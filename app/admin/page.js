'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  GraduationCap, Users, BookOpen, Trophy, MessageCircle, FileText,
  LogOut, Plus, Trash2, Edit, Upload, Eye, BarChart3, Settings,
  Home, Mail, Phone, User, ChevronRight, X, Save, Download, Search
} from 'lucide-react';

const API_BASE = '/api';

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('admin_token', data.token);
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-royal flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-royal-800 flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-gold-light" />
            </div>
            <h2 className="text-2xl font-bold text-royal-800">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-1">Result Wallah Dashboard</p>
          </div>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@resultwallah.com" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            </div>
            <Button type="submit" className="w-full bg-royal-800 hover:bg-royal-700 text-white" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6"><a href="/" className="hover:text-royal-700">← Back to website</a></p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-royal-800">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [staff, setStaff] = useState([]);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [notes, setNotes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);

  // Form states
  const [staffForm, setStaffForm] = useState({ name: '', designation: '', description: '', photo_url: '', order: 99 });
  const [resultForm, setResultForm] = useState({ student_name: '', exam: 'JEE', marks: '', percentile: '', year: '2025', photo_url: '' });
  const [noteForm, setNoteForm] = useState({ title: '', subject: 'Physics', file_url: '' });
  const [editingStaff, setEditingStaff] = useState(null);
  const [directorMessage, setDirectorMessage] = useState('');

  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved) setToken(saved);
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [statsR, staffR, coursesR, resultsR, notesR, contactsR, usersR, settingsR] = await Promise.all([
        fetch(`${API_BASE}/stats`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/staff`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/courses`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/results`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/notes`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/contacts`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/users`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/settings`, { headers }).then(r => r.json()),
      ]);
      setStats(statsR.stats || {});
      setStaff(staffR.staff || []);
      setCourses(coursesR.courses || []);
      setResults(resultsR.results || []);
      setNotes(notesR.notes || []);
      setContacts(contactsR.contacts || []);
      setUsers(usersR.users || []);
      const s = settingsR.settings || {};
      setSettings(s);
      setDirectorMessage(s.directorMessage || '');
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  // Staff CRUD
  const addStaff = async () => {
    if (!staffForm.name) return;
    await fetch(`${API_BASE}/staff`, { method: 'POST', headers, body: JSON.stringify(staffForm) });
    setStaffForm({ name: '', designation: '', description: '', photo_url: '', order: 99 });
    fetchData();
  };

  const updateStaff = async () => {
    if (!editingStaff) return;
    await fetch(`${API_BASE}/staff`, { method: 'PUT', headers, body: JSON.stringify({ ...staffForm, id: editingStaff }) });
    setEditingStaff(null);
    setStaffForm({ name: '', designation: '', description: '', photo_url: '', order: 99 });
    fetchData();
  };

  const deleteStaff = async (id) => {
    if (!confirm('Delete this staff member?')) return;
    await fetch(`${API_BASE}/staff?id=${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  // Results
  const addResult = async () => {
    if (!resultForm.student_name) return;
    await fetch(`${API_BASE}/results`, { method: 'POST', headers, body: JSON.stringify(resultForm) });
    setResultForm({ student_name: '', exam: 'JEE', marks: '', percentile: '', year: '2025', photo_url: '' });
    fetchData();
  };

  const deleteResult = async (id) => {
    if (!confirm('Delete this result?')) return;
    await fetch(`${API_BASE}/results?id=${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  // Notes
  const addNote = async () => {
    if (!noteForm.title) return;
    await fetch(`${API_BASE}/notes`, { method: 'POST', headers, body: JSON.stringify(noteForm) });
    setNoteForm({ title: '', subject: 'Physics', file_url: '' });
    fetchData();
  };

  const deleteNote = async (id) => {
    if (!confirm('Delete this note?')) return;
    await fetch(`${API_BASE}/notes?id=${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  // Settings
  const saveSettings = async () => {
    await fetch(`${API_BASE}/settings`, { method: 'PUT', headers, body: JSON.stringify({ ...settings, directorMessage }) });
    fetchData();
    alert('Settings saved!');
  };

  const deleteContact = async (id) => {
    await fetch(`${API_BASE}/contacts?id=${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  if (!token) return <AdminLogin onLogin={setToken} />;

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'staff', label: 'Staff Management', icon: Users },
    { key: 'results', label: 'Top Performers', icon: Trophy },
    { key: 'notes', label: 'Notes / PDFs', icon: FileText },
    { key: 'contacts', label: 'Contact Enquiries', icon: Mail },
    { key: 'students', label: 'Registered Students', icon: User },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-royal-800 text-white hidden lg:flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-royal-800" />
            </div>
            <div>
              <h2 className="font-bold text-sm">RESULT WALLAH</h2>
              <p className="text-[10px] text-gold-light">Admin Dashboard</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map(item => (
            <button key={item.key} onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.key ? 'bg-gold/20 text-gold-light' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <a href="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-3 px-4">
            <Home className="w-4 h-4" /> View Website
          </a>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm px-4">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-royal-800 text-white p-4 z-50 flex items-center justify-between">
        <h2 className="font-bold text-sm">RW Admin</h2>
        <div className="flex gap-2">
          <select className="bg-white/10 text-white text-xs rounded px-2 py-1 border-0" value={activeTab} onChange={e => setActiveTab(e.target.value)}>
            {sidebarItems.map(i => <option key={i.key} value={i.key}>{i.label}</option>)}
          </select>
          <button onClick={handleLogout} className="text-red-400"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-8 pt-20 lg:pt-8 overflow-auto">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-royal-800 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard title="Staff" value={stats.staffCount || 0} icon={Users} color="bg-blue-500" />
              <StatCard title="Students" value={stats.studentCount || 0} icon={User} color="bg-green-500" />
              <StatCard title="Notes" value={stats.notesCount || 0} icon={FileText} color="bg-purple-500" />
              <StatCard title="Results" value={stats.resultCount || 0} icon={Trophy} color="bg-yellow-500" />
              <StatCard title="Enquiries" value={stats.contactCount || 0} icon={Mail} color="bg-red-500" />
              <StatCard title="Courses" value={stats.courseCount || 0} icon={BookOpen} color="bg-indigo-500" />
            </div>
            <Card className="border-0 shadow-lg">
              <CardHeader><CardTitle className="text-lg">Recent Enquiries</CardTitle></CardHeader>
              <CardContent>
                {contacts.slice(0, 5).map(c => (
                  <div key={c.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.mobile} | {c.course || 'General'}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{new Date(c.createdAt).toLocaleDateString()}</Badge>
                  </div>
                ))}
                {contacts.length === 0 && <p className="text-gray-400 text-sm">No enquiries yet</p>}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Staff Management */}
        {activeTab === 'staff' && (
          <div>
            <h2 className="text-2xl font-bold text-royal-800 mb-6">Staff Management</h2>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="text-lg">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                    <Input value={staffForm.name} onChange={e => setStaffForm(p => ({ ...p, name: e.target.value }))} placeholder="Staff name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Designation</label>
                    <Input value={staffForm.designation} onChange={e => setStaffForm(p => ({ ...p, designation: e.target.value }))} placeholder="e.g. Physics Faculty" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                    <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={staffForm.description} onChange={e => setStaffForm(p => ({ ...p, description: e.target.value }))} placeholder="Short bio" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Photo</label>
                    <input type="file" accept="image/*" className="text-sm" onChange={async (e) => {
                      if (e.target.files[0]) {
                        const url = await handleFileUpload(e.target.files[0], 'staff');
                        setStaffForm(p => ({ ...p, photo_url: url }));
                      }
                    }} />
                    {staffForm.photo_url && <img src={staffForm.photo_url} alt="Preview" className="w-16 h-16 rounded-full object-cover mt-2" />}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Display Order</label>
                    <Input type="number" value={staffForm.order} onChange={e => setStaffForm(p => ({ ...p, order: parseInt(e.target.value) || 99 }))} />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  {editingStaff ? (
                    <>
                      <Button onClick={updateStaff} className="bg-royal-800 hover:bg-royal-700"><Save className="w-4 h-4 mr-2" /> Update</Button>
                      <Button variant="outline" onClick={() => { setEditingStaff(null); setStaffForm({ name: '', designation: '', description: '', photo_url: '', order: 99 }); }}>Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={addStaff} className="bg-royal-800 hover:bg-royal-700"><Plus className="w-4 h-4 mr-2" /> Add Staff</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {staff.map(s => (
                <Card key={s.id} className="border-0 shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-royal-100 flex items-center justify-center overflow-hidden">
                        {s.photo_url ? <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" /> : <span className="font-bold text-royal-700">{s.name?.charAt(0)}</span>}
                      </div>
                      <div>
                        <p className="font-semibold text-royal-800">{s.name}</p>
                        <p className="text-sm text-gray-500">{s.designation}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingStaff(s.id); setStaffForm({ name: s.name, designation: s.designation, description: s.description, photo_url: s.photo_url, order: s.order }); }}><Edit className="w-3 h-3" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteStaff(s.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Results / Top Performers */}
        {activeTab === 'results' && (
          <div>
            <h2 className="text-2xl font-bold text-royal-800 mb-6">Top Performers</h2>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="text-lg">Add Top Performer</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Student Name *</label>
                    <Input value={resultForm.student_name} onChange={e => setResultForm(p => ({ ...p, student_name: e.target.value }))} placeholder="Student name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Exam</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={resultForm.exam} onChange={e => setResultForm(p => ({ ...p, exam: e.target.value }))}>
                      <option>JEE</option><option>NEET</option><option>CET</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Percentile</label>
                    <Input value={resultForm.percentile} onChange={e => setResultForm(p => ({ ...p, percentile: e.target.value }))} placeholder="e.g. 99.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Marks</label>
                    <Input value={resultForm.marks} onChange={e => setResultForm(p => ({ ...p, marks: e.target.value }))} placeholder="e.g. 650/720" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Year</label>
                    <Input value={resultForm.year} onChange={e => setResultForm(p => ({ ...p, year: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Photo</label>
                    <input type="file" accept="image/*" className="text-sm" onChange={async (e) => {
                      if (e.target.files[0]) {
                        const url = await handleFileUpload(e.target.files[0], 'results');
                        setResultForm(p => ({ ...p, photo_url: url }));
                      }
                    }} />
                  </div>
                </div>
                <Button onClick={addResult} className="mt-4 bg-royal-800 hover:bg-royal-700"><Plus className="w-4 h-4 mr-2" /> Add Performer</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map(r => (
                <Card key={r.id} className="border-0 shadow text-center">
                  <CardContent className="p-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-royal-100 flex items-center justify-center overflow-hidden mb-2">
                      {r.photo_url ? <img src={r.photo_url} alt={r.student_name} className="w-full h-full object-cover" /> : <Trophy className="w-6 h-6 text-gold" />}
                    </div>
                    <p className="font-semibold text-sm">{r.student_name}</p>
                    <Badge className="text-xs mt-1">{r.exam}</Badge>
                    {r.percentile && <p className="text-gold-dark font-bold mt-1">{r.percentile}%ile</p>}
                    <Button size="sm" variant="destructive" className="mt-2" onClick={() => deleteResult(r.id)}><Trash2 className="w-3 h-3" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Notes Management */}
        {activeTab === 'notes' && (
          <div>
            <h2 className="text-2xl font-bold text-royal-800 mb-6">Notes & PDF Management</h2>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="text-lg">Upload Notes</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                    <Input value={noteForm.title} onChange={e => setNoteForm(p => ({ ...p, title: e.target.value }))} placeholder="Note title" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={noteForm.subject} onChange={e => setNoteForm(p => ({ ...p, subject: e.target.value }))}>
                      <option>Physics</option><option>Chemistry</option><option>Mathematics</option><option>JEE</option><option>NEET</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">PDF File</label>
                    <input type="file" accept=".pdf" className="text-sm" onChange={async (e) => {
                      if (e.target.files[0]) {
                        const url = await handleFileUpload(e.target.files[0], 'notes');
                        setNoteForm(p => ({ ...p, file_url: url }));
                      }
                    }} />
                  </div>
                </div>
                <Button onClick={addNote} className="mt-4 bg-royal-800 hover:bg-royal-700"><Upload className="w-4 h-4 mr-2" /> Upload Note</Button>
              </CardContent>
            </Card>

            <div className="grid gap-3">
              {notes.map(n => (
                <Card key={n.id} className="border-0 shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{n.title}</p>
                        <p className="text-xs text-gray-500">{n.subject} | Downloads: {n.download_count || 0}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {n.file_url && <a href={n.file_url} target="_blank"><Button size="sm" variant="outline"><Eye className="w-3 h-3" /></Button></a>}
                      <Button size="sm" variant="destructive" onClick={() => deleteNote(n.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {notes.length === 0 && <p className="text-gray-400 text-center py-8">No notes uploaded yet</p>}
            </div>
          </div>
        )}

        {/* Contacts */}
        {activeTab === 'contacts' && (
          <div>
            <h2 className="text-2xl font-bold text-royal-800 mb-6">Contact Enquiries</h2>
            <div className="grid gap-3">
              {contacts.map(c => (
                <Card key={c.id} className="border-0 shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <div className="flex gap-4 mt-1">
                          <span className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {c.mobile}</span>
                          {c.email && <span className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</span>}
                        </div>
                        {c.course && <Badge className="mt-2 text-xs" variant="outline">{c.course}</Badge>}
                        {c.message && <p className="text-sm text-gray-600 mt-2">{c.message}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                        <Button size="sm" variant="destructive" onClick={() => deleteContact(c.id)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {contacts.length === 0 && <p className="text-gray-400 text-center py-8">No enquiries yet</p>}
            </div>
          </div>
        )}

        {/* Students */}
        {activeTab === 'students' && (
          <div>
            <h2 className="text-2xl font-bold text-royal-800 mb-6">Registered Students</h2>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Name</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Email</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Mobile</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Role</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-t">
                          <td className="p-4 text-sm">{u.name}</td>
                          <td className="p-4 text-sm text-gray-600">{u.email}</td>
                          <td className="p-4 text-sm text-gray-600">{u.mobile}</td>
                          <td className="p-4"><Badge variant="outline" className="text-xs">{u.role}</Badge></td>
                          <td className="p-4 text-sm text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <p className="text-gray-400 text-center py-8">No registered students yet</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-royal-800 mb-6">Site Settings</h2>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="text-lg">Director's Message</CardTitle></CardHeader>
              <CardContent>
                <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[200px] font-mono" value={directorMessage} onChange={e => setDirectorMessage(e.target.value)} placeholder="HTML content for director's message" />
                <p className="text-xs text-gray-400 mt-1">Supports HTML tags for formatting</p>
              </CardContent>
            </Card>
            <Button onClick={saveSettings} className="bg-royal-800 hover:bg-royal-700"><Save className="w-4 h-4 mr-2" /> Save All Settings</Button>
          </div>
        )}
      </main>
    </div>
  );
}

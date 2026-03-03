'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap, Download, FileText, LogOut, Home, User, BookOpen,
  Atom, FlaskConical, BookMarked, Zap, HeartPulse, Search
} from 'lucide-react';

const SUBJECT_ICONS = {
  'Physics': Atom,
  'Chemistry': FlaskConical,
  'Mathematics': BookMarked,
  'JEE': Zap,
  'NEET': HeartPulse,
};

const SUBJECT_COLORS = {
  'Physics': 'bg-blue-100 text-blue-700',
  'Chemistry': 'bg-green-100 text-green-700',
  'Mathematics': 'bg-purple-100 text-purple-700',
  'JEE': 'bg-orange-100 text-orange-700',
  'NEET': 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeSubject, setActiveSubject] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('student_token');
    const userData = localStorage.getItem('student_user');
    if (!token || !userData) {
      window.location.href = '/login';
      return;
    }
    setUser(JSON.parse(userData));

    fetch('/api/notes')
      .then(r => r.json())
      .then(d => setNotes(d.notes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (note) => {
    const token = localStorage.getItem('student_token');
    try {
      const res = await fetch(`/api/download?id=${note.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.file_url) {
        window.open(data.file_url, '_blank');
      } else {
        alert('File not available. Please contact admin.');
      }
    } catch {
      alert('Download failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    window.location.href = '/';
  };

  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'JEE', 'NEET'];
  const filteredNotes = activeSubject === 'All' ? notes : notes.filter(n => n.subject === activeSubject);

  if (loading) return (
    <div className="min-h-screen gradient-royal flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-royal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-royal-800" />
            </div>
            <div>
              <h1 className="font-bold text-sm">RESULT WALLAH</h1>
              <p className="text-[10px] text-gold-light">Student Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm">{user?.name}</span>
            </div>
            <a href="/"><Button size="sm" variant="ghost" className="text-white/70 hover:text-white"><Home className="w-4 h-4" /></Button></a>
            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-royal-800">Welcome, {user?.name}!</h2>
          <p className="text-gray-500">Download study materials prepared by our expert faculty</p>
        </div>

        {/* Subject Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {subjects.map(subject => {
            const Icon = SUBJECT_ICONS[subject] || BookOpen;
            return (
              <Button key={subject}
                variant={activeSubject === subject ? 'default' : 'outline'}
                size="sm"
                className={activeSubject === subject ? 'bg-royal-800 text-white' : ''}
                onClick={() => setActiveSubject(subject)}>
                {subject !== 'All' && <Icon className="w-3 h-3 mr-1" />}
                {subject}
              </Button>
            );
          })}
        </div>

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => {
            const Icon = SUBJECT_ICONS[note.subject] || FileText;
            const colorClass = SUBJECT_COLORS[note.subject] || 'bg-gray-100 text-gray-700';
            return (
              <Card key={note.id} className="border-0 shadow-lg hover-lift">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="text-xs">{note.subject}</Badge>
                  </div>
                  <h3 className="font-semibold text-royal-800 mb-2">{note.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{new Date(note.upload_date).toLocaleDateString()}</span>
                    <Button size="sm" onClick={() => handleDownload(note)} className="bg-royal-800 hover:bg-royal-700 text-white text-xs">
                      <Download className="w-3 h-3 mr-1" /> Download
                    </Button>
                  </div>
                  {note.download_count > 0 && (
                    <p className="text-xs text-gray-400 mt-2">{note.download_count} downloads</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">No notes available</h3>
            <p className="text-gray-400 text-sm">Notes will be uploaded by the admin soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

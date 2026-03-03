import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'resultwallah_secret_2026_jwt';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

function getPathSegments(params) {
  return params?.path || [];
}

function verifyToken(request) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) return null;
    const token = auth.split(' ')[1];
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function verifyAdmin(request) {
  const user = verifyToken(request);
  if (!user || user.role !== 'admin') return null;
  return user;
}

// ============== SEED DATA ==============
async function seedDatabase(db) {
  // Use a seed_lock collection to prevent race conditions
  const lockCol = db.collection('seed_lock');
  const lock = await lockCol.findOne({ _id: 'seed' });
  if (lock) return; // Already seeded
  
  // Try to acquire lock atomically
  try {
    await lockCol.insertOne({ _id: 'seed', seeded: true, ts: new Date() });
  } catch (e) {
    // Another process already acquired the lock
    return;
  }

  const usersCol = db.collection('users');
  const staffCol = db.collection('staff');
  const coursesCol = db.collection('courses');
  const settingsCol = db.collection('settings');

  // Seed admin
  const existingAdmin = await usersCol.findOne({ email: 'admin@resultwallah.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Result@2026', 10);
    await usersCol.insertOne({
      id: uuidv4(),
      name: 'Admin',
      email: 'admin@resultwallah.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
  }

  // Seed staff with actual photos
  const staffCount = await staffCol.countDocuments();
  if (staffCount === 0) {
    await staffCol.insertMany([
      {
        id: uuidv4(),
        name: 'Swami Sir',
        designation: 'Founder & Chairman',
        description: 'Visionary leader dedicated to transforming education in Karad region. Under his leadership, Result Wallah has become the premier coaching institute for JEE, NEET & MHT-CET preparation.',
        photo_url: 'https://customer-assets.emergentagent.com/job_edu-result-portal/artifacts/blztr8z2_Founder.jpeg',
        is_founder: true,
        order: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Dubey Sir',
        designation: 'Director - Academics',
        description: 'Expert educator with years of experience in JEE and NEET coaching. Passionate about student success and academic excellence.',
        photo_url: 'https://customer-assets.emergentagent.com/job_edu-result-portal/artifacts/p44lk7my_director%201.jpeg',
        is_founder: false,
        order: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Director Sir',
        designation: 'Director - Operations',
        description: 'Ensuring smooth operations and world-class infrastructure for the best learning environment.',
        photo_url: 'https://customer-assets.emergentagent.com/job_edu-result-portal/artifacts/r4hl9udh_director%202.jpg',
        is_founder: false,
        order: 3,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  // Seed announcements
  const announcementsCol = db.collection('announcements');
  const announcementCount = await announcementsCol.countDocuments();
  if (announcementCount === 0) {
    await announcementsCol.insertMany([
      {
        id: uuidv4(),
        text: 'Admissions Open for 2025-26! Limited seats available. Enroll now for JEE/NEET/MHT-CET batches.',
        active: true,
        priority: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        text: 'New NEET Repeater Batch starting from July 2025. Special discount for early registrations!',
        active: true,
        priority: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        text: 'Weekly Mock Tests every Sunday. AI-Powered Connected Classroom now available!',
        active: true,
        priority: 3,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  // Seed banners
  const bannersCol = db.collection('banners');
  const bannerCount = await bannersCol.countDocuments();
  if (bannerCount === 0) {
    await bannersCol.insertMany([
      {
        id: uuidv4(),
        title: 'Welcome to Result Wallah',
        description: 'Transforming Aspirations into Achievements - Your Career Is First For Us',
        image_url: 'https://customer-assets.emergentagent.com/job_edu-result-portal/artifacts/mqflbryl_RW_SWAMI%20_FLEX.jpg.jpeg',
        active: true,
        order: 1,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  // Seed courses
  const courseCount = await coursesCol.countDocuments();
  if (courseCount === 0) {
    await coursesCol.insertMany([
      {
        id: uuidv4(),
        name: 'IIT-JEE (Main & Advanced)',
        slug: 'iit-jee',
        description: 'Comprehensive preparation for IIT-JEE Main and Advanced examinations with expert faculty and proven methodology.',
        features: ['Expert Faculty', 'Daily Practice Problems', 'Weekly Mock Tests', 'Doubt Clearing Sessions', 'Study Material Included'],
        benefits: ['Proven track record of selections', 'Personalized attention with batch size of 50', 'AI-powered connected classroom'],
        icon: 'atom',
        color: '#3B82F6',
        order: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'NEET (UG)',
        slug: 'neet',
        description: 'Result-oriented NEET preparation with focus on Biology, Physics, and Chemistry for medical aspirants.',
        features: ['Biology-focused approach', 'NCERT-based teaching', 'Regular assessments', 'Previous year paper analysis', 'Lab sessions'],
        benefits: ['Dedicated NEET faculty', 'Comprehensive study material', 'Regular parent-teacher meetings'],
        icon: 'heart-pulse',
        color: '#10B981',
        order: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'MHT-CET',
        slug: 'mht-cet',
        description: 'Targeted preparation for Maharashtra Common Entrance Test with state-specific curriculum focus.',
        features: ['State board aligned', 'Chapter-wise tests', 'Online test series', 'Performance tracking', 'Revision sessions'],
        benefits: ['Maharashtra-specific preparation', 'Previous year trend analysis', 'Affordable fees'],
        icon: 'graduation-cap',
        color: '#8B5CF6',
        order: 3,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'IX & X Foundation',
        slug: 'foundation',
        description: 'Build a strong foundation in Science and Mathematics for future competitive exam success.',
        features: ['Conceptual learning', 'Olympiad preparation', 'Board exam excellence', 'Mental ability training', 'Science experiments'],
        benefits: ['Early preparation advantage', 'Strong fundamentals', 'School exam toppers'],
        icon: 'book-open',
        color: '#F59E0B',
        order: 4,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'NEET Repeater Batch',
        slug: 'neet-repeater',
        description: 'Specialized intensive program for NEET repeaters with focused strategy and enhanced preparation.',
        features: ['Intensive revision', 'Gap analysis', 'Mentorship program', 'Daily tests', 'Psychological support'],
        benefits: ['Score improvement guarantee', 'Specialized teaching approach', 'Individual attention'],
        icon: 'refresh-cw',
        color: '#EF4444',
        order: 5,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  // Seed settings
  const existingSettings = await settingsCol.findOne({ key: 'site_settings' });
  if (!existingSettings) {
    await settingsCol.insertOne({
      key: 'site_settings',
      directorMessage: `<h2>Welcome to Result Wallah</h2>
<p>At Result Wallah, we believe every student has the potential to achieve greatness. Our institute is committed to providing world-class coaching for competitive examinations including JEE, NEET, and MHT-CET.</p>

<h3>Our Vision</h3>
<p>To be the premier educational institution in Maharashtra, nurturing future engineers and doctors who will serve the nation with excellence.</p>

<h3>Our Offerings</h3>
<p>We provide comprehensive coaching with a focus on conceptual clarity, regular assessments, and personalized mentoring. Our state-of-the-art AI-powered connected classrooms ensure that every student gets the best learning experience.</p>

<h3>Our Programs</h3>
<ul>
<li>JEE Preparation (Main & Advanced) - For aspiring engineers</li>
<li>NEET / NEET Repeater Preparation - For future doctors</li>
<li>MHT-CET Preparation - For Maharashtra state entrance</li>
<li>IX & X Foundation Courses - Building strong basics early</li>
</ul>

<p>With limited batch sizes of just 50 students, we ensure personalized attention for every learner. Join us and transform your aspirations into achievements!</p>`,
      contactInfo: {
        address: 'Result Wallah, Karad - Vita Rd, near JK Petrol Pump, Saidapur, Karad, Maharashtra 415124',
        whatsapp1: '09156781002',
        whatsapp2: '09156782003',
        facebook: 'https://www.facebook.com/p/Result-Wallah-61573986368335',
        instagram: 'https://www.instagram.com/resultwallah7',
      },
      seoTitle: 'Result Wallah - Best JEE, NEET & MHT-CET Coaching in Karad',
      seoDescription: 'Result Wallah is the top coaching institute in Karad for JEE, NEET, MHT-CET preparation. Expert faculty, limited batches of 50 students, AI-powered classrooms.',
      seoKeywords: 'NEET Coaching, JEE Coaching, MHT-CET Coaching, Best Coaching in Karad, NEET Classes Karad, JEE Classes Karad, Medical Entrance Coaching, Engineering Entrance Coaching',
      updatedAt: new Date().toISOString(),
    });
  }

  return { message: 'Database seeded successfully' };
}

// ============== ROUTE HANDLERS ==============

async function handleStaff(request, method) {
  const { db } = await connectToDatabase();
  const col = db.collection('staff');

  if (method === 'GET') {
    const staff = await col.find({}).sort({ order: 1 }).toArray();
    return jsonResponse({ staff });
  }

  if (method === 'POST') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    const newStaff = {
      id: uuidv4(),
      name: body.name,
      designation: body.designation || '',
      description: body.description || '',
      photo_url: body.photo_url || '',
      order: body.order || 99,
      createdAt: new Date().toISOString(),
    };
    await col.insertOne(newStaff);
    return jsonResponse({ staff: newStaff }, 201);
  }

  if (method === 'PUT') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    const { id, ...updates } = body;
    updates.updatedAt = new Date().toISOString();
    await col.updateOne({ id }, { $set: updates });
    const updated = await col.findOne({ id });
    return jsonResponse({ staff: updated });
  }

  if (method === 'DELETE') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await col.deleteOne({ id });
    return jsonResponse({ message: 'Staff deleted' });
  }
}

async function handleCourses(request, method) {
  const { db } = await connectToDatabase();
  const col = db.collection('courses');

  if (method === 'GET') {
    const courses = await col.find({}).sort({ order: 1 }).toArray();
    return jsonResponse({ courses });
  }

  if (method === 'POST') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    const newCourse = {
      id: uuidv4(),
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description || '',
      features: body.features || [],
      benefits: body.benefits || [],
      icon: body.icon || 'book-open',
      color: body.color || '#3B82F6',
      order: body.order || 99,
      createdAt: new Date().toISOString(),
    };
    await col.insertOne(newCourse);
    return jsonResponse({ course: newCourse }, 201);
  }

  if (method === 'PUT') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    const { id, ...updates } = body;
    updates.updatedAt = new Date().toISOString();
    await col.updateOne({ id }, { $set: updates });
    const updated = await col.findOne({ id });
    return jsonResponse({ course: updated });
  }

  if (method === 'DELETE') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await col.deleteOne({ id });
    return jsonResponse({ message: 'Course deleted' });
  }
}

async function handleResults(request, method) {
  const { db } = await connectToDatabase();
  const col = db.collection('results');

  if (method === 'GET') {
    const results = await col.find({}).sort({ year: -1, percentile: -1 }).toArray();
    return jsonResponse({ results });
  }

  if (method === 'POST') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    const newResult = {
      id: uuidv4(),
      student_name: body.student_name,
      exam: body.exam || '',
      marks: body.marks || '',
      percentile: body.percentile || '',
      year: body.year || new Date().getFullYear().toString(),
      photo_url: body.photo_url || '',
      createdAt: new Date().toISOString(),
    };
    await col.insertOne(newResult);
    return jsonResponse({ result: newResult }, 201);
  }

  if (method === 'DELETE') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await col.deleteOne({ id });
    return jsonResponse({ message: 'Result deleted' });
  }
}

async function handleNotes(request, method) {
  const { db } = await connectToDatabase();
  const col = db.collection('notes');

  if (method === 'GET') {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const query = subject ? { subject } : {};
    const notes = await col.find(query).sort({ upload_date: -1 }).toArray();
    return jsonResponse({ notes });
  }

  if (method === 'POST') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    const newNote = {
      id: uuidv4(),
      title: body.title,
      subject: body.subject,
      file_url: body.file_url || '',
      download_count: 0,
      upload_date: new Date().toISOString(),
    };
    await col.insertOne(newNote);
    return jsonResponse({ note: newNote }, 201);
  }

  if (method === 'DELETE') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await col.deleteOne({ id });
    return jsonResponse({ message: 'Note deleted' });
  }
}

async function handleContacts(request, method) {
  const { db } = await connectToDatabase();
  const col = db.collection('contacts');

  if (method === 'GET') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const contacts = await col.find({}).sort({ createdAt: -1 }).toArray();
    return jsonResponse({ contacts });
  }

  if (method === 'POST') {
    const body = await request.json();
    if (!body.name || !body.mobile) {
      return jsonResponse({ error: 'Name and mobile are required' }, 400);
    }
    const newContact = {
      id: uuidv4(),
      name: body.name,
      mobile: body.mobile,
      email: body.email || '',
      course: body.course || '',
      message: body.message || '',
      createdAt: new Date().toISOString(),
    };
    await col.insertOne(newContact);
    return jsonResponse({ message: 'Contact form submitted successfully', contact: newContact }, 201);
  }

  if (method === 'DELETE') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await col.deleteOne({ id });
    return jsonResponse({ message: 'Contact deleted' });
  }
}

async function handleAuth(request, segments) {
  const { db } = await connectToDatabase();
  const action = segments[1];

  if (action === 'admin-login') {
    const body = await request.json();
    const { email, password } = body;

    const user = await db.collection('users').findOne({ email, role: 'admin' });
    if (!user) return jsonResponse({ error: 'Invalid credentials' }, 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return jsonResponse({ error: 'Invalid credentials' }, 401);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    return jsonResponse({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }

  if (action === 'register') {
    const body = await request.json();
    const { name, email, mobile, role } = body;

    if (!name || !email || !mobile) {
      return jsonResponse({ error: 'Name, email, and mobile are required' }, 400);
    }

    const existing = await db.collection('users').findOne({ $or: [{ email }, { mobile }] });
    if (existing) return jsonResponse({ error: 'User already exists' }, 400);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser = {
      id: uuidv4(),
      name,
      email,
      mobile,
      role: role || 'student',
      otp,
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      verified: false,
      createdAt: new Date().toISOString(),
    };
    await db.collection('users').insertOne(newUser);
    return jsonResponse({ message: 'Registration successful. OTP sent.', otp_hint: 'In production, OTP will be sent via email/SMS. For testing, OTP is: ' + otp });
  }

  if (action === 'send-otp') {
    const body = await request.json();
    const { email } = body;

    const user = await db.collection('users').findOne({ email, role: { $ne: 'admin' } });
    if (!user) return jsonResponse({ error: 'User not found. Please register first.' }, 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.collection('users').updateOne(
      { email },
      { $set: { otp, otpExpiry: new Date(Date.now() + 5 * 60 * 1000).toISOString() } }
    );
    return jsonResponse({ message: 'OTP sent successfully', otp_hint: 'For testing, OTP is: ' + otp });
  }

  if (action === 'verify-otp') {
    const body = await request.json();
    const { email, otp } = body;

    const user = await db.collection('users').findOne({ email });
    if (!user) return jsonResponse({ error: 'User not found' }, 404);

    if (user.otp !== otp) return jsonResponse({ error: 'Invalid OTP' }, 400);
    if (new Date(user.otpExpiry) < new Date()) return jsonResponse({ error: 'OTP expired' }, 400);

    await db.collection('users').updateOne(
      { email },
      { $set: { verified: true, otp: null, otpExpiry: null } }
    );

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    return jsonResponse({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }

  if (action === 'me') {
    const user = verifyToken(request);
    if (!user) return jsonResponse({ error: 'Unauthorized' }, 401);
    return jsonResponse({ user });
  }

  return jsonResponse({ error: 'Invalid auth action' }, 400);
}

async function handleSettings(request, method) {
  const { db } = await connectToDatabase();
  const col = db.collection('settings');

  if (method === 'GET') {
    const settings = await col.findOne({ key: 'site_settings' });
    return jsonResponse({ settings: settings || {} });
  }

  if (method === 'PUT') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    body.updatedAt = new Date().toISOString();
    await col.updateOne({ key: 'site_settings' }, { $set: body }, { upsert: true });
    const updated = await col.findOne({ key: 'site_settings' });
    return jsonResponse({ settings: updated });
  }
}

async function handleStats(request) {
  const { db } = await connectToDatabase();
  const studentCount = await db.collection('users').countDocuments({ role: { $ne: 'admin' } });
  const staffCount = await db.collection('staff').countDocuments();
  const notesCount = await db.collection('notes').countDocuments();
  const contactCount = await db.collection('contacts').countDocuments();
  const resultCount = await db.collection('results').countDocuments();
  const courseCount = await db.collection('courses').countDocuments();

  return jsonResponse({
    stats: { studentCount, staffCount, notesCount, contactCount, resultCount, courseCount }
  });
}

async function handleUpload(request) {
  const admin = verifyAdmin(request);
  if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'staff';

    if (!file) return jsonResponse({ error: 'No file provided' }, 400);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);

    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${type}/${fileName}`;
    return jsonResponse({ url: fileUrl, fileName });
  } catch (error) {
    return jsonResponse({ error: 'Upload failed: ' + error.message }, 500);
  }
}

async function handleDownload(request) {
  const user = verifyToken(request);
  if (!user) return jsonResponse({ error: 'Please login to download notes' }, 401);

  const { searchParams } = new URL(request.url);
  const noteId = searchParams.get('id');

  const { db } = await connectToDatabase();
  await db.collection('notes').updateOne({ id: noteId }, { $inc: { download_count: 1 } });

  const note = await db.collection('notes').findOne({ id: noteId });
  return jsonResponse({ file_url: note?.file_url, download_count: note?.download_count });
}

async function handleUsers(request, method) {
  const admin = verifyAdmin(request);
  if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

  const { db } = await connectToDatabase();

  if (method === 'GET') {
    const users = await db.collection('users').find({ role: { $ne: 'admin' } })
      .project({ password: 0, otp: 0, otpExpiry: 0 })
      .sort({ createdAt: -1 }).toArray();
    return jsonResponse({ users });
  }
}

// ============== ANNOUNCEMENTS ==============
async function handleAnnouncements(request, method) {
  const { db } = await connectToDatabase();
  const col = db.collection('announcements');

  if (method === 'GET') {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active');
    const query = activeOnly === 'true' ? { active: true } : {};
    const announcements = await col.find(query).sort({ priority: 1 }).toArray();
    return jsonResponse({ announcements });
  }

  if (method === 'POST') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    const newAnnouncement = {
      id: uuidv4(),
      text: body.text || '',
      active: body.active !== undefined ? body.active : true,
      priority: body.priority || 99,
      createdAt: new Date().toISOString(),
    };
    await col.insertOne(newAnnouncement);
    return jsonResponse({ announcement: newAnnouncement }, 201);
  }

  if (method === 'PUT') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    const { id, ...updates } = body;
    updates.updatedAt = new Date().toISOString();
    await col.updateOne({ id }, { $set: updates });
    const updated = await col.findOne({ id });
    return jsonResponse({ announcement: updated });
  }

  if (method === 'DELETE') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await col.deleteOne({ id });
    return jsonResponse({ message: 'Announcement deleted' });
  }
}

// ============== BANNERS ==============
async function handleBanners(request, method) {
  const { db } = await connectToDatabase();
  const col = db.collection('banners');

  if (method === 'GET') {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active');
    const query = activeOnly === 'true' ? { active: true } : {};
    const banners = await col.find(query).sort({ order: 1 }).toArray();
    return jsonResponse({ banners });
  }

  if (method === 'POST') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    const newBanner = {
      id: uuidv4(),
      title: body.title || '',
      description: body.description || '',
      image_url: body.image_url || '',
      active: body.active !== undefined ? body.active : true,
      order: body.order || 99,
      createdAt: new Date().toISOString(),
    };
    await col.insertOne(newBanner);
    return jsonResponse({ banner: newBanner }, 201);
  }

  if (method === 'PUT') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    const { id, ...updates } = body;
    updates.updatedAt = new Date().toISOString();
    await col.updateOne({ id }, { $set: updates });
    const updated = await col.findOne({ id });
    return jsonResponse({ banner: updated });
  }

  if (method === 'DELETE') {
    const admin = verifyAdmin(request);
    if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await col.deleteOne({ id });
    return jsonResponse({ message: 'Banner deleted' });
  }
}

// ============== MAIN ROUTER ==============
async function handleRequest(request, { params }) {
  const resolvedParams = await params;
  const segments = getPathSegments(resolvedParams);
  const method = request.method;
  const route = segments[0] || '';

  try {
    // Ensure database is seeded
    const { db } = await connectToDatabase();
    await seedDatabase(db);

    switch (route) {
      case 'staff': return await handleStaff(request, method);
      case 'courses': return await handleCourses(request, method);
      case 'results': return await handleResults(request, method);
      case 'notes': return await handleNotes(request, method);
      case 'contacts': return await handleContacts(request, method);
      case 'auth': return await handleAuth(request, segments);
      case 'settings': return await handleSettings(request, method);
      case 'stats': return await handleStats(request);
      case 'upload': return await handleUpload(request);
      case 'download': return await handleDownload(request);
      case 'users': return await handleUsers(request, method);
      case 'announcements': return await handleAnnouncements(request, method);
      case 'banners': return await handleBanners(request, method);
      case 'health': return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
      default: return jsonResponse({ error: 'Route not found', path: segments }, 404);
    }
  } catch (error) {
    console.error('API Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

export async function GET(request, context) {
  return handleRequest(request, context);
}

export async function POST(request, context) {
  return handleRequest(request, context);
}

export async function PUT(request, context) {
  return handleRequest(request, context);
}

export async function DELETE(request, context) {
  return handleRequest(request, context);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

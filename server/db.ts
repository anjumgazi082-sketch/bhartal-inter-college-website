import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'school.db');
export const db = new DatabaseSync(dbPath);

// Initialize schema
export function initDatabase() {
  db.exec('PRAGMA foreign_keys = ON;');

  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // School Settings (Key-Value)
  db.exec(`
    CREATE TABLE IF NOT EXISTS school_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Teachers Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      qualification TEXT,
      designation TEXT DEFAULT 'Faculty Member',
      bio TEXT,
      photo_url TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Notices Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      description TEXT,
      date TEXT DEFAULT (date('now')),
      pdf_url TEXT,
      is_published INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Events Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'Academic',
      date TEXT NOT NULL,
      time TEXT,
      location TEXT DEFAULT 'College Campus',
      description TEXT,
      image_url TEXT,
      is_published INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Gallery Albums
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery_albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'Campus',
      cover_image TEXT,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Gallery Images
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      album_id INTEGER REFERENCES gallery_albums(id) ON DELETE SET NULL,
      category TEXT DEFAULT 'Campus',
      image_url TEXT NOT NULL,
      caption TEXT,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Downloads Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      description TEXT,
      file_url TEXT NOT NULL,
      date TEXT DEFAULT (date('now')),
      is_published INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Results Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      academic_year TEXT NOT NULL,
      examination TEXT NOT NULL,
      class_name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      pdf_url TEXT,
      external_url TEXT,
      is_published INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Admission Enquiries Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admission_enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      dob TEXT,
      class_applying TEXT NOT NULL,
      parent_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT,
      message TEXT,
      status TEXT DEFAULT 'New',
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  seedInitialData();
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function seedInitialData() {
  // Check if admin user exists
  const checkUser = db.prepare('SELECT id FROM users WHERE username = ?');
  const userRow = checkUser.get('admin');

  if (!userRow) {
    const salt = crypto.randomBytes(16).toString('hex');
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin@bhartal123';
    const hash = hashPassword(defaultPassword, salt);

    const insertAdmin = db.prepare(`
      INSERT INTO users (username, password_hash, salt, name, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertAdmin.run('admin', hash, salt, 'College Administrator', 'admin');
    console.log('[DB] Initialized default admin account: username: admin');
  }

  // Seed default school settings with official info and clearly tagged demo placeholders
  const defaultSettings: Record<string, string> = {
    school_name: 'Bhartal Inter College',
    tagline: 'Education, Discipline & Academic Excellence',
    address: 'Hasanpur Road, Bhartal, Sirsi, District Sambhal, Uttar Pradesh, India',
    phone: '+91 90124 93127',
    email: 'afarjand581@gmail.com',
    principal_name: "Principal's Name",
    principal_designation: 'Principal, Bhartal Inter College',
    principal_photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
    principal_message: 'Welcome to Bhartal Inter College. Our institution is dedicated to nurturing young minds with knowledge, moral integrity, and lifelong discipline. We invite parents and students to join our learning community.',
    homepage_intro: 'Bhartal Inter College provides high quality education, fostering discipline, character development, and academic achievement for students in Bhartal, Sirsi, and the Sambhal district.',
    vision: 'To nurture educated, enlightened, and conscientious citizens who excel academically and contribute positively to our society and nation.',
    mission: 'To impart quality education with a strong emphasis on character building, moral ethics, academic rigor, and holistic student development.',
    office_hours: JSON.stringify({
      days: 'Monday to Saturday',
      timings: '08:00 AM - 02:00 PM',
      closed: 'Sundays & Gazetted Holidays',
    }),
    statistics: JSON.stringify([
      { id: '1', label: 'Students', value: '1,200+', isDemo: true },
      { id: '2', label: 'Qualified Teachers', value: '35+', isDemo: true },
      { id: '3', label: 'Classrooms & Labs', value: '24+', isDemo: true },
      { id: '4', label: 'Years of Dedication', value: '15+', isDemo: true },
    ]),
    facilities: JSON.stringify([
      { id: '1', title: 'Modern Classrooms', description: 'Spacious, well-ventilated rooms designed for attentive learning and active student participation.', enabled: true, isDemo: true },
      { id: '2', title: 'Science Laboratories', description: 'Practical labs supporting physics, chemistry, and biology experiments under faculty guidance.', enabled: true, isDemo: true },
      { id: '3', title: 'College Library', description: 'A quiet reading room with curriculum textbooks, reference literature, and magazines.', enabled: true, isDemo: true },
      { id: '4', title: 'Computer Workstations', description: 'Dedicated IT workstations introducing students to digital literacy and basic computing.', enabled: true, isDemo: true },
      { id: '5', title: 'Sports & Playground', description: 'Outdoor area supporting physical fitness, team sports, cricket, and annual athletics events.', enabled: true, isDemo: true },
      { id: '6', title: 'Clean Drinking Water', description: 'Purified drinking water stations and maintained hygienic sanitary facilities.', enabled: true, isDemo: true },
    ]),
    social_links: JSON.stringify({
      facebook: '',
      twitter: '',
      youtube: '',
      instagram: '',
    }),
  };

  const getSetting = db.prepare('SELECT value FROM school_settings WHERE key = ?');
  const insertSetting = db.prepare('INSERT OR REPLACE INTO school_settings (key, value) VALUES (?, ?)');

  for (const [key, val] of Object.entries(defaultSettings)) {
    const existing = getSetting.get(key);
    if (!existing) {
      insertSetting.run(key, val);
    }
  }

  // Seed sample Notices if table is empty
  const noticeCountRow = db.prepare('SELECT COUNT(*) as count FROM notices').get() as { count: number };
  if (noticeCountRow.count === 0) {
    const insertNotice = db.prepare(`
      INSERT INTO notices (title, category, description, date, pdf_url, is_published)
      VALUES (?, ?, ?, ?, ?, 1)
    `);

    insertNotice.run(
      'Admission Notice for Academic Session (Demo)',
      'Admissions',
      'Admission enquiries and forms for the upcoming academic session are now open. Prospective students and parents may submit their enquiries online or visit the college office during working hours.',
      new Date().toISOString().split('T')[0],
      null
    );

    insertNotice.run(
      'Annual Sports Day Announcement (Demo)',
      'Events',
      'The Annual Sports Meet is scheduled for next month. Interested students should contact their respective physical education coordinators for event registrations.',
      new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      null
    );

    insertNotice.run(
      'Quarterly Examination Schedule (Demo)',
      'Examinations',
      'The quarterly assessment schedule for secondary and senior secondary classes will be released shortly. Students are advised to prepare their study plans accordingly.',
      new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
      null
    );
  }

  // Seed sample Teachers if table is empty
  const teacherCountRow = db.prepare('SELECT COUNT(*) as count FROM teachers').get() as { count: number };
  if (teacherCountRow.count === 0) {
    const insertTeacher = db.prepare(`
      INSERT INTO teachers (name, subject, qualification, designation, bio, photo_url, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    insertTeacher.run(
      'Senior Lecturer in Mathematics',
      'Mathematics',
      'M.Sc. (Mathematics), B.Ed.',
      'Head of Mathematics Department',
      'Over 12 years of teaching experience with a focus on concept building, problem solving, and analytical clarity for secondary students. [Demo Faculty - Editable in Admin]',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      1
    );

    insertTeacher.run(
      'Lecturer in Physics & Science',
      'Physics',
      'M.Sc. (Physics), B.Ed.',
      'Senior Science Faculty',
      'Specializes in experiential physics demonstrations, laboratory practicals, and inspiring scientific curiosity in learners. [Demo Faculty - Editable in Admin]',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
      2
    );

    insertTeacher.run(
      'Lecturer in English & Literature',
      'English Language',
      'M.A. (English), B.Ed.',
      'Senior Language Faculty',
      'Passionate educator working to enhance written expression, reading comprehension, and communication confidence among students. [Demo Faculty - Editable in Admin]',
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=400',
      3
    );

    insertTeacher.run(
      'Lecturer in Hindi & Social Studies',
      'Hindi & Social Studies',
      'M.A. (Hindi), B.Ed.',
      'Faculty Member',
      'Dedicated to teaching literature, civic awareness, and moral values with a culturally rooted, engaging pedagogical approach. [Demo Faculty - Editable in Admin]',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      4
    );
  }

  // Seed sample Events if table is empty
  const eventCountRow = db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number };
  if (eventCountRow.count === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (title, category, date, time, location, description, image_url, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    insertEvent.run(
      'Independence Day Celebrations (Demo)',
      'National',
      '2026-08-15',
      '08:30 AM',
      'College Main Ground',
      'Flag hoisting ceremony followed by patriotic songs, student speeches, and prize distributions celebrating the spirit of Indian freedom. [Demo Event]',
      'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=800'
    );

    insertEvent.run(
      'Annual Science Exhibition (Demo)',
      'Academic',
      '2026-10-20',
      '10:00 AM',
      'College Science Hall',
      'Students from various grades showcase working science models, renewable energy projects, and environmental awareness exhibits. [Demo Event]',
      'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=800'
    );

    insertEvent.run(
      'Inter-Class Cricket & Sports Tournament (Demo)',
      'Sports',
      '2026-11-12',
      '09:00 AM',
      'College Playground',
      'Annual athletic tournament featuring friendly cricket matches, relay races, and badminton matches. [Demo Event]',
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800'
    );
  }

  // Seed sample Gallery
  const galleryCountRow = db.prepare('SELECT COUNT(*) as count FROM gallery_images').get() as { count: number };
  if (galleryCountRow.count === 0) {
    const insertAlbum = db.prepare('INSERT INTO gallery_albums (title, category, description, display_order) VALUES (?, ?, ?, ?)');
    insertAlbum.run('Campus Life & Activities', 'Campus', 'Glimpses of daily academic and campus activities at Bhartal Inter College.', 1);
    insertAlbum.run('Cultural & Sports Events', 'Events', 'Memorable moments from sports competitions and national day celebrations.', 2);

    const insertImage = db.prepare('INSERT INTO gallery_images (album_id, category, image_url, caption, display_order) VALUES (?, ?, ?, ?, ?)');
    insertImage.run(1, 'Classroom', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800', 'Students engaged in classroom learning (Demo)', 1);
    insertImage.run(1, 'Infrastructure', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800', 'College building front facade (Demo)', 2);
    insertImage.run(1, 'Infrastructure', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800', 'College library study section (Demo)', 3);
    insertImage.run(2, 'Sports', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800', 'Students participating in sports training (Demo)', 4);
    insertImage.run(2, 'Cultural', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800', 'Annual cultural gathering and ceremonies (Demo)', 5);
    insertImage.run(1, 'Classroom', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', 'Laboratory and group practicals (Demo)', 6);
  }

  // Seed sample Downloads
  const downloadCountRow = db.prepare('SELECT COUNT(*) as count FROM downloads').get() as { count: number };
  if (downloadCountRow.count === 0) {
    const insertDownload = db.prepare(`
      INSERT INTO downloads (title, category, description, file_url, date, is_published)
      VALUES (?, ?, ?, ?, ?, 1)
    `);

    insertDownload.run(
      'Admission Application Form (Demo Form)',
      'Admission Forms',
      'Download the printable admission application form for session registration. [Demo Form - Replace in Admin]',
      '#demo-admission-form',
      new Date().toISOString().split('T')[0]
    );

    insertDownload.run(
      'College Code of Conduct & Rules (Demo Document)',
      'General',
      'Information brochure detailing student discipline, uniform guidelines, and attendance policies. [Demo Document]',
      '#demo-conduct-rules',
      new Date().toISOString().split('T')[0]
    );

    insertDownload.run(
      'Academic Syllabus & Book List (Demo)',
      'Syllabus',
      'Subject-wise curriculum guidelines and suggested textbooks for junior and secondary classes. [Demo Syllabus]',
      '#demo-syllabus',
      new Date().toISOString().split('T')[0]
    );
  }

  // Seed sample Results
  const resultCountRow = db.prepare('SELECT COUNT(*) as count FROM results').get() as { count: number };
  if (resultCountRow.count === 0) {
    const insertResult = db.prepare(`
      INSERT INTO results (academic_year, examination, class_name, title, description, pdf_url, external_url, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    insertResult.run(
      '2025-2026',
      'Quarterly Assessment',
      'Class 10',
      'Class 10 Quarterly Evaluation Summary [Demo Result Notice]',
      'Consolidated marksheet and evaluation overview for Class 10 students. Contact the examination cell for individual mark slips. [Demo Data]',
      '#demo-result-10',
      null
    );

    insertResult.run(
      '2025-2026',
      'Half-Yearly Examination',
      'Class 12',
      'Class 12 Half-Yearly Exam Performance [Demo Result Notice]',
      'Provisional half-yearly marks overview for Senior Secondary batches. [Demo Data]',
      '#demo-result-12',
      null
    );
  }
}

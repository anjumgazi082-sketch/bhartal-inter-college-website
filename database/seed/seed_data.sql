-- PostgreSQL Seed Data for Bhartal Inter College
-- Official School Info:
-- School Name: Bhartal Inter College
-- Address: Hasanpur Road, Bhartal, Sirsi, District Sambhal, Uttar Pradesh, India
-- Phone: +91 90124 93127
-- Email: afarjand581@gmail.com

INSERT INTO school_settings (key, value) VALUES
('school_name', 'Bhartal Inter College'),
('tagline', 'Excellence in Education & Character Building'),
('address', 'Hasanpur Road, Bhartal, Sirsi, District Sambhal, Uttar Pradesh, India'),
('phone', '+91 90124 93127'),
('email', 'afarjand581@gmail.com'),
('office_hours', '{"days":"Monday to Saturday","timings":"08:00 AM - 02:30 PM (Demo - Editable)","closed":"Sundays and National Holidays"}'),
('principal_name', 'Principal''s Name (Demo - Editable)'),
('principal_designation', 'Principal, Bhartal Inter College'),
('principal_photo', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600'),
('principal_message', 'Welcome to Bhartal Inter College. Our commitment is to foster a disciplined, inspiring, and supportive learning environment that empowers our students to excel academically and ethically. (Demo content - Editable via Admin Panel)'),
('homepage_intro', 'Bhartal Inter College, located on Hasanpur Road, Bhartal, Sirsi, District Sambhal, is dedicated to delivering quality education and holistic development for students across the region.'),
('vision', 'To be a beacon of learning, integrity, and civic responsibility, cultivating future leaders who contribute positively to society.'),
('mission', 'To provide comprehensive education rooted in discipline, academic rigor, ethical values, and community welfare.'),
('statistics', '[{"label":"Students Enrolled","value":"1,200+","isDemo":true},{"label":"Dedicated Faculty","value":"45+","isDemo":true},{"label":"Classrooms","value":"28+","isDemo":true},{"label":"Years of Service","value":"15+","isDemo":true}]'),
('facilities', '[{"title":"Spacious Classrooms","description":"Well-ventilated and well-lit rooms designed for collaborative and focused learning.","isDemo":true,"enabled":true},{"title":"Science Laboratories","description":"Equipped facilities for practical experimentation in Physics, Chemistry, and Biology.","isDemo":true,"enabled":true},{"title":"Library & Reading Room","description":"Collection of curriculum textbooks, reference guides, and periodical literature.","isDemo":true,"enabled":true},{"title":"Computer Lab","description":"Digital workstations introducing learners to foundational computer skills.","isDemo":true,"enabled":true},{"title":"Playground & Sports","description":"Open ground facilitating outdoor sports, athletics, and physical education.","isDemo":true,"enabled":true},{"title":"Clean Drinking Water & Sanitation","description":"Hygienic RO-filtered water stations and modern clean restroom facilities.","isDemo":true,"enabled":true}]'),
('social_links', '{"facebook":"","twitter":"","youtube":"","instagram":""}')
ON CONFLICT (key) DO NOTHING;

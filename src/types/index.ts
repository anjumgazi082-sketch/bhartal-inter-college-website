export interface SchoolSettings {
  school_name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  principal_name: string;
  principal_designation: string;
  principal_photo: string;
  principal_message: string;
  homepage_intro: string;
  vision: string;
  mission: string;
  office_hours: {
    days: string;
    timings: string;
    closed: string;
  };
  statistics: Array<{
    id: string;
    label: string;
    value: string;
    isDemo: boolean;
  }>;
  facilities: Array<{
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    isDemo: boolean;
  }>;
  social_links: {
    facebook: string;
    twitter: string;
    youtube: string;
    instagram: string;
  };
}

export interface Notice {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  pdf_url: string | null;
  is_published: number;
  created_at?: string;
  updated_at?: string;
}

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  qualification: string;
  designation: string;
  bio: string;
  photo_url: string;
  display_order: number;
  is_active: number;
  created_at?: string;
}

export interface EventItem {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_url: string;
  is_published: number;
  created_at?: string;
}

export interface GalleryAlbum {
  id: number;
  title: string;
  category: string;
  cover_image: string;
  description: string;
  display_order: number;
  created_at?: string;
}

export interface GalleryImage {
  id: number;
  album_id: number | null;
  album_title?: string;
  category: string;
  image_url: string;
  caption: string;
  display_order: number;
  created_at?: string;
}

export interface DownloadItem {
  id: number;
  title: string;
  category: string;
  description: string;
  file_url: string;
  date: string;
  is_published: number;
  created_at?: string;
}

export interface ResultItem {
  id: number;
  academic_year: string;
  examination: string;
  class_name: string;
  title: string;
  description: string;
  pdf_url: string | null;
  external_url: string | null;
  is_published: number;
  created_at?: string;
}

export interface AdmissionEnquiry {
  id: number;
  student_name: string;
  dob: string | null;
  class_applying: string;
  parent_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  message: string | null;
  status: 'New' | 'Contacted' | 'Closed';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

export interface DashboardMetrics {
  totalNotices: number;
  totalTeachers: number;
  totalEvents: number;
  totalGalleryImages: number;
  totalDownloads: number;
  totalResults: number;
  totalAdmissions: number;
  newAdmissions: number;
}

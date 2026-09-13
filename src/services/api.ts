import type {
  SchoolSettings,
  Notice,
  Teacher,
  EventItem,
  GalleryImage,
  GalleryAlbum,
  DownloadItem,
  ResultItem,
  AdmissionEnquiry,
  User,
  DashboardMetrics,
} from '../types';

const TOKEN_KEY = 'bhartal_admin_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = typeof data === 'object' && data?.error ? data.error : response.statusText || 'Request failed';
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { username: string; password: string }) =>
      request<{ success: boolean; token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    me: () => request<{ user: User }>('/api/auth/me'),
    logout: () => request<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      request<{ success: boolean; message: string }>('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // School Settings
  settings: {
    get: () => request<{ settings: SchoolSettings }>('/api/settings'),
    update: (settings: Partial<SchoolSettings>) =>
      request<{ success: boolean; message: string }>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),
  },

  // Notices
  notices: {
    getAll: (params?: { category?: string; search?: string; all?: boolean; limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.all) query.set('all', 'true');
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));
      return request<{ notices: Notice[]; categories: string[] }>(`/api/notices?${query.toString()}`);
    },
    getById: (id: number) => request<{ notice: Notice }>(`/api/notices/${id}`),
    create: (data: Partial<Notice>) =>
      request<{ success: boolean; id: number; message: string }>('/api/notices', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Notice>) =>
      request<{ success: boolean; message: string }>(`/api/notices/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ success: boolean; message: string }>(`/api/notices/${id}`, {
        method: 'DELETE',
      }),
  },

  // Teachers / Faculty
  teachers: {
    getAll: (params?: { all?: boolean; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.all) query.set('all', 'true');
      if (params?.search) query.set('search', params.search);
      return request<{ teachers: Teacher[] }>(`/api/teachers?${query.toString()}`);
    },
    create: (data: Partial<Teacher>) =>
      request<{ success: boolean; id: number; message: string }>('/api/teachers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Teacher>) =>
      request<{ success: boolean; message: string }>(`/api/teachers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ success: boolean; message: string }>(`/api/teachers/${id}`, {
        method: 'DELETE',
      }),
  },

  // Events
  events: {
    getAll: (params?: { category?: string; search?: string; all?: boolean; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.all) query.set('all', 'true');
      if (params?.limit) query.set('limit', String(params.limit));
      return request<{ events: EventItem[]; categories: string[] }>(`/api/events?${query.toString()}`);
    },
    getById: (id: number) => request<{ event: EventItem }>(`/api/events/${id}`),
    create: (data: Partial<EventItem>) =>
      request<{ success: boolean; id: number; message: string }>('/api/events', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<EventItem>) =>
      request<{ success: boolean; message: string }>(`/api/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ success: boolean; message: string }>(`/api/events/${id}`, {
        method: 'DELETE',
      }),
  },

  // Gallery
  gallery: {
    getAll: (params?: { category?: string; album_id?: number }) => {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.album_id) query.set('album_id', String(params.album_id));
      return request<{ images: GalleryImage[]; albums: GalleryAlbum[]; categories: string[] }>(
        `/api/gallery?${query.toString()}`
      );
    },
    getAlbums: () => request<{ albums: GalleryAlbum[] }>('/api/gallery/albums'),
    createImage: (data: Partial<GalleryImage>) =>
      request<{ success: boolean; id: number; message: string }>('/api/gallery', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    createAlbum: (data: Partial<GalleryAlbum>) =>
      request<{ success: boolean; id: number; message: string }>('/api/gallery/albums', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    deleteImage: (id: number) =>
      request<{ success: boolean; message: string }>(`/api/gallery/${id}`, {
        method: 'DELETE',
      }),
    deleteAlbum: (id: number) =>
      request<{ success: boolean; message: string }>(`/api/gallery/albums/${id}`, {
        method: 'DELETE',
      }),
  },

  // Downloads
  downloads: {
    getAll: (params?: { category?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      return request<{ downloads: DownloadItem[]; categories: string[] }>(`/api/downloads?${query.toString()}`);
    },
    getAllAdmin: () => request<{ downloads: DownloadItem[] }>('/api/downloads/all'),
    create: (data: Partial<DownloadItem>) =>
      request<{ success: boolean; id: number; message: string }>('/api/downloads', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<DownloadItem>) =>
      request<{ success: boolean; message: string }>(`/api/downloads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ success: boolean; message: string }>(`/api/downloads/${id}`, {
        method: 'DELETE',
      }),
  },

  // Results
  results: {
    getAll: (params?: { year?: string; class_name?: string; examination?: string; all?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.year) query.set('year', params.year);
      if (params?.class_name) query.set('class_name', params.class_name);
      if (params?.examination) query.set('examination', params.examination);
      if (params?.all) query.set('all', 'true');
      return request<{ results: ResultItem[]; years: string[]; classes: string[]; examinations: string[] }>(
        `/api/results?${query.toString()}`
      );
    },
    create: (data: Partial<ResultItem>) =>
      request<{ success: boolean; id: number; message: string }>('/api/results', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<ResultItem>) =>
      request<{ success: boolean; message: string }>(`/api/results/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ success: boolean; message: string }>(`/api/results/${id}`, {
        method: 'DELETE',
      }),
  },

  // Admission Enquiries
  admissions: {
    submit: (enquiry: {
      student_name: string;
      dob?: string;
      class_applying: string;
      parent_name: string;
      phone: string;
      email?: string;
      address?: string;
      message?: string;
    }) =>
      request<{ success: boolean; id: number; message: string }>('/api/admissions', {
        method: 'POST',
        body: JSON.stringify(enquiry),
      }),
    getAllAdmin: (params?: { status?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      return request<{
        enquiries: AdmissionEnquiry[];
        counts: { total: number; new: number; contacted: number; closed: number };
      }>(`/api/admin/admissions/all?${query.toString()}`);
    },
    updateStatus: (id: number, data: { status?: string; notes?: string }) =>
      request<{ success: boolean; message: string }>(`/api/admin/admissions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ success: boolean; message: string }>(`/api/admin/admissions/${id}`, {
        method: 'DELETE',
      }),
  },

  // Upload
  upload: {
    file: (filename: string, dataUrl: string) =>
      request<{ success: boolean; fileUrl: string; filename: string; size: number; mimeType: string }>('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ filename, dataUrl }),
      }),
  },

  // Admin Stats
  stats: {
    get: () =>
      request<{
        metrics: DashboardMetrics;
        recentNotices: Notice[];
        recentEnquiries: AdmissionEnquiry[];
      }>('/api/admin/stats'),
  },
};

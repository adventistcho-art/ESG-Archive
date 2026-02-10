import { AuthResponse, EsgProject, ProjectFilter, ProjectResult, EsgPlan, EsgWhitePaper } from './types';

const API_BASE = '/api';

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete (headers as Record<string, string>)['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, deptName: string) =>
    fetchAPI<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, deptName }),
    }),

  getProfile: () => fetchAPI<any>('/users/me'),
};

// Projects - Public
export const projectsAPI = {
  getAll: (filter?: ProjectFilter) => {
    const params = new URLSearchParams();
    if (filter?.year) params.append('year', String(filter.year));
    if (filter?.category) params.append('category', filter.category);
    if (filter?.deptName) params.append('deptName', filter.deptName);
    const query = params.toString();
    return fetchAPI<EsgProject[]>(`/projects${query ? `?${query}` : ''}`);
  },

  getOne: (id: string) => fetchAPI<EsgProject>(`/projects/${id}`),

  getYears: () => fetchAPI<number[]>('/projects/years'),

  getStats: () => fetchAPI<any>('/projects/stats'),
};

// Projects - Admin
export const adminAPI = {
  getProjects: () => fetchAPI<EsgProject[]>('/projects/admin/list'),

  createProject: (data: any) =>
    fetchAPI<EsgProject>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProject: (id: string, data: any) =>
    fetchAPI<EsgProject>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProject: (id: string) =>
    fetchAPI<any>(`/projects/${id}`, { method: 'DELETE' }),
};

// Project Results
export const resultsAPI = {
  getByProject: (projectId: string) =>
    fetchAPI<ProjectResult>(`/projects/${projectId}/result`),

  create: (projectId: string, data: any) =>
    fetchAPI<ProjectResult>(`/projects/${projectId}/result`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (projectId: string, data: any) =>
    fetchAPI<ProjectResult>(`/projects/${projectId}/result`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ESG Plans
export const plansAPI = {
  getAll: (year?: number) => {
    const params = year ? `?year=${year}` : '';
    return fetchAPI<EsgPlan[]>(`/plans${params}`);
  },

  getYears: () => fetchAPI<number[]>('/plans/years'),
};

// ESG White Paper (백서)
export const whitePaperAPI = {
  getAll: () => fetchAPI<EsgWhitePaper[]>('/whitepaper'),

  getByYear: (year: number) => fetchAPI<EsgWhitePaper>(`/whitepaper/${year}`),

  getYears: () => fetchAPI<number[]>('/whitepaper/years'),
};

// Upload
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchAPI<{ url: string }>('/upload/image', {
      method: 'POST',
      body: formData,
    });
  },

  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchAPI<{ url: string }>('/upload/document', {
      method: 'POST',
      body: formData,
    });
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return fetchAPI<{ urls: string[] }>('/upload/images', {
      method: 'POST',
      body: formData,
    });
  },
};

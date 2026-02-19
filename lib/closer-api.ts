'use client';

import { auth } from './firebase';

const API_BASE = 'https://billymc-api.bmcii1976.workers.dev';

export async function closerFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API Error ${res.status}`);
  }

  return res.json();
}

// --- Leads ---
export const getLeads = (params?: string) => closerFetch(`/leads${params ? `?${params}` : ''}`);
export const getLead = (id: string) => closerFetch(`/leads/${id}`);
export const createLead = (data: any) => closerFetch('/leads', { method: 'POST', body: JSON.stringify(data) });
export const updateLead = (id: string, data: any) => closerFetch(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteLead = (id: string) => closerFetch(`/leads/${id}`, { method: 'DELETE' });
export const importLeads = (data: any) => closerFetch('/leads/import', { method: 'POST', body: JSON.stringify(data) });

// --- Calls ---
export const getCalls = (params?: string) => closerFetch(`/calls${params ? `?${params}` : ''}`);
export const getCall = (id: string) => closerFetch(`/calls/${id}`);
export const getCallEvents = (id: string) => closerFetch(`/calls/${id}/events`);
export const initiateCall = (data: any) => closerFetch('/calls/initiate', { method: 'POST', body: JSON.stringify(data) });

// --- Campaigns ---
export const getCampaigns = (params?: string) => closerFetch(`/campaigns${params ? `?${params}` : ''}`);
export const getCampaign = (id: string) => closerFetch(`/campaigns/${id}`);
export const createCampaign = (data: any) => closerFetch('/campaigns', { method: 'POST', body: JSON.stringify(data) });
export const updateCampaign = (id: string, data: any) => closerFetch(`/campaigns/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

// --- Scripts ---
export const getScripts = () => closerFetch('/scripts');
export const getScript = (id: string) => closerFetch(`/scripts/${id}`);
export const createScript = (data: any) => closerFetch('/scripts', { method: 'POST', body: JSON.stringify(data) });
export const updateScript = (id: string, data: any) => closerFetch(`/scripts/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

// --- Appointments ---
export const getAppointments = (params?: string) => closerFetch(`/appointments${params ? `?${params}` : ''}`);

// --- Analytics ---
export const getDashboardStats = () => closerFetch('/analytics/dashboard');
export const getCostAnalytics = (params?: string) => closerFetch(`/analytics/costs${params ? `?${params}` : ''}`);

// --- DNC ---
export const checkDNC = (phone: string) => closerFetch(`/dnc/check/${encodeURIComponent(phone)}`);
export const addDNC = (phone: string, reason?: string) => closerFetch('/dnc', { method: 'POST', body: JSON.stringify({ phone, reason }) });

// --- Auth ---
export const getMe = () => closerFetch('/auth/me');
export const signup = (data: { firebase_token: string; company_name: string; owner_name: string; industry: string }) =>
  closerFetch('/auth/signup', { method: 'POST', body: JSON.stringify(data) });

// --- Billy Copilot ---
export const chatWithBilly = (message: string) => closerFetch('/billy/chat', { method: 'POST', body: JSON.stringify({ message }) });

'use client';

import { auth } from './firebase';
import { getApiBase, getWsBase } from './api-base';

const API_BASE = getApiBase('billymc-api');

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
export const importLeads = (data: any) => closerFetch('/leads/bulk', { method: 'POST', body: JSON.stringify(data) });

// --- Calls ---
export const getCalls = (params?: string) => closerFetch(`/calls${params ? `?${params}` : ''}`);
export const getCall = (id: string) => closerFetch(`/calls/${id}`);
export const getCallEvents = (id: string) => closerFetch(`/calls/${id}/events`);
export const initiateCall = (data: any) => closerFetch('/calls/initiate', { method: 'POST', body: JSON.stringify(data) });
export const whisperToAI = (callId: string, message: string) => closerFetch(`/calls/${callId}/whisper`, { method: 'POST', body: JSON.stringify({ message }) });
export const takeoverCall = (callId: string) => closerFetch(`/calls/${callId}/takeover`, { method: 'POST' });
export const muteAI = (callId: string, muted: boolean) => closerFetch(`/calls/${callId}/mute`, { method: 'POST', body: JSON.stringify({ muted }) });
export const endCall = (callId: string) => closerFetch(`/calls/${callId}/end`, { method: 'POST' });

// --- Campaigns ---
export const getCampaigns = (params?: string) => closerFetch(`/campaigns${params ? `?${params}` : ''}`);
export const getCampaign = (id: string) => closerFetch(`/campaigns/${id}`);
export const createCampaign = (data: any) => closerFetch('/campaigns', { method: 'POST', body: JSON.stringify(data) });
export const updateCampaign = (id: string, data: any) => closerFetch(`/campaigns/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteCampaign = (id: string) => closerFetch(`/campaigns/${id}`, { method: 'DELETE' });
export const assignLeadsToCampaign = (campaignId: string, leadIds: string[]) => closerFetch(`/campaigns/${campaignId}/leads`, { method: 'POST', body: JSON.stringify({ lead_ids: leadIds }) });
export const getCampaignLeads = (campaignId: string) => closerFetch(`/campaigns/${campaignId}/leads`);
export const dialNextLead = (campaignId: string) => closerFetch(`/campaigns/${campaignId}/dial-next`, { method: 'POST' });
export const getCampaignStats = (campaignId: string) => closerFetch(`/campaigns/${campaignId}/stats`);
export const getLeadCategories = () => closerFetch('/leads/categories');
export const renameLeadCategory = (old_name: string, new_name: string) => closerFetch('/leads/categories/rename', { method: 'POST', body: JSON.stringify({ old_name, new_name }) });
export const deleteLeadCategory = (name: string) => closerFetch('/leads/categories/delete', { method: 'POST', body: JSON.stringify({ name }) });
export const moveLeadsToCategory = (lead_ids: string[], category: string | null) => closerFetch('/leads/categories/move', { method: 'POST', body: JSON.stringify({ lead_ids, category }) });

// --- Scripts ---
export const getScripts = () => closerFetch('/scripts');
export const getScript = (id: string) => closerFetch(`/scripts/${id}`);
export const createScript = (data: any) => closerFetch('/scripts', { method: 'POST', body: JSON.stringify(data) });
export const updateScript = (id: string, data: any) => closerFetch(`/scripts/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteScript = (id: string) => closerFetch(`/scripts/${id}`, { method: 'DELETE' });
export const generateScripts = (text: string, filename: string): Promise<{ scripts: Array<{ id: string; name: string; states_count: number }>; total: number; filename: string }> =>
  closerFetch('/scripts/generate', { method: 'POST', body: JSON.stringify({ text, filename }) });

// --- Appointments ---
export const getAppointments = (params?: string) => closerFetch(`/appointments${params ? `?${params}` : ''}`);
export const getAppointment = (id: string) => closerFetch(`/appointments/${id}`);
export const createAppointment = (data: any) => closerFetch('/appointments', { method: 'POST', body: JSON.stringify(data) });
export const updateAppointment = (id: string, data: any) => closerFetch(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteAppointment = (id: string) => closerFetch(`/appointments/${id}`, { method: 'DELETE' });
export const bookAppointment = (callId: string, data: { appointment_time: string; duration_minutes?: number; type?: string; interest_level?: string; notes?: string; agent_name?: string }) =>
  closerFetch(`/calls/${callId}/book-appointment`, { method: 'POST', body: JSON.stringify(data) });

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

// --- Settings ---
export const getSettings = () => closerFetch('/settings');
export const updateSettings = (data: any) => closerFetch('/settings', { method: 'PATCH', body: JSON.stringify(data) });

// --- Ace Copilot Chat ---
export const chatWithAce = (message: string) => closerFetch('/billy/chat', { method: 'POST', body: JSON.stringify({ message }) });

// --- Echo Prime AI Chat ---
export const chatWithEcho = (message: string) => closerFetch('/chat', { method: 'POST', body: JSON.stringify({ message }) });

// --- Bug Reports ---
export const submitBugReport = (message: string, ai_response: string) =>
  closerFetch('/bug-reports', { method: 'POST', body: JSON.stringify({ message, ai_response }) });

// --- WebSocket URL ---
export const VOICE_WS_URL = `${getWsBase('billymc-voice')}/voice/live`;

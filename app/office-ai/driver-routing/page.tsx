'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  Truck, MapPin, Clock, Navigation, Users, Plus, X,
  CheckCircle, AlertCircle, ChevronDown, ChevronUp,
} from 'lucide-react';

interface Stop {
  id: string;
  address: string;
  timeWindow: string;
  status: 'pending' | 'completed' | 'skipped';
  notes: string;
}

interface Route {
  id: string;
  driver: string;
  vehicle: string;
  date: string;
  stops: Stop[];
  status: 'pending' | 'in_progress' | 'completed';
  estimatedTime: number;
}

const DEMO_ROUTES: Route[] = [
  {
    id: '1', driver: 'Mike Rodriguez', vehicle: 'Van #3 - Ford Transit', date: '2026-03-14',
    status: 'in_progress', estimatedTime: 360,
    stops: [
      { id: 's1', address: '1401 W Wall St, Midland, TX', timeWindow: '8:00 AM - 9:00 AM', status: 'completed', notes: 'Front door access' },
      { id: 's2', address: '3200 N Big Spring St, Midland, TX', timeWindow: '9:30 AM - 10:30 AM', status: 'completed', notes: '' },
      { id: 's3', address: '4610 N Garfield St, Midland, TX', timeWindow: '11:00 AM - 12:00 PM', status: 'pending', notes: 'Gate code: 4521' },
      { id: 's4', address: '2901 W Louisiana Ave, Midland, TX', timeWindow: '1:00 PM - 2:00 PM', status: 'pending', notes: '' },
    ],
  },
  {
    id: '2', driver: 'Sarah Chen', vehicle: 'Truck #1 - Chevy Silverado', date: '2026-03-14',
    status: 'pending', estimatedTime: 240,
    stops: [
      { id: 's5', address: '500 W Texas Ave, Midland, TX', timeWindow: '9:00 AM - 10:00 AM', status: 'pending', notes: 'Loading dock B' },
      { id: 's6', address: '1600 S Midkiff Rd, Midland, TX', timeWindow: '10:30 AM - 11:30 AM', status: 'pending', notes: '' },
      { id: 's7', address: '3100 W Wadley Ave, Midland, TX', timeWindow: '12:00 PM - 1:00 PM', status: 'pending', notes: 'Ask for Jim' },
    ],
  },
  {
    id: '3', driver: 'Carlos Mendez', vehicle: 'Van #5 - Ram ProMaster', date: '2026-03-14',
    status: 'completed', estimatedTime: 300,
    stops: [
      { id: 's8', address: '2200 W Front St, Midland, TX', timeWindow: '7:00 AM - 8:00 AM', status: 'completed', notes: '' },
      { id: 's9', address: '800 N Lamesa Rd, Midland, TX', timeWindow: '8:30 AM - 9:30 AM', status: 'completed', notes: '' },
      { id: 's10', address: '4200 Andrews Hwy, Midland, TX', timeWindow: '10:00 AM - 11:00 AM', status: 'completed', notes: '' },
    ],
  },
];

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-warning', in_progress: 'badge-info', completed: 'badge-success', skipped: 'badge-danger',
};

export default function DriverRoutingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>(DEMO_ROUTES);
  const [expandedRoute, setExpandedRoute] = useState<string | null>('1');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ driver: '', vehicle: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);

  if (loading || !user) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner spinner-lg" /></div>;

  const totalStops = routes.reduce((s, r) => s + r.stops.length, 0);
  const completedStops = routes.reduce((s, r) => s + r.stops.filter(st => st.status === 'completed').length, 0);

  const handleAddRoute = () => {
    if (!form.driver || !form.vehicle) return;
    const newRoute: Route = {
      id: Date.now().toString(), driver: form.driver, vehicle: form.vehicle, date: form.date,
      stops: [], status: 'pending', estimatedTime: 0,
    };
    setRoutes(prev => [...prev, newRoute]);
    setShowModal(false);
    setForm({ driver: '', vehicle: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
            <Truck size={28} style={{ color: 'var(--ept-accent)' }} />
            Driver Routing
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ept-text-muted)' }}>
            Manage fleet routes, stops, and driver assignments
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-glow flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold">
          <Plus size={16} /> New Route
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Routes', value: routes.filter(r => r.status !== 'completed').length, icon: Navigation, color: 'var(--ept-accent)' },
          { label: 'Drivers Today', value: new Set(routes.map(r => r.driver)).size, icon: Users, color: 'var(--ept-info)' },
          { label: 'Total Stops', value: totalStops, icon: MapPin, color: 'var(--ept-text-secondary)' },
          { label: 'Completed Stops', value: `${completedStops}/${totalStops}`, icon: CheckCircle, color: 'var(--ept-success)' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon size={16} style={{ color: stat.color }} />
              <span className="text-xs font-medium" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--ept-text)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Routes */}
      <div className="space-y-4">
        {routes.length === 0 ? (
          <div className="glass-card p-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
            <Truck size={32} className="mx-auto mb-3 opacity-40" />
            No routes scheduled.{' '}
            <button onClick={() => setShowModal(true)} className="underline" style={{ color: 'var(--ept-accent)' }}>Create one</button>
          </div>
        ) : routes.map(route => {
          const isExpanded = expandedRoute === route.id;
          const doneCount = route.stops.filter(s => s.status === 'completed').length;
          return (
            <div key={route.id} className="glass-card overflow-hidden">
              <button
                onClick={() => setExpandedRoute(isExpanded ? null : route.id)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ept-surface)' }}>
                    <Truck size={20} style={{ color: 'var(--ept-accent)' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>{route.driver}</div>
                    <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{route.vehicle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: 'var(--ept-text-secondary)' }}>
                    {doneCount}/{route.stops.length} stops
                  </span>
                  <span className={`badge ${STATUS_BADGE[route.status]}`}>
                    {route.status === 'in_progress' ? 'In Progress' : route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ept-text-muted)' }}>
                    <Clock size={12} />
                    {Math.floor(route.estimatedTime / 60)}h {route.estimatedTime % 60}m
                  </span>
                  {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--ept-text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--ept-text-muted)' }} />}
                </div>
              </button>

              {isExpanded && route.stops.length > 0 && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: 'var(--ept-border)' }}>
                  <div className="mt-4 space-y-3">
                    {route.stops.map((stop, idx) => (
                      <div key={stop.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: stop.status === 'completed' ? 'var(--ept-success)' : 'var(--ept-surface)',
                              color: stop.status === 'completed' ? '#fff' : 'var(--ept-text-muted)',
                            }}>
                            {stop.status === 'completed' ? <CheckCircle size={14} /> : idx + 1}
                          </div>
                          {idx < route.stops.length - 1 && (
                            <div className="w-0.5 h-8 mt-1" style={{ backgroundColor: 'var(--ept-border)' }} />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2">
                            <MapPin size={12} style={{ color: 'var(--ept-accent)' }} />
                            <span className="text-sm font-medium" style={{ color: 'var(--ept-text)' }}>{stop.address}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock size={10} style={{ color: 'var(--ept-text-muted)' }} />
                            <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{stop.timeWindow}</span>
                            {stop.notes && (
                              <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>
                                {stop.notes}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`badge ${STATUS_BADGE[stop.status]} text-[10px]`}>
                          {stop.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isExpanded && route.stops.length === 0 && (
                <div className="px-5 pb-5 border-t text-center py-4" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
                  <MapPin size={20} className="mx-auto mb-1 opacity-40" />
                  <span className="text-xs">No stops added yet</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Route Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--ept-text)' }}>
                <Plus size={20} style={{ color: 'var(--ept-accent)' }} />
                New Route
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:opacity-70" style={{ color: 'var(--ept-text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Driver Name *</label>
                <input value={form.driver} onChange={e => setForm(p => ({ ...p, driver: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Vehicle *</label>
                <input value={form.vehicle} onChange={e => setForm(p => ({ ...p, vehicle: e.target.value }))} placeholder="e.g. Van #3 - Ford Transit" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={handleAddRoute} disabled={!form.driver || !form.vehicle} className="btn-glow px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                Create Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

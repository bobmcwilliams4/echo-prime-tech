'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Appointments',
  tagline: 'Online booking, automated reminders, no-show prediction, and provider scheduling — the AI-powered appointment system that fills your calendar.',
  accent: '#06b6d4',
  productUrl: '/appointments',
  workerUrl: 'echo-appointments.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Appointments is an AI-powered scheduling and booking platform built on Cloudflare Workers. Share your booking URL or embed it on your website — clients choose a service, select a provider, pick an available time slot, and confirm. The system checks real-time availability so double-bookings are impossible.',
    'Automated email reminders sent 24 hours and 1 hour before each appointment reduce no-shows by up to 80%. The AI goes further by analyzing each client\'s appointment history — cancellation rate, reschedule frequency, and no-show patterns — to predict risk and flag high-risk bookings for proactive confirmation.',
    'Full provider management with individual availability schedules, service catalogs with duration and pricing, revenue tracking by service and provider, and multi-location support through multi-tenant architecture. Compared to Calendly, Acuity, and Square, Echo Appointments adds AI scheduling insights and full REST API access at every tier.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create Your Account', desc: 'Sign up at echo-ept.com and choose a plan: Solo ($19/mo for 1 provider), Team ($49/mo for 10 providers), or Business ($129/mo for unlimited). All plans include a free trial.' },
    { step: 2, title: 'Add Services', desc: 'Define your services with name, duration, price, and description. Color-code them for easy calendar viewing. Enable or disable services anytime as your offerings change.' },
    { step: 3, title: 'Set Up Providers', desc: 'Add team members with roles, bios, and which services they offer. Each provider configures their own weekly availability schedule with day-of-week rules and buffer times.' },
    { step: 4, title: 'Share Your Booking Page', desc: 'Your public booking page is ready immediately. Share the direct link, embed it on your website, or add a booking button. Clients can book, reschedule, or cancel through the page.' },
    { step: 5, title: 'Review AI Insights', desc: 'As bookings accumulate, the AI analyzes patterns to predict peak hours, identify no-show risk, and recommend optimal provider scheduling for maximum utilization.' },
  ],
  features: [
    { title: 'Online Booking', desc: 'Public booking page where clients choose a service, provider, and available time slot. Embed on your website or share a direct link. Fully responsive on all devices.' },
    { title: 'Provider Management', desc: 'Add team members with roles, bios, and service capabilities. Each provider manages their own availability schedule with day-of-week rules.' },
    { title: 'Service Catalog', desc: 'Define services with duration, price, and description. Color-code for easy calendar viewing. Enable or disable services anytime.' },
    { title: 'Smart Availability', desc: 'Weekly availability per provider with day-of-week rules. The system prevents double-booking automatically and respects buffer times between appointments.' },
    { title: 'Automated Reminders', desc: 'Email reminders sent 24 hours and 1 hour before appointments. Reduces no-shows by up to 80% with zero manual effort.' },
    { title: 'Appointment Lifecycle', desc: 'Full status tracking: scheduled, confirmed, completed, cancelled, no-show. Handle cancellations, reschedules, and no-shows with one click.' },
    { title: 'AI Scheduling Insights', desc: 'AI analyzes booking patterns to predict peak hours, no-show risk per client, and optimal provider scheduling for better team utilization.' },
    { title: 'Calendar View', desc: 'Team calendar showing all appointments across providers. Filter by provider, service, or status. Approved time-off displayed at a glance.' },
    { title: 'Revenue Tracking', desc: 'Track revenue by service, provider, and time period. See which services generate the most income and highest completion rates.' },
    { title: 'Multi-Location Ready', desc: 'Multi-tenant architecture supports multiple businesses or locations. Each tenant gets isolated data with full API access.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/services', desc: 'List all active services with duration, pricing, and provider availability.', auth: false },
    { method: 'GET', path: '/providers', desc: 'List providers with bios, services offered, and next available time slots.', auth: false },
    { method: 'GET', path: '/availability/:providerId', desc: 'Get available time slots for a specific provider on a given date range.', auth: false },
    { method: 'POST', path: '/appointments', desc: 'Create a new appointment booking with service, provider, and time slot.', auth: true },
    { method: 'PATCH', path: '/appointments/:id', desc: 'Update appointment status (confirm, cancel, reschedule, mark no-show).', auth: true },
    { method: 'GET', path: '/analytics/revenue', desc: 'Revenue analytics by service, provider, and time period with completion rates.', auth: true },
  ],
  userGuide: [
    { title: 'Managing Your Schedule', id: 'schedule', content: [
      'Set your weekly availability by going to Provider Settings and defining available hours for each day of the week. Add buffer time between appointments (e.g., 15 minutes) to prevent back-to-back bookings.',
      'Block off time for lunch, meetings, or personal time by creating unavailable periods. These blocked times will not show as available on the booking page. You can also mark full days as unavailable for vacations.',
      'The calendar view shows all appointments across your team. Use filters to see a single provider\'s schedule, appointments for a specific service, or bookings with a particular status. Color-coded services make it easy to scan at a glance.',
    ] },
    { title: 'Reducing No-Shows', id: 'no-shows', content: [
      'Automated email reminders are the first line of defense — the 24-hour and 1-hour reminders are enabled by default and require no configuration.',
      'The AI no-show prediction engine analyzes each client\'s history and assigns a risk score to upcoming appointments. High-risk bookings are flagged in the calendar so you can send a personal confirmation or strategically overbook that time slot.',
      'Track no-show rates over time in the analytics dashboard. See which services, providers, or days of the week have the highest no-show rates, and adjust your scheduling or reminder strategy accordingly.',
    ] },
    { title: 'Client Self-Service', id: 'self-service', content: [
      'Clients receive a confirmation email with a link to manage their booking. They can reschedule to a different time or cancel entirely without calling your office. Cancelled slots are automatically reopened for new bookings.',
      'The booking page works on any device — phone, tablet, or desktop. No app download required. Clients simply visit the URL, select their options, and confirm.',
    ] },
  ],
  aiCapabilities: [
    { capability: 'No-Show Prediction', desc: 'AI analyzes each client\'s appointment history — cancellation rate, reschedule frequency, and no-show patterns — to predict risk for upcoming bookings. High-risk appointments are flagged for proactive confirmation.' },
    { capability: 'Peak Hour Forecasting', desc: 'Historical booking data is analyzed to predict which days and hours will be busiest. Use these insights to schedule additional providers during peak times and reduce coverage during slow periods.' },
    { capability: 'Provider Utilization Optimization', desc: 'AI identifies underutilized providers and recommends schedule adjustments to balance workload across the team, maximizing revenue per provider hour.' },
  ],
  troubleshooting: [
    { issue: 'Clients see no available time slots', solution: 'Check that the provider has availability configured for the requested date range. Verify the service is enabled and assigned to at least one provider. Ensure buffer times are not consuming all available slots.' },
    { issue: 'Reminder emails not being received', solution: 'Have the client check their spam/junk folder. Verify the client email address is correct on the booking. Reminder emails are sent 24 hours and 1 hour before — if the appointment was booked less than 24 hours out, only the 1-hour reminder fires.' },
    { issue: 'Double-booking despite prevention', solution: 'The system prevents double-booking through real-time availability checks. If you see overlapping appointments, they were likely created by an admin override. Check the appointment audit log for creation source.' },
    { issue: 'AI insights not appearing', solution: 'AI scheduling insights require the Team plan or higher and at least 30 days of booking history to generate meaningful predictions. The system needs enough data to identify patterns.' },
  ],
  faq: [
    { q: 'How does online booking work?', a: 'Share your booking URL or embed it on your website. Clients see available services, choose a provider, pick a time slot, and confirm. Real-time availability checks make double-bookings impossible.' },
    { q: 'How do automated reminders reduce no-shows?', a: 'Email reminders sent 24 hours and 1 hour before each appointment reduce no-shows by 60-80%. The AI also flags high-risk bookings based on client history.' },
    { q: 'Can clients book on mobile?', a: 'The booking page is fully responsive — works on iPhone, Android, tablets, and desktop. No app download needed, just visit the URL and book.' },
    { q: 'How does AI predict no-shows?', a: 'AI analyzes each client\'s cancellation rate, reschedule frequency, and no-show history to assign a risk score to each upcoming appointment. High-risk bookings are flagged for confirmation.' },
    { q: 'What are the pricing tiers?', a: 'Solo at $19/mo (1 provider, 3 services), Team at $49/mo (10 providers, unlimited services, AI insights), and Business at $129/mo (unlimited providers, multi-location, webhooks).' },
  ],
}

export default function AppointmentsDocsPage() {
  return <ProductDoc {...data} />
}

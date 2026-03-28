'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Booking',
  tagline: 'AI-powered appointment scheduling — online booking, calendar sync, payments, and smart automation.',
  accent: '#0ea5e9',
  productUrl: '/booking',
  workerUrl: 'https://echo-booking.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Booking is an intelligent appointment scheduling platform that replaces fragmented tools like Calendly and Acuity with a single, AI-driven system. Businesses of any size can publish booking pages, accept payments at the time of scheduling, manage staff availability across multiple locations, and automate the entire confirmation-reminder-follow-up lifecycle — all without writing a line of code.',
    'Unlike basic scheduling links, Echo Booking learns from your booking patterns. The AI engine optimizes appointment density to minimize dead gaps in your calendar, predicts no-shows based on historical behavior and sends targeted reminders to at-risk bookings, and suggests time-slot expansions when demand spikes. Waitlist management, group bookings, and recurring appointment series are built in, so every scheduling scenario your business encounters is handled natively.',
    'Echo Booking integrates with Google Calendar, Outlook, and Apple Calendar via two-way sync so availability is always accurate. Payment collection through Stripe processes deposits or full payments at booking time. Custom intake forms capture the information you need before the appointment, and branded booking pages match your company identity. A full REST API and webhook system enables deep integration with CRMs, marketing platforms, and internal tools.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Booking Profile', desc: 'Sign up at echo-ept.com/booking and configure your business profile — name, timezone, logo, and brand colors. Your public booking page is live immediately at a unique URL you can share with clients.' },
    { step: 2, title: 'Define Service Types', desc: 'Create the services you offer — name, duration, price, buffer time between appointments, and max daily capacity. Each service gets its own booking link and can have unique intake form questions, cancellation policies, and staff assignments.' },
    { step: 3, title: 'Connect Your Calendar', desc: 'Link Google Calendar, Outlook, or Apple Calendar for two-way availability sync. Echo Booking reads your existing events to prevent double-booking and writes new appointments back to your calendar in real time.' },
    { step: 4, title: 'Set Up Payments & Reminders', desc: 'Connect your Stripe account to collect deposits or full payments at booking time. Configure automated email and SMS reminders — typically 24 hours and 1 hour before the appointment — with customizable message templates.' },
    { step: 5, title: 'Share Your Booking Link', desc: 'Embed the booking widget on your website, share the direct link via email or social media, or add a "Book Now" button to your Google Business profile. Clients select a service, pick an available time, fill out the intake form, pay, and receive instant confirmation.' },
  ],

  features: [
    { title: 'Online Booking Pages', desc: 'Branded, mobile-responsive booking pages where clients browse services, select available time slots, complete intake forms, and pay — all in one flow. Customizable colors, logos, and messaging to match your brand.' },
    { title: 'Calendar Sync', desc: 'Two-way sync with Google Calendar, Microsoft Outlook, and Apple Calendar. Existing events block availability automatically. New bookings appear on your calendar within seconds. Supports multiple calendar accounts per staff member.' },
    { title: 'Automated Reminders', desc: 'Configurable email and SMS reminders sent at intervals you choose — 48h, 24h, 2h, or custom. Each reminder template is editable with merge fields for client name, service, date, time, and location. Dramatically reduces no-show rates.' },
    { title: 'Payment Collection', desc: 'Stripe integration for collecting deposits or full payment at booking time. Support for percentage-based deposits, flat-fee deposits, or full prepayment. Automatic refund processing on cancellations within your policy window.' },
    { title: 'Waitlist Management', desc: 'When a time slot fills up, clients can join a waitlist. If a cancellation opens the slot, the first waitlisted client is automatically notified and given a time-limited window to claim the appointment before the next person is contacted.' },
    { title: 'Group Bookings', desc: 'Offer classes, workshops, or group sessions with configurable minimum and maximum participant counts. Clients book individual spots; the session runs when the minimum is met. Automatic notifications if a session is cancelled due to low enrollment.' },
    { title: 'Recurring Appointments', desc: 'Clients or staff can schedule recurring appointments — weekly, biweekly, monthly, or custom intervals. The system reserves the same time slot across future dates and handles individual-occurrence rescheduling without breaking the series.' },
    { title: 'Multi-Location Support', desc: 'Manage booking availability across multiple physical locations, virtual meeting rooms, or service areas. Each location has its own hours, staff assignments, and capacity limits. Clients select their preferred location during booking.' },
    { title: 'Staff Scheduling', desc: 'Assign staff members to services with individual availability windows, break times, and maximum daily appointment limits. Round-robin and load-balanced auto-assignment distribute bookings evenly across your team.' },
    { title: 'Custom Intake Forms', desc: 'Build intake forms with text fields, dropdowns, checkboxes, file uploads, and conditional logic. Responses are attached to the appointment record and available via API. Required fields ensure you have the information you need before the appointment.' },
    { title: 'Embed Widget', desc: 'Lightweight JavaScript widget embeds your booking flow directly into any website. Configurable to show specific services, pre-select staff, or skip steps. Responsive design works on desktop and mobile without iframes.' },
    { title: 'Webhook & API', desc: 'Full REST API for programmatic booking management. Webhooks fire on booking created, rescheduled, cancelled, no-show marked, and payment events. JSON payloads include complete appointment and client data for real-time integrations.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/services', desc: 'List all booking services with durations, pricing, staff assignments, and availability windows.', auth: true },
    { method: 'POST', path: '/api/bookings', desc: 'Create a new booking for a specific service, time slot, and client. Validates availability, processes payment if configured, and sends confirmation.', auth: true },
    { method: 'GET', path: '/api/bookings/:id', desc: 'Retrieve a single booking by ID including client details, intake form responses, payment status, and reminder history.', auth: true },
    { method: 'PUT', path: '/api/bookings/:id/reschedule', desc: 'Reschedule an existing booking to a new date/time. Validates new slot availability and sends updated confirmation to the client.', auth: true },
    { method: 'DELETE', path: '/api/bookings/:id', desc: 'Cancel a booking. Processes refund according to cancellation policy. Notifies the client and frees the time slot. Triggers waitlist notification if applicable.', auth: true },
    { method: 'GET', path: '/api/availability', desc: 'Query available time slots for a service and date range. Factors in staff schedules, existing bookings, buffer times, and calendar sync blocks.', auth: false },
    { method: 'GET', path: '/api/staff', desc: 'List staff members with their assigned services, availability hours, and booking counts for load balancing.', auth: true },
    { method: 'POST', path: '/api/waitlist', desc: 'Add a client to the waitlist for a fully-booked time slot. Returns position in queue and estimated notification time.', auth: true },
  ],

  userGuide: [
    {
      title: 'Setting Up Services',
      id: 'setting-up-services',
      content: [
        'Services are the core building blocks of your booking system. Each service represents something a client can book — a consultation, haircut, coaching session, class, or any other time-based offering. Navigate to Settings > Services to create and manage your service catalog.',
        'For each service, configure the display name, duration (15 minutes to 8 hours), description shown on the booking page, price, and buffer time before and after appointments. Buffer time prevents back-to-back bookings and gives you transition time between clients. Set a daily capacity limit to control how many of each service can be booked per day.',
        'Advanced settings let you specify a minimum scheduling notice (e.g., no bookings less than 2 hours from now), a maximum advance booking window (e.g., up to 60 days out), and cancellation/reschedule policies with time-based cutoffs. Each service can also have its own custom intake form with fields specific to that service type.',
      ],
    },
    {
      title: 'Managing Staff & Availability',
      id: 'managing-staff',
      content: [
        'If your business has multiple team members who handle appointments, the staff management module lets you assign each person to specific services with individual availability windows. Go to Settings > Staff to add team members with their name, email, photo, and the services they can perform.',
        'Each staff member sets their own weekly availability hours — for example, Monday through Friday 9:00 AM to 5:00 PM with a lunch break from 12:00 to 1:00 PM. Staff can also block off specific dates for vacation, training, or personal time. Two-way calendar sync ensures that personal calendar events automatically block booking availability.',
        'When a client books, they can either select a specific staff member or let the system auto-assign. Auto-assignment uses round-robin by default, distributing bookings evenly. You can switch to load-balanced mode, which assigns to the staff member with the most availability, or priority mode, which fills one person\'s calendar before moving to the next.',
      ],
    },
    {
      title: 'Payments & Cancellations',
      id: 'payments-cancellations',
      content: [
        'Echo Booking integrates with Stripe to collect payments at the time of booking. In Settings > Payments, connect your Stripe account and choose a payment model per service: no payment required, deposit (percentage or flat amount), or full prepayment. Clients enter their card during the booking flow and are charged immediately upon confirmation.',
        'Cancellation policies are configurable per service. Set a free cancellation window — for example, cancellations more than 24 hours before the appointment receive a full refund, cancellations within 24 hours forfeit the deposit, and no-shows are charged the full amount. These policies are displayed to clients during booking so expectations are clear.',
        'Refunds are processed automatically through Stripe when a cancellation falls within the free window. For edge cases, administrators can issue manual partial or full refunds from the booking detail view. All payment events — charges, refunds, disputes — are logged on the appointment record and available via the payments API.',
      ],
    },
    {
      title: 'Reminders & Notifications',
      id: 'reminders-notifications',
      content: [
        'Automated reminders are one of the most effective tools for reducing no-shows. Echo Booking sends configurable email and SMS notifications at intervals you define — commonly 24 hours and 1 hour before the appointment. Each reminder includes the appointment details, location or meeting link, and a one-click reschedule or cancel option.',
        'Reminder templates use merge fields like {{client_name}}, {{service_name}}, {{date}}, {{time}}, and {{location}} so messages feel personal. Create different templates per service if the information clients need varies — for example, a medical appointment reminder might include preparation instructions, while a coaching call reminder includes the video link.',
        'Beyond reminders, the notification system sends booking confirmations, reschedule confirmations, cancellation notices, waitlist promotions, and post-appointment follow-ups. Each notification type can be toggled on or off, and you can customize the sender name, reply-to address, and SMS number to maintain brand consistency.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Smart Slot Optimization', desc: 'AI analyzes your booking patterns to suggest optimal scheduling windows that minimize dead gaps between appointments. The engine considers service durations, buffer times, staff transitions, and historical demand curves to pack your calendar efficiently without overbooking.' },
    { capability: 'No-Show Prediction', desc: 'Machine learning model scores each upcoming booking\'s no-show risk based on client history, booking lead time, day of week, weather patterns, and reminder engagement (opened vs. ignored). High-risk bookings receive additional reminders and can be flagged for staff follow-up or overbooking allowance.' },
    { capability: 'Demand Forecasting', desc: 'Predictive model analyzes seasonal trends, day-of-week patterns, marketing campaign timing, and historical booking volumes to forecast demand 2-8 weeks out. Alerts when projected demand exceeds available capacity so you can add staff hours or open new time slots proactively.' },
    { capability: 'Intelligent Waitlist Ranking', desc: 'When a cancellation opens a slot, the AI ranks waitlisted clients by likelihood to book (based on urgency signals, historical conversion, and requested time proximity) rather than simple first-come-first-served ordering, maximizing the chance the slot gets filled.' },
    { capability: 'Auto-Scheduling Suggestions', desc: 'For recurring clients, AI suggests optimal appointment times based on their historical preferences, commute patterns, and availability overlaps with their preferred staff member. Reduces back-and-forth by proposing times the client is most likely to accept.' },
  ],

  troubleshooting: [
    { issue: 'Calendar sync shows incorrect availability', solution: 'Verify that the correct calendar account is connected in Settings > Integrations and that the right calendars are selected for sync (personal, work, etc.). If using Google Calendar, check that Echo Booking has read/write permissions — re-authorize if the token expired. Allow up to 5 minutes for sync propagation after calendar changes. If events on a secondary calendar are not blocking availability, ensure that calendar is checked in the sync settings.' },
    { issue: 'Client not receiving confirmation or reminder emails', solution: 'Check the client\'s email address for typos on the booking record. Verify that the notification type is enabled in Settings > Notifications. Ask the client to check spam/junk folders and whitelist your sender address. For SMS reminders, confirm the phone number includes the country code. Review the notification log on the booking detail page to see delivery status and any bounce/failure reasons.' },
    { issue: 'Payment fails during booking', solution: 'Ensure your Stripe account is fully activated (not in test mode) and the connected account has no holds or restrictions. Check that the service has the correct payment configuration (deposit vs. full). If clients report card declines, the issue is typically on the card issuer side — Stripe\'s dashboard shows the specific decline reason. For 3D Secure failures, verify that your Stripe integration supports SCA (Strong Customer Authentication).' },
    { issue: 'Bookings appear on the wrong timezone', solution: 'Check your business timezone in Settings > General — this is the master timezone for all availability windows. If individual staff members serve clients in different timezones, ensure each staff profile has the correct timezone set. Client-facing booking pages display times in the client\'s detected browser timezone but store all data in UTC internally.' },
  ],

  faq: [
    { q: 'How many bookings can I handle per month?', a: 'Free plans support up to 50 bookings per month with one staff member. Pro plans handle unlimited bookings with up to 25 staff members and multi-location support. Enterprise plans add custom SLAs, dedicated support, and advanced API rate limits. All plans include calendar sync, reminders, and the booking page.' },
    { q: 'Can clients reschedule or cancel their own bookings?', a: 'Yes. Every confirmation email and reminder includes a link to a self-service page where clients can reschedule to any available slot or cancel. Rescheduling and cancellation are governed by the policy you set per service — for example, free cancellation up to 24 hours before, or no changes within 2 hours of the appointment.' },
    { q: 'Does Echo Booking support virtual appointments?', a: 'Yes. When creating a service, set the location type to "Virtual" and configure your meeting platform — Zoom, Google Meet, or Microsoft Teams. Echo Booking automatically generates a unique meeting link for each booking and includes it in the confirmation and reminder notifications. No manual link creation required.' },
    { q: 'Can I embed the booking widget on my existing website?', a: 'Absolutely. Go to Settings > Embed and copy the JavaScript snippet. Paste it into any page on your website and the booking widget renders inline. You can configure it to show specific services, pre-select a staff member, or match your site\'s color scheme. The widget is responsive and works on all devices.' },
    { q: 'How does the waitlist work?', a: 'When a time slot is fully booked, clients see a "Join Waitlist" button instead. If a cancellation opens the slot, the system notifies waitlisted clients in order of AI-ranked priority. Each client gets a time-limited claim window (default 30 minutes) before the slot is offered to the next person. You can configure the claim window duration and maximum waitlist size per service.' },
  ],
}

export default function EchoBookingDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/booking' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}

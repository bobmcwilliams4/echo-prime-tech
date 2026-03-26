'use client'

import ProductDoc from '@/components/ProductDoc'

export default function ShepherdDocPage() {
  return (
    <ProductDoc
      name="Echo Shepherd AI"
      tagline="AI-powered church management — sermons, congregation CRM, tithing, worship, volunteers, events, and 9 denominations."
      accent="#8b5cf6"
      productUrl="/shepherd"
      workerUrl="https://echo-shepherd-ai.bmcii1976.workers.dev"
      version="2.0.0"
      overview={[
        'Echo Shepherd AI is the most comprehensive AI-powered church management platform available. Built to serve 9 denominations (Baptist, Methodist, Catholic, Non-Denominational, Pentecostal, Presbyterian, Lutheran, Episcopal, AME), it adapts its features, language, and worship structure to each tradition.',
        'The platform manages the entire church lifecycle: sermon planning with AI-assisted scripture research, congregation CRM with family units and spiritual milestones, online and in-person tithing with financial reporting, worship service planning with song databases, volunteer coordination with skill matching, and event management with registration.',
        'Shepherd AI understands theology. The THEO engine integration provides sermon research backed by 5,486 intelligence engines covering biblical studies, church history, pastoral counseling, and denominational theology. It does not just manage — it ministers.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Register Your Church', desc: 'Sign up and select your denomination. The system pre-configures worship structure, terminology, and features for your tradition.' },
        { step: 2, title: 'Import Congregation', desc: 'Import members via CSV or add manually. Each member record includes family unit, contact info, membership date, and spiritual milestones.' },
        { step: 3, title: 'Set Up Giving', desc: 'Configure tithing options: online giving (card/bank), text-to-give, kiosk mode. Set up fund categories (General, Building, Missions, etc).' },
        { step: 4, title: 'Plan Your First Service', desc: 'Create a worship service with order of service, songs, scripture readings, and sermon notes. AI suggests songs that match your sermon theme.' },
        { step: 5, title: 'Launch Volunteer Teams', desc: 'Create ministry teams (Worship, Children, Greeters, Tech), assign volunteers, and set up rotation schedules.' },
        { step: 6, title: 'Enable Small Groups', desc: 'Create small group studies with curriculum, meeting schedules, and leader assignments. Members self-register through the church portal.' },
      ]}
      features={[
        { title: 'Sermon Planner', desc: 'AI-assisted sermon preparation with scripture research, cross-reference suggestions, illustration finder, and sermon series planning. THEO engine provides theological depth.' },
        { title: 'Congregation CRM', desc: 'Complete member management with family units, contact info, membership status, spiritual milestones (baptism, confirmation, marriage), visitation tracking, and custom fields.' },
        { title: 'Online Giving', desc: 'Secure online tithing via card, bank transfer, or text-to-give. Recurring donations, pledge tracking, tax-deductible receipts, and fund-specific giving.' },
        { title: 'Worship Planning', desc: 'Service builder with order of worship, song database, scripture readings, media cues, and team assignments. Denomination-specific liturgy templates.' },
        { title: 'Volunteer Management', desc: 'Ministry team creation, volunteer scheduling with rotation, skill matching, background check tracking, availability management, and service hour logging.' },
        { title: 'Event Management', desc: 'Church events with online registration, room booking, resource scheduling, volunteer assignments, and attendance tracking. Supports conferences, VBS, retreats.' },
        { title: 'Small Groups', desc: 'Study group creation with curriculum management, meeting schedules, leader tools, member registration, prayer requests, and group communication.' },
        { title: 'Attendance Tracking', desc: 'Check-in system for services, classes, and events. Child check-in with security tags. Historical attendance trends and growth analytics.' },
        { title: 'Communication Hub', desc: 'Email and SMS broadcasts to the entire congregation or filtered groups. Prayer request sharing, announcements, and automated follow-ups for visitors.' },
        { title: 'Financial Reports', desc: 'Giving statements, fund reports, budget vs actual, giving trends, and year-end tax receipts. Export to QuickBooks or Church Windows.' },
        { title: 'Children\'s Ministry', desc: 'Dedicated child check-in, classroom management, curriculum tracking, allergy/medical alerts, and parent notification system.' },
        { title: '9 Denomination Configs', desc: 'Pre-built configurations for Baptist, Methodist, Catholic, Non-Denominational, Pentecostal, Presbyterian, Lutheran, Episcopal, and AME traditions.' },
      ]}
      apiEndpoints={[
        { method: 'GET', path: '/api/members', desc: 'List congregation members with filtering by status, group, and family.', auth: true },
        { method: 'POST', path: '/api/members', desc: 'Add a new member with family unit, contact info, and milestones.', auth: true },
        { method: 'GET', path: '/api/giving', desc: 'Get giving history with totals by fund, period, and member.', auth: true },
        { method: 'POST', path: '/api/giving/donate', desc: 'Process a donation with amount, fund, method, and recurrence.', auth: true },
        { method: 'GET', path: '/api/services', desc: 'List worship services with attendance and order of worship.', auth: true },
        { method: 'POST', path: '/api/services', desc: 'Create a worship service with songs, readings, and team assignments.', auth: true },
        { method: 'GET', path: '/api/groups', desc: 'List small groups with members, curriculum, and meeting schedule.', auth: true },
        { method: 'POST', path: '/api/events', desc: 'Create a church event with registration, rooms, and volunteers.', auth: true },
        { method: 'GET', path: '/api/volunteers', desc: 'List volunteers with team assignments and schedule.', auth: true },
        { method: 'POST', path: '/api/sermons/research', desc: 'AI sermon research — scripture cross-references, illustrations, and theological context.', auth: true },
      ]}
      userGuide={[
        { id: 'sermons', title: 'Sermon Planning & Research', content: [
          'The Sermon Planner is accessed from the main dashboard. Start by entering your passage or topic. The THEO engine searches across biblical studies engines to provide cross-references, historical context, and theological commentary.',
          'AI suggests sermon outlines, illustrations from real-life scenarios, and discussion questions for small groups. You can save sermon notes, attach media (slides, videos), and link to the worship service where it will be preached.',
          'Sermon Series: Plan multi-week series with connected themes. The AI helps maintain narrative coherence across weeks and suggests complementary songs and readings for each installment.',
        ]},
        { id: 'congregation', title: 'Managing Your Congregation', content: [
          'Each member record includes: full name, family unit, contact info (email, phone, address), membership date, membership status (member, regular attender, visitor, inactive), spiritual milestones, and custom fields.',
          'Family units link related members. When you add a family, child records are automatically associated. Communication to families can be directed to the primary contact or all adult members.',
          'Visitor follow-up: When a new visitor is added, the system creates an automated follow-up workflow — welcome email, pastor notification, follow-up call assignment, and second-visit tracking.',
        ]},
        { id: 'giving', title: 'Tithing & Financial Management', content: [
          'Online giving is configured in Settings > Giving. Connect your payment processor (Stripe recommended for lowest fees). Create fund categories that match your church\'s budget structure.',
          'Members can set up recurring donations (weekly, bi-weekly, monthly) to any fund. The system tracks pledges vs actual giving and sends gentle reminders for unfulfilled pledges.',
          'Year-end tax receipts are auto-generated for all donors. Receipts include all tax-deductible contributions with date, amount, fund, and your church\'s tax ID. Send via email or print for mailing.',
        ]},
        { id: 'worship', title: 'Worship Service Planning', content: [
          'Build each service by adding elements: Call to Worship, Songs, Prayer, Scripture Reading, Sermon, Offering, Benediction. Drag and drop to reorder.',
          'The song database includes thousands of hymns and contemporary worship songs with CCLI licensing info. Filter by theme, key, tempo, and denomination preference. AI suggests songs that complement your sermon topic.',
          'Assign team roles: worship leader, musicians, sound tech, projection, greeters, ushers. Send automated reminders 48 hours before each service.',
        ]},
        { id: 'volunteers', title: 'Volunteer Coordination', content: [
          'Create ministry teams for each area of service. Each team has a leader, members, and a rotation schedule. Volunteers set their availability and the system auto-schedules based on preferences.',
          'Skill matching helps place volunteers where they\'re most effective. A member with musical training gets suggested for worship team. Someone with teaching experience gets flagged for children\'s ministry.',
          'Service hours are logged automatically for check-in/check-out. Volunteers can view their hours and leaders can generate reports for appreciation events.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'THEO Engine Integration', desc: 'Access 5,486 intelligence engines for biblical research, theological commentary, sermon illustrations, and pastoral counseling resources.' },
        { capability: 'Sermon Research AI', desc: 'Cross-reference scriptures, find parallel passages, generate sermon outlines, and suggest illustrations. Adapts to denominational hermeneutics.' },
        { capability: 'Visitor Prediction', desc: 'Analyzes attendance patterns to predict visitor likelihood by season, event, and outreach activity. Helps plan follow-up resources.' },
        { capability: 'Giving Pattern Analysis', desc: 'Identifies giving trends, predicts budget shortfalls, and suggests stewardship campaign timing based on historical patterns.' },
        { capability: 'Volunteer Matching', desc: 'Matches volunteers to ministry roles based on skills, availability, interests, and personality profiles. Reduces leader burden in recruitment.' },
        { capability: 'Growth Analytics', desc: 'Tracks membership growth, attendance trends, engagement levels, and retention rates. Identifies what\'s working and where attention is needed.' },
      ]}
      troubleshooting={[
        { issue: 'Online giving not processing', solution: 'Verify your Stripe integration is active in Settings > Giving > Payment Processor. Test with a small donation. Check that the giving page URL is correct in your church website link.' },
        { issue: 'Member import failing', solution: 'Ensure your CSV matches the template format (download from Settings > Import). Required fields: first_name, last_name, email. Date formats must be MM/DD/YYYY.' },
        { issue: 'Worship songs not showing', solution: 'The song database loads from our cloud library. Check your internet connection. If searching by CCLI number, ensure the number is correct. Custom songs must be added via the Song Manager.' },
        { issue: 'Denomination-specific features missing', solution: 'Verify your denomination is correctly set in Settings > Church Profile. Some features (liturgy templates, sacrament tracking) only appear for specific denominations.' },
      ]}
      faq={[
        { q: 'Which denominations are supported?', a: 'Baptist, Methodist, Catholic, Non-Denominational, Pentecostal, Presbyterian, Lutheran, Episcopal, and AME. Each gets customized terminology, worship structure, and features.' },
        { q: 'Is the AI theologically sound?', a: 'Shepherd AI is backed by the THEO engine with thousands of doctrines sourced from respected theological works. It provides research resources, not doctrine — your pastor makes the theological decisions.' },
        { q: 'Can we accept text-to-give donations?', a: 'Yes. Configure a dedicated giving number in Settings > Giving > Text-to-Give. Members text an amount to the number and complete payment via a mobile-optimized form.' },
        { q: 'Is member data secure?', a: 'All data is encrypted at rest and in transit. Access is role-based — only authorized staff see sensitive information. We comply with church data protection best practices.' },
        { q: 'Can multiple campuses use one account?', a: 'Yes. Enterprise plan supports multi-campus with shared member database, campus-specific services and events, and consolidated or per-campus financial reporting.' },
        { q: 'What about CCLI licensing?', a: 'We display CCLI numbers for songs in our database. Your church must maintain its own CCLI license for projection/streaming rights. We help track which songs you use for CCLI reporting.' },
      ]}
    />
  )
}

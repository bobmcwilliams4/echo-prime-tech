'use client'

import ProductDoc from '@/components/ProductDoc'

export default function HomeAiDocPage() {
  return (
    <ProductDoc
      name="Echo Home AI"
      tagline="AI-powered smart home hub — automation, energy management, family scheduling, bills, tutoring, and more."
      accent="#f59e0b"
      productUrl="/home-ai"
      workerUrl="https://echo-home-ai.bmcii1976.workers.dev"
      version="3.0.0"
      overview={[
        'Echo Home AI is your complete smart home command center. It combines home automation, energy management, family scheduling, bill tracking, AI tutoring, pet care, fitness tracking, meal planning, and garden management into one unified platform.',
        'The AI learns your household routines — when you wake up, when you leave, when you return — and proactively adjusts lighting, temperature, security, and reminders. Energy optimization reduces utility bills by analyzing usage patterns and suggesting schedule changes.',
        'Family features include shared calendars, chore assignments with gamification, homework help via AI tutoring (math, science, language arts), grocery list generation from meal plans, and pet care reminders with vet appointment tracking.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Create Your Home', desc: 'Sign up and configure your home profile — address, rooms, family members, and connected devices.' },
        { step: 2, title: 'Connect Devices', desc: 'Link smart home devices via supported platforms (Tuya, SmartThings, Alexa, Google Home). The system auto-discovers compatible devices.' },
        { step: 3, title: 'Set Up Routines', desc: 'Configure daily routines — morning wake-up, departure, arrival, bedtime. AI suggests optimal settings based on your schedule.' },
        { step: 4, title: 'Add Family Members', desc: 'Invite family members with role-based access. Kids get limited controls. Parents get full management.' },
        { step: 5, title: 'Enable Modules', desc: 'Activate the modules you need: Energy, Bills, Tutoring, Pet Care, Fitness, Meals, Garden. Each can be configured independently.' },
      ]}
      features={[
        { title: 'Smart Automation', desc: 'Create if-then rules for devices: lights on at sunset, thermostat adjusts when you leave, security arms at bedtime. AI suggests new automations.' },
        { title: 'Energy Management', desc: 'Real-time energy usage monitoring with AI optimization suggestions. Track utility costs, set budgets, and get alerts for unusual consumption.' },
        { title: 'Family Calendar', desc: 'Shared calendar with school events, activities, appointments, and chores. Color-coded per family member with conflict detection.' },
        { title: 'Bill Tracker', desc: 'Track all household bills with due date reminders, auto-pay status, spending trends, and budget vs actual comparisons.' },
        { title: 'AI Tutoring', desc: 'Homework help in math, science, language arts, and history. Step-by-step explanations adapted to the child\'s grade level and learning style.' },
        { title: 'Pet Care', desc: 'Feeding schedules, medication reminders, vet appointments, weight tracking, and activity monitoring for dogs, cats, and other pets.' },
        { title: 'Fitness Tracking', desc: 'Family fitness goals, step counting, workout logging, water intake reminders, and weekly activity reports per family member.' },
        { title: 'Meal Planning', desc: 'AI-generated weekly meal plans based on dietary preferences, allergies, and budget. Auto-generates grocery lists with store aisle mapping.' },
        { title: 'Garden Manager', desc: 'Plant database with watering schedules, frost alerts, harvest timing, and soil condition tracking. AI suggests plants for your climate zone.' },
        { title: 'Security Monitoring', desc: 'Camera feeds, motion alerts, door/window sensors, and alarm management. AI distinguishes between family, guests, and unknown visitors.' },
        { title: 'Voice Control', desc: 'Control everything via voice commands through Echo Speak integration. Natural language understanding for complex requests.' },
        { title: 'Usage Analytics', desc: 'Comprehensive dashboard showing energy usage, costs, device usage patterns, and household activity trends over time.' },
      ]}
      apiEndpoints={[
        { method: 'GET', path: '/api/home', desc: 'Get home profile, rooms, and connected devices summary.', auth: true },
        { method: 'GET', path: '/api/devices', desc: 'List all connected devices with status, room, and capabilities.', auth: true },
        { method: 'POST', path: '/api/devices/:id/control', desc: 'Control a device (on/off, brightness, temperature, etc).', auth: true },
        { method: 'GET', path: '/api/energy', desc: 'Get energy usage data with breakdown by device and room.', auth: true },
        { method: 'GET', path: '/api/bills', desc: 'List all tracked bills with status and upcoming due dates.', auth: true },
        { method: 'POST', path: '/api/bills', desc: 'Add a new bill to track with amount, due date, and category.', auth: true },
        { method: 'GET', path: '/api/calendar', desc: 'Get family calendar events for a date range.', auth: true },
        { method: 'POST', path: '/api/tutor/ask', desc: 'Ask the AI tutor a homework question with subject and grade level.', auth: true },
        { method: 'GET', path: '/api/meals/plan', desc: 'Generate a weekly meal plan based on preferences and budget.', auth: true },
        { method: 'GET', path: '/api/pets', desc: 'Get pet profiles with care schedules and vet history.', auth: true },
      ]}
      userGuide={[
        { id: 'automation', title: 'Setting Up Home Automation', content: [
          'Navigate to the Automation tab to create rules. Each rule has a trigger (time, device state, location, sensor) and one or more actions (turn on/off device, adjust temperature, send notification).',
          'The AI learns your habits after about a week of usage and suggests new automations. For example, if you always turn off lights and lower the thermostat at 11pm, it will suggest an automated bedtime routine.',
          'Routines are pre-built automation sequences. Morning routine might include: gradually brighten bedroom lights, adjust thermostat to 72F, start coffee maker, and read today\'s weather and calendar.',
        ]},
        { id: 'energy', title: 'Energy Management', content: [
          'The Energy dashboard shows real-time power consumption broken down by device and room. Set a monthly budget and receive alerts when you\'re trending over.',
          'AI optimization analyzes your usage patterns and suggests changes: shifting laundry to off-peak hours, adjusting HVAC schedules, or identifying devices that consume power while idle.',
          'Connect your utility account for accurate billing data. The system compares your usage to similar homes in your area and shows where you can save.',
        ]},
        { id: 'family', title: 'Family Features', content: [
          'Each family member gets their own profile with role-based access. Parents have full control. Teens get limited device control. Kids can view calendars and use the tutor.',
          'The chore system assigns tasks with due dates, point values, and streaks. Kids earn points for completing chores which can be redeemed for screen time, allowance, or custom rewards.',
          'The shared grocery list syncs in real-time. Anyone can add items. The meal planner auto-adds ingredients. Check off items while shopping with store aisle suggestions.',
        ]},
        { id: 'tutoring', title: 'AI Tutoring System', content: [
          'Select a subject (Math, Science, Language Arts, History, or Spanish) and grade level (K-12). Ask questions in natural language or take a photo of a homework problem.',
          'The AI provides step-by-step explanations at the appropriate level. It doesn\'t just give answers — it walks through the reasoning so students learn the underlying concepts.',
          'Progress tracking shows topics covered, accuracy rates, and areas that need more practice. Parents receive weekly reports on tutoring activity and progress.',
        ]},
        { id: 'pets', title: 'Pet Care Management', content: [
          'Create a profile for each pet with breed, age, weight, diet, and medical history. Set up feeding schedules, medication reminders, and grooming appointments.',
          'The vet tracker logs all veterinary visits, vaccinations, and prescriptions. Receive reminders when annual checkups or vaccinations are due.',
          'Activity tracking (via connected collar or manual logging) shows daily exercise levels. The AI suggests exercise goals based on breed and age.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Routine Learning', desc: 'Analyzes household patterns over time and automatically creates and adjusts automation routines. Adapts to seasonal changes and schedule shifts.' },
        { capability: 'Energy Optimization', desc: 'Identifies energy waste, suggests schedule changes, and predicts monthly costs. Learns which optimizations you accept and refines suggestions.' },
        { capability: 'Adaptive Tutoring', desc: 'Adjusts explanation complexity to match student understanding. Identifies knowledge gaps and creates targeted practice exercises.' },
        { capability: 'Meal Intelligence', desc: 'Generates diverse meal plans considering nutrition, preferences, allergies, budget, and what\'s already in your pantry. Minimizes food waste.' },
        { capability: 'Predictive Maintenance', desc: 'Monitors device health patterns and predicts failures. Alerts you to replace filters, service HVAC, or check devices showing unusual behavior.' },
        { capability: 'Security Intelligence', desc: 'Distinguishes between family members, expected guests, delivery drivers, and unknown visitors. Learns normal activity patterns and flags anomalies.' },
      ]}
      troubleshooting={[
        { issue: 'Device not connecting', solution: 'Ensure the device is on the same WiFi network. Check that the device platform (Tuya, SmartThings) is linked in Settings > Integrations. Try removing and re-adding the device.' },
        { issue: 'Automation not triggering', solution: 'Check the trigger conditions — time, device state, and location must all match. Verify the target device is online. Check the automation log for error messages.' },
        { issue: 'Energy data not updating', solution: 'Smart plugs and energy monitors report data every 5-15 minutes. If no data appears after 30 minutes, check device connectivity. Some devices require firmware updates for energy reporting.' },
        { issue: 'Tutor giving wrong grade level', solution: 'Update the student profile grade level in Settings > Family Members. The tutor adapts content to the selected grade. You can also specify grade level per question.' },
      ]}
      faq={[
        { q: 'What smart home platforms are supported?', a: 'Tuya/Smart Life, SmartThings, Google Home, Amazon Alexa, Apple HomeKit (via bridge), Zigbee, Z-Wave, and WiFi devices. Most major brands are compatible.' },
        { q: 'Can multiple homes be managed?', a: 'Yes. Professional and Enterprise plans support multiple homes (vacation home, rental properties). Each home has its own devices, automations, and family members.' },
        { q: 'Is the AI tutoring safe for kids?', a: 'Yes. Content is filtered and age-appropriate. Tutoring is limited to academic subjects. No personal data collection from minors beyond what parents provide in profiles.' },
        { q: 'How accurate is the energy monitoring?', a: 'Energy monitoring is as accurate as your connected smart plugs and energy monitors. Whole-home monitoring requires a compatible energy meter (Sense, Emporia, or utility smart meter).' },
        { q: 'Can I use Home AI without smart devices?', a: 'Yes. Many features work without smart devices: bill tracking, family calendar, meal planning, tutoring, pet care, fitness, and garden management. Smart devices add automation capabilities.' },
      ]}
    />
  )
}

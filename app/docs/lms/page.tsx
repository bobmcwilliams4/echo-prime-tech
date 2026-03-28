'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo LMS',
  tagline: 'AI-powered learning management system — courses, quizzes, certifications, and threaded discussions at scale.',
  accent: '#d97706',
  productUrl: '/lms',
  workerUrl: 'https://echo-lms.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo LMS is a full-featured learning management system with 60+ API endpoints and 14 D1 tables. Build structured courses with ordered modules and lessons, assess learners with auto-scoring quizzes, track individual progress through enrollment records, and issue professional certificates upon completion — all on Cloudflare\'s global edge infrastructure with zero cold-start latency.',
    'The course system uses a three-tier hierarchy: Courses contain Modules (sections), and Modules contain Lessons (individual content units). Ordering is enforced at every tier — modules and lessons have explicit integer position values so instructors can rearrange content without gaps or conflicts. Courses are accessed by URL slug, and each course has a configurable enrollment model (open, invite-only, or paid via Stripe).',
    'Quiz and assessment infrastructure supports multiple question types, configurable maximum attempts, auto-grading against answer keys, and real-time feedback display. Upon course completion, certificates are auto-generated with a unique identifier in the format CERT-{base36}-{uuid} — making each certificate cryptographically unique and publicly verifiable. AI capabilities (model ID EDU-01 via Engine Runtime) generate course outlines, lesson content drafts, and quiz question sets from a brief topic description.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create a Course', desc: 'Navigate to /lms and click "New Course." Enter a title, slug (used in the public course URL), description, and optional cover image. Set the enrollment type: Open (anyone can self-enroll), Invite (enroll by email), or Paid (requires Stripe payment). Courses start in Draft status and are not publicly visible until published.' },
    { step: 2, title: 'Build Course Structure', desc: 'Add modules (sections) to organize your course content. Give each module a title and position number. Within each module, add lessons with a title, content type (video, article, PDF, or interactive), and body content. Drag to reorder modules and lessons — position values update automatically to stay gapless.' },
    { step: 3, title: 'Add Quizzes', desc: 'Attach quizzes to any lesson or module for formative assessment. Add questions with type (multiple_choice, true_false, short_answer, or matching), the correct answer key, and point values. Set max_attempts and passing score threshold. Quizzes auto-grade on submission and display immediate feedback per question when enabled.' },
    { step: 4, title: 'Configure Completion & Certificates', desc: 'In Course Settings > Completion, set completion criteria: all lessons viewed, all quizzes passed, or a minimum quiz score average. Enable certificate generation — provide the certificate template name and any custom display fields (instructor name, course duration, completion date). Certificates are auto-generated and emailed upon completion.' },
    { step: 5, title: 'Enroll Students & Launch', desc: 'Publish the course to make it discoverable. For open enrollment, share the course URL. For invite enrollment, use Enrollments > Invite to send enrollment emails. Monitor student progress from the Enrollments dashboard showing per-student lesson completion, quiz scores, and current status.' },
  ],

  features: [
    { title: 'Course Management with Slugs', desc: 'Courses are accessed at echo-ept.com/lms/COURSE-SLUG. Each course has a public title, description, cover image, instructor attribution, estimated duration, category, and tags. Course slugs must be unique within the LMS instance and support alphanumeric characters and hyphens up to 80 characters.' },
    { title: 'Module & Lesson Ordering', desc: 'Modules and lessons use explicit integer position values enforced at the database level. Reordering via the drag-and-drop editor fires a batch position update that renumbers all siblings in a single transaction — preventing gap and collision issues. Position values are 1-indexed and always gapless after any reorder operation.' },
    { title: 'Quiz Auto-Scoring', desc: 'Quizzes are graded automatically on submission. Multiple choice and true/false questions are graded by exact match against the stored answer key. Short answer questions use configurable exact-match or fuzzy-match (Levenshtein distance ≤ 2) grading. Matching questions are graded pair by pair. A total score (points earned / points possible) and pass/fail determination are computed in the same transaction as the response save.' },
    { title: 'Max Attempts Configuration', desc: 'Each quiz has a configurable max_attempts value. The LMS tracks attempt counts per student per quiz and enforces the limit — students see their remaining attempts before starting. On reaching the limit, the quiz locks and the student\'s highest-scoring attempt is used for progress calculations. Instructors can manually reset attempts from the enrollment detail view.' },
    { title: 'Student Enrollment & Progress', desc: 'The enrollment record is the central object linking a student to a course. It stores enrollment date, current status (enrolled, in_progress, completed, dropped), lesson completion events with timestamps, quiz attempt history, current quiz scores, and overall course progress percentage. Progress is recomputed on every lesson completion or quiz submission event.' },
    { title: 'Certificate Auto-Generation', desc: 'When a student meets completion criteria, a certificate is generated with ID format CERT-{base36 timestamp}-{uuid4}. The certificate record stores the student ID, course ID, completion date, issue date, and certificate ID. Certificates are rendered as styled PDFs using a configurable HTML template and delivered to the student\'s email. Each certificate is publicly verifiable at echo-ept.com/verify/CERT-ID.' },
    { title: 'Reviews & Ratings', desc: 'Students can submit a 1-5 star review with a written comment after completing at least 25% of a course. The course record maintains a rolling avg_rating and review_count aggregate that updates on every new review. Reviews are displayed on the public course page, sortable by date and rating. Instructors can respond to reviews from the course management panel.' },
    { title: 'Threaded Discussions', desc: 'Each lesson and module supports threaded discussion boards where students and instructors can post questions, answers, and notes. Threads support markdown formatting, file attachments, and @mention notifications. Instructors can pin important posts, mark responses as the official answer, and lock threads. Discussion activity is factored into engagement analytics.' },
    { title: 'AI Outline Generation (EDU-01)', desc: 'The EDU-01 engine via Engine Runtime generates complete course outlines from a title and target audience description. The outline includes suggested module titles, lesson titles within each module, estimated time per lesson, and recommended content types. Generated outlines are imported directly into the course builder as a draft structure for editing.' },
    { title: 'AI Quiz Generation (EDU-01)', desc: 'Provide a topic and difficulty level — EDU-01 generates a complete quiz with questions, answer choices, correct answers, and distractors designed to test genuine understanding rather than pattern matching. Questions are tagged by Bloom\'s taxonomy level (recall, comprehension, application, analysis) for pedagogical quality control.' },
    { title: 'SCORM Import', desc: 'Import existing SCORM 1.2 and 2004 packages to migrate content from other LMS platforms. SCORM modules are extracted, lessons are mapped to the LMS lesson schema, and completion events are tracked through the standard SCORM API calls. Imported SCORM content renders in an isolated iframe with full API compatibility.' },
    { title: 'Progress Webhooks', desc: 'Subscribe to enrollment events via webhooks: enrollment.created, lesson.completed, quiz.passed, quiz.failed, course.completed, certificate.issued. Use progress webhooks to trigger CRM updates, HR system notifications, compliance tracking records, or gamification point awards in external systems.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/courses', desc: 'List all published courses with title, slug, enrollment count, avg_rating, review_count, and completion rate. Supports filtering by category, tags, and enrollment type.', auth: false },
    { method: 'POST', path: '/api/courses', desc: 'Create a new course with title, slug, description, instructor_id, enrollment_type, and settings. Returns created course in draft status.', auth: true },
    { method: 'GET', path: '/api/courses/:slug', desc: 'Public course detail endpoint. Returns full course structure (modules and lessons without quiz answer keys), instructor info, ratings summary, and enrollment instructions.', auth: false },
    { method: 'POST', path: '/api/courses/:id/modules', desc: 'Add a module to a course. Accepts title and optional position (appended to end if omitted). Returns the new module with assigned position.', auth: true },
    { method: 'POST', path: '/api/modules/:id/lessons', desc: 'Add a lesson to a module with title, content_type, body (HTML, markdown, or video URL), and optional position.', auth: true },
    { method: 'POST', path: '/api/courses/:id/enroll', desc: 'Enroll a student in a course. Creates an enrollment record and sets status to "enrolled." Fires enrollment.created webhook. Returns enrollment ID.', auth: true },
    { method: 'GET', path: '/api/enrollments/:id/progress', desc: 'Get full progress report for an enrollment: lesson completion status, quiz scores per attempt, overall progress percentage, and completion timestamp if applicable.', auth: true },
    { method: 'POST', path: '/api/lessons/:id/complete', desc: 'Mark a lesson as completed for the authenticated student. Updates enrollment progress, checks if course completion criteria are now met, and triggers certificate generation if completion is detected.', auth: true },
    { method: 'POST', path: '/api/quizzes/:id/submit', desc: 'Submit a quiz attempt with answers object keyed by question_id. Auto-grades, updates attempt count, returns score, pass/fail result, and per-question feedback if enabled.', auth: true },
    { method: 'GET', path: '/api/certificates/:cert_id/verify', desc: 'Public certificate verification endpoint. Returns certificate details (student name, course, completion date) for a valid certificate ID, or 404 for invalid IDs.', auth: false },
    { method: 'POST', path: '/api/ai/outline', desc: 'Generate a course outline from title and audience description using EDU-01. Returns structured JSON with module titles and lesson titles array ready for import.', auth: true },
    { method: 'POST', path: '/api/ai/quiz', desc: 'Generate quiz questions from a topic and difficulty level using EDU-01. Returns a complete questions array with type, body, answer choices, correct_answer, and Bloom\'s taxonomy tag per question.', auth: true },
  ],

  userGuide: [
    {
      id: 'building-courses',
      title: 'Building Courses',
      content: [
        'Start course creation with the AI Outline Generator — enter your course title and who it\'s for, and EDU-01 returns a suggested module and lesson structure in under 10 seconds. Import the outline to pre-populate the course builder with modules and lessons in draft state, then fill in the actual content for each lesson.',
        'Lesson content supports four types: Article (rich HTML text editor with embeds), Video (YouTube/Vimeo URL or direct upload), PDF (file upload rendered in-browser), and Interactive (H5P-compatible interactive content). Each lesson can have a completion action: auto-complete on view (after a minimum time), require an explicit "Mark Complete" click, or require a passing quiz score.',
        'The course builder shows a real-time preview of the student experience as you build. Use the Visibility toggle to publish individual modules while others remain in draft — useful for releasing course content progressively as you build it. Students see published modules immediately upon publication with no cache invalidation required.',
      ],
    },
    {
      id: 'quizzes-assessments',
      title: 'Quizzes & Assessments',
      content: [
        'Create quizzes from the lesson or module detail view using the Quiz Builder. Add questions one at a time or paste a batch in the AI-compatible format (JSON array). Set the quiz title, instructions, time limit (optional), max attempts, minimum passing score, and whether to show answer feedback immediately or only after all attempts are exhausted.',
        'Multiple choice questions support 2-6 answer options with one correct answer. True/false questions are binary. Short answer questions have a stored correct answer and a matching mode (exact, case-insensitive, or fuzzy). Matching questions present a list of pairs where students drag items to match them — each correctly matched pair earns the configured points.',
        'The quiz attempt history view shows every attempt per student with submission timestamp, time taken, score, and a question-by-question breakdown. Instructors can view all attempts for all students from the Quiz Analytics tab, identifying which questions have the lowest correct answer rates — strong signals for content that needs revision.',
      ],
    },
    {
      id: 'student-progress',
      title: 'Student Enrollment & Progress',
      content: [
        'The Enrollments dashboard shows all enrolled students in a table view with columns for name, enrollment date, progress percentage, quiz score average, last activity date, and current status. Click any student row to open the enrollment detail view showing their complete activity timeline and lesson-by-lesson completion status.',
        'Progress percentage is calculated as (completed lessons + weighted quiz contributions) / total required activities. Quizzes contribute to progress only when passed above the minimum threshold. Lessons with a quiz gate contribute 0% until the quiz is passed. The calculation is recomputed in real time on every activity event.',
        'Use the Bulk Enrollment feature to enroll multiple students from a CSV (email, name) or from an integrated contact list. Bulk enrollment fires individual enrollment.created webhook events per student, which can be used to trigger automated welcome emails or onboarding workflows in connected systems.',
      ],
    },
    {
      id: 'certificates',
      title: 'Certificates & Verification',
      content: [
        'Certificate generation is triggered automatically when an enrollment\'s completion criteria are met. The criteria are checked on every lesson completion and quiz submission event. When met, a certificate record is created with the unique ID (CERT-{base36}-{uuid4}) and a PDF is generated from the configured HTML template.',
        'Certificate templates support these dynamic variables: {{student_name}}, {{course_title}}, {{completion_date}}, {{issue_date}}, {{certificate_id}}, {{instructor_name}}, {{course_hours}}, and {{organization_name}}. Custom variables can be added per course by defining them in Course Settings > Certificate Variables. Templates are written in HTML/CSS with print-optimized styling.',
        'Every certificate is publicly verifiable at echo-ept.com/verify/CERT-ID. The verification page shows the certificate details without requiring a login. Embed the verification URL as a QR code on the printed certificate PDF so anyone can scan and verify authenticity instantly. Certificate IDs are cryptographically unique — there is no feasible way to guess a valid certificate ID.',
      ],
    },
    {
      id: 'discussions',
      title: 'Threaded Discussions',
      content: [
        'Discussion boards are enabled per lesson and module from the content settings panel. When enabled, a Discussions tab appears below the lesson content. Students can start new threads with a title and body (markdown supported), and reply to existing threads in a threaded tree structure up to 3 levels deep.',
        'Instructors have elevated permissions in discussion boards: pin threads to the top, mark a reply as "Official Answer" (displays with a checkmark badge), edit or delete any post, and lock threads to prevent further replies. The "@" mention system notifies specific participants via email when mentioned in a post.',
        'Discussion activity is tracked in engagement analytics — students who participate in discussions have measurably higher completion rates. The Discussion Health metric (posts per enrolled student) is shown on the course analytics dashboard. Courses with below-average discussion health receive a suggestion to add discussion prompts to lessons.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Course Outline Generation (EDU-01)', desc: 'Generates a complete course structure from a title and target audience description. Returns JSON with module titles, lesson titles, estimated duration per lesson, content type recommendations, and learning objective statements aligned to Bloom\'s taxonomy levels. Import directly into the course builder for immediate editing.' },
    { capability: 'Quiz Question Generation (EDU-01)', desc: 'Creates assessment questions from a topic, difficulty level, and question type preferences. Questions include well-crafted distractors (plausible wrong answers), correct answer explanations, and Bloom\'s taxonomy level tags. Batch generation produces 5-30 questions in a single request, ready for review before import.' },
    { capability: 'Lesson Content Drafting', desc: 'Submit a lesson title and learning objectives — EDU-01 drafts a structured article with an intro, body sections covering key concepts, illustrative examples, and a summary. The draft is inserted into the lesson editor as a starting point. Average draft generation time is under 8 seconds for a 600-900 word article.' },
    { capability: 'Knowledge Gap Analysis', desc: 'Analyzes quiz response patterns across the student cohort to identify systematic knowledge gaps — questions that a majority of students answer incorrectly suggest content is unclear or missing from the preceding lesson material. Returns a gap report mapped to specific lessons and concepts with suggested content additions.' },
    { capability: 'Learning Path Recommendations', desc: 'For multi-course LMS deployments, analyzes a student\'s enrollment history, quiz performance, and completion patterns to recommend the optimal next course in their learning path. Recommendations consider prerequisite satisfaction, skill adjacency, and historical completion rates for similar learners.' },
    { capability: 'Engagement Prediction', desc: 'Predicts which enrolled students are at risk of dropping a course based on early engagement signals: lesson completion velocity, days since last activity, quiz attempt patterns, and discussion participation. At-risk students are flagged in the Enrollments dashboard for proactive instructor outreach.' },
  ],

  troubleshooting: [
    { issue: 'Quiz not showing correct scores', solution: 'Verify each question\'s correct_answer field is set in the Quiz Builder — questions without a correct_answer are skipped in scoring. For multiple choice questions, ensure correct_answer matches the option value key exactly (case-sensitive). For short answer questions, check the matching mode setting: exact match fails for minor spelling variations while fuzzy match allows up to 2 character differences. Use the Quiz Preview mode to test scoring before students attempt.' },
    { issue: 'Certificate not generated after course completion', solution: 'Check Course Settings > Completion Criteria to confirm the exact requirements (all lessons, all quizzes passed, or minimum score average). View the student\'s enrollment detail to see which criteria items remain incomplete. Verify the certificate template is configured in Course Settings > Certificates — if no template is selected, certificates are generated in the default format but may not be emailed. Check the certificate template for syntax errors in variable placeholders.' },
    { issue: 'Lesson ordering incorrect after reorder', solution: 'Module and lesson positions update via a batch API call when you drag to reorder. If positions appear wrong after saving, check the browser console for failed API calls (403, 422, or 500 responses). The reorder endpoint requires admin or instructor role. If you\'re on a slow connection and navigated away before the request completed, reload the course builder — the displayed order may not have saved. Manually set positions via Edit Lesson > Position field as a fallback.' },
    { issue: 'Students cannot enroll in a course', solution: 'Verify the course status is "Published" — draft courses are invisible to students. For Invite-only courses, students must receive an enrollment invite via email or be enrolled programmatically via the API. For Paid courses, verify the Stripe product and price IDs are configured in Course Settings > Pricing. Check enrollment limits — if the course has a max_enrollment cap set and it\'s been reached, new enrollments are blocked until a spot opens or the limit is increased.' },
    { issue: 'Discussion posts not appearing', solution: 'Confirm discussions are enabled for the specific lesson or module in its content settings. Students must be enrolled in the course to post in discussions. If posts are submitting but not appearing, check moderation settings — if pre-moderation is enabled, posts require instructor approval before becoming visible. Check the Discussions > Moderation Queue for pending posts.' },
  ],

  faq: [
    { q: 'What is the maximum number of students per course?', a: 'There is no hard technical limit on enrollments per course. Performance is maintained by Cloudflare\'s edge KV caching for course content and paginated API responses for enrollment data. For courses expecting over 10,000 concurrent students, enable the High-Traffic mode in Course Settings which pre-warms the edge cache and increases rate limits on the quiz submission endpoint.' },
    { q: 'Can students access course content offline?', a: 'The Progressive Web App (PWA) manifest is included in the LMS frontend, enabling service worker caching for lesson content. Students on the web app can mark lessons for offline access from the lesson detail menu. Offline access caches the lesson content, embedded images, and PDF attachments. Quiz submissions are queued locally and synced when connectivity is restored.' },
    { q: 'How do certificate IDs work and can they be verified?', a: 'Each certificate ID is in the format CERT-{base36 timestamp}-{uuid4}. The base36 timestamp encodes the issue epoch for quick date extraction, and the UUID4 suffix makes each ID globally unique with 122 bits of randomness. Anyone with a certificate ID can verify it by visiting echo-ept.com/verify/CERT-ID or calling the public /api/certificates/:cert_id/verify endpoint — no login required.' },
    { q: 'Does Echo LMS support SCORM content?', a: 'Yes. SCORM 1.2 and SCORM 2004 (2nd and 3rd edition) packages can be imported via the Course Settings > Import tab. The package is extracted, lessons are created from the SCORM manifest, and completion events are captured through the standard SCORM API. Existing LMS content can be migrated to Echo LMS without rebuilding by importing your SCORM exports.' },
    { q: 'Can I charge for courses?', a: 'Yes. Set enrollment_type to "paid" and configure a Stripe Price ID in Course Settings > Pricing. Students are redirected to a Stripe Checkout session when enrolling. On payment completion, a webhook from Stripe triggers automatic enrollment. Refunds are processed through Stripe and trigger automatic unenrollment unless the instructor manually overrides.' },
    { q: 'How does the AI quiz generation ensure question quality?', a: 'EDU-01 generates questions with four quality signals per question: a difficulty estimate (easy/medium/hard), a Bloom\'s taxonomy level (recall through synthesis), a distractor quality note (why each wrong answer is plausibly attractive to students who partially understand the material), and a coverage tag (which concept from the lesson the question tests). Review the quality signals in the quiz import preview before accepting questions into your quiz bank.' },
  ],
}

export default function EchoLmsDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/lms' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}

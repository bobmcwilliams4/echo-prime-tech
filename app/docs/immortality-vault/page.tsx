'use client'

import ProductDoc from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export default function ImmortalityVaultDocPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: 'Immortality Vault', href: '/docs/immortality-vault' },
      ]} />
      <ProductDoc
      name="Immortality Vault"
      tagline="AI-powered digital legacy and consciousness preservation — ensure your story, voice, and wisdom live forever."
      accent="#8b5cf6"
      productUrl="/immortality-vault"
      workerUrl="https://echo-immortality-vault.bmcii1976.workers.dev"
      version="2.1.0"
      overview={[
        'Immortality Vault is an AI-powered digital legacy platform that captures, preserves, and perpetuates your life story, personality, and wisdom for future generations. Through structured autobiographical interviews, advanced personality extraction, and voice cloning technology, Immortality Vault creates a living digital representation of you that your family can interact with long after you are gone.',
        'The platform goes far beyond simple storage. Using deep conversational AI, it conducts thousands of micro-interviews that map your beliefs, humor, decision-making patterns, speech cadence, and emotional responses into a comprehensive personality model. Combined with voice cloning and video message scheduling, your loved ones can hear your advice on their wedding day, receive birthday messages in your actual voice, or ask questions and get responses that genuinely sound like you.',
        'Immortality Vault also serves as a secure digital archive for photos, videos, documents, and legal instruments like wills and trusts. The family tree builder connects generations with context-rich profiles, while the life timeline creates an interactive chronological narrative of your entire journey. Every piece of data is encrypted at rest and in transit, stored redundantly across multiple regions, and accessible only to authorized family members through granular permission controls.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Create Your Vault', desc: 'Sign up and create your personal vault. Set your master passphrase, add a recovery contact, and configure two-factor authentication. Your vault is encrypted end-to-end from the moment it is created.' },
        { step: 2, title: 'Begin Your Interviews', desc: 'Start the AI-guided autobiographical interview process. The system asks questions about your childhood, career, relationships, beliefs, and life lessons. Sessions are typically 15-30 minutes and can be paused and resumed at any time.' },
        { step: 3, title: 'Clone Your Voice', desc: 'Record 30-60 minutes of natural speech samples. The AI builds a high-fidelity voice model that can speak new text in your exact voice, cadence, and emotional tone. Supports multiple languages.' },
        { step: 4, title: 'Upload Your Archive', desc: 'Add photos, videos, documents, and scanned records to your vault. Tag them with dates, people, and locations. The AI automatically organizes them into your life timeline and suggests connections.' },
        { step: 5, title: 'Set Permissions & Triggers', desc: 'Define who can access what and when. Schedule post-mortem messages, set date-triggered releases (birthdays, anniversaries), and configure your digital will for vault succession.' },
      ]}
      features={[
        { title: 'Autobiographical Interviews', desc: 'AI-guided conversational interviews that map your entire life story across 12 domains: childhood, education, career, relationships, health, beliefs, humor, regrets, wisdom, fears, dreams, and legacy wishes. Over 2,000 adaptive questions.' },
        { title: 'Personality Extraction', desc: 'Advanced NLP models analyze your interview responses, writing samples, and communication patterns to build a multi-dimensional personality profile. Captures humor style, decision-making heuristics, emotional triggers, and speech patterns.' },
        { title: 'Voice Cloning', desc: 'Create a high-fidelity neural voice clone from 30-60 minutes of speech samples. The model captures pitch, cadence, accent, emotional inflection, and breathing patterns. Generate new speech in your voice for any text.' },
        { title: 'Scheduled Video Messages', desc: 'Record or AI-generate video messages triggered by specific dates or events. Birthday messages for grandchildren not yet born, wedding day advice, graduation congratulations — all delivered automatically on the right day.' },
        { title: 'Life Timeline', desc: 'An interactive chronological visualization of your entire life, auto-populated from interviews, photos, and documents. Each event links to related media, people, and stories. Family members can explore your journey decade by decade.' },
        { title: 'Memory Preservation', desc: 'Structured capture of specific memories with full sensory detail — sights, sounds, smells, emotions. AI prompts help you recall details you might otherwise forget. Memories are indexed and searchable by theme, person, or time period.' },
        { title: 'Digital Will & Succession', desc: 'Define exactly what happens to your vault after death. Designate vault administrators, set content release schedules, specify what should remain private forever, and integrate with legal instruments like trusts and estate plans.' },
        { title: 'Family Tree Builder', desc: 'Build a comprehensive multi-generational family tree with rich profiles for each member. Attach stories, photos, and relationship context. The AI suggests connections and identifies gaps in your family history.' },
        { title: 'Photo & Video Archive', desc: 'Secure cloud storage for your entire media library. AI automatically tags faces, locations, and dates. Duplicate detection, quality enhancement for old photos, and automatic organization into albums and timelines.' },
        { title: 'Post-Mortem AI Communication', desc: 'After activation of succession protocols, authorized family members can have conversations with your AI personality model. It responds using your voice clone, drawing on your interview data, beliefs, and communication patterns.' },
        { title: 'Encrypted Vault Storage', desc: 'Military-grade AES-256 encryption for all vault contents. Zero-knowledge architecture means even Echo Prime cannot read your data. Multi-region redundancy ensures your legacy survives any single point of failure.' },
        { title: 'Legacy Sharing', desc: 'Share specific memories, stories, or media with family members through controlled access links. Create curated collections for specific people — a grandchild gets childhood stories, a business partner gets career wisdom.' },
      ]}
      apiEndpoints={[
        { method: 'POST', path: '/api/vault/create', desc: 'Create a new Immortality Vault with encryption keys and initial configuration.', auth: true },
        { method: 'GET', path: '/api/vault/:id/profile', desc: 'Retrieve the vault owner personality profile and interview completion status.', auth: true },
        { method: 'POST', path: '/api/vault/:id/interview', desc: 'Submit interview session responses. AI processes and extracts personality data.', auth: true },
        { method: 'POST', path: '/api/vault/:id/voice/train', desc: 'Upload voice samples and initiate voice clone model training.', auth: true },
        { method: 'POST', path: '/api/vault/:id/voice/synthesize', desc: 'Generate speech audio from text using the trained voice clone model.', auth: true },
        { method: 'POST', path: '/api/vault/:id/media/upload', desc: 'Upload photos, videos, or documents to the vault archive with metadata.', auth: true },
        { method: 'GET', path: '/api/vault/:id/timeline', desc: 'Retrieve the full life timeline with events, media, and linked stories.', auth: true },
        { method: 'POST', path: '/api/vault/:id/message/schedule', desc: 'Schedule a post-mortem or date-triggered message with delivery rules.', auth: true },
      ]}
      userGuide={[
        { id: 'interviews', title: 'Conducting Interviews', content: [
          'The interview process is the heart of Immortality Vault. The AI interviewer guides you through structured conversations across 12 life domains, starting with open-ended questions and progressively drilling into specific memories, beliefs, and patterns. Each session typically lasts 15-30 minutes, and you can pause at any time.',
          'You do not need to complete interviews in order. Feel free to jump to whichever domain feels most natural. The AI tracks which areas have the most depth and gently suggests under-explored topics. After approximately 40 hours of total interview time, the personality model reaches high fidelity, though you can continue adding depth indefinitely.',
          'Interviews can be conducted via text chat, voice recording, or video. Voice and video sessions are automatically transcribed and analyzed. The AI detects emotional nuance, humor, sarcasm, and emphasis to build a richer personality model than text alone can provide.',
        ]},
        { id: 'voice-cloning', title: 'Voice Cloning & Synthesis', content: [
          'To create your voice clone, navigate to the Voice Lab section. You will be asked to read a series of passages designed to capture the full range of your vocal characteristics — pitch, rhythm, emphasis, breathing, and emotional variation. The minimum recording time is 30 minutes, but 60 minutes produces significantly better results.',
          'Recording quality matters. Use a quiet room, a decent microphone (even a modern phone works), and speak naturally. Avoid reading in a monotone — the AI needs to hear your natural expressiveness. After upload, training takes 2-4 hours and you will be notified when your voice model is ready.',
          'Once trained, you can type any text and hear it spoken in your voice. The synthesis engine handles emphasis, pauses, and emotional tone automatically based on the content. You can also manually adjust speaking rate, pitch, and emotional warmth for specific messages.',
        ]},
        { id: 'succession', title: 'Digital Will & Succession Planning', content: [
          'The succession system controls what happens to your vault after your passing. Navigate to Settings > Succession to configure your digital will. You must designate at least one Vault Administrator who will manage access after succession is activated.',
          'Content release rules let you specify exactly when each piece of content becomes available. You can set immediate release, date-triggered release (e.g., a grandchild turning 18), event-triggered release (e.g., a family member getting married), or permanent seal for content that should never be accessed.',
          'Succession activation requires confirmation from two designated contacts and a 30-day waiting period to prevent unauthorized activation. During the waiting period, the vault owner can cancel the succession if the trigger was premature. After activation, the Vault Administrator receives full management capabilities.',
        ]},
        { id: 'media-archive', title: 'Managing Your Media Archive', content: [
          'Upload photos, videos, documents, and audio files through the Archive section. Supported formats include JPEG, PNG, HEIC, MP4, MOV, PDF, and MP3. There is no per-file size limit on Premium plans, and storage scales automatically.',
          'The AI automatically processes each upload — detecting faces, reading dates from EXIF data, identifying locations from GPS tags, and suggesting tags based on content analysis. You can manually add descriptions, tag people, and link media to specific timeline events or interview responses.',
          'Old photographs can be enhanced using the AI restoration feature, which improves resolution, corrects color fading, and repairs minor damage. Duplicate detection prevents the same photo from being stored twice, even if file names differ.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Personality Modeling', desc: 'Builds a multi-dimensional personality model from interview transcripts, writing samples, and communication patterns. The model captures humor, decision-making style, emotional responses, values, and conversational tendencies with increasing fidelity over time.' },
        { capability: 'Neural Voice Synthesis', desc: 'Creates a neural voice clone that reproduces your exact vocal characteristics — pitch, cadence, accent, and emotional inflection. Generates natural-sounding speech for any new text, including appropriate pauses, emphasis, and breathing.' },
        { capability: 'Adaptive Interviewing', desc: 'The AI interviewer dynamically adjusts questions based on your previous responses, emotional state, and under-explored topics. It follows conversational threads naturally, asks clarifying questions, and knows when to probe deeper versus move on.' },
        { capability: 'Media Intelligence', desc: 'Automatically analyzes uploaded photos and videos using computer vision — detecting faces, reading text in images, identifying locations, estimating dates from visual cues, and suggesting connections to timeline events and family members.' },
        { capability: 'Conversational Legacy AI', desc: 'After succession activation, family members can have natural conversations with your AI persona. The system draws on your personality model, interview data, voice clone, and documented beliefs to generate responses that authentically represent you.' },
        { capability: 'Memory Reconstruction', desc: 'AI assists in reconstructing fragmented memories by cross-referencing your timelines, photos, family records, and interview responses. Suggests dates, locations, and people involved in partially-remembered events to help complete your life record.' },
      ]}
      troubleshooting={[
        { issue: 'Voice clone sounds robotic or unnatural', solution: 'This usually means insufficient training data. Record additional speech samples, focusing on natural conversation rather than reading. Aim for at least 60 minutes total. Ensure recordings are in a quiet environment with consistent microphone distance. Re-train the model after adding new samples.' },
        { issue: 'Interview session not saving', solution: 'Check your internet connection — sessions auto-save every 30 seconds but require connectivity. If you were offline, the session should sync when you reconnect. Navigate to Settings > Sync Status to verify. If data is missing, contact support with your session ID.' },
        { issue: 'Media upload failing for large files', solution: 'Files over 500MB use chunked upload which may fail on unstable connections. Try uploading from a wired connection. For very large video files, use the Desktop Uploader app which supports resume-on-failure. Check Settings > Storage to verify you have not exceeded your plan limit.' },
        { issue: 'Family member cannot access shared content', solution: 'Verify the family member has accepted their vault invitation email. Check their permission level in Settings > Family Access. Ensure the content is not set to a future release date or sealed status. Have them try logging out and back in to refresh their access token.' },
      ]}
      faq={[
        { q: 'How secure is my data in the Immortality Vault?', a: 'All data is encrypted with AES-256 at rest and TLS 1.3 in transit. The vault uses a zero-knowledge architecture — your master passphrase never leaves your device, and Echo Prime cannot decrypt your content. Data is stored redundantly across three geographic regions with automatic failover.' },
        { q: 'What happens to my vault if Echo Prime shuts down?', a: 'Your vault data is yours. You can export a complete encrypted backup at any time. In the unlikely event of service discontinuation, all vault owners would receive 12 months notice and free data export tools. The encryption keys are derived from your passphrase, not our infrastructure.' },
        { q: 'Can the AI really sound like me in conversations?', a: 'With sufficient training data (60+ minutes of speech and 40+ hours of interviews), the personality model and voice clone produce remarkably authentic responses. Family members in testing consistently rated the AI persona as "very much like" the original person. The model improves as you add more data.' },
        { q: 'Is there a storage limit for photos and videos?', a: 'The Starter plan includes 50GB of media storage. Professional includes 500GB, and Legacy (lifetime) includes 5TB with the option to purchase additional storage. Voice clone models and personality data do not count against your storage quota.' },
        { q: 'Can I delete specific content from my vault permanently?', a: 'Yes. Navigate to the content item and select Permanent Delete. This removes the content from all backups and replicas within 72 hours. Deleted content cannot be recovered. For interview responses, you can retract specific answers without deleting the entire session.' },
      ]}
    />
    </>
  )
}

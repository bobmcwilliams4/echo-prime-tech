'use client'

import ProductDoc from '@/components/ProductDoc'

export default function VoiceDocPage() {
  return (
    <ProductDoc
      name="Echo Voice AI"
      tagline="69 cloned voices, 4-layer emotion engine, multi-provider TTS, speech-to-text, and AI voice studio."
      accent="#8b5cf6"
      productUrl="/voice"
      workerUrl="https://echo-speak-cloud.bmcii1976.workers.dev"
      version="2.0.0"
      overview={[
        'Echo Voice AI is a comprehensive voice platform combining text-to-speech (TTS), speech-to-text (STT), and voice studio capabilities. With 69 pre-cloned voices, a 4-layer emotion engine, and multi-provider routing across ElevenLabs, Edge TTS, and Cartesia, it delivers the most natural-sounding AI speech available.',
        'The emotion engine analyzes text content and automatically adjusts voice parameters — pitch, speed, emphasis, and breathing — to convey the appropriate emotion. Four layers of analysis (lexical, contextual, sentiment, and prosodic) ensure voices sound genuinely expressive, not robotic.',
        'Speak Cloud handles provider routing intelligently: premium voices route through ElevenLabs (multilingual_v2 model for cloned voices), high-volume requests fall back to Edge TTS (free, unlimited), and Cartesia provides ultra-low-latency streaming for real-time applications.',
      ]}
      gettingStarted={[
        { step: 1, title: 'Access the Voice Studio', desc: 'Navigate to echo-ept.com/voice to access the voice studio. Preview any of the 69 available voices.' },
        { step: 2, title: 'Choose a Voice', desc: 'Browse voices by category: Male, Female, Character, Accent, Professional. Listen to samples and select your preferred voice.' },
        { step: 3, title: 'Generate Speech', desc: 'Enter text, select your voice, and click Generate. Audio streams in real-time. Download as MP3 or WAV.' },
        { step: 4, title: 'Enable Emotion', desc: 'Toggle the Emotion Engine to automatically detect and express emotions in your text. Fine-tune emotion intensity manually if needed.' },
        { step: 5, title: 'API Integration', desc: 'Get your API key from Settings. Use the REST API or WebSocket for streaming TTS in your own applications.' },
      ]}
      features={[
        { title: '69 Cloned Voices', desc: 'Pre-cloned voices covering male, female, character, and accent variations. Each voice is trained on ElevenLabs multilingual_v2 for natural output.' },
        { title: '4-Layer Emotion Engine', desc: 'Lexical, contextual, sentiment, and prosodic analysis automatically adjusts voice parameters to match text emotion. Joy, sadness, anger, excitement, calm, urgency — all detected and expressed.' },
        { title: 'Multi-Provider Routing', desc: 'Intelligent routing across ElevenLabs (premium quality), Edge TTS (unlimited free), and Cartesia (ultra-low latency). Automatic fallback ensures 100% uptime.' },
        { title: 'Streaming TTS', desc: 'Real-time audio streaming via WebSocket. First audio chunk arrives in under 200ms. Perfect for chatbots, phone systems, and interactive applications.' },
        { title: 'Speech-to-Text', desc: 'Transcribe audio to text with high accuracy. Supports 50+ languages. Returns timestamps, speaker diarization, and confidence scores.' },
        { title: 'Voice Cloning', desc: 'Clone any voice from a 30-second audio sample. Professional plan includes 5 custom clones. Enterprise is unlimited.' },
        { title: 'SSML Support', desc: 'Full SSML markup for fine-grained control: emphasis, pauses, pitch shifts, speed changes, phoneme pronunciation, and audio insertion.' },
        { title: 'Persona Switching', desc: 'Switch between voice personas mid-conversation. Perfect for multi-character narratives, audiobooks, and dialogue-based content.' },
        { title: 'Batch Generation', desc: 'Generate audio for hundreds of text segments in parallel. Upload a CSV and receive a ZIP of audio files. Ideal for course content and IVR menus.' },
        { title: 'Audio Editing', desc: 'Trim, concatenate, and adjust generated audio. Add background music, adjust volume, and export in multiple formats (MP3, WAV, OGG, FLAC).' },
        { title: 'Multi-Language', desc: 'Support for 29 languages with native pronunciation. The same cloned voice can speak multiple languages naturally.' },
        { title: 'Usage Analytics', desc: 'Track character usage, provider costs, popular voices, and API call patterns. Optimize provider selection to minimize costs.' },
      ]}
      apiEndpoints={[
        { method: 'POST', path: '/api/tts', desc: 'Generate speech from text. Parameters: text, voice_id, emotion (auto/manual), format (mp3/wav), speed.', auth: true },
        { method: 'POST', path: '/api/tts/stream', desc: 'Stream speech in real-time via chunked transfer. Same params as /tts but returns audio chunks.', auth: true },
        { method: 'GET', path: '/api/voices', desc: 'List all available voices with metadata: name, gender, accent, sample URL, provider.' },
        { method: 'GET', path: '/api/voices/:id/sample', desc: 'Get a sample audio clip for a specific voice.' },
        { method: 'POST', path: '/api/stt', desc: 'Transcribe audio to text. Upload audio file or provide URL. Returns text with timestamps.', auth: true },
        { method: 'POST', path: '/api/clone', desc: 'Clone a voice from an audio sample (min 30 seconds). Returns a new voice_id for TTS.', auth: true },
        { method: 'POST', path: '/api/emotion/analyze', desc: 'Analyze text for emotion content. Returns detected emotions with intensity scores.' },
        { method: 'GET', path: '/api/usage', desc: 'Get usage statistics: characters generated, API calls, provider breakdown.', auth: true },
      ]}
      userGuide={[
        { id: 'voice-selection', title: 'Choosing the Right Voice', content: [
          'Browse voices in the Voice Library. Each voice has a sample clip, description, and tags indicating its best use case (narration, customer service, character, etc).',
          'For professional content (IVR, presentations, courses), use the Professional category. For creative content (audiobooks, games, characters), explore the Character and Accent categories.',
          'Pro tip: Test your actual content with 2-3 voices before committing. Some voices perform better with certain content types. The AI will suggest optimal voices based on your text.',
        ]},
        { id: 'emotion', title: 'Using the Emotion Engine', content: [
          'The Emotion Engine has four analysis layers that work together. Lexical analysis identifies emotion words. Contextual analysis understands sentence meaning. Sentiment analysis detects overall tone. Prosodic analysis plans the speech rhythm.',
          'By default, emotion is set to "auto" which detects and applies appropriate emotion automatically. You can override with manual emotion tags: [happy], [sad], [excited], [calm], [angry], [urgent].',
          'Emotion intensity ranges from 0.0 (neutral) to 1.0 (maximum expression). Default is 0.6 which sounds natural. Higher values are more dramatic and work well for character voices.',
        ]},
        { id: 'cloning', title: 'Voice Cloning Guide', content: [
          'To clone a voice, provide a clean audio sample of at least 30 seconds. The sample should have: one speaker only, minimal background noise, natural speaking pace, and varied intonation.',
          'Upload the sample via the Clone tab or API. Processing takes 2-5 minutes. Once complete, the cloned voice appears in your Personal Voices library with a unique voice_id.',
          'Important: Cloned voices MUST use the multilingual_v2 model (automatically selected). Using v3 produces empty audio. This is enforced server-side for reliability.',
        ]},
        { id: 'integration', title: 'API Integration Guide', content: [
          'The simplest integration is a POST to /api/tts with your text and voice_id. The response is an audio file (MP3 by default). For streaming, use /api/tts/stream which returns chunked audio.',
          'For real-time applications (chatbots, phone), use the WebSocket endpoint at /ws/tts. Send text messages and receive audio chunks with sub-200ms latency.',
          'Rate limits: Starter (1,000 chars/min), Professional (10,000 chars/min), Enterprise (100,000 chars/min). Characters are counted before SSML tags are stripped.',
        ]},
        { id: 'providers', title: 'Understanding Provider Routing', content: [
          'Echo Voice AI routes requests across three providers to optimize quality, cost, and reliability. You can let the system auto-route or specify a provider preference.',
          'ElevenLabs: Highest quality, best for cloned voices and emotional content. Uses multilingual_v2 model. Costs apply to your quota.',
          'Edge TTS: Microsoft\'s free TTS engine. Good quality for standard content. Unlimited usage. Best for high-volume, cost-sensitive applications.',
          'Cartesia: Ultra-low latency (sub-100ms first chunk). Best for real-time streaming and interactive voice applications. Premium pricing.',
        ]},
      ]}
      aiCapabilities={[
        { capability: 'Emotion Detection', desc: 'Four-layer AI analysis detects joy, sadness, anger, excitement, calm, urgency, sarcasm, and 12 other emotions from text context. Accuracy: 92%+.' },
        { capability: 'Prosodic Planning', desc: 'AI plans speech rhythm, emphasis patterns, breathing points, and pause timing before generation. Produces more natural-sounding speech than raw TTS.' },
        { capability: 'Voice Matching', desc: 'Given a description of desired voice characteristics, AI recommends the best matching voice from the library based on similarity scoring.' },
        { capability: 'Content Adaptation', desc: 'AI adjusts speaking style based on content type: conversational for chat, authoritative for news, gentle for children\'s content, dramatic for fiction.' },
        { capability: 'Pronunciation Intelligence', desc: 'Handles proper nouns, technical terms, acronyms, and multi-language content with context-aware pronunciation. Custom pronunciation dictionaries supported.' },
        { capability: 'Cost Optimization', desc: 'AI routes requests to the most cost-effective provider that meets quality requirements. Learns usage patterns and suggests plan changes to minimize spend.' },
      ]}
      troubleshooting={[
        { issue: 'Audio sounds robotic or unnatural', solution: 'Enable the Emotion Engine (auto mode). Use a premium voice (ElevenLabs provider). Increase emotion intensity to 0.7. Ensure text has proper punctuation — commas and periods affect prosody.' },
        { issue: 'Cloned voice produces empty/silent audio', solution: 'This happens if the v3 model is selected. All cloned voices must use multilingual_v2. Delete the clone and recreate it. The system should auto-select the correct model.' },
        { issue: 'Streaming has high latency', solution: 'Switch to Cartesia provider for lowest latency. Check your network connection. Use WebSocket instead of HTTP streaming. Reduce text chunk size for faster first-byte time.' },
        { issue: 'Pronunciation is wrong for names or terms', solution: 'Use SSML phoneme tags: <phoneme alphabet="ipa" ph="...">word</phoneme>. Or add the word to your custom pronunciation dictionary in Settings > Pronunciation.' },
      ]}
      faq={[
        { q: 'How many characters can I generate per month?', a: 'Starter: 100K characters. Professional: 1M characters. Enterprise: 10M+ characters. Unused characters do not roll over. Batch generation counts the same as real-time.' },
        { q: 'Can I use generated audio commercially?', a: 'Yes. All plans include commercial usage rights for generated audio. You own the output. Cloned voices require that you have rights to the original voice sample.' },
        { q: 'What audio formats are supported?', a: 'Output: MP3, WAV, OGG, FLAC. Input (for STT and cloning): MP3, WAV, M4A, FLAC, OGG, WebM. Max file size for upload: 25MB.' },
        { q: 'Does it support real-time conversation?', a: 'Yes. The WebSocket endpoint delivers sub-200ms latency with Cartesia provider. Combined with STT, you can build full voice-interactive applications.' },
        { q: 'Can the same voice speak multiple languages?', a: 'Yes. The multilingual_v2 model supports 29 languages. A cloned English voice can speak Spanish, French, German, etc. with the same voice characteristics but native pronunciation.' },
      ]}
    />
  )
}

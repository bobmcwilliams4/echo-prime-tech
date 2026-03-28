'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Runway',
  tagline: 'AI creative studio for video generation, image editing, and multimedia production.',
  accent: '#ec4899',
  productUrl: '/runway',
  workerUrl: 'https://echo-production-studio.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Runway is a full-stack AI creative studio that generates professional video, images, and multimedia assets from text prompts and reference inputs. Powered by Grok Imagine for video generation and Aurora for image synthesis, Runway puts studio-grade production capabilities into a single API — no design skills, rendering farms, or editing software required.',
    'The platform supports the entire creative workflow from concept to final export. Generate video clips from text descriptions, create images with precise style control, apply style transfer to existing media, stitch multiple scenes into cohesive sequences, sync audio tracks, and export in broadcast-ready formats. Multi-scene projects let you build complete narratives with consistent characters, environments, and visual styles across shots.',
    'Built for content creators, marketing teams, and product builders who need high-quality visual assets at speed and scale. Whether you are producing social media content, product demos, training videos, or brand imagery, Echo Runway delivers production-quality results in minutes instead of days.',
  ],
  gettingStarted: [
    { step: 1, title: 'Authenticate via SDK Gateway', desc: 'Access Echo Runway through the SDK Gateway at echo-sdk-gateway.bmcii1976.workers.dev. Include your X-Echo-API-Key header in all requests. Runway capabilities require a Pro or Enterprise subscription.' },
    { step: 2, title: 'Generate Your First Image', desc: 'POST to /generate/image with a text prompt describing the image you want. Include optional parameters for style (photorealistic, illustration, 3D render), aspect ratio, and resolution. The Aurora engine returns a generated image within 5-15 seconds.' },
    { step: 3, title: 'Generate a Video Clip', desc: 'POST to /generate/video with a text prompt, duration (3-30 seconds), and style parameters. The Grok engine generates the video and returns a preview URL. Video generation takes 30-120 seconds depending on duration and complexity.' },
    { step: 4, title: 'Build a Multi-Scene Project', desc: 'Create a project via POST /projects with a scene list — each scene has a prompt, duration, transition type, and optional audio reference. The system generates each scene, applies transitions, and stitches them into a final video.' },
    { step: 5, title: 'Export Final Assets', desc: 'Download completed assets from the project or individual generation endpoints. Videos are available in MP4 (H.264) and WebM formats. Images export as PNG, JPEG, or WebP. All assets are stored for 30 days in your project library.' },
  ],
  features: [
    { title: 'Text-to-Video Generation', desc: 'Generate video clips from natural language descriptions using the Grok Imagine engine. Supports 3-30 second clips with control over camera movement, lighting, pacing, and visual style. Outputs at up to 1080p resolution at 30fps.' },
    { title: 'AI Image Generation', desc: 'Create photorealistic images, illustrations, concept art, and 3D renders from text prompts using the Aurora engine. Supports aspect ratios from 1:1 to 21:9, resolutions up to 4K, and style modifiers for precise creative control.' },
    { title: 'Style Transfer', desc: 'Apply the visual style of a reference image or video to your generated content. Transfer painting styles, color palettes, lighting moods, or brand visual identities across any media type while preserving the original content structure.' },
    { title: 'Video Stitching', desc: 'Combine multiple video clips into seamless sequences with configurable transitions — crossfade, cut, dissolve, wipe, and zoom. The stitching engine matches color grading and pacing across clips for professional-looking results.' },
    { title: 'Scene Composition', desc: 'Build complex scenes by layering multiple generated elements — backgrounds, characters, objects, text overlays, and effects. Each layer is independently positionable, scalable, and animatable within the scene timeline.' },
    { title: 'Audio Synchronization', desc: 'Sync generated video with audio tracks — music, voiceover, or sound effects. The system analyzes audio peaks and rhythm to align visual transitions with audio beats. Supports uploading custom audio or generating AI narration via Echo Speak integration.' },
    { title: 'Multi-Scene Projects', desc: 'Create narrative projects with multiple scenes, each with its own prompt, duration, and style. The system maintains visual consistency across scenes — characters, environments, and color palettes remain coherent throughout the project.' },
    { title: 'Template Library', desc: 'Access a curated library of production templates for common use cases — product demos, social media ads, explainer videos, brand intros, and testimonial formats. Templates define scene structure, timing, and style so you only provide the content-specific prompts.' },
    { title: 'Multiple Export Formats', desc: 'Export videos as MP4 (H.264/H.265), WebM (VP9), or MOV (ProRes) for different platforms and quality requirements. Images export as PNG, JPEG, WebP, or TIFF. Preset export profiles for YouTube, Instagram, TikTok, and LinkedIn handle format and resolution automatically.' },
    { title: 'Collaborative Editing', desc: 'Share projects with team members for collaborative editing. Multiple users can work on different scenes simultaneously. Version history tracks all changes with the ability to restore any previous state. Comments and annotations facilitate creative review.' },
    { title: 'Asset Management', desc: 'Organize generated assets in project folders with tags, favorites, and search. The asset library stores all generated images, videos, and audio files with full metadata — prompt, parameters, model version, and generation date — for easy retrieval and reuse.' },
    { title: 'Real-Time Preview', desc: 'Preview generated content and project compositions in the browser before committing to full-resolution export. Previews render at reduced resolution for instant feedback. Adjust prompts, timing, and styles iteratively without waiting for full renders.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/generate/video', desc: 'Generate a video clip from a text prompt. Accepts prompt, duration (3-30s), style, resolution, camera_movement, and fps parameters. Returns a job ID for polling and a preview URL on completion.', auth: true },
    { method: 'POST', path: '/generate/image', desc: 'Generate an image from a text prompt using the Aurora engine. Accepts prompt, style, aspect_ratio, resolution, and negative_prompt parameters. Returns the image URL and metadata within 5-15 seconds.', auth: true },
    { method: 'POST', path: '/edit/style', desc: 'Apply style transfer to an existing image or video. Accepts the source asset URL, a style reference (image URL or style preset name), and intensity parameter (0-1). Returns the styled asset.', auth: true },
    { method: 'POST', path: '/stitch', desc: 'Stitch multiple video clips into a single sequence. Accepts an ordered array of clip IDs or URLs, transition types between clips, and output format. Returns the stitched video URL on completion.', auth: true },
    { method: 'GET', path: '/projects/:id', desc: 'Retrieve a project with all its scenes, assets, and export history. Returns the project metadata, scene definitions, generated asset URLs, and current render status.', auth: true },
    { method: 'GET', path: '/assets', desc: 'List all generated assets in the account library. Supports filtering by type (image, video, audio), project, date range, and tags. Returns paginated results with thumbnail URLs and metadata.', auth: true },
  ],
  userGuide: [
    {
      title: 'Crafting Effective Prompts',
      id: 'prompts',
      content: [
        'The quality of generated content depends heavily on prompt quality. Be specific about the visual elements you want — describe the subject, environment, lighting, camera angle, color palette, and mood. Vague prompts produce generic results; detailed prompts produce striking, intentional visuals.',
        'Use style modifiers to guide the aesthetic — "cinematic lighting", "studio photography", "watercolor illustration", "isometric 3D render", "film noir". Combine subject description with style modifiers for precise control: "a bustling Tokyo street at night, neon reflections on wet pavement, cinematic wide-angle shot, cyberpunk atmosphere".',
        'For video generation, include temporal descriptions — camera movements ("slow dolly forward", "aerial tracking shot"), action sequences ("the character walks into frame from the left"), and pacing cues ("slow motion", "time-lapse"). The Grok engine interprets these as motion instructions for the generated video.',
        'Negative prompts exclude unwanted elements. Use the negative_prompt parameter to specify things like "blurry, low quality, distorted faces, text overlays" to improve output quality. Negative prompts are especially useful for avoiding common generation artifacts.',
      ],
    },
    {
      title: 'Building Multi-Scene Projects',
      id: 'projects',
      content: [
        'Multi-scene projects let you build complete video narratives. Create a project with an ordered list of scenes, each defined by a prompt, duration, transition type, and optional audio reference. The system generates each scene independently, then composites them into a final video.',
        'To maintain visual consistency across scenes, use the style_lock parameter. When enabled, the first scene establishes the visual style — color palette, lighting, character appearance — and subsequent scenes inherit those parameters. This prevents jarring style shifts between shots.',
        'Transitions between scenes support crossfade (default), hard cut, dissolve, wipe (left, right, up, down), zoom in, and zoom out. Transition duration is configurable from 0.25 to 2 seconds. For music-driven projects, set transitions to "beat-sync" to automatically align cuts with audio peaks.',
      ],
    },
    {
      title: 'Exporting for Different Platforms',
      id: 'export',
      content: [
        'Echo Runway includes export presets optimized for major platforms. Select a preset — YouTube (1080p/4K MP4), Instagram Reels (9:16 1080x1920), TikTok (9:16 1080x1920), LinkedIn (16:9 1080p), Twitter/X (16:9 720p) — and the system handles resolution, aspect ratio, bitrate, and format automatically.',
        'For custom export requirements, specify the format (MP4, WebM, MOV), codec (H.264, H.265, VP9, ProRes), resolution, frame rate, and bitrate manually. The export engine re-renders the project at the target specifications. Higher resolutions and ProRes exports take longer but produce broadcast-quality output.',
        'Image exports support PNG (lossless, large files), JPEG (lossy, small files, configurable quality 1-100), WebP (modern format, best size/quality ratio), and TIFF (uncompressed, for print production). Batch export lets you export all project assets in a single request with consistent naming and folder structure.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Grok Imagine Video Engine', desc: 'Generates video content from natural language descriptions with scene-level control over camera, lighting, motion, and pacing. The engine produces temporally coherent frames with consistent subjects and environments. Supports reference image conditioning to match specific visual targets.' },
    { capability: 'Aurora Image Synthesis', desc: 'Produces photorealistic and stylized images with fine-grained control over composition, lighting, and style. Aurora excels at architectural visualization, product photography, concept art, and portrait generation. Supports inpainting, outpainting, and image-to-image transformation.' },
    { capability: 'Intelligent Scene Continuity', desc: 'Analyzes multi-scene projects to maintain visual consistency across shots. Characters retain their appearance, environments stay coherent, and color grading remains unified. The continuity engine extracts style embeddings from generated scenes and propagates them forward through the project timeline.' },
    { capability: 'Adaptive Quality Enhancement', desc: 'Post-processes generated content through upscaling, denoising, color correction, and sharpening pipelines. Automatically detects and corrects common generation artifacts — face distortions, hand anomalies, text rendering issues, and temporal flickering in video — without manual intervention.' },
  ],
  troubleshooting: [
    { issue: 'Generated video has flickering or temporal artifacts', solution: 'Reduce the motion complexity in your prompt — simpler camera movements and fewer moving subjects produce more temporally stable output. Enable the "stabilize" post-processing flag in the generation request. For persistent issues, try generating at a lower frame rate (24fps instead of 30fps) which gives the model more temporal coherence budget per frame.' },
    { issue: 'Image generation does not match the prompt', solution: 'Be more specific in your prompt — add details about composition, lighting, and style. Use the negative_prompt parameter to exclude unwanted elements. If a specific visual element is missing, emphasize it by placing it first in the prompt or repeating it. Try different style presets to find one that better matches your intent.' },
    { issue: 'Multi-scene project has inconsistent visual style', solution: 'Enable the style_lock parameter on the project to force visual consistency across scenes. If style_lock is already enabled and results are still inconsistent, use a reference image in the first scene to anchor the visual style more firmly. Reduce the style_variance parameter from the default 0.3 to 0.1 for tighter consistency.' },
    { issue: 'Export takes too long or fails', solution: 'Large projects (10+ scenes at 4K) can take 5-10 minutes to export. Check the export status via the project endpoint — the progress field shows completion percentage. If export fails, verify that all scenes completed generation successfully before triggering export. Reduce resolution or switch from ProRes to H.264 for faster export times.' },
  ],
  faq: [
    { q: 'What AI models power Echo Runway?', a: 'Video generation uses Grok Imagine (via xAI integration) for text-to-video synthesis. Image generation uses Aurora for photorealistic and stylized image creation. Post-processing pipelines use specialized models for upscaling, denoising, and artifact correction. All models run through the Echo Model Host infrastructure.' },
    { q: 'What is the maximum video duration?', a: 'Individual clips can be up to 30 seconds. Multi-scene projects can combine unlimited clips for total durations up to 10 minutes on Pro plans and 30 minutes on Enterprise plans. Longer videos are built by stitching multiple generated scenes together with transitions.' },
    { q: 'Who owns the generated content?', a: 'You own full commercial rights to all content generated through your Echo Runway account. Generated assets can be used for any purpose including commercial projects, advertising, social media, and client deliverables. There are no royalty fees or usage restrictions on generated content.' },
    { q: 'Can I use my own images or videos as inputs?', a: 'Yes. Upload reference images for style transfer, image-to-image transformation, or visual anchoring in video generation. Upload existing video clips for stitching, style transfer, or as reference material for scene consistency. Uploaded assets are stored securely in your project library.' },
    { q: 'How much does video generation cost?', a: 'Pricing is based on generation seconds and resolution. Standard resolution (720p) costs 1 credit per second of video. HD (1080p) costs 2 credits per second. 4K costs 5 credits per second. Image generation costs 0.5 credits per image at standard resolution. Free tier includes 50 credits per month. Pro includes 500, Enterprise includes 5,000.' },
  ],
}

export default function Page() { return <ProductDoc {...data} /> }

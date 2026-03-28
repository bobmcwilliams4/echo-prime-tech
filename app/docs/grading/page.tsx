'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Grading AI',
  tagline: 'AI-powered collectibles authentication and grading for sports cards, comics, coins, and more',
  accent: '#d97706',
  productUrl: '/grading',
  workerUrl: 'echo-grading.bmcii1976.workers.dev',
  version: '1.0.0',
  overview: [
    'Echo Grading AI delivers professional-grade collectibles authentication and condition scoring powered by computer vision and machine learning. Submit photos of sports cards, comic books, coins, stamps, or vintage toys and receive a comprehensive assessment in seconds.',
    'Grading follows industry-standard scales — PSA 1–10 for sports cards, BGS half-point system, and CGC 0.5–10 for comics — so your results integrate directly with established certification workflows. Every assessment includes centering measurements, surface defect mapping, corner and edge analysis, and forgery detection.',
    'Market valuation data pulls from live auction records and population reports, giving you real-time insight into what your item is worth relative to its grade and the total graded population. Batch grading handles up to 500 items per job, making it ideal for dealers, estate buyers, and auction houses.',
  ],
  gettingStarted: [
    { step: 1, title: 'Create your account', desc: 'Sign up at echo-ept.com/grading and choose your subscription tier. Free accounts include 10 assessments per month; Pro unlocks unlimited grading and batch operations.' },
    { step: 2, title: 'Upload high-resolution images', desc: 'Photograph both front and back of your item under consistent lighting. Minimum 1200 x 1600 px recommended. JPEG, PNG, and HEIC formats are accepted.' },
    { step: 3, title: 'Select your category', desc: 'Choose from Sports Cards, Comics, Coins, Stamps, or Vintage Toys. The AI model switches to the appropriate grading rubric and defect detection parameters for your category.' },
    { step: 4, title: 'Review the AI assessment', desc: 'Within 10–30 seconds you receive a full condition report: grade, centering percentage, surface defect map, edge and corner scores, and an estimated market value range.' },
    { step: 5, title: 'Submit for certification', desc: 'Approve the AI assessment and generate a submission package for your preferred grading company. Tracking numbers update automatically once the item ships.' },
  ],
  features: [
    { title: 'Multi-Category Grading', desc: 'Supports sports cards (PSA, BGS, SGC scales), comic books (CGC, CBCS), coins (PCGS, NGC), stamps (PSE), and vintage toys with category-specific rubrics and defect parameters.' },
    { title: 'Condition Scoring', desc: 'Precise numeric grades on industry-standard scales with sub-grade breakdowns: Centering, Corners, Edges, and Surface each scored independently so you know exactly where points were lost.' },
    { title: 'Centering Analysis', desc: 'Sub-pixel centering measurement calculates left/right and top/bottom ratios to two decimal places, matching professional centering tools used by major grading companies.' },
    { title: 'Surface Defect Detection', desc: 'Computer vision scans for scratches, creases, stains, print defects, and restoration. Each defect is marked with a bounding box and severity rating on an annotated image overlay.' },
    { title: 'Authentication Verification', desc: 'Compares item against a reference database of known authentic specimens. Flags color variations, print anomalies, and reproduction tells that indicate counterfeits or altered items.' },
    { title: 'Market Price Estimation', desc: 'Real-time valuation based on recent sold prices from major auction houses and marketplaces, filtered by grade and condition to give accurate comps for your specific item.' },
    { title: 'Population Reports', desc: 'See how many items at each grade exist across all major grading companies. Low-population grades command significant premiums — know yours before you sell or submit.' },
    { title: 'Submission Tracking', desc: 'Track submissions to PSA, BGS, CGC, PCGS, and NGC from a unified dashboard. Receive push notifications when grades are assigned and certificates are ready.' },
    { title: 'Certificate Generation', desc: 'Generate a signed digital certificate for AI-assessed items, suitable for private sales, insurance documentation, and estate inventories without full grading company submission.' },
    { title: 'Batch Grading', desc: 'Submit up to 500 items per batch job via bulk image upload or API. Results are delivered as structured JSON or exportable CSV with full grade breakdowns and defect maps.' },
  ],
  apiEndpoints: [
    { method: 'POST', path: '/grade', desc: 'Submit item images for AI grading. Returns grade, sub-grades, defect map, centering measurement, and condition narrative.', auth: true },
    { method: 'POST', path: '/authenticate', desc: 'Run forgery and restoration detection on submitted images. Returns authenticity confidence score and flagged anomalies with bounding box annotations.', auth: true },
    { method: 'GET', path: '/valuations', desc: 'Retrieve market valuation data for a given item type, year, and grade range. Pulls from live auction records updated every 6 hours.', auth: true },
    { method: 'POST', path: '/batch-grade', desc: 'Submit a batch grading job with up to 500 items as a ZIP or manifest. Returns a job ID for asynchronous status polling and result retrieval.', auth: true },
    { method: 'GET', path: '/population/:category', desc: 'Fetch population report for a category showing grade distribution counts across PSA, BGS, CGC, PCGS, and NGC registries.', auth: true },
    { method: 'GET', path: '/submissions', desc: 'List all tracked submissions with current status, estimated completion dates, and assigned grades when available.', auth: true },
  ],
  userGuide: [
    {
      title: 'Submitting Items',
      id: 'submitting',
      content: [
        'For best results, photograph items on a neutral gray or dark background with two diffused light sources positioned at 45-degree angles to minimize glare. Avoid direct flash — it washes out surface texture the AI needs for defect detection.',
        'Each submission requires a minimum of two images: front and back. Cards and comics with known high-value variants benefit from additional macro shots of corners and edges. Coins should include an edge photo when possible.',
        'After upload the system auto-rotates and crops your image, then runs the full grading pipeline. You can edit the crop before confirming if the auto-detect missed a border. HEIC format from iPhone typically produces the sharpest results.',
      ],
    },
    {
      title: 'Understanding Grades',
      id: 'grades',
      content: [
        'Each grade is computed from four sub-grade components: Centering (25%), Corners (25%), Edges (25%), and Surface (25%). The lowest sub-grade acts as a ceiling — a card with a PSA 10 surface but PSA 7 corners cannot grade higher than 8 overall.',
        'The AI grade is a predictive assessment, not a guarantee of what a grading company will assign. Real-world graders may weigh factors differently or identify defects not visible in photos. Echo Grading AI targets within 0.5 grade accuracy at 90% confidence.',
        'Grades are version-locked: the model version used for your assessment is recorded so results remain consistent even as the AI is updated. Regrade requests use the current model version and may differ from the original assessment.',
      ],
    },
    {
      title: 'Market Valuations',
      id: 'valuations',
      content: [
        'Valuations refresh every 6 hours from aggregated auction data. Each estimate shows a low, mid, and high range based on the last 90 days of comparable sales filtered to your item grade and condition tier.',
        'The population multiplier adjusts valuations based on rarity. A PSA 10 with a population of 3 will show a significantly higher valuation than the same card with 2,000 PSA 10s in existence across the registry.',
        'Export valuation reports as PDF for insurance appraisals. Reports include item description, AI grade, population data, and three comparable sales with dates and links to original auction records for verification.',
      ],
    },
  ],
  aiCapabilities: [
    { capability: 'Surface Defect Detection via Computer Vision', desc: 'A multi-scale CNN trained on 4.2 million annotated collectible images identifies scratches, print defects, stains, creases, and restoration work. Defects smaller than 0.1mm are detectable at standard submission resolution.' },
    { capability: 'Centering Measurement', desc: 'Sub-pixel edge detection calculates border width ratios to two decimal places. The system handles rotated, warped, and perspective-distorted images, correcting for camera angle before measuring.' },
    { capability: 'Color Analysis', desc: 'Spectral analysis detects faded inks, color restoration, and reprints. Reference color profiles for 50,000+ known items flag deviations that indicate trimming, cleaning, or reproduction.' },
    { capability: 'Forgery Detection', desc: 'Multi-modal analysis compares print dot patterns, paper texture signatures, and holographic elements against authenticated reference specimens. Detects trimmed cards, restored comics, and coin cleaning with 94%+ recall.' },
  ],
  troubleshooting: [
    { issue: 'Blurry or low-resolution image rejected', solution: 'Ensure minimum 1200 x 1600 px resolution. Avoid using zoom on mobile cameras — move physically closer instead. Use burst mode and select the sharpest frame. Convert HEIC to JPEG if the upload form reports format errors.' },
    { issue: 'Incorrect category auto-detected', solution: 'Use the Category dropdown on the upload form to override auto-detection before submitting. If the wrong model already ran, delete the assessment and resubmit with the correct category explicitly selected.' },
    { issue: 'Grade disagreement with professional grader result', solution: 'AI grades are predictive with target accuracy of within 0.5 grade at 90% confidence. If your professional grade differs significantly, submit a regrade request with the official grade attached for model feedback and documentation.' },
    { issue: 'Batch job taking longer than expected', solution: 'Batch jobs over 100 items are queued and processed asynchronously. Average throughput is 60 items per minute during normal load. Check the Jobs dashboard for your queue position and estimated completion time.' },
  ],
  faq: [
    { q: 'Is the AI grade accepted by PSA or BGS as a substitute for their grading?', a: 'No. Echo Grading AI provides a predictive assessment to help you decide whether to submit for professional grading and what grade to expect. Official grades are issued only by PSA, BGS, SGC, CGC, and similar companies.' },
    { q: 'What image formats are supported?', a: 'JPEG, PNG, HEIC, and WebP are accepted. Maximum file size per image is 25 MB. RAW formats are not currently supported — convert to JPEG or PNG before uploading for best results.' },
    { q: 'How accurate is the forgery detection?', a: 'Forgery detection achieves 96.8% precision and 94.1% recall on our benchmark dataset. It performs best on trimmed cards and restored comics. Detection of sophisticated coin alterations is 89% accurate and improving with each model update.' },
    { q: 'Can I grade items without submitting them to a grading company?', a: 'Yes. You can generate a digital certificate for AI-assessed items for use in private sales, insurance documentation, and estate inventories without ever submitting to a physical grading company.' },
    { q: 'How is population data sourced?', a: 'Population data is aggregated from PSA, BGS, CGC, PCGS, and NGC public registers and refreshed daily. Census counts reflect items in their public databases and may not include recently graded items that have not yet appeared in public census data.' },
  ],
}

export default function GradingDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/grading' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}

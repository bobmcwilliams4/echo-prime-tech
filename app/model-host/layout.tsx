import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Echo Model Host — AI Model Hosting & Inference Platform | Echo Prime Tech',
  description: 'Deploy and serve AI models on the global edge. Multi-GPU inference, auto-scaling, model versioning, A/B testing, and real-time analytics for production ML workloads.',
  keywords: ['AI model hosting', 'ML inference', 'model deployment', 'GPU inference', 'model serving', 'MLOps platform'],
  openGraph: { title: 'Echo Model Host — AI Model Inference Platform', description: 'Deploy AI models to the edge with auto-scaling, versioning, and real-time analytics.', url: 'https://echo-ept.com/model-host' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }

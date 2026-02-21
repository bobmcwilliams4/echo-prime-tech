import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sentinel Intelligence — AI Analysis Engine | Echo Prime Technologies',
  description: 'Query 932 doctrine-hardened engines across 65 domains. Standard, Swarm, and Echo Prime modes. Memory cortex. Trinity Council consensus. Voice output. Court-defensible AI with deterministic audit trails.',
  keywords: ['Sentinel AI', 'intelligence engine', 'doctrine analysis', 'swarm intelligence', 'Echo Prime', 'court-defensible AI'],
  openGraph: {
    title: 'Sentinel Intelligence Engine',
    description: 'Query 932 doctrine-hardened engines. Standard, Swarm, and Echo Prime modes. Memory cortex. Court-defensible AI.',
    url: 'https://echo-ept.com/sentinel',
  },
};

export default function SentinelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

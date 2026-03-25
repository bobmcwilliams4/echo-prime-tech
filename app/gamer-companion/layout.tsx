import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GGI Apex Predator — AI Gaming Companion | Echo Prime Technologies',
  description: 'AI gaming companion that auto-detects 45+ games, reads the screen in real-time, and coaches you through 8 play modes. From passive tips to full autonomous play. Steam Overlay integration.',
  openGraph: {
    title: 'GGI Apex Predator — AI Gaming Companion | Echo Prime Technologies',
    description: 'AI gaming companion with 45+ games, 8 play modes, and real-time screen analysis.',
  },
};

export default function GamerCompanionLayout({ children }: { children: React.ReactNode }) {
  return children;
}

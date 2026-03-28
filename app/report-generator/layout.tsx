import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echo Report Generator — AI-Powered Professional Reports | Echo Prime Technologies',
  description: 'Generate professional PDF reports from 5,500+ intelligence engines. Query any domain — tax, legal, oilfield, cybersecurity — and receive branded reports with doctrine citations, risk assessments, and action items.',
  openGraph: {
    title: 'Echo Report Generator — AI-Powered Professional Reports',
    description: 'Generate professional PDF reports from 5,500+ intelligence engines. Query any domain — tax, legal, oilfield, cybersecurity — and receive branded reports with doctrine citations, risk assessments, and action items.',
    url: 'https://echo-ept.com/report-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo Report Generator — AI-Powered Professional Reports | Echo Prime Technologies',
    description: 'Generate professional PDF reports from 5,500+ intelligence engines. Query any domain and receive branded reports with doctrine citations, risk assessments, and action items.',
  },
  alternates: { canonical: '/report-generator' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo App Forge — AI App Generator | Build Electron, Next.js, React Native Apps | Echo Prime Technologies',
  description: 'Generate complete applications with AI — Electron desktop apps, Next.js websites, React Native mobile, CLI tools, Chrome extensions, and MCP servers. From $49/mo.',
  openGraph: {
    title: 'Echo App Forge — AI App Generator',
    description: 'Generate complete applications with AI — Electron, Next.js, React Native, CLI tools, Chrome extensions, and MCP servers.',
    url: 'https://echo-ept.com/app-forge',
  },
}

export default function AppForgeLayout({ children }: { children: React.ReactNode }) {
  return children
}

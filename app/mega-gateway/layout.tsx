import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Echo MEGA Gateway — 37,000+ AI Tools API Hub | Echo Prime Tech',
  description: 'Access 37,475+ AI tools through one unified API. MCP server aggregation, intelligent routing, credential management, and usage analytics for every AI tool you need.',
  keywords: ['AI tools API', 'MCP gateway', 'tool aggregation', 'AI integration', 'API hub', 'model context protocol'],
  openGraph: { title: 'Echo MEGA Gateway — 37,000+ AI Tools', description: 'One API for 37,475+ AI tools. Search, execute, and monitor across 1,873 MCP servers.', url: 'https://echo-ept.com/mega-gateway' },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }

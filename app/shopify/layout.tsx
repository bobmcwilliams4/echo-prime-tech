import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Echo Shopify — AI-Powered Shopify Integration & E-commerce Automation | Echo Prime Technologies',
  description: 'Supercharge your Shopify store with AI product recommendations, automated catalog sync, smart checkout flows, and real-time analytics. From $39/mo.',
  openGraph: {
    title: 'Echo Shopify — AI-Powered Shopify Integration',
    description: 'Supercharge your Shopify store with AI product recommendations, automated catalog sync, and smart analytics.',
    url: 'https://echo-ept.com/shopify',
  },
}

export default function ShopifyLayout({ children }: { children: React.ReactNode }) {
  return children
}

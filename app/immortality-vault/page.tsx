import { Metadata } from 'next'
import { Zap, Shield, BarChart3, Cpu, Globe, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Immortality Vault | Echo Prime Technology',
  description: 'Immortality Vault is a powerful AI-powered solution built on the Echo Prime Technology platform.',
}

const features = [
  { icon: Zap, title: 'AI-Powered Automation', description: 'Leverage cutting-edge AI technology to streamline and optimize your ai-powered automation workflow.' },
  { icon: Shield, title: 'Real-Time Analytics Dashboard', description: 'Leverage cutting-edge AI technology to streamline and optimize your real-time analytics dashboard workflow.' },
  { icon: BarChart3, title: 'Enterprise-Grade Security', description: 'Leverage cutting-edge AI technology to streamline and optimize your enterprise-grade security workflow.' },
  { icon: Cpu, title: 'Multi-Tenant Architecture', description: 'Leverage cutting-edge AI technology to streamline and optimize your multi-tenant architecture workflow.' },
  { icon: Globe, title: 'RESTful API with Full Documentation', description: 'Leverage cutting-edge AI technology to streamline and optimize your restful api with full documentation workflow.' },
  { icon: Lock, title: 'Cloudflare Edge Deployment', description: 'Leverage cutting-edge AI technology to streamline and optimize your cloudflare edge deployment workflow.' },
]

export default function ImmortalityVaultPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Immortality Vault
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Immortality Vault is a powerful AI-powered solution built on the Echo Prime Technology platform.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/pricing" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Started
            </a>
            <a href="/docs" className="border border-gray-700 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                  <Icon className="w-8 h-8 text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-t from-red-900/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of businesses using Echo Prime Technology to automate and scale.
          </p>
          <a href="/pricing" className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors inline-block">
            Start Free Trial
          </a>
        </div>
      </section>
    </div>
  )
}

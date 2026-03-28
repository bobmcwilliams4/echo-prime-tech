"use client"

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'

const data: ProductDocProps = {
  name: 'Echo Vault',
  tagline: 'Encrypted credential management — secure storage, rotation, and runtime access for 1,527+ API keys, tokens, and secrets.',
  accent: '#b91c1c',
  productUrl: '/vault',
  workerUrl: 'https://echo-vault-api.bmcii1976.workers.dev',
  version: '2.0.0',
  overview: [
    'Echo Vault is the central credential management system for ECHO OMEGA PRIME. It securely stores 1,527+ API keys, tokens, passwords, and secrets with AES-256 encryption at rest and TLS in transit.',
    'Every Worker, Bot, and system pulls credentials from Vault at runtime. Never hardcoded, never in git. The Vault API provides instant access with key-based authentication and per-credential access control.',
    'Supports credential rotation, expiry tracking, health checks, and automated alerts when credentials approach expiration or are unused.',
  ],
  gettingStarted: [
    { step: 1, title: 'Access Vault', desc: 'Authenticate with X-Echo-API-Key header. The master key provides full read/write access.' },
    { step: 2, title: 'Store Credentials', desc: 'POST /credentials with service name, type (api_key, token, password, oauth), and secret value.' },
    { step: 3, title: 'Retrieve at Runtime', desc: 'GET /credentials/:name from Workers and services. Use Python client or direct HTTP.' },
    { step: 4, title: 'Set Up Rotation', desc: 'Configure rotation schedules for OAuth tokens and API keys with supported providers.' },
    { step: 5, title: 'Monitor', desc: 'Check /health for status, /audit for access logs. Review expiring credentials.' },
  ],
  features: [
    { title: 'Encrypted Storage', desc: 'AES-256 at rest in D1. Never stored plaintext. Decrypted only at retrieval.' },
    { title: 'Runtime Access', desc: 'REST API with sub-50ms response via Cloudflare edge. Python client and HTTP.' },
    { title: 'Access Control', desc: 'Per-credential policies. Full audit trail of every access.' },
    { title: 'Credential Rotation', desc: 'Auto-rotation for OAuth tokens. Zero-downtime rollover for all types.' },
    { title: 'Expiry Tracking', desc: 'Alerts at 30/14/7/1 day thresholds. Dashboard of expiring credentials.' },
    { title: 'Cloud Backup', desc: 'Encrypted R2 backups. Point-in-time recovery. Global redundancy.' },
    { title: 'Audit Trail', desc: 'Every access, creation, update, and deletion logged with timestamps.' },
    { title: 'Bulk Operations', desc: 'Import/export via encrypted JSON. Bulk rotation across services.' },
  ],
  apiEndpoints: [
    { method: 'GET', path: '/credentials/:name', desc: 'Retrieve decrypted credential by service name.', auth: true },
    { method: 'POST', path: '/credentials', desc: 'Store new credential with name, type, value, and metadata.', auth: true },
    { method: 'PUT', path: '/credentials/:name', desc: 'Update credential. Previous value archived for rollback.', auth: true },
    { method: 'DELETE', path: '/credentials/:name', desc: 'Soft-delete. Archived 30 days before permanent removal.', auth: true },
    { method: 'GET', path: '/credentials', desc: 'List all credentials with metadata. Values NOT included.', auth: true },
    { method: 'GET', path: '/audit', desc: 'Access audit trail with filtering.', auth: true },
    { method: 'GET', path: '/health', desc: 'Vault health: credential count, storage, encryption status.', auth: true },
    { method: 'POST', path: '/rotate/:name', desc: 'Trigger credential rotation.', auth: true },
  ],
  userGuide: [
    { title: 'Python Client', id: 'python-client', content: ['Import MasterVault from core/master_vault.py. Initialize with vault_config, call get_credential().', 'For Workers, use fetch with X-Echo-API-Key header. Cache in KV with appropriate TTL.', 'Never log credential values. The client masks values in debug output.'] },
    { title: 'Security Practices', id: 'security', content: ['NEVER hardcode secrets in code, .env files, or logs. Always pull from Vault.', 'Grant each service access only to credentials it needs.', 'Rotate: OAuth auto-rotate, API keys quarterly, passwords monthly.'] },
    { title: 'Disaster Recovery', id: 'dr', content: ['Encrypted R2 backups on every change. Download, decrypt, and import to restore.', 'Local SQLite vault serves as independent backup layer.', 'Both cloud and local vaults support full credential export.'] },
  ],
  aiCapabilities: [
    { capability: 'Anomaly Detection', desc: 'Flags unusual access patterns: odd hours, unexpected services, volume spikes.' },
    { capability: 'Rotation Recommendations', desc: 'Analyzes age, usage, and best practices to recommend rotation schedules.' },
    { capability: 'Dependency Mapping', desc: 'Maps service-credential dependencies for safe rotation planning.' },
    { capability: 'Breach Response', desc: 'Identifies all systems using a compromised credential and generates rotation plan.' },
  ],
  troubleshooting: [
    { issue: '403 on retrieval', solution: 'Use correct key: echo-vault-master-2024 (NOT forge-x-2026). Names are case-sensitive.' },
    { issue: '500 errors', solution: 'Check D1 via /health. Local vault (master_vault.db) can serve as fallback.' },
    { issue: 'Encrypted values returned', solution: 'Check VAULT_ENCRYPTION_KEY secret on the Worker.' },
    { issue: 'OAuth rotation failed', solution: 'Refresh token may be expired. Manual re-auth needed. Check provider token lifetime.' },
  ],
  faq: [
    { q: 'Storage limits?', a: 'Currently 1,527+ credentials. D1 supports 10GB. Each record under 1KB. Effectively unlimited.' },
    { q: 'API key security?', a: 'Set as Cloudflare Worker secret. HTTPS only. IP allowlisting available.' },
    { q: 'Non-Echo services?', a: 'Yes. REST API works with any HTTP client. X-Echo-API-Key header for auth.' },
    { q: 'Cloud Vault down?', a: 'Local SQLite vault auto-fallback. Workers should cache credentials.' },
    { q: 'Global replication?', a: 'Yes. D1 and R2 replicate globally. Served from nearest edge location.' },
  ],
}

export default function EchoVaultDocsPage() {
  return <ProductDoc {...data} />
}

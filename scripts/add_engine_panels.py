"""Add EngineQueryPanel to product pages that don't have it yet."""
import re, os

BASE = "O:/ECHO_OMEGA_PRIME/WEBSITES/echo-prime-tech/app"

# Map each product page to its engine domain(s) and example queries
ENGINE_MAP = {
    "bots": {
        "domains": ["SE", "AI"],
        "title": "Ask the Bot Intelligence Engine",
        "placeholder": "Ask about bot development, automation, APIs...",
        "examples": ["Best practices for Discord bot rate limiting", "How to handle webhook retries", "OAuth2 bot token management"],
    },
    "bree-assistant": {
        "domains": ["BUS", "AI"],
        "title": "Ask the Business Intelligence Engine",
        "placeholder": "Ask about business operations, scheduling, HR...",
        "examples": ["Best scheduling algorithms for service businesses", "How to calculate employee utilization rate", "Customer retention strategies for service companies"],
    },
    "county-records": {
        "domains": ["LG", "RE"],
        "title": "Ask the Legal & Real Estate Engine",
        "placeholder": "Ask about property records, deeds, liens...",
        "examples": ["What is a lis pendens and when is it filed?", "How to search grantor-grantee index", "Texas deed recording requirements"],
    },
    "ecommerce": {
        "domains": ["BUS", "FIN"],
        "title": "Ask the Commerce Intelligence Engine",
        "placeholder": "Ask about ecommerce, payments, fulfillment...",
        "examples": ["Best practices for subscription billing", "How to reduce cart abandonment", "Payment processor fee comparison"],
    },
    "linkedin": {
        "domains": ["BUS", "MKT"],
        "title": "Ask the Marketing Intelligence Engine",
        "placeholder": "Ask about LinkedIn strategy, B2B marketing...",
        "examples": ["Optimal LinkedIn posting frequency for B2B", "How to write engaging LinkedIn content", "LinkedIn Sales Navigator best practices"],
    },
    "office-ai": {
        "domains": ["BUS", "ACCT"],
        "title": "Ask the Business Operations Engine",
        "placeholder": "Ask about invoicing, payroll, scheduling...",
        "examples": ["Best invoicing practices for service businesses", "How to calculate overtime pay in Texas", "Accounts receivable aging best practices"],
    },
    "orchestration": {
        "domains": ["SE", "AI"],
        "title": "Ask the Systems Intelligence Engine",
        "placeholder": "Ask about orchestration, pipelines, automation...",
        "examples": ["Event-driven vs scheduled orchestration", "How to implement circuit breakers", "Distributed task queue patterns"],
    },
    "payments": {
        "domains": ["FIN", "BUS"],
        "title": "Ask the Payments Intelligence Engine",
        "placeholder": "Ask about payment processing, compliance...",
        "examples": ["PCI DSS compliance requirements", "Stripe vs PayPal fee comparison", "How to handle payment disputes"],
    },
    "pipelines": {
        "domains": ["SE", "DATA"],
        "title": "Ask the Data Pipeline Engine",
        "placeholder": "Ask about ETL, data extraction, normalization...",
        "examples": ["Best practices for web scraping at scale", "How to handle rate limiting in data pipelines", "Data normalization techniques"],
    },
    "reddit": {
        "domains": ["MKT", "AI"],
        "title": "Ask the Social Intelligence Engine",
        "placeholder": "Ask about Reddit marketing, sentiment analysis...",
        "examples": ["Reddit API rate limits and best practices", "How to analyze subreddit sentiment", "Content marketing strategies for Reddit"],
    },
    "scrapers": {
        "domains": ["SE", "DATA"],
        "title": "Ask the Scraping Intelligence Engine",
        "placeholder": "Ask about web scraping, data extraction...",
        "examples": ["How to bypass Cloudflare protection ethically", "Best headless browser for scraping", "Handling dynamic JavaScript content"],
    },
    "services": {
        "domains": ["BUS"],
        "title": "Ask the Professional Services Engine",
        "placeholder": "Ask about consulting, project management...",
        "examples": ["How to scope a software consulting engagement", "Best practices for SOW writing", "Project estimation techniques"],
    },
    "title-intelligence": {
        "domains": ["OG", "RE", "LG"],
        "title": "Ask the Title Intelligence Engine",
        "placeholder": "Ask about mineral rights, chain of title, deeds...",
        "examples": ["How to calculate net mineral acres", "Texas intestate succession for mineral rights", "What is a division order?"],
    },
    "vault": {
        "domains": ["CYBER", "SE"],
        "title": "Ask the Security Vault Engine",
        "placeholder": "Ask about credential security, encryption...",
        "examples": ["AES-256 vs ChaCha20 for credential storage", "Best practices for API key rotation", "How does Argon2id key derivation work?"],
    },
    "voice": {
        "domains": ["AI", "SE"],
        "title": "Ask the Voice AI Engine",
        "placeholder": "Ask about TTS, STT, voice cloning...",
        "examples": ["Comparison of TTS engines: ElevenLabs vs Azure vs Google", "How to reduce TTS latency", "Voice cloning ethical considerations"],
    },
    "x-bot": {
        "domains": ["MKT", "AI"],
        "title": "Ask the Social Media Intelligence Engine",
        "placeholder": "Ask about X/Twitter automation, engagement...",
        "examples": ["X API v2 rate limits and best practices", "How to grow engagement on X organically", "Content scheduling strategies"],
    },
    "rewards": {
        "domains": ["BUS", "FIN"],
        "title": "Ask the Rewards Intelligence Engine",
        "placeholder": "Ask about loyalty programs, rewards design...",
        "examples": ["Best loyalty program structures", "How to calculate reward point ROI", "Gamification strategies for retention"],
    },
}

IMPORT_LINE = "import { EngineQueryPanel } from '../../components/EngineQueryPanel';"

def process_page(page_dir, config):
    filepath = os.path.join(BASE, page_dir, "page.tsx")
    if not os.path.exists(filepath):
        print(f"  SKIP: {filepath} not found")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "EngineQueryPanel" in content:
        print(f"  ALREADY HAS: {page_dir}")
        return

    changes = []

    # 1. Add import
    import_lines = list(re.finditer(r"^import\s+.*$", content, re.MULTILINE))
    if import_lines:
        last = import_lines[-1]
        content = content[:last.end()] + "\n" + IMPORT_LINE + content[last.end():]
        changes.append("import")

    # 2. Build the JSX for EngineQueryPanel
    domains_str = ", ".join(f"'{d}'" for d in config["domains"])
    examples_str = ", ".join(f"'{e}'" for e in config["examples"])

    panel_jsx = f'''
      {{/* Intelligence Engine Integration */}}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{{{ color: 'var(--ept-text)' }}}}>
          {config["title"]}
        </h2>
        <EngineQueryPanel
          domains={{[{domains_str}]}}
          title="{config["title"]}"
          placeholder="{config["placeholder"]}"
          exampleQueries={{[{examples_str}]}}
        />
      </section>'''

    # 3. Insert before footer or before the closing </div>
    # Find a footer element
    footer_match = re.search(r"(\n\s*<footer\b)", content)
    if footer_match:
        pos = footer_match.start()
        content = content[:pos] + panel_jsx + content[pos:]
        changes.append("panel(before footer)")
    else:
        # Find the last </div> before the final );
        lines = content.split("\n")
        insert_idx = None
        for i in range(len(lines) - 1, -1, -1):
            stripped = lines[i].strip()
            if stripped == "</div>" or stripped == "</>":
                insert_idx = i
                break
            if stripped.startswith("export default"):
                break
        if insert_idx:
            lines.insert(insert_idx, panel_jsx)
            content = "\n".join(lines)
            changes.append("panel(before closing)")

    if changes:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  OK: {page_dir} [{', '.join(changes)}]")
    else:
        print(f"  FAILED: {page_dir}")


print("Adding EngineQueryPanel to remaining product pages...")
for page_dir, config in ENGINE_MAP.items():
    print(f"\n{page_dir}:")
    process_page(page_dir, config)

print("\nDone!")

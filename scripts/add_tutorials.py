import re, os

BASE = "O:/ECHO_OMEGA_PRIME/WEBSITES/echo-prime-tech/app"

# Pages that need BOTH ProductTutorialButton import + data-tutorial attributes
NEED_BUTTON_AND_ATTRS = {
    "grading": {
        "tutorialId": "grading", "productName": "AI Collectibles Grading",
        "attrs": ["grading-hero", "grading-type-select", "grading-upload", "grading-grade-scale", "grading-defects"]
    },
    "tax-returns": {
        "tutorialId": "tax-returns", "productName": "AI Tax Returns",
        "attrs": ["tax-hero", "tax-tab-overview", "tax-tab-intake", "tax-doc-upload", "tax-income-categories", "tax-deductions"]
    },
    "title-intelligence": {
        "tutorialId": "title-intelligence", "productName": "Title Intelligence",
        "attrs": ["title-hero", "title-county", "title-search", "title-run-search", "title-chain"]
    },
    "security": {
        "tutorialId": "security", "productName": "Cyber Defense",
        "attrs": ["security-hero", "security-services", "security-pricing"]
    },
    "pentesting": {
        "tutorialId": "pentesting", "productName": "Penetration Testing",
        "attrs": ["pentest-hero", "pentest-scope", "pentest-pricing"]
    },
    "hephaestion-forge": {
        "tutorialId": "hephaestion-forge", "productName": "Hephaestion Forge",
        "attrs": ["heph-hero", "heph-mode", "heph-chat", "heph-stages", "heph-guilds"]
    },
    "bree-assistant": {
        "tutorialId": "bree-assistant", "productName": "Bree AI Assistant",
        "attrs": ["bree-hero", "bree-demo", "bree-voice-widget", "bree-capabilities", "bree-roi"]
    },
}

# Pages that already have ProductTutorialButton but need data-tutorial attributes
NEED_ATTRS_ONLY = {
    "engines": ["engines-hero", "engines-search", "engines-tier-filter", "engines-domain-card", "engines-try-query", "engines-pricing"],
    "county-records": ["county-hero", "county-tabs", "county-search-fields", "county-search-btn", "county-filters"],
    "echocad": ["echocad-hero", "echocad-tabs", "echocad-materials", "echocad-calculator", "echocad-primitives"],
    "ecommerce": ["ecommerce-hero", "ecommerce-filter", "ecommerce-service", "ecommerce-tier"],
    "immortality-vault": ["iv-hero", "iv-interview", "iv-voice", "iv-memories"],
    "orchestration": ["orch-hero", "orch-features", "orch-code", "orch-pricing"],
    "reddit": ["reddit-hero", "reddit-features", "reddit-pricing"],
    "voice": ["voice-hero", "voice-section-tabs", "voice-text-input", "voice-select", "voice-sliders", "voice-generate"],
    "websites": ["websites-hero", "websites-category", "websites-template", "websites-process", "websites-pricing"],
}


def add_import_if_missing(content):
    """Add ProductTutorialButton import if not present"""
    if "ProductTutorialButton" in content:
        return content, False
    import_lines = list(re.finditer(r"^import\s+.*$", content, re.MULTILINE))
    if import_lines:
        last_import = import_lines[-1]
        insert_pos = last_import.end()
        imp = "\nimport ProductTutorialButton from '../../components/product-tutorial-button';"
        content = content[:insert_pos] + imp + content[insert_pos:]
        return content, True
    return content, False


def add_button_component(content, tutorial_id, product_name):
    """Add <ProductTutorialButton> before closing JSX"""
    marker = f'tutorialId="{tutorial_id}"'
    if marker in content:
        return content, False
    # Find the last closing tag pattern before );
    # Look for last </div> or </section> before the final );
    lines = content.split("\n")
    insert_idx = None
    for i in range(len(lines) - 1, -1, -1):
        stripped = lines[i].strip()
        if stripped in ("</div>", "</>", "</section>", "</main>"):
            insert_idx = i
            break
        if stripped.startswith("return"):
            break
    if insert_idx:
        indent = "      "
        btn_line = f'{indent}<ProductTutorialButton tutorialId="{tutorial_id}" productName="{product_name}" />'
        lines.insert(insert_idx, btn_line)
        return "\n".join(lines), True
    return content, False


def add_data_tutorial_attrs(content, attrs):
    """Add data-tutorial attributes to relevant elements in the page"""
    added = []
    for attr in attrs:
        if f'data-tutorial="{attr}"' in content:
            continue

        suffix = attr.split("-")[-1]

        if suffix == "hero" or attr.endswith("-hero"):
            # Add to the first main container after return (
            match = re.search(
                r'(return\s*\(\s*(?:<>\s*)?<(?:div|main|section|article)\b)([^>]*)(>)',
                content,
            )
            if match:
                # Check if data-tutorial already on this element
                if "data-tutorial" not in match.group(2):
                    pos = match.end(1)
                    content = content[:pos] + f' data-tutorial="{attr}"' + content[pos:]
                    added.append(attr)
                    continue
            # Try first h1
            match = re.search(r'(<h1\b)([^>]*)(>)', content)
            if match and "data-tutorial" not in match.group(2):
                pos = match.end(1)
                content = content[:pos] + f' data-tutorial="{attr}"' + content[pos:]
                added.append(attr)
                continue

        # For non-hero: try to find a section heading or element matching the suffix
        # Use common keyword patterns
        kw_map = {
            "pricing": r"pric",
            "services": r"service",
            "scope": r"scope|assessment",
            "features": r"feature|capabilit",
            "tabs": r"tab",
            "search": r"search|query",
            "filter": r"filter",
            "upload": r"upload|drag|file",
            "select": r"select|type.*select|dropdown",
            "scale": r"grade|scale|score",
            "defects": r"defect|condition",
            "overview": r"overview|summary",
            "intake": r"intake|client.*info",
            "upload": r"upload|document",
            "categories": r"categor|income",
            "deductions": r"deduct",
            "county": r"county|counties",
            "chain": r"chain|result",
            "mode": r"mode|consult",
            "chat": r"chat|message|input.*area",
            "stages": r"stage|phase|pipeline",
            "guilds": r"guild|specialist",
            "demo": r"demo|try|simulator",
            "widget": r"voice|widget|convai",
            "capabilities": r"capabilit|feature",
            "roi": r"roi|calculator|saving",
            "domain": r"domain|card",
            "query": r"query|ask|try",
            "materials": r"material",
            "calculator": r"calculat",
            "primitives": r"primitiv|shape",
            "service": r"service",
            "tier": r"tier|plan",
            "interview": r"interview|record",
            "voice": r"voice|speak",
            "memories": r"memor|recall",
            "code": r"code|api|example",
            "category": r"categor",
            "template": r"template|starter",
            "process": r"process|how.*work",
            "text": r"textarea|text.*input",
            "sliders": r"slider|range",
            "generate": r"generat|create|synth",
            "btn": r"button.*search|search.*btn|submit",
            "fields": r"field|input.*search",
            "filters": r"filter",
        }

        # Extract the keyword part from the attr name
        parts = attr.replace("-", "_").split("_")
        # Try the last meaningful part
        for part in reversed(parts):
            if part in kw_map:
                kw = kw_map[part]
                break
        else:
            kw = None

        if kw:
            # Find a section heading (h2, h3) containing this keyword
            pattern = rf"(<(?:h[2-4]|div)\b)([^>]*)(>[^<]*?{kw})"
            match = re.search(pattern, content, re.IGNORECASE)
            if match and "data-tutorial" not in match.group(2):
                pos = match.end(1)
                content = content[:pos] + f' data-tutorial="{attr}"' + content[pos:]
                added.append(attr)
                continue

            # Try finding a section/div with a comment or id containing the keyword
            pattern = rf"(<(?:section|div)\b)([^>]*)(>[^{{}}]*?{kw})"
            match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
            if match and "data-tutorial" not in match.group(2):
                pos = match.end(1)
                content = content[:pos] + f' data-tutorial="{attr}"' + content[pos:]
                added.append(attr)
                continue

        # Fallback: just add to an appropriate Nth section/div
        # Count existing data-tutorial attrs to determine which section to target
        existing_count = len(re.findall(r'data-tutorial="', content))
        # Find the Nth major div/section after the hero
        all_sections = list(re.finditer(r"(<(?:section|div)\b)([^>]*?)(\s+(?:style|className)=)", content))
        target_idx = existing_count + 1  # Skip hero (index 0)
        if target_idx < len(all_sections):
            match = all_sections[target_idx]
            if "data-tutorial" not in match.group(2):
                pos = match.end(1)
                content = content[:pos] + f' data-tutorial="{attr}"' + content[pos:]
                added.append(attr)
                continue

        print(f"    WARN: Could not auto-place {attr}")

    return content, added


def process_page(page_dir, attrs, tutorial_id=None, product_name=None):
    """Process a single page"""
    filepath = os.path.join(BASE, page_dir, "page.tsx")
    if not os.path.exists(filepath):
        print(f"  SKIP: {filepath} not found")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    changes = []

    # Add import if needed
    if tutorial_id:
        content, did_import = add_import_if_missing(content)
        if did_import:
            changes.append("import")

    # Add data-tutorial attributes
    content, added_attrs = add_data_tutorial_attrs(content, attrs)
    if added_attrs:
        changes.append(f"attrs({len(added_attrs)})")

    # Add button component if needed
    if tutorial_id:
        content, did_btn = add_button_component(content, tutorial_id, product_name)
        if did_btn:
            changes.append("button")

    if changes:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  OK: {page_dir} [{', '.join(changes)}]")
    else:
        print(f"  NO CHANGES: {page_dir}")


# Run
print("=== Pages needing button + attributes ===")
for page_dir, config in NEED_BUTTON_AND_ATTRS.items():
    print(f"\n{page_dir}:")
    process_page(page_dir, config["attrs"], config["tutorialId"], config["productName"])

print("\n=== Pages needing only attributes ===")
for page_dir, attrs in NEED_ATTRS_ONLY.items():
    print(f"\n{page_dir}:")
    process_page(page_dir, attrs)

print("\nDone!")

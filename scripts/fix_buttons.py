import re, os

BASE = "O:/ECHO_OMEGA_PRIME/WEBSITES/echo-prime-tech/app"

# Pages that have the import but missing the component JSX
MISSING_BTN = {
    "engines": ("engines", "Intelligence Engines"),
    "county-records": ("county-records", "County Records"),
    "echocad": ("echocad", "EchoCAD"),
    "ecommerce": ("ecommerce", "Ecommerce Store"),
    "immortality-vault": ("immortality-vault", "Immortality Vault"),
    "orchestration": ("orchestration", "Orchestration"),
    "reddit": ("reddit", "Reddit Intelligence"),
    "voice": ("voice", "Voice Studio"),
    "websites": ("websites", "Website Builder"),
    "sec-intel": ("sec-intel", "Security Intelligence"),
    "county-records": ("county-records", "County Records"),
}

for page_dir, (tid, pname) in MISSING_BTN.items():
    filepath = os.path.join(BASE, page_dir, "page.tsx")
    if not os.path.exists(filepath):
        print(f"SKIP: {filepath}")
        continue

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Skip if already has the component
    if f'tutorialId="{tid}"' in content:
        print(f"ALREADY HAS: {page_dir}")
        continue

    # Strategy: find the last </div> or </section> before the closing );} pattern
    # Look for the pattern: closing tag + newline + spaces + ); + newline + }
    # We want to insert before the last major closing tag

    # Find all return ( ... ); blocks and their closing
    # Simple approach: find the last occurrence of "    </div>\n  );\n}" and insert before it

    patterns_to_try = [
        # Pattern: footer then closing div
        (r"(      </footer>\n    </div>\n  \);\n})",
         lambda m: f"      </footer>\n      <ProductTutorialButton tutorialId=\"{tid}\" productName=\"{pname}\" />\n    </div>\n  );\n}}"),
        # Pattern: section then closing div
        (r"(      </section>\n    </div>\n  \);\n})",
         lambda m: f"      </section>\n      <ProductTutorialButton tutorialId=\"{tid}\" productName=\"{pname}\" />\n    </div>\n  );\n}}"),
        # Pattern: just closing div before );
        (r"(    </div>\n  \);\n})",
         lambda m: f"      <ProductTutorialButton tutorialId=\"{tid}\" productName=\"{pname}\" />\n    </div>\n  );\n}}"),
    ]

    done = False
    for pattern, replacement in patterns_to_try:
        matches = list(re.finditer(pattern, content))
        if matches:
            # Use the LAST match (main component return, not sub-components)
            last_match = matches[-1]
            new_text = replacement(last_match)
            content = content[:last_match.start()] + new_text + content[last_match.end():]
            done = True
            break

    if not done:
        # Fallback: find the last ); and insert before its preceding closing tag
        lines = content.split("\n")
        for i in range(len(lines) - 1, -1, -1):
            stripped = lines[i].strip()
            if stripped in ("</div>", "</section>", "</main>", "</>"):
                indent = " " * (len(lines[i]) - len(lines[i].lstrip()))
                btn = f'{indent}<ProductTutorialButton tutorialId="{tid}" productName="{pname}" />'
                lines.insert(i, btn)
                content = "\n".join(lines)
                done = True
                break

    if done:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"FIXED: {page_dir}")
    else:
        print(f"FAILED: {page_dir}")

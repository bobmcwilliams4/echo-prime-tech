import pathlib

p = pathlib.Path('app/blog/blog-data.ts')
text = p.read_text(encoding='utf-8')
lines = text.split('\n')

BT = chr(96)  # backtick character
BS = chr(92)  # backslash character

# Line 10530 (idx 10529): "content: \`" -> "content: `"
old = lines[10529]
lines[10529] = old.replace('content: ' + BS + BT, 'content: ' + BT)
print(f"10530: {repr(old[:50])} -> {repr(lines[10529][:50])}")

# Line 10640 (idx 10639): fix double backtick from bad sed + trailing \`
old = lines[10639]
# First fix the ]` inserted by bad sed
line = old.replace(']' + BT + '(', '](')
# Then fix trailing \`
line = line.replace(BS + BT, BT)
lines[10639] = line
print(f"10640: {repr(old[:80])} -> {repr(lines[10639][:80])}")

# Line 10651 (idx 10650): "content: \`" -> "content: `"
old = lines[10650]
lines[10650] = old.replace('content: ' + BS + BT, 'content: ' + BT)
print(f"10651: {repr(old[:50])} -> {repr(lines[10650][:50])}")

# Line 10804 (idx 10803): trailing \` -> `
old = lines[10803]
lines[10803] = old.replace(BS + BT, BT)
print(f"10804: {repr(old[:80])} -> {repr(lines[10803][:80])}")

p.write_text('\n'.join(lines), encoding='utf-8')
print("\nAll fixes applied.")

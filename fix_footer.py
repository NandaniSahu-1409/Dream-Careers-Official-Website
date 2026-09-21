import os, re

base = r'c:\Users\nanda\Dream-Careers\DC-website'

# ─── Canonical footer CSS block ──────────────────────────────────────────────

NEW_FOOTER_CSS = """
/* =========================================================
   FOOTER
========================================================= */

.footer {
    width: 100%;
    background: #fff;
    padding: 50px 0 40px;
    border-top: 1px solid #e5e7eb;
    font-family: 'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
}

.footer-container {
    width: 90%;
    max-width: 1300px;
    margin: auto;
    display: grid;
    grid-template-columns: 2.4fr 1fr 1fr 1fr 1fr;
    gap: 40px;
    align-items: start;
}

.footer-about img {
    width: 210px;
    margin-bottom: 16px;
    display: block;
}

.footer-about p {
    max-width: 340px;
    margin-bottom: 16px;
    color: #64748b;
    font-size: 13.5px;
    line-height: 1.6;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-bottom: 10px;
}

.contact-item i {
    width: 14px;
    flex-shrink: 0;
    margin-top: 3px;
    color: #2563eb;
    font-size: 13px;
    text-align: center;
}

.contact-item span {
    color: #475569;
    font-size: 13px;
    line-height: 1.55;
}

.contact-item strong {
    color: #1e293b;
    font-weight: 600;
}

.footer-links h3 {
    margin-bottom: 14px;
    color: #1e293b;
    font-size: 14.5px;
    font-weight: 700;
}

.footer-links a {
    display: block;
    text-decoration: none;
    color: #64748b;
    font-size: 13px;
    margin-bottom: 10px;
    transition: color 0.2s ease;
}

.footer-links a:hover {
    color: #2563eb;
}

/* Courses column — all links blue */
.footer-links.courses-col a {
    color: #2563eb;
}

.footer-links.courses-col a:hover {
    color: #1048b3;
}

/* Services column — Career Guidance (first link) blue */
.footer-links.services-col a:first-of-type {
    color: #2563eb;
}

/* Company column — Testimonials (last link) blue */
.footer-links.company-col a:last-of-type {
    color: #2563eb;
}

/* Footer responsive */
@media (max-width: 1100px) {
    .footer-container {
        grid-template-columns: 2fr 1fr 1fr;
        gap: 28px;
    }
    .footer-about {
        grid-column: 1 / -1;
    }
}

@media (max-width: 640px) {
    .footer-container {
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }
    .footer-about {
        grid-column: 1 / -1;
    }
}

@media (max-width: 400px) {
    .footer-container {
        grid-template-columns: 1fr;
    }
}
"""

# ─── CSS files to update ─────────────────────────────────────────────────────

css_files = {
    'style1.CSS': {
        'start_marker': '\n.footer {',
        'end_marker': '.footer-links.courses-col a:hover {\n    color: #1048b3;\n}',
    },
    'about.css': {
        'start_marker': '\n/* =====================================================\n   FOOTER\n   ===================================================== */',
        'end_marker': None,  # handled separately
    },
    'style4.css': {
        'start_marker': '\n/* =====================================================\n   FOOTER\n   ===================================================== */',
        'end_marker': None,
    },
}

# ── style1.CSS — replace between .footer { ... } and end of courses-col block
path = os.path.join(base, 'style1.CSS')
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Find the footer block start and end
start = c.find('\n.footer {')
end_marker = '.footer-links.courses-col a:hover {\n    color: #1048b3;\n}'
end = c.find(end_marker)
if start != -1 and end != -1:
    end += len(end_marker)
    c = c[:start] + NEW_FOOTER_CSS + c[end:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated: style1.CSS')
else:
    print('WARN: style1.CSS footer block not found (start=%d, end=%d)' % (start, end))

# ── about.css and style4.css — replace the /* FOOTER */ comment block through
#    the last responsive footer rule
for fname in ('about.css', 'style4.css'):
    path = os.path.join(base, fname)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    # Locate the footer section header comment
    marker = '/* =====================================================\n   FOOTER\n   ===================================================== */'
    start = c.find(marker)
    if start == -1:
        print('WARN: footer marker not found in ' + fname)
        continue

    # Find end: last @media block for footer (400px one) closing brace
    end_marker = '@media (max-width: 400px) {\n    .footer-container {\n        grid-template-columns: 1fr;\n    }\n}'
    end = c.find(end_marker, start)
    if end != -1:
        end += len(end_marker)
    else:
        # fallback: just replace up to next major section
        # find the next /* === */ comment after footer start
        next_section = c.find('/* =====', start + 50)
        end = next_section if next_section != -1 else len(c)

    c = c[:start] + NEW_FOOTER_CSS.lstrip('\n') + c[end:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated: ' + fname)

# ─── HTML files — add company-col and services-col classes ──────────────────

pages = [
    'index.html',
    'about.html',
    'services.html',
    'engineering.html',
    'medical.html',
    'pharmacy.html',
    'bsc nursing.html',
    'law-management.html',
    'mbbs abroad.html',
    'studyabroad.html',
    'testimonials.html',
    'contact.html',
    'free counseling.html',
    'paid counseling.html',
]

for page in pages:
    path = os.path.join(base, page)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    original = c

    # Company column: <!-- Company --> ... <div class="footer-links">
    c = c.replace(
        '<!-- Company -->\n\n            <div class="footer-links">',
        '<!-- Company -->\n\n            <div class="footer-links company-col">'
    )

    # Services column: <!-- Services --> ... <div class="footer-links">
    c = c.replace(
        '<!-- Services -->\n\n            <div class="footer-links">',
        '<!-- Services -->\n\n            <div class="footer-links services-col">'
    )

    if c != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print('Updated HTML: ' + page)
    else:
        print('No HTML change: ' + page)

print('Done.')

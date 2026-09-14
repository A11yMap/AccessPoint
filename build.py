#!/usr/bin/env python3
"""Bundle the app into ONE self-contained .html file you can publish anywhere.

Inlines styles.css and every js/ module into a single inline <script type="module">,
so the result works from a web host, a static file server, or by double-clicking.
Leaflet and the display font still come from a CDN, and map tiles come from
OpenStreetMap, so the page needs an internet connection (any map would).

    python3 build.py           ->  accessibility-map.html
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / 'accessibility-map.html'

# Dependency order: a module may only rely on ones above it.
MODULES = [
    'js/config.js',
    'js/data/needs.js',
    'js/data/attributes.js',
    'js/data/venues.js',
    'js/data/reviews.js',
    'js/scoring.js',
    'js/store.js',
    'js/map.js',
    'js/views.js',
    'js/app.js',
]

IMPORT_RE = re.compile(r'^import\s+(?:.|\n)*?from\s+[\'"][^\'"]+[\'"];\s*$', re.M)
NAMESPACE_RE = re.compile(r'^import\s+\*\s+as\s+(\w+)\s+from\s+[\'"]\./([\w/.]+)[\'"];', re.M)
EXPORT_NAME_RE = re.compile(r'^export\s+(?:async\s+)?(?:const|let|var|function|class)\s+(\w+)', re.M)


def bundle():
    namespaces = {}          # module filename -> alias used elsewhere
    sources, exports_by_mod = {}, {}

    for rel in MODULES:
        src = (ROOT / rel).read_text()
        for alias, target in NAMESPACE_RE.findall(src):
            namespaces[target.split('/')[-1]] = alias
        exports_by_mod[rel] = EXPORT_NAME_RE.findall(src)
        sources[rel] = src

    # Guard against two modules declaring the same top-level name.
    seen = {}
    for rel, names in exports_by_mod.items():
        for n in names:
            if n in seen:
                sys.exit(f'ERROR: "{n}" is exported by both {seen[n]} and {rel}. '
                         'Rename one before bundling.')
            seen[n] = rel

    chunks = []
    for rel in MODULES:
        body = IMPORT_RE.sub('', sources[rel])
        body = re.sub(r'^export\s+(?=(?:async\s+)?(?:const|let|var|function|class)\b)', '', body, flags=re.M)
        chunks.append(f'// ===== {rel} ' + '=' * max(0, 62 - len(rel)) + f'\n{body.strip()}\n')

        alias = namespaces.get(rel.split('/')[-1])
        if alias:
            fields = ', '.join(exports_by_mod[rel])
            chunks.append(f'// `import * as {alias}` becomes a plain namespace object.\n'
                          f'const {alias} = {{ {fields} }};\n')

    return '\n'.join(chunks)


def main():
    html = (ROOT / 'index.html').read_text()
    css = (ROOT / 'styles.css').read_text()

    body = re.search(r'<body>(.*)</body>', html, re.S).group(1)
    body = re.sub(r'\s*<script type="module".*?</script>', '', body, flags=re.S)
    head = re.search(r'<head>(.*)</head>', html, re.S).group(1)
    head = head.replace('<link rel="stylesheet" href="styles.css">', '')

    out = (
        '<!doctype html>\n<html lang="en">\n<head>'
        + head.rstrip()
        + '\n  <style>\n' + css.strip() + '\n  </style>\n</head>\n<body>'
        + body.rstrip()
        + '\n\n<script type="module">\n' + bundle() + '</script>\n</body>\n</html>\n'
    )
    OUT.write_text(out)
    print(f'wrote {OUT.name}  ({len(out):,} bytes)')


if __name__ == '__main__':
    main()

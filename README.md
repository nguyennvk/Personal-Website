# Personal Website — Khoi Nguyen

My software engineering portfolio: experience, case studies, projects, and skills on a single page.

Plain HTML, CSS, and JavaScript. No framework, no build step, no dependencies.

```
index.html   all content (every section is plain HTML)
styles.css   design tokens, layout, components, responsive rules
script.js    nav, scroll-spy, reveal animations, project filters,
             case-study tabs, command palette, copy-email
```

## Features

- **Sticky nav with scroll-spy:** highlights the current section and collapses to a menu on mobile.
- **Experience timeline:** extra detail is tucked behind a "More details" toggle.
- **Deep dives:** case studies in tabs, each with the problem, key decisions, results, and a step-by-step flow diagram.
- **Filterable projects:** All, Full-stack, Data, Systems, AI/ML.
- **Command palette:** press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> or <kbd>/</kbd> to jump to any section, case study, or link.
- **SEO:** link-preview tags, a JSON-LD `Person` schema, and an inline SVG favicon.
- **Accessible:** keyboard navigable, visible focus rings, ARIA tabs and listbox, respects `prefers-reduced-motion`.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Editing content

All text lives in `index.html`. Sections are marked with comments such as `<!-- PROJECTS -->`.

### Add a project

Copy any `<li class="project reveal">` block inside `#project-grid` and change the text. The `data-cat` attribute controls which filters show the card. Use one or more of `fullstack`, `data`, `systems`, `ai`, separated by spaces:

```html
<li class="project reveal" data-cat="fullstack ai">
  <div class="project-top">
    <svg class="icon project-icon" aria-hidden="true"><use href="#i-code"/></svg>
    <span class="project-kind">Web App</span>
  </div>
  <h3>Project name</h3>
  <p>One or two sentences on what it does and how.</p>
  <p class="project-metric"><strong>~80%</strong> faster runtime</p>  <!-- optional -->
  <ul class="tags"><li>React</li><li>Node.js</li></ul>
</li>
```

To add a filter, add a `<button class="chip" data-filter="newcat" aria-pressed="false">` to `.filters`. The script picks it up automatically.

### Add an experience entry

Copy a `<li class="job reveal">` block in the `.timeline` list. Wrap numbers in `<span class="metric">…</span>` to highlight them. Put secondary bullets inside the `<details class="more">` block.

### Add a case study

1. Add a `<button class="tab" role="tab" id="tab-x" aria-controls="panel-x" aria-selected="false" tabindex="-1">` to `.tabs`.
2. Add a matching `<div class="tab-panel" role="tabpanel" id="panel-x" aria-labelledby="tab-x" tabindex="0" hidden>`. Copy an existing panel for the structure.
3. Optionally add an entry to the `commands` array in `script.js` so it appears in the command palette.

### Hero stats

The numbers count up when they scroll into view. Set `data-count` (the target number) and `data-suffix` (for example `+`) on the `<dd>`, and keep the same final value as its text so it still shows correctly without JavaScript.

### Icons

Icons are an inline SVG sprite at the top of `index.html`. Use one with:

```html
<svg class="icon" aria-hidden="true"><use href="#i-github"/></svg>
```

Available icons: `github`, `linkedin`, `mail`, `pin`, `arrow`, `chevron`, `menu`, `close`, `copy`, `code`, `db`, `phone`, `cpu`, `brain`, `cloud`, `check`, `search`, `up`, `hash`, `ext`, `cap`. Each is referenced as `#i-<name>`, for example `#i-github`.

## Changing the look

Every color, font, and size comes from the `:root` block at the top of `styles.css`:

| Variable | Purpose |
|---|---|
| `--bg`, `--card`, `--muted` | Background layers |
| `--fg`, `--fg-soft`, `--fg-muted` | Text colors |
| `--accent` | Highlight color (buttons, links, metrics) |
| `--font-head`, `--font-body` | JetBrains Mono / IBM Plex Sans |
| `--max` | Content width |

Fonts load from Google Fonts through the `<link>` in `index.html`. If you change fonts, update that URL and the two font variables together.

## Deploy

**GitHub Pages:** in the repo, go to **Settings → Pages → Source: Deploy from a branch → `main` / root**. The site is served at `https://nguyennvk.github.io/Personal-Website/`.
To serve it at `https://nguyennvk.github.io` instead, rename the repo to `nguyennvk.github.io`.

**Netlify / Vercel:** import the repo or drag the folder in. No build settings are needed.

## Accessibility notes

Keep these intact when editing:

- `prefers-reduced-motion` disables animations, count-ups, and smooth scrolling.
- Focus outlines are visible on every interactive element.
- The tabs follow the WAI-ARIA tabs pattern (arrow keys, Home/End).
- The layout works down to about 320px wide, with touch targets of at least 44px.

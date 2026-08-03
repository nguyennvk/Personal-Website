# Personal site

Three files, no build step, no dependencies. Edit, save, refresh.

```
index.html   all the words
style.css    all the colours and layout
main.js      project filter
```

## Run it

Double-click `index.html`. That's it.

If you'd rather serve it properly (needed for some browser features):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Before you publish

Double-check the date ranges in the Experience section — they're estimates,
marked with `EDIT:` in `index.html`.

## Add a project

Open `index.html`, find the projects section, copy any `<article class="card">`
block and change the text. There's a blank template commented out at the bottom
of the list.

The `data-tags` attribute decides which filter buttons show the card. Use one or
more of `data`, `quant`, `ai`, `web`, separated by spaces:

```html
<article class="card" id="p-yourthing" data-tags="data quant">
```

Give it a unique `id`, then add a matching row to the index panel in the hero so
it stays in sync:

```html
<a href="#p-yourthing"><span class="n">Project name</span><span class="t">Stack</span></a>
```

To add a new filter category, add a button to the `.filters` group with a
matching `data-filter` value — the JavaScript picks it up automatically.

## Change the look

Everything visual comes from the `:root` block at the top of `style.css`.
Swap `--accent` for a different highlight colour, or `--bg` for a lighter
background, and the whole page follows.

Fonts load from Google Fonts via the `<link>` in `index.html`. Change the URL
and the three `--display` / `--body` / `--mono` variables together.

## Deploy to GitHub Pages

```bash
git remote add origin git@github.com:nguyennvk/nguyennvk.github.io.git
git branch -M main
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → main / (root)**.

Naming the repo `nguyennvk.github.io` gets you `https://nguyennvk.github.io`.
Any other name gets you `https://nguyennvk.github.io/repo-name`.

Netlify and Vercel both work too — drag the folder onto their dashboard, no
config needed, since there's nothing to build.

## Accessibility notes

Kept deliberately, so don't undo them by accident:

- `prefers-reduced-motion` stops all animation and smooth scrolling
- Focus outlines are visible on every link and button
- The layout works down to roughly 320px wide

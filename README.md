# spontraveous

A splash page for "spontraveous" — visitors guess what the word means, and
whoever gets close enough gets founding-member perks. Waitlist signups
(guessers and non-guessers alike) go into Brevo.

Stack: React 18 + Vite 5 + Tailwind + Framer Motion, deployed as a single
Cloudflare Worker (static assets + a small API route), so there's no
separate backend to host.

## 1. Install

```bash
npm install
```

## 2. Run locally

```bash
npm run dev
```

The `/api/subscribe` route only exists in the deployed Worker, so during
local `vite dev` the waitlist form will hit a 404 — that's expected. To test
the full flow locally, build and run it through Wrangler instead:

```bash
npm run build
npx wrangler dev
```

## 3. Connect Brevo

1. In Brevo, create (or pick) the list you want signups to land in, and note
   its numeric **List ID** (Contacts → Lists).
2. Grab an API key from Brevo under SMTP & API → API Keys.
3. Set both as Worker secrets (never commit these):

   ```bash
   npx wrangler secret put BREVO_API_KEY
   npx wrangler secret put BREVO_LIST_ID
   ```

The Worker (`worker/index.js`) calls Brevo's `/v3/contacts` endpoint
server-side, so the API key never reaches the browser. Each signup is
tagged with the visitor's guess and whether it was correct
(`GUESS`, `GUESSED_CORRECTLY` contact attributes) — create those two custom
attributes in Brevo (Contacts → Settings → Contact attributes) if you want
to filter/segment on them, or drop them from `worker/index.js` if you don't.

## 4. Deploy to Cloudflare Workers

```bash
npx wrangler login   # first time only
npm run deploy       # builds the app, then runs `wrangler deploy`
```

Wrangler will print the `*.workers.dev` URL. To use a custom domain, add a
route or custom domain to the Worker from the Cloudflare dashboard, or in
`wrangler.toml`.

### Deploying from a git repo instead

If you'd rather have Cloudflare build on push: push this repo to
GitHub/GitLab, then in the Cloudflare dashboard go to Workers & Pages →
Create → connect the repo. Set the build command to `npm run build` and the
deploy command to `npx wrangler deploy`, and add `BREVO_API_KEY` /
`BREVO_LIST_ID` as encrypted environment variables in the project settings.

## Adjusting the guessing game

The definition, the check for what counts as "correct," and the progressive
hints all live in `src/components/GuessPanel.jsx`. Right now a guess is
marked correct if it contains both a "spontaneous"-flavored word and a
"travel"-flavored word (see `SPONTANEOUS_WORDS` / `TRAVEL_WORDS`) — loosen
or tighten those lists to make the game easier or harder.

## SEO / LLMO (making sure it isn't read as a typo for "spontaneous")

Before deploying, replace the placeholder domain `https://spontraveous.com`
with your real one — it's used in `index.html` (canonical link, Open Graph
tags, JSON-LD `@id`/`url` fields) and in `public/robots.txt` and
`public/sitemap.xml`. A quick way to find every occurrence:

```bash
grep -rl "spontraveous.com" .
```

What's in place, and why:

- **Explicit disambiguation, in three places at once** — the `<title>`,
  meta description, hero subhead, and a visible FAQ section
  (`src/components/Disambiguation.jsx`) all state plainly that
  "spontraveous" is a coined word, not a misspelling of "spontaneous."
  Repetition across visible copy is what actually shifts how both search
  engines and LLMs represent an unfamiliar word — a single hidden tag
  won't do it.
- **Matching JSON-LD structured data** — `index.html` has `DefinedTerm` and
  `FAQPage` schema (`@type: DefinedTerm`, `@type: FAQPage`) with the exact
  same question ("Is spontraveous a misspelling of spontaneous?") and
  answer as the visible FAQ. Search and LLM crawlers check that structured
  data matches on-page content, so keep these two in sync if you edit
  either one. `DefinedTerm` in particular exists for exactly this
  case — telling machines "this is a specific term with this specific
  meaning," rather than leaving them to infer one.
- **A no-JS fallback** — the `<noscript>` block in `index.html` repeats the
  core definition and disambiguation as plain text, so bots that don't
  execute JavaScript (some AI crawlers still don't) see the same message
  as a browser would.
- **`robots.txt`** explicitly allows major AI/answer-engine crawlers
  (GPTBot, Google-Extended, ClaudeBot, PerplexityBot, and others) in
  addition to standard search bots, since LLMO depends on those crawlers
  being able to fetch the page at all.
- **Open Graph / Twitter cards + `public/og-image.png`** so links shared in
  Slack, X, iMessage, etc. show the real word and definition instead of a
  blank preview — another signal that reinforces the correct spelling
  wherever the link travels.
- **`sitemap.xml`** for the single page, referenced from `robots.txt`.

None of this guarantees any specific engine won't autocorrect the word on
its own — that's outside what a page's own markup can control — but it
gives search engines and LLMs the clearest possible signal that
"spontraveous" is intentional and has its own meaning.

## Logo & favicon

The mark is a tilted two-tone compass needle inside a perforated ring — the
same postmark/stamp motif used for the guess card elsewhere on the page —
in the site's green/purple palette.

- `public/logo-mark.svg` / `public/favicon.svg` — the vector source (same
  file, two names so both a "logo" and a "favicon" reference resolve).
  Edit this if you want to tweak the mark; the raster files below were
  generated from the same shapes, not from this SVG file directly, so
  regenerate them by hand (or with a tool like `resvg`/Inkscape) if you
  change it.
- `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png` —
  browser tab icons (the two smallest drop the perforation ring, since it
  just turns to noise at that size).
- `apple-touch-icon.png` (180×180) — iOS home-screen icon.
- `icon-192.png` / `icon-512.png` + `site.webmanifest` — Android/PWA icons.
- `logo-mark.png` (1024×1024) — full-resolution raster for anywhere else
  you need it (app store listing, print, etc).
- On the page itself, `src/components/Header.jsx` renders the SVG mark plus
  the wordmark, pinned over the hero.

## Project structure

```
public/
  robots.txt         allows standard + AI/LLM crawlers
  sitemap.xml
  og-image.png        social preview image
src/
  components/
    Hero.jsx           hero + animated aurora background
    GuessPanel.jsx      the guessing game and reveal
    Disambiguation.jsx  visible FAQ, mirrors the JSON-LD in index.html
    Waitlist.jsx        email capture, posts to /api/subscribe
    Footer.jsx
  App.jsx
  index.css
index.html             meta tags, Open Graph, JSON-LD, noscript fallback
worker/
  index.js             serves the built app + /api/subscribe → Brevo
wrangler.toml
```

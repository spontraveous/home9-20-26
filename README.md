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

## Project structure

```
src/
  components/
    Hero.jsx        hero + animated dawn-sky background
    GuessPanel.jsx   the guessing game and reveal
    Waitlist.jsx     email capture, posts to /api/subscribe
    Footer.jsx
  App.jsx
  index.css
worker/
  index.js           serves the built app + /api/subscribe → Brevo
wrangler.toml
```

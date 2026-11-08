# TOEFL ITP Prep

A phone-first, offline web app for a 12-week TOEFL ITP plan: grammar (Structure & Written Expression), Academic Word List vocabulary, timed practice, and weekly mock tests with an estimated score.

- Progress is stored **only on your device** (IndexedDB). Use **Settings → Export backup** regularly.
- Works offline after the first visit. No account, no server, no API keys.

## Develop

```bash
npm install
npm run dev -- --host   # open the printed Network URL on your phone (same Wi-Fi)
npm test                # unit + UI tests
npm run build           # production build in dist/
```

## Deploy (free)

The build is a static site; any static host works. The app uses relative paths, so it also works in a sub-folder.

**Live site (GitHub Pages, automatic):** https://songkhun.github.io/toefl-itp-prep/

Every push to `main` runs the tests, builds the app and publishes it (`.github/workflows/deploy.yml`). Progress is the action's run in the repository's **Actions** tab. An installed app picks up the new version the next time it is opened online.

**Alternative: Netlify Drop**
1. `npm run build`
2. Go to https://app.netlify.com/drop and drag the `dist` folder onto the page.
3. Open the URL it gives you on your phone.

## Install on your phone

- **iPhone (Safari):** open the URL → Share button → **Add to Home Screen**.
- **Android (Chrome):** open the URL → ⋮ menu → **Install app** (or *Add to Home screen*).

Open it once while online; after that it works without internet.

## Daily reminders

Settings → **Add reminders to calendar** downloads a calendar file with daily events at 07:00 and 16:30. Open it on your phone to add it to your calendar.

## Content

- `src/content/questions/Pxx.json` — drill items per grammar pattern
- `src/content/mocks/formN.json` — mock tests (40 items each; never used in drills)
- `src/content/lessons/Pxx.md` — lesson text
- `src/content/awl/words.json` — vocabulary
- `src/generator/` — the free "New set" generator (templates per pattern)

`npm test` validates all content (answer keys in range, one blank per Structure item, four underlined parts per Written Expression item, mock/drill separation, and more).

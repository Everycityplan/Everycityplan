# Every City Plan – Secure plan viewer

A simple static prototype for the Every City Plan website. Travelers sign in to a secure viewer to browse time-limited city itineraries without downloading or printing them.

## Features
- **Login gate** with demo credentials (`traveler@everycityplan.com` / `demo123`).
- **Secure viewing controls**: watermarking, disabled copy/print shortcuts, and blocked context menu.
- **Timed sessions**: automatic expiration with a one-click reactivation button.
- **City selector** for New York, Paris, and Tokyo sample plans.

## Usage
1. Open `index.html` in a browser.
2. Sign in with the demo credentials above (or any non-empty email/password for exploration).
3. Browse the plan; note that downloads, copy shortcuts, and printing are blocked and the session counts down.

## Notes
- The anti-download and anti-screenshot measures are deterrents; no web app can fully prevent screen capture.
- Extend the `plans` object in `script.js` to add real itineraries and city-specific tips.

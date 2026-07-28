# JixeGo Live Project Guide

## Architecture

This is a dependency-free static site. Each route is a standalone HTML file, while navigation, footer, player modal, API rendering, and interactions are shared through JavaScript.

## Key Directories

- `assets/css/styles.css`: complete design system, responsive layouts, animations, skeletons, and component styles.
- `assets/js/config.js`: the only user-editable integration configuration; contains the YouTube API key and fixed channel handle.
- `assets/js/youtube.js`: YouTube Data API client, normalization, Shorts classification, statistics, and local cache.
- `assets/js/app.js`: shared site chrome, page rendering, search, category filters, player modal, and PWA registration.
- `assets/icons/`: brand artwork, favicon, social card, and PWA icons.

## Conventions

- Use semantic HTML and preserve per-page metadata.
- Keep the project framework-free and avoid adding a build step.
- Reuse CSS custom properties and existing card/button patterns.
- Escape API-derived text before inserting HTML.
- Keep all YouTube API requests in `youtube.js` and all DOM rendering in `app.js`.
- Maintain keyboard focus states, reduced-motion support, alt text, and accessible labels.

## Non-Obvious Decisions

YouTube does not expose a dedicated low-cost uploads playlist for Shorts. The site classifies public videos up to 180 seconds as Shorts, matching the current maximum Shorts duration. The API key is necessarily browser-visible because the requested architecture has no backend, so deployment depends on Google Cloud referrer restrictions.

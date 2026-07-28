# JixeGo Live Website

A premium, mobile-first static website for the JixeGo Live YouTube channel. The site uses YouTube Data API v3 in the browser to load the channel logo, banner, public statistics, latest videos, Shorts, and popular recent uploads automatically.

## Technology

- Semantic HTML5
- Modern CSS3 with responsive layouts and motion preferences
- Vanilla JavaScript
- YouTube Data API v3
- Progressive Web App manifest and service worker
- Netlify static hosting configuration

## Configure YouTube

1. Create a project in Google Cloud Console.
2. Enable YouTube Data API v3.
3. Create an API key and restrict it to the YouTube Data API plus the deployed website's HTTP referrer.
4. Open `assets/js/config.js` and add the key to `YOUTUBE_API_KEY`.

The channel handle is already configured as `@jixegolive`. Public channel data refreshes automatically and is cached in each visitor's browser for 15 minutes to reduce quota usage.

## Run Locally

Serve the project root with any static file server. For Netlify's local environment, use:

```bash
netlify dev --port 8889
```

Then open `http://localhost:8889`.

## Deploy

Connect the repository to Netlify. No build command is required, and the publish directory is the repository root. If the production domain changes, update canonical URLs in the HTML files, `robots.txt`, and `sitemap.xml`.

## API Key Safety

Because this is a no-backend site, the browser must receive the YouTube API key. Treat it as a public identifier and protect it with strict website referrer and API restrictions in Google Cloud Console.

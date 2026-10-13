# FitPlanet Gym

A responsive React website built with Vite, React Three Fiber, and Three.js.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview the production build:

```sh
npm run build
npm run preview
```

## Configure gym details

Edit `src/config.js` to replace the sample address, phone number, email, map link, membership prices, and image URLs. The pricing and contact sections read from this file. Replace the example coach names and testimonials in `src/main.jsx` with approved gym information before publishing. The images currently use remote Unsplash URLs.

## Deploy to Vercel

1. Push the project to a Git repository and import it from the Vercel dashboard, or install the Vercel CLI and run `vercel` from this folder.
2. Use the Vite defaults: framework preset **Vite**, build command `npm run build`, output directory `dist`, install command `npm install`.
3. Deploy. `vercel.json` includes a route rewrite for the single-page app.

There are no required environment variables. The 3D scene uses React Three Fiber and falls back to an empty canvas while its scene assets initialize; gym photography is remote and needs an internet connection to load.


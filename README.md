# Receiper

**Receiper** is a tiny single-page app that turns a title, a description, and an amount into a clean, minimalist receipt you can copy as an image and share in seconds.

🔗 Live: https://hasaneyldrm.github.io/receiper-clone/

## Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **framer-motion** — the receipt "print" spring animation + enter/exit transitions
- **lucide-react** — icons
- **html-to-image** — renders the ticket to PNG and copies it to the clipboard

Fonts: Inter (sans) + JetBrains Mono (mono), loaded from Google Fonts.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/receiper-clone/
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build
```

> `vite.config.ts` sets `base: '/receiper-clone/'` so the build works on GitHub Pages
> at `https://<user>.github.io/receiper-clone/`. If you rename the repo or move to a custom
> domain / root, update `base` accordingly.

## Deploy (GitHub Pages)

A workflow at `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

One-time setup: in **Settings → Pages → Build and deployment → Source**, select
**GitHub Actions**. After that, every push to `main` redeploys automatically.

## How it works

1. Enter a **Title**, a **Description**, and an **Amount**, then **Generate Receipt**.
2. A receipt prints in with a randomized receipt number, timestamp, and a random cashier name.
3. **Copy Image** rasterizes the receipt to PNG and writes it to your clipboard.
4. **Reset** clears the form. Nothing is stored — it's all local.

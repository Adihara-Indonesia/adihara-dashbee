# Dashbee landing page — design reference

`dashbee-landing.html` is the promotional/marketing front page design for Dashbee (built and reviewed in Claude, published as an Artifact). It's a **content fragment**, not a full document: no `<!doctype>`, `<html>`, `<head>`, or `<body>` tags — just a `<title>`, one `<style>` block, and the page markup, meant to be dropped inside a page shell.

## How to use this with Claude Code / an agent

Treat this as the visual + copy spec for a new public marketing route (e.g. `app/page.tsx` or `app/(marketing)/page.tsx`), **separate from** the existing `(dashboard)` route group, which is the authenticated app and currently owns `/`. The dashboard's root page will likely need to move (e.g. under `/app` or `/dashboard`) so this marketing page can own `/`, with its own CTAs linking to `/login`.

Porting notes:
- Fonts: Fraunces (display/headings), Inter (body/UI), IBM Plex Mono (numbers/prices/labels) — currently loaded via a Google Fonts `<link>`; swap for `next/font/google` in the real app.
- All icons/charts are inline SVG, no external assets or JS dependencies — safe to copy directly into JSX (remember `class` → `className`, self-close void elements, etc.).
- The "dashboard mockups" embedded in the hero and feature sections (Overview, Admin) are static HTML/CSS replicas of the real app screens, built to match the actual `(dashboard)/page.tsx` and `(dashboard)/admin/page.tsx` structure — not real screenshots. All sample numbers are explicitly labeled "Data contoh" and should stay that way if reused (never presented as real customer data).
- CTA buttons currently link to `mailto:adihara.solutions@adihara.com` and in-page anchors (`#fitur`, `#harga`, `#faq`, `#kontak`) — repoint the primary CTA to `/login` or a real contact flow as needed.
- Color tokens, type scale, and the honeycomb background texture are all defined in the single `<style>` block at the top — pull these into Tailwind config / CSS variables if the rest of the app should share the palette.
- Content is in Bahasa Indonesia, matching the target market (Jakarta/Jabodetabek UMKM) and existing outreach copy.

# Northshore Cadet Learning Center

Standalone GitHub Pages site for Civil Air Patrol Northshore Composite Squadron (PCR-WA-068). It is a browser-only training aid for cadets and staff, with seven short lessons, knowledge checks, local progress, glossary search, resources, dark mode, and a no-score Practice Center.

The Drill Guide at `#drill` covers falling in and the Achievement 1 and 2 practical-test command lists. `drill.js` holds the step-by-step study cues. The diagrams are schematic; current CAPP 60-33 and CAPP 60-34 and supervised instruction control.

## Local preview

```text
node server.mjs
```

Open `http://127.0.0.1:4173`.

## Updating squadron information

Edit `data.js` first. `SITE_CONFIG.leadership`, `RESOURCES`, `GLOSSARY`, and `MODULES` are intentionally centralized so leadership, official links, lesson copy, and quiz questions can be reviewed without hunting through page markup. Current CAP publications control if this training aid differs from an official source.

## GitHub Pages

The included workflow publishes the repository root with GitHub Actions. Enable Pages with **GitHub Actions** as the source in the repository settings after the first push, or use the repository's Pages API/Settings UI. The site uses hash routes, so it works on a project Pages URL without server-side rewrites.

## Accuracy note

This is not an official CAP regulation, eServices record, promotion approval, or cadet protection system. Grooming and uniform modules intentionally point to current CAPR 39-1 text and interim change letters instead of inventing measurements. Staff should review local leadership and all regulation-sensitive content before use.

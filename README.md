# Learning Cars

A personal PWA for learning how cars and motorcycles work, from pistons to CAN bus.
Vanilla JS + Vite, installable on iPhone, works on laptop. No backend, no accounts.

Live: https://kasene08.github.io/learning-cars/

## Use it
- **Install (iPhone):** open the link in Safari → Share → *Add to Home Screen*.
- **Course:** a recommended *Path* through all 4 tracks, or browse *By track*. Every lesson is open anytime.
- **Review:** spaced-repetition flashcards (FSRS), only what's due. *(Phase 2)*
- **Lab:** diagrams, Python bench, CAN bus simulator, live car link. *(Phases 3, 5, 6, 7)*
- **Backup:** *Settings → Export backup* saves everything to a JSON file; *Import backup* restores it.

## Develop
```
npm install
npm run dev      # http://localhost:5173/learning-cars/  (add ?demo for sample progress)
npm test         # unit tests
npm run build    # production build in dist/
npm run shots    # iPhone + laptop screenshots in screenshots/
npm run icons    # re-render app icons
```
Pushing to `main` runs tests, builds, and deploys to GitHub Pages
(repo Settings → Pages → Source: **GitHub Actions**).

## Layout
```
src/
  main.js, router.js          boot + hash router (#/course, #/lesson/engine-02, …)
  content/course.js           the course map: tracks, units, lessons, recommended path
  content/glossary.js         glossary terms
  core/                       db (IndexedDB), store, progress + mastery, backup, review, sw
  ui/components/              shell (rail / tab bar), sheet, meter, parts
  ui/screens/                 home, course, lesson, lab, review, glossary, progress, settings
  ui/styles/                  tokens.css (design system), base.css, app.css
tests/                        vitest
scripts/                      screenshots, icon renderer
```

## Phases
1. ✅ Setup: Vite, PWA, deploy, design system, navigation, storage, backup
2. Lesson engine, quizzes, FSRS flashcards, Engine Fundamentals (11 lessons)
3. Interactive full-car / motorcycle diagrams, exploded views
4. Rest of Tracks 1–3
5. Track 4 + Pyodide coding exercises
6. Simulated CAN bus + reverse-engineering challenges
7. Real-car connection (laptop only, read-only)

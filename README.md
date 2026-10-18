# Learning Cars

A personal PWA for learning how cars and motorcycles work, from pistons to CAN bus.
Vanilla JS + Vite, installable on iPhone, works on laptop. No backend, no accounts.

Live: https://kasene08.github.io/learning-cars/

## Use it
- **Install (iPhone):** open the link in Safari → Share → *Add to Home Screen*.
- **Course:** a recommended *Path* through all 4 tracks, or browse *By track*. Every lesson is open anytime.
- **Lessons:** 3–7 minute steps (metaphor → mechanics → interactive visual → your Bronco) and a quiz. Finishing adds flashcards.
- **Review:** spaced-repetition flashcards (FSRS), only what's due. Grade Again / Hard / Good / Easy.
- **Lab:** X-ray diagrams of the Bronco Sport and a sport bike you drill into (car → engine → head → valve), the Bronco 4x4 torque-flow simulator, and exploded views (engine, gearbox, differential, turbo, clutch, wet clutch). Python bench, CAN simulator and live car link come in Phases 5–7.
- **Backup:** *Settings → Export backup* saves everything to a JSON file; *Import backup* restores it.

## Develop
```
npm install
npm run dev      # http://localhost:5173/learning-cars/  (add ?demo for sample progress)
npm test         # unit tests
npm run build    # production build in dist/
npm run shots    # iPhone + laptop screenshots in screenshots/
npm run icons    # re-render app icons
# Visual bench: #/vis/<type>?<json>, e.g. #/vis/parts?{"drawing":"head"}
```
Pushing to `main` runs tests, builds, and deploys to GitHub Pages
(repo Settings → Pages → Source: **GitHub Actions**).

## Layout
```
src/
  main.js, router.js          boot + hash router (#/course, #/lesson/engine-02, …)
  content/course.js           the course map: tracks, units, lessons, recommended path
  content/glossary.js         glossary terms
  content/lessons/<id>.js     lesson content: steps, quiz, flashcards
  content/vehicles.js         Bronco / bike facts with sources and confirmed/conflicting status
  ui/visuals/                 interactive SVG visuals (cylinder, parts, crank, valvetrain, timing, …)
  ui/quiz/                    quiz question renderer (mc, tap, order, num)
  ui/visuals/drawings/        tappable SVG drawings (car top/side, bike, head, piston, RDU, …)
  ui/visuals/assemblies/      exploded-view assemblies (parts, offsets, teardown order)
  content/explorer.js         drill-down tree for the Lab explorer (#/explore/<node>)
  content/glossary/*.js       glossary terms per unit group (merged into glossary.js)
  content/facts/*.js          sourced vehicle facts per unit group (merged into vehicles.js)
docs/CONTENT_GUIDE.md         how lessons are written (rules, format, quiz types)
docs/VISUALS.md               every visual type and its spec, for lesson authors
  core/                       db (IndexedDB), store, progress + mastery, backup, review, sw
  ui/components/              shell (rail / tab bar), sheet, meter, parts
  ui/screens/                 home, course, lesson, lab, review, glossary, progress, settings
  ui/styles/                  tokens.css (design system), base.css, app.css
tests/                        vitest
scripts/                      screenshots, icon renderer
```

## Phases
1. ✅ Setup: Vite, PWA, deploy, design system, navigation, storage, backup
2. ✅ Lesson engine, quizzes, FSRS flashcards, Engine Fundamentals (11 lessons)
3. ✅ Interactive full-car / motorcycle diagrams, exploded views
4. Rest of Tracks 1–3 (✅ 4a: all of Track 1 · 4b: Tracks 2 and 3)
5. Track 4 + Pyodide coding exercises
6. Simulated CAN bus + reverse-engineering challenges
7. Real-car connection (laptop only, read-only)

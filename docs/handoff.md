# Handoff: Toca Toca Egg House

Paste everything below the line into a new Claude Code session that has this repository.

---

You're picking up an ongoing project: a dress-up game I'm building with my 5-year-old daughter (she/her).
Please read this whole message, then `README.md`, before changing anything.

## Where things are

- **Repository:** `ckloehn/e-e-mobile-gaming` on GitHub (public, so GitHub Pages is free)
- **Branch:** `ccr-ebff52f2-nccgya`. All the work is here, and it's the repository's default branch. Work on
  this branch unless I say otherwise, and push when a change is done and tested.
- **Everything is committed and pushed.** There's no other unsaved work.

## What the game is

"Toca Toca Egg House": her own version of the dress-up games she likes (Toca Boca World and fashion-doll
dress-up games), without the ads and questionable themes. It's a plain HTML/CSS/JavaScript web app, with no
build step and no libraries. It installs to the home screen of her iPad and my Galaxy S24, and works
offline.

- **The family:** Mommy, Daddy, Me and Sister. Everyone is fair-skinned with blonde hair and blue eyes.
  Daddy has a shaved head (blonde buzz cut). Me and Sister are about 6 years old.
- **Castle:** a rainbow castle hall. The family walks around, waves, dances and has short chats in speech
  bubbles. They always **face the camera** (she asked for this). They move in depth: further back is
  higher up the floor and smaller. They have soft floor reflections.
- **Dress-up:** tap anyone to dress them. Items come by category, and locked items can be tried on, then
  bought with coins.
- **Coins:** ✓ Done on a new outfit (+10), a daily surprise egg (+25 and a free item), and a fashion show
  mini game with a theme and three animal judges (everyone wins a prize).
- **Learning to read:** words have a 🔊 button, and tapping a word reads it aloud. Nothing is read
  automatically unless turned on in the grown-ups menu. Item names include color words.
- **Grown-ups menu:** press and hold the ⚙️ gear for 1.5 seconds. It has read-aloud and music toggles,
  renaming, a "give coins" button and "start over". **Real names go here only.** They're saved on the
  device and never reach GitHub.
- **Look:** bright rainbow and sparkly with music, in a glossy fashion-doll art style (her request).
  Painted backgrounds are in `art/`.

## How the dolls work (most important)

There are two kinds of dolls:

1. **Painted dolls** (what she sees now): hand-painted layered PNGs made by a separate AI art agent.
   - Sources: `art/dolls/woman|man|kid/*.png`, all on a 1024 × 2560 canvas, feet at y = 2440, center x = 512.
   - **After any new or changed picture, run `python3 tools/build_dolls.py`** (needs Pillow). It makes
     half-size WebP copies in `art/dolls-web/` and writes `js/doll-art.js` (the list of pieces and the box
     around each one).
   - `js/painted.js` holds the wardrobe catalog, the layer stacking order, recoloring, and thumbnails.
     - Files ending in `-tint.png` are painted in gray and recolored in code (canvas multiply, then a blob
       URL). One painting becomes 10 colors, including gold and rainbow. Gold and rainbow stretch across
       the piece's box.
     - Hair is tinted with the canvas "color" or "multiply" blend.
   - A family member switches to their painted doll as soon as their base exists. The kid doll also needs a
     hairstyle first, because she's painted bald.
   - The `Doll` object in `js/painted.js` is the single entry point the game uses. It picks painted or drawn
     for each person.
2. **Drawn dolls** (the older fallback): SVG drawn by code in `js/avatar.js`, with the items in
   `js/data.js`. They're kept so nothing breaks while art is missing.

The art agent's instructions are in `docs/doll-kit-prompt.md` and `docs/doll-wardrobe-prompt.md`. The
second one ends with a "Fixes needed" list; both fixes there are done. Background prompts are in
`docs/art-prompts.md`. **The art agent never changes code.** When it pushes pictures, pull, run the build
script, check the pieces stacked together, then commit and push.

## Files

| File | What it does |
|---|---|
| `index.html` | All screens, plus shared SVG gradients (`#dyn-defs` holds the painted-doll color gradients) |
| `css/style.css` | All styles, including castle depth, reflections and doll animations |
| `js/data.js` | Colors, drawn-doll items, family defaults (`look` for drawn, `plook` for painted), fashion show themes, chats |
| `js/avatar.js` | Drawn dolls |
| `js/doll-art.js` | Made by `tools/build_dolls.py`. Don't edit by hand. |
| `js/painted.js` | Painted dolls and the `Doll` entry point |
| `js/audio.js` | Generated music, sound effects and read-aloud (speechSynthesis) |
| `js/game.js` | Saving and version migrations, castle movement (`Castle`), dress-up, coins, egg, fashion show, grown-ups menu |
| `sw.js` | Offline support. **Bump `VERSION` whenever game files change**, or devices keep old files. |
| `tools/build_dolls.py` | Prepares painted pictures |

## Things that have bitten us

- `[hidden]` needs `display: none !important` (it's in the CSS), because `.screen` and `.sheet` set
  `display`.
- SVG gradients defined inside a drawing on a hidden screen don't paint for other drawings. Shared
  gradients live in the page-level `<defs>`, and painted-doll color gradients go in `#dyn-defs`.
- Saved games live in `localStorage` under `egg-house-v1` and are migrated by version (now version 3).
  Add a migration whenever the family's defaults change. Keep custom names.
- The ⚙️ gear is press-and-hold on purpose, so little fingers don't open it by accident.

## How to test

Serve the folder with `python3 -m http.server 8000`. Then use Playwright to click through every screen at
iPad landscape (1180 × 820), iPad portrait (820 × 1180) and phone (384 × 832): title, castle, dress-up and
every tab, buy sheet, ✓ Done reward, surprise egg (3 taps), fashion show, runway, result. Check for page
errors and look at the screenshots. Missing `art/*.jpg` returns 404s that are expected and handled.

## Still open

- **Hosting: done.** The game is live at https://ckloehn.github.io/E-E-Mobile-Gaming/ (GitHub Pages from this
  branch, `/ (root)`). Every push updates it within a minute or two. The repository is public, so never put
  personal details (her name, photos) in it.
- **Not yet tried on her real iPad:** check how fast recolored clothes appear the first time a tab opens
  (about 0.6 s on a computer), and sound with the silent switch off.
- **Maybe:** make Me and Sister a little bigger next to the grown-ups; add more rooms (bedroom, beach);
  more outfits; pets.

## How to work with me

- Explain things in plain words. I'm a parent, not a programmer. Short updates are best.
- Keep it kid-safe: no ads, no purchases, no tracking, nothing scary.
- She's the designer. When a change is about taste, ask what she wants instead of guessing.
- Test before saying something works, and tell me plainly what you tested and what you couldn't.

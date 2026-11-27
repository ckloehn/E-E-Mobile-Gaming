# Toca Toca Egg House

A rainbow castle dress-up game we're making together. It has no ads, no purchases and no tracking.
It runs in the web browser and can be added to the home screen of an iPad or Android phone, where it
works like a regular app, even offline.

- [Game plan](docs/game-plan.md) (written for kids)
- [Interview notes](docs/interview-notes.md)
- [Handoff for a new session](docs/handoff.md)
- [Art prompts](docs/art-prompts.md) for painted backgrounds made with an AI image generator

## Put it on the iPad and phone

**The game is live at https://ckloehn.github.io/E-E-Mobile-Gaming/** (skip to Step 2).

**Step 1: Turn on GitHub Pages (one time).**
On GitHub, open this repository, then go to **Settings → Pages**. Under "Build and deployment", choose
**Deploy from a branch**, pick the branch with the game, choose the `/ (root)` folder and click **Save**.
After a minute or two, GitHub shows the game's web address, for example
`https://<your-username>.github.io/E-E-Mobile-Gaming/`.

> GitHub Pages is free for public repositories. A private repository needs a paid GitHub plan for Pages.

**Step 2: Add it to the iPad home screen.**
Open the address in **Safari**, tap the **Share** button (the square with an arrow), then tap
**Add to Home Screen**.

**Step 2: Add it to the Galaxy S24 home screen.**
Open the address in **Chrome**, tap the **⋮** menu, then tap **Add to Home screen** and choose **Install**.

Open it once while online. After that it works without internet.

## Tips
- **No sound on iPhone or iPad?** Check that the device isn't on silent and that the volume is up.
- **Grown-ups menu:** press and hold the ⚙️ gear for 1.5 seconds.
- **Saved games** live on each device separately, so the iPad and the phone each keep their own coins and outfits.

## How it's built
Plain HTML, CSS and JavaScript with no build step and no libraries.

| File | What it does |
|---|---|
| `index.html` | The screens: title, castle, dress-up, fashion show, runway |
| `js/data.js` | Every item, price, character and fashion show theme |
| `js/avatar.js` | Draws the characters, with arms, legs and head as separate moving parts |
| `js/audio.js` | Music, sound effects and read-aloud |
| `js/game.js` | Coins, unlocking, the surprise egg, the fashion show, and the family walking and chatting |
| `art/` | Optional painted backgrounds. The game uses them when they're present |
| `sw.js` | Lets the game work offline. Change `VERSION` when you update files. |

To try it on a computer, run `python3 -m http.server` in this folder and open http://localhost:8000.

## Painted dolls

Painted doll pictures go in `art/dolls/woman/`, `art/dolls/man/` and `art/dolls/kid/`
(see `docs/doll-wardrobe-prompt.md` for the file names). After adding pictures, run:

```
python3 tools/build_dolls.py
```

It makes small web copies in `art/dolls-web/` and updates `js/doll-art.js`. A family member switches to
their painted doll as soon as the base picture for their body is there. Until then they use the drawn doll.
The wardrobe for painted dolls is listed in `js/painted.js`.

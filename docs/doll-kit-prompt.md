# Painted Doll Test Kit: Instructions for the Art Agent

> **Done.** The test pieces passed and now live in `art/dolls/woman/`. The full wardrobe is in
> `docs/doll-wardrobe-prompt.md`. The rules below (canvas, style, layering) still apply.

## Goal

Make **one painted doll plus a few pieces of clothing** as separate see-through pictures that line up
exactly when stacked. This is a test. If the pieces line up well, we'll paint the whole wardrobe this way.
If they don't, we'll try something else, so speed matters more than perfection.

The game is a dress-up game for a 5-year-old. It has no ads and no purchases. Everything must be cute,
cheerful and kid-safe.

## Where to put the files

- **Repository:** `ckloehn/e-e-mobile-gaming` on GitHub
- **Branch:** `ccr-ebff52f2-nccgya`. Work on this branch, or on a new branch made from it.
- **Folder:** `art/dolls/test/`. Create it if it doesn't exist.
- **Don't change any code**, and don't touch `art/castle-hall.jpg`, `art/runway-stage.jpg` or
  `art/title-background.jpg`.

## The most important rule: every picture uses the same canvas

Stacking only works if every file has exactly the same canvas, and the doll sits in exactly the same
spot in every one.

- **Canvas:** 1024 × 2560 pixels, portrait, **PNG with a transparent background** (no white, no checkerboard
  painted in)
- **Doll's center line:** x = 512
- **Top of the head** (without hair): about y = 230
- **Soles of the feet:** y = 2440
- **Pose:** standing straight and facing forward. Arms hang down and slightly away from the body, with a
  small gap between arm and waist. Feet a little apart, on tiptoe. Use the same pose in every picture.
- Each clothing file contains **only that item**, in the spot where it sits on the doll. Everything
  else on the canvas is transparent: no body, no shadow, no background.
- Keep each file under about 700 KB. Use PNG compression if needed.

## Style for every picture

Glossy, polished 2D digital illustration in the style of a modern animated fashion-doll TV series. Clean
smooth shapes, soft gradient shading, glossy highlights, a thin darker outline in each item's own color, and
bright pink, lavender and gold. It should match the three painted backgrounds in the `art/` folder.

**Don't** use brand names (like Barbie) in the prompts, and don't put logos, text or watermarks in the
pictures.

## The files to make

| File | What it is |
|---|---|
| `base.png` | The doll with no hair, wearing a plain light-pink tank top and short shorts (so she is never without clothes). Fair peach skin, big blue eyes, long lashes, a sweet smile showing a little bit of teeth, glossy pink lips, rosy cheeks. Barefoot. |
| `hair-long-back.png` | The part of long, glossy blonde hair that goes **behind** the head and body, down to the waist |
| `hair-long-front.png` | The part of the same hair that goes **in front**: the top of the head, side-swept bangs, and two locks over the shoulders. Leave the face fully visible. |
| `dress-gown.png` | A pink princess ball gown with puffy short sleeves, a fitted bodice and a full skirt down to the ankles |
| `dress-sundress.png` | A yellow sundress with thin straps and a knee-length flared skirt with white polka dots |
| `top-tee.png` | A light-blue T-shirt with short sleeves and a small gold star on the chest |
| `bottom-skirt.png` | A purple pleated skirt, just above the knee |
| `shoes-heels.png` | Sparkly gold low heels, one shoe on each foot |
| `preview-all.png` | A check picture (not used by the game): four versions of the doll side by side on a white background: base + hair; + gown; + sundress; + T-shirt, skirt and heels |

## How to keep the pieces consistent

1. Make `base.png` first. Every other picture is made from it.
2. For each item, start from `base.png` and ask the image tool to **edit** it: "dress this exact doll in
   [item], keep the pose, size and position exactly the same, don't change the face or body." If the tool
   can edit just one area (a mask), mask the area where the item goes.
3. Cut the item out to its own transparent layer at the same canvas size. Erase the doll and keep only
   the item.
4. Stack the layers in the order below and look at the result. If something doesn't line up, nudge or
   redo that one item, not the whole set.

The layer order, from back to front, is:
**hair-long-back → base → bottom → top or dress → shoes → hair-long-front**

## Prompts

**Base doll (`base.png`)**

```
Full-body front view of a cute fashion doll girl standing straight, facing the viewer, on a transparent
background. Glossy polished 2D digital illustration in the style of a modern animated fashion-doll TV series,
soft gradient shading, glossy highlights, thin colored outlines. Fair peach skin, big blue eyes with long
lashes and soft pink eyeshadow, arched brows, small nose, sweet smile showing a little bit of teeth, glossy
pink lips, rosy cheeks. She is bald (no hair) because hair is added as a separate layer. She wears a plain
light-pink tank top and short light-pink shorts. Arms hang down slightly away from her body, feet slightly
apart, standing on tiptoe, barefoot. Slim fashion-doll proportions, long legs. Centered, whole body visible
from head to toe with empty space around her. Kid-friendly. No text, no logo, no watermark, no background.
```

**Hair**

```
Using this exact doll image, add long glossy straight blonde hair down to her waist with side-swept bangs
and two locks falling in front of her shoulders, with shiny highlight streaks. Keep the doll's face, pose,
size and position exactly the same. Transparent background.
```
Then split it into two layers: what's behind the head and body (`hair-long-back.png`) and what's in front
(`hair-long-front.png`).

**Each clothing item.** Use this pattern and fill in the item from the table:

```
Using this exact doll image, dress her in [ITEM DESCRIPTION]. Keep her face, pose, body size and position
exactly the same, and keep the same glossy fashion-doll illustration style. Transparent background.
```
Then erase the doll so only the item is left, on the same 1024 × 2560 canvas.

## When you're done

Commit everything in `art/dolls/test/` with a short message and push to the branch. Then reply with:
- which items lined up well and which needed redoing
- anything that didn't work, like an item that kept shifting or the tool changing the face

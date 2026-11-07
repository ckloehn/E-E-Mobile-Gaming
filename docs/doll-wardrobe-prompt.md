# Painted Doll Wardrobe: Instructions for the Art Agent

The test worked. Every piece lined up on the doll, so now we're painting the whole family and their
wardrobe the same way. Read `docs/doll-kit-prompt.md` first: the canvas, style and layering rules there
still apply. This file adds the new dolls and the full list of pieces.

## Where things go

- **Repository:** `ckloehn/e-e-mobile-gaming` on GitHub
- **Branch:** `ccr-ebff52f2-nccgya`. Pull first, because the test pieces have moved.
- **Folders:** one per body type: `art/dolls/woman/`, `art/dolls/man/`, `art/dolls/kid/`
- **Done already** (don't redo): everything currently in `art/dolls/woman/`. That's the doll, the long
  hair, the pink gown, the yellow sundress, the blue T-shirt, the purple skirt and the gold heels.
- **Don't change any code.** The game finds the files by their exact names, so please match the names below
  exactly. A missing file is fine: the game skips anything that isn't there yet.
- **Commit and push after each body type** (woman, then man, then kid), so the work shows up in stages.

## The family

Everyone is **fair-skinned with blue eyes**, in the same glossy fashion-doll style as
`art/dolls/woman/base.png`. Use that picture as the style reference for every new piece.

| Doll | Who | Notes |
|---|---|---|
| `woman` | Mommy | Done |
| `man` | Daddy | A friendly grown man with a **shaved head: a very short blonde buzz cut, painted as part of the base** (no separate hair files). Broad shoulders, straight waist, short trimmed brows, warm smile, blue eyes. Wears a plain white T-shirt and light-gray knee shorts. |
| `kid` | Me and Sister (both girls, about 6 years old) | A real kid's shape: shorter, rounder face, bigger eyes, small nose, no makeup look, sweet smile. **Bald**, because hair comes in separate files. Wears a plain light-pink T-shirt and shorts. Barefoot. |

## Canvas rules (same for every file)

- 1024 × 2560 pixels, transparent PNG, center line x = 512, **soles of the feet at y = 2440**
- Same pose as the woman doll: standing straight, facing forward, arms slightly away from the body, feet
  a little apart
- **Sizes:** the man's head (top of the buzz cut) at about y = 170. The kid's head top (bald) at about
  y = 1060, so she's clearly a child next to the grown-ups.
- Each clothing file has **only that item**, exactly where it sits on its doll. Everything else is
  transparent.
- Each file under about 700 KB

## Two kinds of clothing files

1. **Normal:** painted in its real colors. File name with no suffix, like `shoes-boots.png`.
2. **Recolorable:** file name ends in `-tint.png`. Paint these **in light gray only**: the main fabric
   about `#E6E6E6`, shading in softer and darker grays, white highlights, no color at all. The game colors
   them in, so one painting can become a pink, blue, purple or gold version. Small details like buttons can
   be gray too.

Hair is always blonde (the family's color). The game can tint hair for fun colors.

Hair always comes in two files: `-back` (behind the head and body) and `-front` (on top of the head and
over the shoulders, never covering the eyes).

## The pieces

### Woman: `art/dolls/woman/`

| File(s) | Item |
|---|---|
| `hair-ponytail-back.png`, `hair-ponytail-front.png` | High ponytail with a small bow, side bangs |
| `hair-curls-back.png`, `hair-curls-front.png` | Long princess curls down to the waist |
| `hair-bun-back.png`, `hair-bun-front.png` | Elegant bun on top with face-framing strands |
| `dress-gown-tint.png` | The same princess ball gown as `dress-gown.png`, in gray |
| `dress-party-tint.png` | Party dress with a fitted top and a puffy layered tutu skirt to the knee |
| `top-tee-tint.png` | The same T-shirt as `top-tee.png`, in gray, without the star |
| `top-hoodie-tint.png` | Cozy hoodie with pockets and drawstrings |
| `bottom-skirt-tint.png` | The same pleated skirt as `bottom-skirt.png`, in gray |
| `bottom-shorts-tint.png` | Shorts |
| `bottom-jeans.png` | Blue jeans down to the ankles |
| `shoes-sneakers-tint.png` | Sneakers with white soles |
| `shoes-boots.png` | Brown knee-high boots |
| `hat-tiara.png` | Silver tiara with pink gems |
| `hat-crown.png` | Gold crown with jewels |
| `extra-wings.png` | Sparkly see-through fairy wings (behind the body) |
| `extra-necklace.png` | Gold necklace with a pink heart |
| `extra-sunglasses.png` | Heart-shaped pink sunglasses |

### Man: `art/dolls/man/`

| File | Item |
|---|---|
| `base.png` | Daddy (see the family table) |
| `top-tee-tint.png` | T-shirt |
| `top-hoodie-tint.png` | Hoodie |
| `top-shirt.png` | Light-blue button-up shirt with short sleeves |
| `top-tux.png` | Royal ball outfit: navy jacket with gold buttons, white shirt, pink bow tie |
| `bottom-jeans.png` | Blue jeans |
| `bottom-shorts-tint.png` | Knee shorts |
| `bottom-pants.png` | Dark navy dress pants |
| `shoes-sneakers-tint.png` | Sneakers with white soles |
| `shoes-dress.png` | Shiny brown dress shoes |
| `hat-crown.png` | Gold king's crown |
| `hat-cap-tint.png` | Baseball cap |
| `extra-sunglasses.png` | Dark sunglasses |
| `extra-glasses.png` | Round reading glasses |

### Kid: `art/dolls/kid/`

| File(s) | Item |
|---|---|
| `base.png` | The kid doll (see the family table) |
| `hair-pigtails-back.png`, `hair-pigtails-front.png` | Two pigtails with pink hair ties, short bangs |
| `hair-ponytail-back.png`, `hair-ponytail-front.png` | Ponytail with a bow |
| `hair-long-back.png`, `hair-long-front.png` | Long straight hair with bangs |
| `hair-braids-back.png`, `hair-braids-front.png` | Two braids over the shoulders |
| `dress-gown-tint.png` | Princess ball gown, ankle length |
| `dress-party-tint.png` | Party dress with a puffy tutu skirt |
| `dress-sundress-tint.png` | Sundress with straps |
| `top-tee-tint.png` | T-shirt |
| `top-hoodie-tint.png` | Hoodie with bunny ears on the hood |
| `bottom-skirt-tint.png` | Skirt |
| `bottom-shorts-tint.png` | Shorts |
| `bottom-leggings-tint.png` | Leggings |
| `shoes-sneakers-tint.png` | Sneakers |
| `shoes-flats-tint.png` | Ballet shoes with a little bow |
| `shoes-rainboots-tint.png` | Rain boots |
| `hat-tiara.png` | Small tiara |
| `hat-bow-tint.png` | Big hair bow |
| `extra-wings.png` | Fairy wings (behind the body) |

## Prompts

**Man base**
```
Full-body front view of a friendly fashion-doll man standing straight, facing the viewer, on a
transparent background, in exactly the same glossy 2D fashion-doll illustration style, lighting and
outline treatment as the attached woman doll. Fair skin, blue eyes, short trimmed brows, warm smile,
a shaved head with a very short blonde buzz cut. Broad shoulders, straight waist, long legs. Plain white
T-shirt and light-gray knee shorts, barefoot. Arms hang down slightly away from the body, feet slightly
apart. Same canvas, scale and position rules as the woman doll: feet at the bottom of the figure area,
centered. Kid-friendly. No text, no logo, no watermark, no background.
```

**Kid base**
```
Full-body front view of a cute 6-year-old girl doll standing straight, facing the viewer, on a
transparent background, in exactly the same glossy 2D fashion-doll illustration style as the attached
woman doll. Fair skin, big blue eyes, small nose, sweet smile, rosy cheeks, no makeup look. Child
proportions: shorter, rounder face, bigger head compared to her body. She is bald because hair is added
as a separate layer. Plain light-pink T-shirt and shorts, barefoot. Arms slightly away from the body,
feet slightly apart. Centered. Kid-friendly. No text, no logo, no watermark, no background.
```

**Each item:** use the pattern from `docs/doll-kit-prompt.md`: edit the doll for that body to wear the
item, keep everything else the same, then cut the item out onto its own transparent canvas. For a
`-tint.png` file, add: "Paint the item only in light grays and white, with no color."

## When you're done

After each body type: commit, push, and reply with what's done and anything that didn't line up.

## Fixes needed (found when stacking the pieces in the game)

1. **`art/dolls/man/base.png`: repaint the underclothes.** The white T-shirt's sleeves and shoulders show
   behind every top, and the gray shorts peek out at the hips under pants. Repaint Daddy wearing a **snug
   white sleeveless tank top** and **short, snug gray shorts** (mid-thigh, fitted), like the woman doll's
   base. Keep his face, head, body, pose, size and position exactly the same, so all of his existing
   clothes still line up. Then check that every `man` top and bottom fully covers the new underclothes.
2. **`art/dolls/man/bottom-jeans.png`: remove the step at mid-thigh.** The legs suddenly get narrower
   partway down, leaving a hard horizontal edge. Repaint the jeans with smooth legs that taper evenly
   from hip to ankle, in the same position.

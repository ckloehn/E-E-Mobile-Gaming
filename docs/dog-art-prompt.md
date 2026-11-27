# Painted Dog: Instructions for the Art Agent

The family has a dog now. He's in the game already, drawn in code (`js/dog.js`). Please paint him in the
same glossy fashion-doll style as the family, so he matches them. The game switches to your painting on
its own as soon as `art/dolls/dog/base.png` exists, and every item below works on both versions.

Read `docs/doll-kit-prompt.md` first: its canvas, style and layering rules still apply.

## Where things go

- **Repository:** `ckloehn/e-e-mobile-gaming` on GitHub
- **Branch:** `ccr-ebff52f2-nccgya`. Pull first.
- **Folder:** `art/dolls/dog/`
- **Don't change any code**, and match the file names below exactly. A missing file is fine: the game
  keeps using the drawn version of that item.
- **Never commit a photo of the real dog.** If a grown-up gives you a photo to look at, use it only as a
  reference and don't save it in the repository (it's public).
- Commit and push when the base is done, then again when the items are done.

## The dog

A friendly, medium-size **white** dog, about 40 pounds. He looks like an **American Eskimo dog**: pure white
fluffy coat, a thick fluffy ruff around the neck and chest, **pointy upright triangle ears** with pink
insides, dark round eyes, a black nose, a happy open-mouth smile with a little pink tongue. His tail
curls up over his back, but it's **less fluffy than a typical American Eskimo's tail**. Cute and
kid-friendly, the same cartoon fashion-doll polish as the family (soft shading, clean outlines, glossy
eyes). No collar in the base: collars are separate items.

**Pose:** standing on all four paws, **facing the viewer** (front view, like the family dolls), front legs
straight and a little apart, the back legs showing a bit at each side, tail curling up beside his body on
the viewer's right. The drawn dog in the game shows the pose: open the game, or see `js/dog.js`.

## Canvas rules

- 1024 × 2560 pixels, transparent PNG, center line x = 512
- **The bottoms of his paws at y = 2440**, the same floor line as the family
- **The tips of his ears at about y = 1440**, so he's dog-sized next to the grown-ups (his back is about at
  the grown-ups' knees)
- Keep him between about x = 230 and x = 800 (the tail can reach x = 820)
- Each item file has **only that item**, exactly where it sits on the dog. Everything else is transparent.
- Each file under about 700 KB
- `-tint.png` files: paint **in light gray only** (main fabric about `#E6E6E6`, gray shading, white
  highlights, no color). The game colors them.

## The pieces

| File | Item | Where it sits |
|---|---|---|
| `base.png` | The dog | (see above) |
| `top-sweater-tint.png` | Cozy knit sweater with a ribbed neck and hem and a little heart on the chest | Covers the chest and belly; legs come out underneath |
| `top-tutu-tint.png` | Puffy tulle tutu with a waistband | Around his middle, over the tops of his legs |
| `shoes-booties-tint.png` | Four little booties with white cuffs | On all four paws |
| `hat-crown.png` | Small gold crown with jewels | Between his ears |
| `hat-tiara.png` | Silver tiara with a pink gem | Across the top of his head |
| `hat-party-tint.png` | Party hat with dots and a pom-pom, tilted a little | On top of his head |
| `hat-bow-tint.png` | Big hair bow | Next to his right ear (viewer's right) |
| `hat-flowers.png` | Flower crown: small pink, purple, yellow and blue flowers with leaves | Across his forehead, between the ears |
| `extra-collar-tint.png` | Collar with a round gold tag that has a pink heart | Around his neck, under the chin |
| `extra-bandana-tint.png` | Triangle bandana with white polka dots | Tied at the neck, hanging down over the chest |
| `extra-cape-tint.png` | Royal cape with a gold trim along the bottom | **Behind** him: shows at both sides and down to the floor |
| `extra-sunglasses.png` | Heart-shaped pink sunglasses | Over his eyes |
| `extra-wings.png` | Sparkly see-through fairy wings, rainbow shimmer | **Behind** his body, sticking out at both sides |

## Prompts

**Dog base**
```
Full-body front view of a cute, friendly white dog standing on all four paws, facing the viewer, on a
transparent background, in exactly the same glossy 2D fashion-doll illustration style, lighting and
outline treatment as the attached woman doll. He looks like an American Eskimo dog: pure white fluffy
coat, thick fluffy neck ruff, pointy upright triangle ears with pink insides, dark round shiny eyes, black
nose, happy open-mouth smile with a little pink tongue. His tail curls up over his back on the viewer's
right and is only a little fluffy. Medium size, about 40 pounds. No collar, no clothes. Kid-friendly.
No text, no logo, no watermark, no background.
```

**Each item:** edit the dog to wear the item, keep everything else exactly the same, then cut the item out
onto its own transparent canvas in the same position. For a `-tint.png` file, add: "Paint the item only in
light grays and white, with no color."

## When you're done

Commit, push, and reply with what's done and anything that didn't line up.

#!/usr/bin/env python3
"""Prepare the painted doll pictures for the game.

Run from the repository root after new pictures land in art/dolls/<body>/:

    python3 tools/build_dolls.py

For every PNG in art/dolls/woman, art/dolls/man and art/dolls/kid it:
  - writes a half-size WebP copy to art/dolls-web/<body>/ (full size is far more than a phone needs
    and uses a lot of memory when many layers are stacked)
  - records the box around the painted part of the picture, so the item picker can zoom in on it
and writes the list to js/doll-art.js. The game shows only pieces that are in that list.
"""
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'art' / 'dolls'
OUT = ROOT / 'art' / 'dolls-web'
CANVAS = (1024, 2560)
WEB = (512, 1280)

art = {}
problems = []
for body in ['woman', 'man', 'kid']:
    folder = SRC / body
    if not folder.is_dir():
        continue
    (OUT / body).mkdir(parents=True, exist_ok=True)
    for f in sorted(folder.glob('*.png')):
        im = Image.open(f).convert('RGBA')
        if im.size != CANVAS:
            problems.append(f'{f.relative_to(ROOT)} is {im.size[0]}x{im.size[1]}, expected {CANVAS[0]}x{CANVAS[1]}; resized')
            im = im.resize(CANVAS, Image.LANCZOS)
        box = im.getchannel('A').point(lambda a: 255 if a > 10 else 0).getbbox()
        if not box:
            problems.append(f'{f.relative_to(ROOT)} is empty; skipped')
            continue
        im.resize(WEB, Image.LANCZOS).save(OUT / body / (f.stem + '.webp'), 'WEBP', quality=88, method=6)
        art[f'{body}/{f.stem}'] = list(box)

js = ('// Made by tools/build_dolls.py. Do not edit by hand: run the script after adding pictures.\n'
      '// Each painted piece and the box (left, top, right, bottom) around its painted part on the 1024 x 2560 canvas.\n'
      'const DOLL_ART = {\n' + ''.join(f'  {json.dumps(k)}: {json.dumps(v)},\n' for k, v in art.items()) + '};\n')
(ROOT / 'js' / 'doll-art.js').write_text(js)

print(f'{len(art)} pieces ready')
for p in problems:
    print('  note:', p)
sys.exit(0)

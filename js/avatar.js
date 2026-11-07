// Draws a fashion doll as SVG from a "look" (one item id per category).
// Grid is 300 wide x 740 tall, doll facing forward:
// head centered at (150,95), shoulders at y 190, waist at y 296, hips at y 350, ankles at y 690.
// Everything is drawn for the doll's left side once and mirrored for the right.
// Arms, legs and the head are separate groups (.arm-l, .leg-r, .head ...) so CSS can animate them.
// Body types: 'adult' (tall doll), 'broad' (Daddy: wider shoulders, straight waist, square jaw),
// 'kid' (shorter body, bigger head) and 'flat' (no scaling, used for the item pictures).

const Avatar = (() => {
  const INK = 'rgba(80,35,70,.55)';
  const SHADE = 'rgba(70,20,70,.16)';
  const SHINE = 'rgba(255,255,255,.5)';
  const VOL = 'url(#g-vol)';
  const PATTERN = { dots: 'url(#p-dots)', stripes: 'url(#p-stripes)', glitter: 'url(#p-glitter)' };

  // ---------- Color helpers ----------
  const fillOf = c => (COLORS[c] ? COLORS[c].hex : c || '#ccc');
  function darken(hex, f = 0.72) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return INK;
    const n = parseInt(hex.slice(1), 16);
    const ch = s => Math.round(((n >> s) & 255) * f);
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  }
  function lighten(hex, f = 0.4) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return SHINE;
    const n = parseInt(hex.slice(1), 16);
    const ch = s => { const v = (n >> s) & 255; return Math.round(v + (255 - v) * f); };
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  }
  const edge = fill => darken(fill, 0.62);

  // ---------- Shape helpers ----------
  const f1 = n => n.toFixed(1);
  const P = (d, fill, stroke = INK, w = 1.6) =>
    `<path d="${d}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"` : ''}/>`;
  const Line = (d, color, w = 1.6) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  // A filled shape with soft light on the left and shadow on the right, plus an optional pattern.
  const solid = (d, fill, pattern, stroke) =>
    P(d, fill, stroke || edge(fill)) + (pattern ? P(d, PATTERN[pattern], null) : '') + P(d, VOL, null);
  const mirror = svg => `<g transform="translate(300 0) scale(-1 1)">${svg}</g>`;
  const both = svg => svg + mirror(svg);

  function star(x, y, r, fill, stroke) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
      d += `${i ? 'L' : 'M'}${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`;
    }
    return P(d + 'Z', fill, stroke || null, 1);
  }
  const heart = (x, y, s, fill, stroke) =>
    P(`M${x} ${y + s * 0.9} C${x - s * 1.4} ${y} ${x - s * 0.8} ${y - s} ${x} ${y - s * 0.35} C${x + s * 0.8} ${y - s} ${x + s * 1.4} ${y} ${x} ${y + s * 0.9} Z`, fill, stroke || null, 1);

  // A limb is a soft tube along a curve, with a width that changes along the way.
  const bez = ([a, b, c], t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1]];
  const bezD = ([a, b, c], t) => [2 * (1 - t) * (b[0] - a[0]) + 2 * t * (c[0] - b[0]), 2 * (1 - t) * (b[1] - a[1]) + 2 * t * (c[1] - b[1])];
  function widthAt(ws, t) {
    for (let i = 1; i < ws.length; i++) {
      if (t <= ws[i][0]) {
        const [t0, w0] = ws[i - 1], [t1, w1] = ws[i];
        return w0 + ((w1 - w0) * (t - t0)) / (t1 - t0);
      }
    }
    return ws[ws.length - 1][1];
  }
  function tube(curve, ws, t0 = 0, t1 = 1, extra = 0, roundEnd = true) {
    const L = [], R = [], n = 16;
    for (let i = 0; i <= n; i++) {
      const t = t0 + ((t1 - t0) * i) / n;
      const p = bez(curve, t), d = bezD(curve, t), len = Math.hypot(d[0], d[1]);
      const nx = -d[1] / len, ny = d[0] / len, w = (widthAt(ws, t) + extra) / 2;
      L.push([p[0] + nx * w, p[1] + ny * w]);
      R.push([p[0] - nx * w, p[1] - ny * w]);
    }
    const pt = p => `${f1(p[0])} ${f1(p[1])}`;
    const we = (widthAt(ws, t1) + extra) / 2, w0 = (widthAt(ws, t0) + extra) / 2;
    let d = 'M' + pt(L[0]) + L.slice(1).map(p => ' L' + pt(p)).join('');
    d += roundEnd ? ` A${f1(we)} ${f1(we)} 0 0 0 ${pt(R[n])}` : ' L' + pt(R[n]);
    d += R.slice(0, n).reverse().map(p => ' L' + pt(p)).join('');
    d += ` A${f1(w0)} ${f1(w0)} 0 0 0 ${pt(L[0])} Z`;
    return d;
  }

  // ---------- Body types ----------
  const DOLL = {
    male: false,
    arm: [[103, 194], [86, 292], [84, 394]],
    armW: [[0, 23], [0.5, 15], [1, 11]],
    leg: [[131, 348], [133, 520], [138, 688]],
    legW: [[0, 42], [0.42, 23], [0.62, 24], [1, 13]],
    torso: 'M140 130 L140 168 Q122 174 106 180 Q96 185 96 197 L98 214 Q104 252 124 296 Q118 330 112 352 L188 352 Q182 330 176 296 Q196 252 202 214 L204 197 Q204 185 194 180 Q178 174 160 168 L160 130 Z',
    hip: 'M120 292 L180 292 Q186 322 190 354 L110 354 Q114 322 120 292 Z',
    face: 'M108 90 C106 40 194 40 192 90 C192 123 174 147 150 149 C126 147 108 123 108 90 Z',
    tops: {
      base: 'M104 181 Q124 172 140 170 Q150 190 160 170 Q176 172 196 181 Q204 186 204 198 L202 214 Q196 252 178 300 L180 330 L120 330 L122 300 Q104 252 98 214 L96 198 Q96 186 104 181 Z',
      tank: 'M108 186 L118 178 L126 178 Q150 210 174 178 L182 178 L192 186 Q200 214 202 222 Q196 254 178 300 L180 330 L120 330 L122 300 Q104 254 98 222 Q100 214 108 186 Z',
      crop: 'M106 180 Q124 172 140 170 Q150 190 160 170 Q176 172 194 180 Q204 186 204 198 L202 214 Q198 240 188 268 L112 268 Q102 240 98 214 L96 198 Q96 186 106 180 Z',
      hoodie: 'M104 180 Q124 172 140 170 Q150 186 160 170 Q176 172 196 180 Q206 186 206 198 L204 216 Q198 256 184 300 L188 340 L112 340 L116 300 Q102 256 96 216 L94 198 Q94 186 104 180 Z',
    },
  };
  const GUY = {
    male: true,
    arm: [[97, 192], [84, 292], [85, 394]],
    armW: [[0, 28], [0.5, 19], [1, 13]],
    leg: [[132, 348], [134, 520], [138, 688]],
    legW: [[0, 40], [0.45, 27], [0.65, 25], [1, 15]],
    torso: 'M139 128 L139 166 Q118 172 98 178 Q86 184 86 198 L90 222 Q98 262 112 300 L112 352 L188 352 L188 300 Q202 262 210 222 L214 198 Q214 184 202 178 Q182 172 161 166 L161 128 Z',
    hip: 'M114 296 L186 296 Q188 324 190 354 L110 354 Q112 324 114 296 Z',
    face: 'M107 88 C105 38 195 38 193 88 C194 116 188 136 172 146 Q150 156 128 146 C112 136 106 116 107 88 Z',
    tops: {
      base: 'M100 179 Q122 170 140 168 Q150 186 160 168 Q178 170 200 179 Q212 186 212 200 L208 224 Q200 262 190 300 L190 336 L110 336 L110 300 Q100 262 92 224 L88 200 Q88 186 100 179 Z',
      tank: 'M110 184 L120 176 L128 176 Q150 204 172 176 L180 176 L190 184 Q204 210 206 224 Q200 262 190 300 L190 336 L110 336 L110 300 Q100 262 94 224 Q96 210 110 184 Z',
      hoodie: 'M98 178 Q122 170 140 168 Q150 184 160 168 Q178 170 202 178 Q214 186 214 200 L210 224 Q202 262 194 300 L196 344 L104 344 L106 300 Q98 262 90 224 L86 200 Q86 186 98 178 Z',
    },
  };
  GUY.tops.crop = GUY.tops.base;

  const KID_FACE = 'M106 92 C104 42 196 42 194 92 C194 128 178 150 150 151 C122 150 106 128 106 92 Z';
  const HAND = 'M78 390 Q73 408 77 423 Q84 433 91 423 Q95 408 90 390 Z';
  const THUMB = 'M89 398 Q97 404 95 414 Q91 416 88 410 Z';
  const FOOT = 'M130 684 Q127 702 131 720 Q138 730 145 720 Q149 702 146 684 Z';

  // ---------- Hair ----------
  // Each style has a back piece (behind the body), a front piece, and strand lines.
  const CAP = 'M104 104 C94 46 128 32 152 32 C182 32 208 48 196 104 Z';
  const BANGS = 'M106 104 C102 42 198 42 194 104 C190 84 182 70 168 64 C156 72 140 74 128 70 C116 78 108 90 106 104 Z';
  const SWEEP = 'M106 106 C100 44 150 32 176 42 C198 52 200 78 194 112 C188 86 176 70 158 64 C140 76 122 84 106 106 Z';
  const LONG_STRANDS = ['M104 120 Q96 220 100 326', 'M196 120 Q206 220 200 326', 'M112 150 Q108 240 116 332', 'M188 150 Q194 240 186 334', 'M124 170 Q120 250 128 330', 'M176 170 Q182 250 172 330'];
  const HAIR = {
    short: { back: CAP, front: 'M106 100 C100 46 146 30 176 40 C198 50 200 76 194 106 C186 80 170 64 150 62 C134 72 118 80 106 100 Z',
      strands: ['M120 82 Q140 56 172 50', 'M150 62 Q170 60 188 82', 'M112 92 Q118 70 134 60'] },
    spiky: { back: CAP, front: 'M106 104 L104 60 L120 70 L122 36 L140 58 L150 26 L162 58 L180 36 L182 70 L196 60 L194 104 C180 76 166 68 150 70 C134 68 120 76 106 104 Z',
      strands: ['M128 66 L136 46', 'M162 66 L168 46', 'M114 80 L118 64', 'M186 80 L182 64'] },
    bob: {
      back: 'M100 96 C92 34 208 34 200 96 C204 128 206 150 196 160 Q172 166 150 160 Q128 166 104 160 C94 150 96 128 100 96 Z',
      front: 'M106 104 C100 42 200 42 194 104 C190 86 186 80 180 76 L170 80 L160 74 L150 80 L140 74 L130 80 L120 76 C114 82 108 92 106 104 Z',
      strands: ['M112 108 Q108 140 116 158', 'M188 108 Q192 140 184 158', 'M130 52 Q150 44 170 52', 'M104 120 Q102 144 108 156'] },
    long: {
      back: 'M102 92 C90 30 210 30 198 92 C206 160 216 250 212 332 Q182 346 150 338 Q118 346 88 332 C84 250 94 160 102 92 Z',
      front: SWEEP, strands: [...LONG_STRANDS, 'M120 84 Q140 56 172 50'] },
    superlong: {
      back: 'M102 92 C90 30 210 30 198 92 C210 200 226 380 222 560 Q186 576 150 566 Q114 576 78 560 C74 380 90 200 102 92 Z',
      front: SWEEP,
      strands: ['M104 120 Q90 320 92 552', 'M196 120 Q212 320 208 552', 'M114 160 Q104 360 112 560', 'M186 160 Q198 360 188 562', 'M128 200 Q122 380 132 560', 'M172 200 Q180 380 168 560', 'M120 84 Q140 56 172 50'] },
    wavy: {
      back: 'M102 92 C90 30 210 30 198 92 C212 130 200 170 214 210 C226 250 204 290 220 330 Q202 350 184 334 Q168 352 150 336 Q132 352 116 334 Q98 350 80 330 C96 290 74 250 86 210 C100 170 88 130 102 92 Z',
      front: SWEEP,
      strands: ['M100 120 Q112 160 96 206 Q82 250 98 300', 'M200 120 Q188 160 204 206 Q218 250 202 300', 'M118 160 Q126 200 112 240 Q102 280 116 320', 'M182 160 Q174 200 188 240 Q198 280 184 320', 'M120 84 Q140 56 172 50'] },
    ponytail: {
      back: CAP + ' M180 44 C230 30 240 90 226 160 C218 200 224 240 214 270 Q204 282 200 266 C212 220 200 180 206 140 C210 100 200 70 176 62 Z',
      front: BANGS, strands: ['M214 80 Q224 150 212 250', 'M206 90 Q214 150 206 230', 'M122 56 Q150 42 178 54'], tie: [[188, 52, 8]] },
    pigtails: {
      back: CAP +
        ' M108 92 C76 96 66 150 72 200 C76 236 66 256 74 270 Q84 276 86 262 C92 230 84 200 92 160 C96 130 104 112 112 104 Z' +
        ' M192 92 C224 96 234 150 228 200 C224 236 234 256 226 270 Q216 276 214 262 C208 230 216 200 208 160 C204 130 196 112 188 104 Z',
      front: BANGS, strands: ['M84 130 Q76 190 80 258', 'M216 130 Q224 190 220 258', 'M92 140 Q86 190 88 240', 'M208 140 Q214 190 212 240', 'M122 56 Q150 42 178 54'], tie: [[104, 100, 7], [196, 100, 7]] },
    buns: { back: CAP, extra: [[112, 40, 22], [188, 40, 22]], front: BANGS,
      strands: ['M100 36 Q112 26 124 38', 'M176 38 Q188 26 200 36', 'M122 56 Q150 42 178 54'] },
    puffs: { back: CAP, extra: [[102, 44, 30], [198, 44, 30]], front: SWEEP, strands: ['M86 40 Q96 26 110 30', 'M190 30 Q204 26 214 40'] },
    curly: { curls: true, front: BANGS, strands: [] },
    braid: { back: CAP, front: BANGS, strands: ['M122 56 Q150 42 178 54'], braid: true },
  };

  function hairBack(style, hc) {
    const h = HAIR[style] || HAIR.short;
    const ink = edge(hc);
    let s = '';
    if (h.curls) {
      for (let a = 160; a <= 380; a += 18) {
        const r = (a * Math.PI) / 180;
        s += `<circle cx="${f1(150 + 62 * Math.cos(r))}" cy="${f1(110 + 74 * Math.sin(r))}" r="22" fill="${hc}" stroke="${ink}" stroke-width="1.4"/>` +
          `<circle cx="${f1(150 + 62 * Math.cos(r))}" cy="${f1(110 + 74 * Math.sin(r))}" r="22" fill="url(#g-hair)"/>`;
      }
      return s;
    }
    if (h.extra) for (const [x, y, r] of h.extra) {
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${hc}" stroke="${ink}" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#g-hair)"/>` +
        Line(`M${x - r * 0.6} ${y - r * 0.3} Q${x} ${y - r * 0.8} ${x + r * 0.5} ${y - r * 0.4}`, SHINE, 3);
    }
    return s + P(h.back, hc, ink) + P(h.back, 'url(#g-hair)', null);
  }

  function hairFront(style, hc) {
    const h = HAIR[style] || HAIR.short;
    const ink = edge(hc);
    const light = lighten(hc, 0.45);
    let s = '';
    if (h.braid) {
      for (let i = 0; i < 10; i++) {
        const x = 182 + i * 2.6, y = 128 + i * 21;
        s += `<ellipse cx="${f1(x)}" cy="${y}" rx="13" ry="13" fill="${hc}" stroke="${ink}" stroke-width="1.4"/>` +
          `<ellipse cx="${f1(x)}" cy="${y}" rx="13" ry="13" fill="url(#g-hair)"/>` +
          Line(`M${f1(x - 10)} ${y + 2} Q${f1(x)} ${y + 10} ${f1(x + 10)} ${y + 2}`, ink, 1.2);
      }
      s += `<circle cx="207" cy="342" r="6" fill="#FF6FB5" stroke="${INK}" stroke-width="1"/>`;
    }
    s += P(h.front, hc, ink) + P(h.front, 'url(#g-hair)', null);
    if (h.curls) {
      for (const [x, y] of [[112, 84], [126, 62], [148, 54], [170, 58], [188, 76]]) {
        s += `<circle cx="${x}" cy="${y}" r="15" fill="${hc}" stroke="${ink}" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="15" fill="url(#g-hair)"/>` +
          Line(`M${x - 8} ${y - 4} Q${x - 2} ${y - 11} ${x + 6} ${y - 8}`, SHINE, 2.4);
      }
    }
    for (const d of h.strands) s += Line(d, ink, 1.2);
    s += Line('M124 62 Q144 48 168 50', light, 5) + Line('M126 60 Q144 50 162 51', SHINE, 2.4) + Line('M116 76 Q124 66 134 62', light, 2.5);
    if (h.tie) for (const [x, y, r] of h.tie) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FF6FB5" stroke="${INK}" stroke-width="1"/><circle cx="${x - 2}" cy="${y - 2}" r="${r * 0.35}" fill="${SHINE}"/>`;
    return s;
  }

  // ---------- Face ----------
  let clipId = 0;
  function eyes(style, ec, skin, male, young) {
    const one = (x, right) => {
      const y = 93, s = right ? 1 : -1;
      const almond = male
        ? `M${x - 12} ${y} Q${x - 1} ${y - 8} ${x + 12} ${y - 1} Q${x + 1} ${y + 5} ${x - 12} ${y} Z`
        : `M${x - 12} ${y} Q${x - 2} ${y - 10} ${x + 12} ${y - 2} Q${x + 2} ${y + 7} ${x - 12} ${y} Z`;
      const lashLine = Line(male ? `M${x - 12} ${y} Q${x - 1} ${y - 9} ${x + 12} ${y - 1}` : `M${x - 13} ${y + 0.5} Q${x - 2} ${y - 11} ${x + 13} ${y - 2}`,
        '#2A1F2D', male ? 1.8 : 2.8);
      const flick = male ? '' : Line(right ? `M${x + 12} ${y - 2} L${x + 17} ${y - 6}` : `M${x - 12} ${y} L${x - 17} ${y - 5}`, '#2A1F2D', 2);
      const crease = Line(`M${x - 10} ${y - 9} Q${x} ${y - 15} ${x + 11} ${y - 9}`, darken(skin, 0.75), 1.1);
      const iris = (r, shape) => {
        const cy = y - 1;
        if (shape === 'star') return star(x, cy, r + 2, ec, '#2A1F2D');
        if (shape === 'heart') return heart(x, cy, r - 0.5, ec, '#2A1F2D');
        return `<circle cx="${x}" cy="${cy}" r="${r}" fill="${ec}"/><circle cx="${x}" cy="${cy}" r="${r}" fill="url(#g-iris)"/>` +
          `<circle cx="${x}" cy="${cy}" r="${r}" fill="none" stroke="rgba(30,15,40,.5)" stroke-width="1"/>` +
          `<circle cx="${x}" cy="${cy}" r="${r * 0.42}" fill="#1E1522"/>`;
      };
      const shine = big => `<circle cx="${x - 2.5}" cy="${y - 4}" r="${big ? 2.6 : 2}" fill="#fff"/>` + `<circle cx="${x + 2.6}" cy="${y + 1.6}" r="${big ? 1.4 : 0.9}" fill="#fff" opacity=".9"/>`;
      const open = (r, shape, big) => {
        const id = `eye${++clipId}`;
        return P(almond, '#fff', null) + `<clipPath id="${id}"><path d="${almond}"/></clipPath>` +
          `<g clip-path="url(#${id})">${iris(r, shape)}<path d="M${x - 14} ${y - 12} L${x + 14} ${y - 12} L${x + 14} ${y - 5} Q${x} ${y - 9} ${x - 14} ${y - 4} Z" fill="rgba(60,20,60,.18)"/></g>` +
          shine(big) + crease + lashLine;
      };
      const lashes = n => (male ? [] : [0, 1, 2].slice(0, n)).map(k => {
        const bx = right ? x + 6 + k * 3.5 : x - 6 - k * 3.5, by = y - 6 + k * 2;
        return Line(`M${bx} ${by} l${s * 4} ${-6 + k}`, '#2A1F2D', 1.6);
      }).join('');
      let eye;
      switch (style) {
        case 'happy': eye = Line(`M${x - 12} ${y + 2} Q${x} ${y - 9} ${x + 12} ${y + 2}`, '#2A1F2D', 2.6) + lashes(2); break;
        case 'wink':
          eye = right ? Line(`M${x - 12} ${y - 1} Q${x} ${y + 6} ${x + 12} ${y - 1}`, '#2A1F2D', 2.6) + lashes(2) : open(6.8, null, false) + flick + lashes(3);
          break;
        case 'sleepy':
          eye = open(6.8, null, false) + P(`M${x - 14} ${y - 14} L${x + 14} ${y - 14} L${x + 14} ${y - 2} Q${x} ${y + 1} ${x - 14} ${y} Z`, skin, null) +
            Line(`M${x - 13} ${y} Q${x} ${y + 1} ${x + 13} ${y - 2}`, '#2A1F2D', 2.4);
          break;
        case 'sparkly': eye = open(8, null, true) + flick + lashes(3); break;
        case 'star': eye = open(6.8, 'star', false) + flick + lashes(2); break;
        case 'heart': eye = open(6.8, 'heart', false) + flick + lashes(2); break;
        case 'lashes':
          eye = (male ? '' : Line(`M${x - 12} ${y - 6} Q${x} ${y - 16} ${x + 12} ${y - 8}`, 'rgba(190,120,200,.35)', 6)) + open(6.8, null, false) + flick + lashes(3);
          break;
        default: eye = open(male ? 6.2 : 6.8, null, false) + lashes(1);
      }
      // Big doll eyes for the girls
      const big = young ? 1.3 : 1.14;
      return male ? eye : `<g transform="translate(${x} ${y + (young ? 2 : 0)}) scale(${big}) translate(${-x} ${-y})">${eye}</g>`;
    };
    const brow = darken(skin, male ? 0.38 : 0.45);
    const brows = male
      ? Line('M118 79 Q131 73 144 77', brow, 4.2) + Line('M156 77 Q169 73 182 79', brow, 4.2)
      : Line('M119 77 Q131 70 143 75', brow, 2.2) + Line('M157 75 Q169 70 181 77', brow, 2.2);
    return one(132, false) + one(168, true) + brows;
  }

  function facePaint(style) {
    switch (style) {
      case 'blush': return `<ellipse cx="121" cy="113" rx="11" ry="6.5" fill="#FF7FA8" opacity=".45"/><ellipse cx="179" cy="113" rx="11" ry="6.5" fill="#FF7FA8" opacity=".45"/>`;
      case 'freckles': return [[118, 108], [124, 112], [116, 114], [182, 108], [176, 112], [184, 114], [146, 104], [154, 104]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#A0663E"/>`).join('');
      case 'stars': return star(120, 114, 6, '#FFD93D', INK) + star(180, 114, 6, '#FFD93D', INK) + star(190, 102, 3.5, '#FF6FB5');
      case 'hearts': return heart(120, 114, 5.5, '#FF4F8B', INK) + heart(180, 114, 5.5, '#FF4F8B', INK);
      case 'eyeshadow': return Line('M120 86 Q132 74 145 85', 'url(#g-rainbow)', 7) + Line('M155 85 Q168 74 180 86', 'url(#g-rainbow)', 7);
      case 'glitter': return [[116, 106], [124, 116], [112, 118], [184, 106], [176, 116], [188, 118], [150, 66], [142, 62], [158, 62]]
        .map(([x, y], i) => star(x, y, i % 3 ? 2.5 : 3.6, i % 2 ? '#FFE680' : '#FFFFFF')).join('');
      case 'whiskers':
        return `<ellipse cx="150" cy="111" rx="4" ry="3" fill="#FF8FB1"/>` +
          [[-1, 112], [-1, 118], [1, 112], [1, 118]].map(([s, y]) => Line(`M${150 + s * 16} ${y} L${150 + s * 38} ${y + (y - 115) * 1.6}`, '#4A2E3A', 1.4)).join('');
      default: return '';
    }
  }

  function mouth(lips, skin, male) {
    const painted = lips && lips.color;
    if (male && !painted) {
      return Line('M140 124 Q150 130 160 124', darken(skin, 0.5), 2) + Line('M144 130 Q150 132 156 130', darken(skin, 0.82), 1.6);
    }
    const upper = 'M139 122 Q144 118 150 121 Q156 118 161 122 Q155 125 150 125 Q145 125 139 122 Z';
    const lower = 'M140 123 Q150 134 160 123 Q150 127 140 123 Z';
    const c = painted ? fillOf(lips.color) : '#D9787A';
    return `<g${painted ? '' : ' opacity=".75"'}>` + P(upper, c, edge(c), 1) + P(lower, c, edge(c), 1) + P(lower, VOL, null) + '</g>' +
      (painted && ['gold', 'rainbow'].includes(lips.color) ? P(lower, PATTERN.glitter, null) : '') +
      Line('M139 122 Q150 126 161 122', 'rgba(90,20,40,.55)', 1.2) +
      `<ellipse cx="146" cy="128" rx="3.4" ry="1.5" fill="#fff" opacity=".7"/><ellipse cx="146" cy="120.5" rx="2" ry=".9" fill="#fff" opacity=".5"/>`;
  }

  // ---------- Clothes ----------
  const SLEEVE_END = { tee: 0.3, startee: 0.3, hearttee: 0.3, crop: 0.26, long: 0.97, hoodie: 0.97, ruffle: 0.95 };

  // One sleeve (left side); it is drawn inside the arm so it swings with it.
  function topSleeve(item, B) {
    const end = SLEEVE_END[item.style];
    if (!end) return '';
    const fill = fillOf(item.color);
    const extra = item.style === 'hoodie' ? 10 : item.style === 'ruffle' ? 9 : 6;
    let s = solid(tube(B.arm, B.armW, 0, end, extra, false), fill, item.pattern);
    if (end > 0.9) s += P(tube(B.arm, B.armW, end - 0.06, end, extra + 1, false), item.style === 'ruffle' ? '#fff' : SHADE, edge(fill), 1.2);
    else s += Line(`M${f1(bez(B.arm, end)[0] - 12)} ${f1(bez(B.arm, end)[1] - 3)} l22 5`, SHADE, 2.5);
    return s + Line('M104 210 Q100 240 94 262', SHADE, 2.5);
  }

  function dressSleeve(item) {
    if (item.style !== 'gown') return '';
    const fill = fillOf(item.color);
    return `<ellipse cx="100" cy="200" rx="17" ry="14" fill="${fill}" stroke="${edge(fill)}" stroke-width="1.6"/>` +
      `<ellipse cx="100" cy="200" rx="17" ry="14" fill="${VOL}"/>` + Line('M90 196 Q98 188 108 192', SHINE, 3) + Line('M92 210 Q100 214 110 210', SHADE, 2);
  }

  function topBody(item, B) {
    const fill = fillOf(item.color);
    const ink = edge(fill);
    let s = solid(B.tops[item.style] || B.tops.base, fill, item.pattern);
    if (!B.male) s += Line('M126 230 Q138 240 146 236', SHADE, 2.5) + Line('M174 230 Q162 240 154 236', SHADE, 2.5);
    s += Line('M118 300 Q150 306 182 300', SHADE, 2);
    switch (item.style) {
      case 'hoodie': {
        const hood = 'M116 176 Q150 214 184 176 Q190 168 178 164 Q150 190 122 164 Q110 168 116 176 Z';
        s += P(hood, fill, ink) + P(hood, SHADE, null) +
          P('M124 270 L176 270 L182 308 L118 308 Z', SHADE, ink, 1.2) + P('M110 328 L190 328 L190 342 L110 342 Z', SHADE, null) +
          Line('M142 196 L140 236', '#fff', 2) + Line('M158 196 L160 236', '#fff', 2);
        break;
      }
      case 'ruffle':
        s += P('M140 170 L150 196 L130 186 Z', '#fff', INK, 1.2) + P('M160 170 L150 196 L170 186 Z', '#fff', INK, 1.2) + Line('M150 196 L150 328', ink, 1.2);
        for (let y = 204; y < 300; y += 22) s += `<circle cx="150" cy="${y}" r="2.6" fill="#fff" stroke="${INK}" stroke-width=".8"/>`;
        break;
      case 'tank':
        s += Line(B.male ? 'M128 176 Q150 204 172 176' : 'M126 178 Q150 210 174 178', ink, 2);
        break;
      default:
        s += Line('M140 171 Q150 192 160 171', ink, 2.5);
        if (item.print === 'star') s += star(150, 240, 18, '#FFD93D', INK);
        if (item.print === 'heart') s += heart(150, 238, 15, '#FF4F8B', INK);
    }
    return s;
  }

  const BODICE = 'M108 192 Q128 182 150 194 Q172 182 192 192 Q200 236 178 296 L122 296 Q100 236 108 192 Z';

  function dressBody(item) {
    const fill = fillOf(item.color);
    const p = item.pattern;
    const ink = edge(fill);
    let s = '';
    switch (item.style) {
      case 'gown': {
        s += solid('M122 290 L178 290 Q206 400 236 520 Q256 610 270 702 Q232 722 196 712 Q174 724 150 714 Q126 724 104 712 Q68 722 30 702 Q44 610 64 520 Q94 400 122 290 Z', fill, p, ink);
        for (const d of ['M150 300 Q146 500 150 712', 'M138 300 Q112 500 100 708', 'M162 300 Q188 500 200 708', 'M128 300 Q80 520 62 700', 'M172 300 Q220 520 238 700'])
          s += Line(d, SHADE, 4);
        for (const d of ['M144 310 Q132 500 124 700', 'M118 320 Q90 520 80 700']) s += Line(d, SHINE, 2.5);
        s += P('M30 702 Q68 722 104 712 Q126 724 150 714 Q174 724 196 712 Q232 722 270 702 L268 690 Q150 712 32 690 Z', SHINE, null);
        s += solid(BODICE, fill, p, ink) + Line('M150 194 L150 294', SHADE, 2);
        s += P('M120 284 L180 284 L178 298 L122 298 Z', SHINE, ink, 1) + heart(150, 290, 6, '#fff', INK);
        return s;
      }
      case 'sundress':
        s += solid('M108 186 L118 178 L126 178 Q150 208 174 178 L182 178 L192 186 Q200 236 178 296 Q204 380 224 466 Q188 482 150 474 Q112 482 76 466 Q96 380 122 296 Q100 236 108 186 Z', fill, p, ink);
        for (const d of ['M138 300 Q122 390 112 472', 'M162 300 Q178 390 188 472', 'M150 300 L150 474']) s += Line(d, SHADE, 3);
        return s + P('M120 288 L180 288 L178 300 L122 300 Z', SHADE, null) + Line('M126 178 Q150 208 174 178', ink, 2);
      case 'tutu': {
        const tut = 'M120 290 L180 290 Q214 336 238 408 Q150 428 62 408 Q86 336 120 290 Z';
        s += P(tut, fill, ink);
        for (let x = 70; x <= 230; x += 16) s += `<circle cx="${x}" cy="${f1(410 + Math.sin(x) * 3)}" r="10" fill="${fill}" stroke="${ink}" stroke-width="1.2"/>`;
        s += P(tut, SHINE, null) + P(tut, PATTERN.glitter, null) + (p ? P(tut, PATTERN[p], null) : '') + P(tut, VOL, null);
        for (const d of ['M136 296 Q118 350 100 404', 'M164 296 Q182 350 200 404']) s += Line(d, SHADE, 3);
        s += solid(BODICE, fill, p, ink) + Line('M118 192 Q114 176 122 170', ink, 3) + Line('M182 192 Q186 176 178 170', ink, 3);
        return s + star(150, 292, 8, '#FFE680', INK);
      }
    }
    return s;
  }

  // The part of pants that goes on one leg (left side).
  function bottomLeg(item, B) {
    const fill = fillOf(item.color);
    const ink = edge(fill);
    switch (item.style) {
      case 'pants': case 'leggings': {
        const pants = item.style === 'pants';
        return solid(tube(B.leg, B.legW, 0, pants ? 0.97 : 0.99, pants ? 8 : 2, false), fill, item.pattern, ink) +
          Line('M136 430 Q137 520 139 660', SHADE, 3) + (pants ? Line('M132 380 Q130 440 134 500', SHINE, 2) : '');
      }
      case 'shorts':
        return solid(tube(B.leg, B.legW, 0, 0.22, 10, false), fill, item.pattern, ink) + P(tube(B.leg, B.legW, 0.18, 0.22, 11, false), SHADE, null);
    }
    return '';
  }

  function bottomHip(item, B) {
    const fill = fillOf(item.color);
    const p = item.pattern;
    const ink = edge(fill);
    const band = P('M118 292 L182 292 L183 302 L117 302 Z', SHADE, ink, 1);
    switch (item.style) {
      case 'pants': case 'leggings': case 'shorts':
        return solid(B.hip, fill, p, ink) + band + Line('M150 302 L150 352', ink, 1.4) +
          (item.style === 'pants' ? both(Line('M124 310 Q132 318 140 312', ink, 1.2)) : '');
      case 'skirt': {
        let s = solid('M120 290 L180 290 Q196 350 210 424 Q150 436 90 424 Q104 350 120 290 Z', fill, p, ink);
        for (const d of ['M132 300 L116 428', 'M150 300 L150 432', 'M168 300 L184 428']) s += Line(d, SHADE, 3);
        return s + band;
      }
      case 'tutu': {
        const tut = 'M120 290 L180 290 Q206 330 226 392 Q150 410 74 392 Q94 330 120 290 Z';
        let s = P(tut, fill, ink);
        for (let x = 82; x <= 218; x += 15) s += `<circle cx="${x}" cy="${f1(394 + Math.sin(x) * 3)}" r="9" fill="${fill}" stroke="${ink}" stroke-width="1.2"/>`;
        return s + P(tut, SHINE, null) + P(tut, PATTERN.glitter, null) + P(tut, VOL, null) + band;
      }
    }
    return '';
  }

  // Shoes that cover the whole foot, so no bare foot is drawn underneath.
  const CLOSED_SHOES = ['boots', 'rainboots', 'skates', 'sneakers', 'bunny', 'glass'];

  // One shoe (left foot).
  function shoe(item, skin, B) {
    const glass = item.style === 'glass';
    const fill = glass ? 'rgba(200,240,255,.8)' : fillOf(item.color);
    const ink = glass ? '#7FB8D8' : edge(fill);
    const foot = 'M128 680 Q124 702 128 722 Q138 734 148 722 Q152 702 148 680 Z';
    const bare = P(FOOT, skin, darken(skin, 0.68));
    switch (item.style) {
      case 'sneakers':
        return solid(foot, fill, item.color === 'rainbow' ? 'glitter' : null, ink) +
          P('M127 712 Q138 728 149 712 L149 718 Q138 736 127 718 Z', '#fff', ink, 1.2) +
          Line('M133 690 L143 690', ink, 1.4) + Line('M133 697 L143 697', ink, 1.4) + Line('M133 704 L143 704', ink, 1.4);
      case 'skates':
        return solid(tube(B.leg, B.legW, 0.9, 1, 8, false), fill, null, ink) + solid(foot, fill, null, ink) +
          P('M125 714 L151 714 L151 724 L125 724 Z', '#B9B9C9', INK, 1.2) +
          `<circle cx="131" cy="730" r="5" fill="#FF6FB5" stroke="${INK}" stroke-width="1"/><circle cx="145" cy="730" r="5" fill="#FF6FB5" stroke="${INK}" stroke-width="1"/>` +
          Line('M132 676 L144 676', ink, 1.4) + Line('M132 684 L144 684', ink, 1.4);
      case 'boots': case 'rainboots': {
        const top = item.style === 'boots' ? 0.72 : 0.8;
        return solid(tube(B.leg, B.legW, top, 1, 6, false), fill, null, ink) + solid(foot, fill, null, ink) +
          P(tube(B.leg, B.legW, top, top + 0.025, 7, false), SHADE, null) +
          (item.style === 'rainboots' ? Line('M132 650 L132 690', SHINE, 4) : Line('M138 600 L139 690', SHADE, 2));
      }
      case 'sandals':
        return bare + P('M126 718 Q138 732 150 718 L150 724 Q138 738 126 724 Z', fill, ink) +
          Line('M130 694 L146 704', fill, 3) + Line('M146 694 L130 704', fill, 3) + Line('M131 686 L145 686', fill, 3);
      case 'flats':
        return bare + solid('M129 700 Q126 712 130 722 Q138 732 146 722 Q150 712 147 700 Q138 708 129 700 Z', fill, null, ink) + `<circle cx="138" cy="706" r="2.6" fill="#fff"/>`;
      case 'heels':
        return bare + solid('M129 698 Q126 712 131 724 Q138 732 145 724 Q150 712 147 698 Q138 704 129 698 Z', fill, 'glitter', ink) + Line('M131 690 L145 690', fill, 3);
      case 'glass':
        return bare + P(foot, fill, ink) + P(foot, PATTERN.glitter, null) + star(134, 704, 3.5, '#fff');
      case 'bunny':
        return `<ellipse cx="132" cy="676" rx="5" ry="14" fill="#fff" stroke="${INK}" stroke-width="1.2"/><ellipse cx="144" cy="676" rx="5" ry="14" fill="#fff" stroke="${INK}" stroke-width="1.2"/>` +
          `<ellipse cx="132" cy="676" rx="2" ry="9" fill="#FFC2E2"/><ellipse cx="144" cy="676" rx="2" ry="9" fill="#FFC2E2"/>` +
          `<ellipse cx="138" cy="708" rx="18" ry="24" fill="#fff" stroke="${INK}" stroke-width="1.4"/><ellipse cx="138" cy="708" rx="18" ry="24" fill="${VOL}"/>` +
          `<circle cx="132" cy="704" r="2" fill="#2A1F2D"/><circle cx="144" cy="704" r="2" fill="#2A1F2D"/><circle cx="138" cy="712" r="2.5" fill="#FF8FB1"/>`;
    }
    return '';
  }

  function nails(item) {
    if (!item || !item.color) return '';
    const fill = fillOf(item.color);
    return [[79, 424], [84, 428], [89, 424]]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="3" fill="${fill}" stroke="${INK}" stroke-width=".7"/><circle cx="${x - 0.6}" cy="${y - 1}" r=".7" fill="#fff"/>`).join('');
  }

  // ---------- Hats ----------
  function hat(item) {
    if (!item || item.style === 'none') return '';
    const c = fillOf(item.color);
    const ink = edge(c);
    switch (item.style) {
      case 'crown': {
        const d = 'M114 52 L118 14 L134 34 L150 4 L166 34 L182 14 L186 52 Z';
        return P(d, 'url(#g-gold)', '#B07A10') + P(d, PATTERN.glitter, null) + P('M114 44 L186 44 L186 54 L114 54 Z', 'rgba(150,90,0,.25)', null) +
          `<circle cx="150" cy="38" r="5" fill="#FF4F8B" stroke="${INK}"/><circle cx="148.5" cy="36.5" r="1.6" fill="#fff"/><circle cx="130" cy="44" r="3.5" fill="#4D96FF"/><circle cx="170" cy="44" r="3.5" fill="#4CD07D"/>` +
          star(150, 4, 4, '#fff');
      }
      case 'tiara':
        return P('M118 56 Q150 30 182 56 L178 60 Q150 42 122 60 Z', 'url(#g-silver)', '#8A90A8') +
          P('M140 42 L144 24 L150 36 L156 24 L160 42 Z', 'url(#g-silver)', '#8A90A8') +
          `<circle cx="150" cy="40" r="4.5" fill="#FF6FB5" stroke="${INK}"/><circle cx="148.8" cy="38.8" r="1.4" fill="#fff"/><circle cx="130" cy="50" r="2.5" fill="#A9DBFF"/><circle cx="170" cy="50" r="2.5" fill="#A9DBFF"/>`;
      case 'bow': {
        const x = 178, y = 46;
        return solid(`M${x} ${y} L${x - 26} ${y - 18} Q${x - 34} ${y} ${x - 26} ${y + 18} Z`, c, null, ink) +
          solid(`M${x} ${y} L${x + 26} ${y - 18} Q${x + 34} ${y} ${x + 26} ${y + 18} Z`, c, null, ink) +
          Line(`M${x - 22} ${y - 8} L${x - 8} ${y - 2}`, SHINE, 2.5) + `<circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke="${ink}" stroke-width="1.4"/>`;
      }
      case 'cap': {
        const brim = 'M98 72 Q150 60 202 72 Q204 84 200 86 Q150 76 100 86 Q96 84 98 72 Z';
        return solid('M104 74 Q102 22 150 22 Q198 22 196 74 Z', c, null, ink) + P(brim, c, ink) + P(brim, SHADE, null) +
          Line('M150 22 L150 64', ink, 1.2) + `<circle cx="150" cy="22" r="4" fill="${c}" stroke="${ink}"/>` + star(130, 50, 7, '#fff');
      }
      case 'sunhat':
        return `<ellipse cx="150" cy="62" rx="86" ry="18" fill="#F2D28A" stroke="#B8924A" stroke-width="1.6"/><ellipse cx="150" cy="62" rx="86" ry="18" fill="${VOL}"/>` +
          solid('M108 62 Q106 14 150 14 Q194 14 192 62 Z', '#F2D28A', null, '#B8924A') + P('M107 48 L193 48 L192 62 L108 62 Z', '#FF6FB5', INK, 1.2) +
          `<circle cx="182" cy="52" r="8" fill="#FFD93D" stroke="${INK}"/><circle cx="182" cy="52" r="3.5" fill="#FF9F43"/>`;
      case 'beanie':
        return solid('M102 84 Q100 14 150 14 Q200 14 198 84 Z', c, null, ink) + P('M100 70 L200 70 L200 88 L100 88 Z', '#fff', INK, 1.4) +
          Line('M100 79 L200 79', c, 4) + `<circle cx="150" cy="14" r="12" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`;
      case 'flowers': {
        let s = '';
        const cols = ['#FF6FB5', '#FFD93D', '#A66CFF', '#FF9F43', '#4D96FF', '#FF6FB5', '#FFD93D'];
        for (let i = 0; i < 7; i++) {
          const a = Math.PI + (i / 6) * Math.PI;
          const x = 150 + 50 * Math.cos(a), y = 80 + 40 * Math.sin(a);
          s += `<ellipse cx="${f1(x + 7)}" cy="${f1(y + 5)}" rx="6" ry="3" fill="#4CD07D" transform="rotate(30 ${f1(x + 7)} ${f1(y + 5)})"/>`;
          for (let k = 0; k < 5; k++) {
            const b = (k / 5) * Math.PI * 2;
            s += `<circle cx="${f1(x + 5.5 * Math.cos(b))}" cy="${f1(y + 5.5 * Math.sin(b))}" r="5" fill="${cols[i]}" stroke="${INK}" stroke-width=".6"/>`;
          }
          s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="3" fill="#fff"/>`;
        }
        return s;
      }
      case 'cat':
        return solid('M110 66 L114 18 L142 44 Z', c, null, ink) + solid('M190 66 L186 18 L158 44 Z', c, null, ink) +
          P('M117 56 L119 30 L134 44 Z', '#fff', null) + P('M183 56 L181 30 L166 44 Z', '#fff', null);
      case 'bunny':
        return `<ellipse cx="128" cy="10" rx="11" ry="34" fill="#fff" stroke="${INK}" stroke-width="1.4"/><ellipse cx="128" cy="12" rx="5" ry="25" fill="#FFC2E2"/>` +
          `<ellipse cx="172" cy="10" rx="11" ry="34" fill="#fff" stroke="${INK}" stroke-width="1.4"/><ellipse cx="172" cy="12" rx="5" ry="25" fill="#FFC2E2"/>`;
      case 'cone':
        return P('M174 20 Q222 100 226 250 Q206 160 156 48 Z', 'rgba(255,255,255,.75)', 'rgba(200,160,220,.6)') +
          solid('M122 54 L150 -50 L178 54 Z', c, 'glitter', ink) +
          P('M118 46 L182 46 L182 58 L118 58 Z', 'url(#g-gold)', '#B07A10', 1.2) + star(150, -50, 8, '#FFD93D', INK);
      case 'unicorn': {
        let s = P('M140 52 L150 -6 L160 52 Z', 'url(#g-gold)', '#B07A10');
        for (let y = 6; y < 50; y += 10) s += Line(`M${f1(150 - (54 - y) * 0.18)} ${y + 5} L${f1(150 + (54 - y) * 0.18)} ${y}`, 'rgba(150,90,0,.45)', 1.6);
        return s + [[124, 56, '#FF6FB5'], [176, 56, '#A66CFF'], [136, 50, '#FFD93D'], [164, 50, '#4D96FF']]
          .map(([x, y, col]) => `<circle cx="${x}" cy="${y}" r="6" fill="${col}" stroke="${INK}" stroke-width=".8"/>`).join('');
      }
    }
    return '';
  }

  // ---------- Extras ----------
  function extraBack(item) {
    if (!item) return '';
    switch (item.style) {
      case 'fairywings': {
        const up = '<ellipse cx="96" cy="230" rx="36" ry="74" transform="rotate(-34 96 230)"/>';
        const low = '<ellipse cx="110" cy="320" rx="22" ry="44" transform="rotate(28 110 320)"/>';
        return `<g class="wings">` + both(`<g fill="#C9ECFF" stroke="#8CC8F0" stroke-width="2" opacity=".9">${up}</g><g fill="#E6D4FF" stroke="#B9A0EE" stroke-width="2" opacity=".9">${low}</g>` +
          `<g fill="url(#p-glitter)">${up}${low}</g>` + Line('M140 220 Q100 220 72 170', 'rgba(140,200,240,.8)', 1.5)) + '</g>';
      }
      case 'butterfly':
        return `<g class="wings">` + both('<path d="M150 230 C110 120 30 130 44 210 C52 262 104 262 150 246 Z" fill="#FF6FB5" stroke="#B83D7E" stroke-width="2"/>' +
          '<path d="M150 250 C110 268 70 330 98 350 C126 366 144 300 150 262 Z" fill="#A66CFF" stroke="#6A3FC0" stroke-width="2"/>' +
          '<circle cx="76" cy="196" r="12" fill="#FFD93D" stroke="#B83D7E"/><circle cx="104" cy="330" r="7" fill="#fff"/><circle cx="100" cy="226" r="6" fill="#fff"/>') + '</g>';
      case 'cape': {
        const c = fillOf(item.color);
        return solid('M104 182 L196 182 Q236 420 262 700 Q150 726 38 700 Q64 420 104 182 Z', c, null, edge(c)) +
          Line('M124 200 Q100 450 86 700', SHADE, 4) + Line('M176 200 Q200 450 214 700', SHADE, 4);
      }
    }
    return '';
  }

  function extraChest(item) {
    if (!item) return '';
    switch (item.style) {
      case 'necklace': return Line('M138 168 Q150 196 162 168', '#E6B422', 1.6) + heart(150, 194, 6, '#FF4F8B', INK);
      case 'pearls': {
        let s = '';
        for (let i = 0; i <= 10; i++) {
          const t = i / 10, x = 134 + 32 * t, y = 168 + 22 * Math.sin(Math.PI * t);
          s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="3" fill="#FFF8F0" stroke="rgba(120,90,80,.5)" stroke-width=".8"/><circle cx="${f1(x - 0.8)}" cy="${f1(y - 0.8)}" r=".9" fill="#fff"/>`;
        }
        return s;
      }
      case 'cape':
        return [104, 114, 124, 176, 186, 196].map(x => `<circle cx="${x}" cy="${f1(184 - Math.abs(150 - x) * 0.05)}" r="8" fill="#fff" stroke="${INK}" stroke-width="1"/>`).join('') +
          `<circle cx="114" cy="186" r="1.6" fill="#2A1F2D"/><circle cx="186" cy="186" r="1.6" fill="#2A1F2D"/>`;
      case 'scarf': {
        const c = fillOf(item.color), ink = edge(c);
        return solid('M130 160 Q150 176 170 160 L176 180 Q150 200 124 180 Z', c, 'stripes', ink) + solid('M156 186 L172 184 L176 260 L160 262 Z', c, 'stripes', ink) +
          Line('M160 262 L162 272', ink, 1.4) + Line('M168 262 L170 272', ink, 1.4) + Line('M175 260 L177 270', ink, 1.4);
      }
    }
    return '';
  }

  function extraFace(item) {
    if (!item) return '';
    switch (item.style) {
      case 'glasses':
        return `<circle cx="132" cy="93" r="14" fill="rgba(255,255,255,.18)" stroke="#5A3A4A" stroke-width="2.6"/>` +
          `<circle cx="168" cy="93" r="14" fill="rgba(255,255,255,.18)" stroke="#5A3A4A" stroke-width="2.6"/>` + Line('M146 91 L154 91', '#5A3A4A', 2.6) +
          Line('M118 90 L108 88', '#5A3A4A', 2.4) + Line('M182 90 L192 88', '#5A3A4A', 2.4) + Line('M124 86 L130 82', SHINE, 2) + Line('M160 86 L166 82', SHINE, 2);
      case 'sunglasses':
        return P('M116 84 L146 84 Q147 104 131 105 Q115 104 116 84 Z', '#2A1F2D', null) + P('M154 84 L184 84 Q185 104 169 105 Q153 104 154 84 Z', '#2A1F2D', null) +
          Line('M146 86 L154 86', '#2A1F2D', 2.6) + Line('M121 89 L131 89', 'rgba(255,255,255,.55)', 2) + Line('M159 89 L169 89', 'rgba(255,255,255,.55)', 2);
      case 'heartglasses':
        return heart(132, 95, 14, 'rgba(255,79,139,.92)', '#B0245E') + heart(168, 95, 14, 'rgba(255,79,139,.92)', '#B0245E') + Line('M144 88 L156 88', '#B0245E', 2.4) +
          `<ellipse cx="126" cy="90" rx="3.5" ry="2" fill="${SHINE}"/><ellipse cx="162" cy="90" rx="3.5" ry="2" fill="${SHINE}"/>`;
    }
    return '';
  }

  // Something held in a hand. The purse goes in the left hand, the wand in the right
  // (drawn here as a left hand and mirrored).
  function handItem(item, side) {
    if (!item) return '';
    if (item.style === 'purse' && side === 'l') {
      const c = fillOf(item.color), ink = edge(c);
      return Line('M76 400 Q62 380 88 396', ink, 2) +
        solid('M56 410 L96 410 L100 446 Q76 454 52 446 Z', c, null, ink) + P('M56 410 L96 410 L97 420 L55 420 Z', SHADE, null) + heart(76, 434, 6, '#fff');
    }
    if (item.style === 'wand' && side === 'r') {
      return Line('M84 410 L64 330', '#fff', 4) + Line('M84 410 L64 330', 'rgba(0,0,0,.2)', 1) + star(62, 322, 14, 'url(#g-gold)', '#B07A10') +
        star(44, 300, 4, '#FFE680') + star(80, 300, 3, '#fff') + star(40, 336, 3, '#FF6FB5');
    }
    return '';
  }

  // ---------- Put it all together ----------
  function outfit(look) {
    const o = {};
    for (const k in look) o[k] = look[k] ? ITEM[look[k]] : null;
    return o;
  }

  // `only` limits drawing to some layers, so the picker can show one item by itself.
  function draw(look, kind = 'adult', only = null) {
    const o = outfit(look);
    const B = kind === 'broad' || kind === 'flat-broad' ? GUY : DOLL;
    const skin = o.skin ? o.skin.hex : '#F8C9A2';
    const skinInk = darken(skin, 0.68);
    const hc = o.hairColor ? o.hairColor.hex : '#6B4226';
    const ec = fillOf(o.eyeColor ? o.eyeColor.color : 'brown');
    const hairStyle = o.hair ? o.hair.style : 'short';
    const show = cat => !only || only.includes(cat);
    const bodyOn = show('body');
    const headOn = show('head');
    const hairOn = headOn || show('hair');
    const wearsDress = o.dress && show('dress');

    // One leg, drawn for the left side and mirrored.
    const leg = (() => {
      let s = '';
      if (bodyOn) {
        s += P(tube(B.leg, B.legW, 0, 0.995), skin, skinInk) + P(tube(B.leg, B.legW, 0, 0.995), VOL, null) + Line('M138 500 Q134 520 138 534', SHADE, 2);
        if (!o.shoes || !CLOSED_SHOES.includes(o.shoes.style)) s += P(FOOT, skin, skinInk);
      }
      if (show('bottom') && !o.dress && o.bottom) s += bottomLeg(o.bottom, B);
      if (show('shoes') && o.shoes) s += shoe(o.shoes, skin, B);
      return s;
    })();

    // One arm with its sleeve, hand, nails and anything it holds.
    const arm = side => {
      let s = '';
      if (bodyOn) s += P(tube(B.arm, B.armW, 0, 0.995), skin, skinInk) + P(tube(B.arm, B.armW, 0, 0.995), VOL, null);
      if (wearsDress) s += dressSleeve(o.dress);
      else if (show('top') && o.top && !o.dress) s += topSleeve(o.top, B);
      if (bodyOn || show('hands')) s += P(HAND, skin, skinInk) + P(HAND, VOL, null) + P(THUMB, skin, skinInk);
      if (show('nails')) s += nails(o.nails);
      if (show('extra')) s += handItem(o.extra, side);
      return s;
    };

    let body = '';
    if (bodyOn) body += `<ellipse cx="150" cy="728" rx="56" ry="9" fill="rgba(60,20,70,.18)"/>`;
    if (show('extra')) body += extraBack(o.extra);
    body += `<g class="leg leg-l">${leg}</g><g class="leg leg-r">${mirror(leg)}</g>`;
    if (bodyOn) {
      body += P(B.torso, skin, skinInk) + P(B.torso, VOL, null) + P('M140 140 Q150 152 160 140 L160 156 Q150 162 140 156 Z', SHADE, null);
      body += Line('M124 186 Q134 190 142 186', SHADE, 1.6) + Line('M176 186 Q166 190 158 186', SHADE, 1.6);
    }
    if (show('bottom') && !o.dress && o.bottom) body += bottomHip(o.bottom, B);
    if (wearsDress) body += dressBody(o.dress);
    else if (show('top') && o.top && !o.dress) body += topBody(o.top, B);
    if (show('extra')) body += extraChest(o.extra);
    body += `<g class="arm arm-l">${arm('l')}</g><g class="arm arm-r">${mirror(arm('r'))}</g>`;

    const back = hairOn ? hairBack(hairStyle, hc) : '';
    let head = '';
    if (headOn) {
      head += both(`<ellipse cx="108" cy="97" rx="6" ry="10" fill="${skin}" stroke="${skinInk}" stroke-width="1.4"/>`);
      const faceD = kind === 'kid' ? KID_FACE : B.face;
      head += P(faceD, skin, skinInk) + P(faceD, 'url(#g-face)', null) + P('M112 112 Q120 136 150 146 Q130 140 116 120 Z', SHADE, null);
      if (B.male) head += Line('M124 136 Q150 152 176 136', SHADE, 2);
      if (show('face')) head += facePaint(o.face ? o.face.style : 'none');
      const young = kind === 'kid';
      head += eyes(o.eyes ? o.eyes.style : 'round', ec, skin, B.male, young);
      head += young
        ? Line('M146 112 Q150 115 154 112', darken(skin, 0.72), 1.4)
        : Line(B.male ? 'M150 94 Q145 108 148 114' : 'M150 96 Q146 106 149 112', darken(skin, 0.8), 1.6) +
          Line('M145 114 Q150 117 155 114', darken(skin, 0.7), 1.4) + `<ellipse cx="152" cy="108" rx="2" ry="3" fill="#fff" opacity=".35"/>`;
      head += mouth(o.lips, skin, B.male);
    }
    if (hairOn) head += hairFront(hairStyle, hc);
    if (show('extra')) head += extraFace(o.extra);
    if (show('hat')) head += hat(o.hat);

    // Hair that hangs down the back goes behind the body.
    if (kind === 'flat' || kind === 'flat-broad') return back + body + head;
    const at = (y, scale, svg) => `<g transform="translate(150 ${y}) scale(${scale}) translate(-150 -150)">${svg}</g>`;
    const headG = `<g class="head">${head}</g>`;
    if (kind === 'kid') {
      return `<g class="doll">${at(306, 1.34, back)}<g transform="translate(150 730) scale(.88 .72) translate(-150 -730)">${body}</g>${at(306, 1.34, headG)}</g>`;
    }
    return `<g class="doll">${at(158, 1.18, back)}${body}${at(158, 1.18, headG)}</g>`;
  }

  const VIEW = {
    full: '0 -96 300 836',
    head: '78 -10 144 170',
    face: '110 62 80 76',
    hair: '62 4 176 230',
    top: '62 150 176 200',
    dress: '20 150 260 590',
    shortdress: '50 150 200 340',
    bottom: '56 280 188 460',
    shortbottom: '64 280 172 170',
    shoes: '112 652 76 92',
    boots: '104 560 92 184',
    nails: '64 382 40 54',
    wings: '20 110 260 270',
    chest: '106 140 88 140',
    hand: '20 290 120 170',
    wand: '160 290 120 170',
  };

  // How to show each item by itself in the picker.
  const FACE_PARTS = ['head', 'hair'];
  function thumbFor(item) {
    switch (item.cat) {
      case 'skin': return { view: 'head', only: FACE_PARTS };
      case 'eyes': case 'eyeColor': case 'lips': return { view: 'face', only: ['head'] };
      case 'face': return { view: 'face', only: ['head', 'face'] };
      case 'hair': case 'hairColor': return { view: 'hair', only: FACE_PARTS };
      case 'hat': return { view: 'head', only: [...FACE_PARTS, 'hat'] };
      case 'top': return { view: 'top', only: ['top'] };
      case 'dress': return { view: item.style === 'gown' ? 'dress' : 'shortdress', only: ['dress'] };
      case 'bottom': return { view: ['shorts', 'skirt', 'tutu'].includes(item.style) ? 'shortbottom' : 'bottom', only: ['bottom'] };
      case 'shoes': return { view: ['boots', 'rainboots', 'skates'].includes(item.style) ? 'boots' : 'shoes', only: ['shoes'] };
      case 'nails': return { view: 'nails', only: ['hands', 'nails'] };
      case 'extra':
        if (['glasses', 'sunglasses', 'heartglasses'].includes(item.style)) return { view: 'face', only: ['head', 'extra'] };
        if (['fairywings', 'butterfly'].includes(item.style)) return { view: 'wings', only: ['extra'] };
        if (['necklace', 'pearls', 'scarf'].includes(item.style)) return { view: 'chest', only: ['extra'] };
        if (item.style === 'cape') return { view: 'dress', only: ['extra'] };
        if (item.style === 'wand') return { view: 'wand', only: ['extra', 'hands'] };
        if (item.style === 'purse') return { view: 'hand', only: ['extra', 'hands'] };
        return { view: 'head', only: FACE_PARTS };
    }
    return { view: 'full', only: null };
  }

  const svgTag = (view, inner, clip) =>
    `<svg viewBox="${VIEW[view]}"${clip ? ' style="overflow:hidden"' : ''} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  return {
    svg: (look, kind = 'adult') => svgTag('full', draw(look, kind)),
    thumb: (look, item) => { const t = thumbFor(item); return svgTag(t.view, draw(look, 'flat', t.only), true); },
    head: (look, kind) => svgTag('head', draw(look, kind === 'broad' ? 'flat-broad' : 'flat', ['head', 'hair', 'face', 'hat']), true),
    outfit, star, heart,
  };
})();

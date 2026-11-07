// Draws a character as SVG from a "look" (one item id per category).
// The body is drawn on a 300 x 480 grid, facing forward:
// head centered at (150,128), shoulders at y 210, hips at y 300, feet at y 424.

const Avatar = (() => {
  const LINE = '#5A3A4A';
  const SHADE = 'rgba(60,20,60,.13)';
  const SHINE = 'rgba(255,255,255,.45)';
  const PATTERN = { dots: 'url(#p-dots)', stripes: 'url(#p-stripes)', glitter: 'url(#p-glitter)' };

  // Body landmarks
  const ARM_L = [[101, 222], [80, 312]];
  const ARM_R = [[199, 222], [220, 312]];
  const HAND_L = [79, 319];
  const HAND_R = [221, 319];
  const LEG_L = [[132, 300], [130, 414]];
  const LEG_R = [[168, 300], [170, 414]];

  const fillOf = c => (COLORS[c] ? COLORS[c].hex : c || '#ccc');
  const lerp = ([a, b], t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const line = (p, q, color, width, cap = 'round') =>
    `<path d="M${p[0]} ${p[1]} L${q[0]} ${q[1]}" stroke="${color}" stroke-width="${width}" stroke-linecap="${cap}" fill="none"/>`;
  const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
  const withPattern = (d, fill, pattern) => path(d, fill) + (pattern ? path(d, PATTERN[pattern]) : '');
  const mirror = svg => `<g transform="translate(300 0) scale(-1 1)">${svg}</g>`;
  const star = (x, y, r, fill) => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const rr = i % 2 ? r * 0.45 : r;
      d += `${i ? 'L' : 'M'}${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`;
    }
    return path(d + 'Z', fill);
  };
  const heart = (x, y, s, fill) =>
    path(`M${x} ${y + s * 0.9} C${x - s * 1.4} ${y} ${x - s * 0.8} ${y - s} ${x} ${y - s * 0.35} C${x + s * 0.8} ${y - s} ${x + s * 1.4} ${y} ${x} ${y + s * 0.9} Z`, fill);

  // ---------- Hair ----------
  const CAP_BACK = 'M74 142 C64 58 108 42 150 42 C192 42 236 58 226 142 Z';
  const FRINGE = 'M76 126 C72 62 108 46 150 46 C192 46 228 62 224 126 C214 104 198 92 178 90 C166 102 136 104 118 96 C102 102 86 110 76 126 Z';
  const SIDEPART = 'M76 132 C68 58 112 44 154 44 C198 44 232 64 224 124 C204 94 168 82 130 86 C106 92 86 110 76 132 Z';
  const STRAIGHT = 'M76 122 C76 60 110 46 150 46 C190 46 224 60 224 122 L224 128 Q150 98 76 128 Z';

  function hairBack(style, hc) {
    switch (style) {
      case 'short': return path(CAP_BACK, hc);
      case 'spiky': return path(CAP_BACK, hc);
      case 'bob': return path('M68 136 C62 50 110 40 150 40 C190 40 238 50 232 136 L234 202 Q150 216 66 202 Z', hc);
      case 'long': return path('M68 136 C62 50 110 40 150 40 C190 40 238 50 232 136 L240 302 Q150 322 60 302 Z', hc);
      case 'superlong': return path('M68 136 C62 50 110 40 150 40 C190 40 238 50 232 136 L246 436 Q150 456 54 436 Z', hc);
      case 'wavy': {
        let s = path('M68 136 C62 50 110 40 150 40 C190 40 238 50 232 136 L238 290 L62 290 Z', hc);
        for (let x = 66; x <= 234; x += 24) s += `<circle cx="${x}" cy="${292 + ((x / 24) % 2) * 6}" r="17" fill="${hc}"/>`;
        return s;
      }
      case 'ponytail':
        return path(CAP_BACK, hc) +
          path('M200 72 C262 62 274 150 252 232 C246 252 230 246 234 226 C250 156 236 104 196 92 Z', hc);
      case 'pigtails': {
        const tail = 'M90 110 C40 120 34 204 52 246 C58 258 72 254 68 236 C58 192 66 150 98 130 Z';
        return path(CAP_BACK, hc) + path(tail, hc) + mirror(path(tail, hc));
      }
      case 'buns':
        return path(CAP_BACK, hc) + `<circle cx="92" cy="62" r="28" fill="${hc}"/><circle cx="208" cy="62" r="28" fill="${hc}"/>`;
      case 'puffs':
        return path(CAP_BACK, hc) + `<circle cx="80" cy="74" r="36" fill="${hc}"/><circle cx="220" cy="74" r="36" fill="${hc}"/>`;
      case 'curly': {
        let s = '';
        for (let a = 150; a <= 390; a += 20) {
          const r = (a * Math.PI) / 180;
          s += `<circle cx="${(150 + 80 * Math.cos(r)).toFixed(1)}" cy="${(128 + 76 * Math.sin(r)).toFixed(1)}" r="24" fill="${hc}"/>`;
        }
        return s;
      }
      case 'braid': return path(CAP_BACK, hc);
      default: return '';
    }
  }

  function hairFront(style, hc) {
    let s = '';
    switch (style) {
      case 'short': s = path(SIDEPART, hc); break;
      case 'spiky': s = path('M76 128 L78 66 L100 84 L106 40 L130 70 L150 30 L170 70 L194 40 L200 84 L222 66 L224 128 Q150 94 76 128 Z', hc); break;
      case 'bob': case 'buns': s = path(STRAIGHT, hc); break;
      case 'long': case 'superlong': case 'wavy': case 'puffs': s = path(SIDEPART, hc); break;
      case 'ponytail': case 'pigtails': s = path(FRINGE, hc) + tie(style); break;
      case 'curly':
        for (const [x, y] of [[96, 92], [116, 72], [140, 62], [164, 62], [186, 72], [204, 92]]) s += `<circle cx="${x}" cy="${y}" r="20" fill="${hc}"/>`;
        break;
      case 'braid': {
        s = path(FRINGE, hc);
        for (let i = 0; i < 9; i++) {
          const x = 212 + i * 2.2, y = 150 + i * 19;
          s += `<ellipse cx="${x}" cy="${y}" rx="14" ry="13" fill="${hc}"/><path d="M${x - 12} ${y + 3} Q${x} ${y + 12} ${x + 12} ${y + 3}" stroke="${SHADE}" stroke-width="3" fill="none"/>`;
        }
        s += `<circle cx="230" cy="324" r="7" fill="#FF6FB5"/>`;
        break;
      }
    }
    // a shiny streak so hair looks soft
    if (s) s += `<path d="M112 66 Q130 56 152 56" stroke="${SHINE}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
    return s;
  }

  function tie(style) {
    if (style === 'ponytail') return `<circle cx="204" cy="84" r="8" fill="#FF6FB5"/>`;
    return `<circle cx="74" cy="134" r="8" fill="#FF6FB5"/><circle cx="226" cy="134" r="8" fill="#FF6FB5"/>`;
  }

  // ---------- Face ----------
  function eyes(style, ec, skin) {
    const one = (x, mirrorWink) => {
      const y = 138;
      switch (style) {
        case 'happy': return `<path d="M${x - 12} ${y + 3} Q${x} ${y - 10} ${x + 12} ${y + 3}" stroke="${LINE}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`;
        case 'wink':
          if (mirrorWink) return `<path d="M${x - 12} ${y} Q${x} ${y + 8} ${x + 12} ${y}" stroke="${LINE}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`;
          return roundEye(x, y, 11, 13, 8);
        case 'star': return star(x, y, 15, ec) + `<circle cx="${x - 3}" cy="${y - 4}" r="2.5" fill="#fff"/>`;
        case 'heart': return heart(x, y, 12, ec) + `<circle cx="${x - 4}" cy="${y - 3}" r="2.5" fill="#fff"/>`;
        case 'sparkly': return roundEye(x, y, 14, 16, 11, true);
        case 'sleepy':
          return roundEye(x, y, 11, 13, 8) +
            `<path d="M${x - 13} ${y - 15} L${x + 13} ${y - 15} L${x + 13} ${y - 1} Q${x} ${y + 3} ${x - 13} ${y - 1} Z" fill="${skin}"/>` +
            `<path d="M${x - 12} ${y - 1} Q${x} ${y + 3} ${x + 12} ${y - 1}" stroke="${LINE}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        case 'lashes':
          return roundEye(x, y, 11, 13, 8) + [-1, 0, 1].map(k => {
            const side = x < 150 ? -1 : 1;
            const bx = x + side * 6 + k * 5, by = y - 11 + Math.abs(k);
            return `<path d="M${bx} ${by} L${bx + side * 5 + k * 2} ${by - 7}" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`;
          }).join('');
        default: return roundEye(x, y, 11, 13, 8);
      }
    };
    const roundEye = (x, y, rx, ry, ir, extraShine) =>
      `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff"/>` +
      `<circle cx="${x}" cy="${y + 1}" r="${ir}" fill="${ec}"/>` +
      `<circle cx="${x}" cy="${y + 1}" r="${ir * 0.45}" fill="#2A1F2D"/>` +
      `<circle cx="${x - ir * 0.35}" cy="${y - ir * 0.35}" r="${ir * 0.3}" fill="#fff"/>` +
      (extraShine ? `<circle cx="${x + ir * 0.4}" cy="${y + ir * 0.45}" r="${ir * 0.16}" fill="#fff"/>` : '');
    return one(122, false) + one(178, true);
  }

  function facePaint(style) {
    switch (style) {
      case 'blush': return `<ellipse cx="104" cy="160" rx="14" ry="8" fill="#FF8FB1" opacity=".55"/><ellipse cx="196" cy="160" rx="14" ry="8" fill="#FF8FB1" opacity=".55"/>`;
      case 'freckles': return [[100, 154], [108, 160], [96, 162], [200, 154], [192, 160], [204, 162]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#B07850"/>`).join('');
      case 'stars': return star(102, 160, 9, '#FFD93D') + star(198, 160, 9, '#FFD93D') + star(214, 146, 5, '#FF6FB5');
      case 'hearts': return heart(102, 160, 8, '#FF4F8B') + heart(198, 160, 8, '#FF4F8B');
      case 'eyeshadow':
        return `<path d="M108 128 Q122 112 136 128" stroke="url(#g-rainbow)" stroke-width="8" stroke-linecap="round" fill="none" opacity=".85"/>` +
               `<path d="M164 128 Q178 112 192 128" stroke="url(#g-rainbow)" stroke-width="8" stroke-linecap="round" fill="none" opacity=".85"/>`;
      case 'glitter': return [[100, 150], [110, 164], [94, 168], [200, 150], [190, 164], [206, 168], [150, 104], [140, 96], [160, 96]]
        .map(([x, y], i) => star(x, y, i % 3 ? 3.5 : 5, i % 2 ? '#FFE680' : '#FFFFFF')).join('');
      case 'whiskers':
        return `<circle cx="150" cy="153" r="5" fill="#FF8FB1"/>` +
          [[-1, 152], [-1, 160], [1, 152], [1, 160]].map(([s, y]) =>
            `<path d="M${150 + s * 22} ${y} L${150 + s * 52} ${y + (y - 156) * 1.5}" stroke="${LINE}" stroke-width="2.5" stroke-linecap="round"/>`).join('');
      default: return '';
    }
  }

  function mouth(lips) {
    if (!lips || !lips.color) {
      return `<path d="M135 166 Q150 180 165 166" stroke="#8A3B3B" stroke-width="4" stroke-linecap="round" fill="none"/>`;
    }
    const c = fillOf(lips.color);
    return path('M133 164 Q141 160 150 165 Q159 160 167 164 Q160 184 150 184 Q140 184 133 164 Z', c) +
      (['gold', 'rainbow'].includes(lips.color) ? path('M133 164 Q141 160 150 165 Q159 160 167 164 Q160 184 150 184 Q140 184 133 164 Z', PATTERN.glitter) : '') +
      `<path d="M136 167 Q150 174 164 167" stroke="rgba(90,30,50,.45)" stroke-width="2" fill="none"/>` +
      `<ellipse cx="144" cy="176" rx="4" ry="2" fill="${SHINE}"/>`;
  }

  // ---------- Clothes ----------
  const NECKLINE = skin => path('M133 202 Q150 222 167 202 Z', skin);

  function sleeves(style, fill) {
    const end = { tee: 0.36, startee: 0.36, hearttee: 0.36, crop: 0.3, long: 0.88, hoodie: 0.9 }[style];
    if (!end) return '';
    return line([104, 218], lerp(ARM_L, end), fill, 30) + line([196, 218], lerp(ARM_R, end), fill, 30) +
      (end > 0.8 ? line(lerp(ARM_L, end - 0.02), lerp(ARM_L, end), SHADE, 30) + line(lerp(ARM_R, end - 0.02), lerp(ARM_R, end), SHADE, 30) : '');
  }

  function top(item, skin) {
    const fill = fillOf(item.color);
    const p = item.pattern;
    let s = sleeves(item.style, fill);
    switch (item.style) {
      case 'tank':
        s += withPattern('M104 220 L116 204 L126 204 Q150 230 174 204 L184 204 L196 220 L200 306 L100 306 Z', fill, p);
        return s;
      case 'crop':
        s += withPattern('M96 210 Q150 196 204 210 L200 268 L100 268 Z', fill, p) + NECKLINE(skin);
        return s;
      case 'ruffle':
        s += `<circle cx="102" cy="222" r="19" fill="${fill}"/><circle cx="198" cy="222" r="19" fill="${fill}"/>`;
        s += withPattern('M96 210 Q150 196 204 210 L200 306 L100 306 Z', fill, p) + NECKLINE(skin);
        for (let x = 128; x <= 172; x += 11) s += `<circle cx="${x}" cy="210" r="8" fill="${fill}"/><circle cx="${x}" cy="210" r="8" fill="${SHINE}"/>`;
        return s;
      case 'hoodie':
        s += withPattern('M96 210 Q150 196 204 210 L200 306 L100 306 Z', fill, p);
        s += path('M118 268 L182 268 L188 300 L112 300 Z', SHADE);
        s += path('M108 206 Q150 234 192 206 Q196 190 180 186 L120 186 Q104 190 108 206 Z', fill) + path('M108 206 Q150 234 192 206 Q196 190 180 186 L120 186 Q104 190 108 206 Z', SHADE);
        s += NECKLINE(skin) + line([142, 214], [140, 244], '#fff', 3) + line([158, 214], [160, 244], '#fff', 3);
        return s;
      default:
        s += withPattern('M96 210 Q150 196 204 210 L200 306 L100 306 Z', fill, p) + NECKLINE(skin);
        if (item.print === 'star') s += star(150, 256, 22, '#FFD93D');
        if (item.print === 'heart') s += heart(150, 254, 18, '#FF4F8B');
        if (item.style === 'long') s += path('M100 296 L200 296 L200 306 L100 306 Z', SHADE);
        return s;
    }
  }

  function dress(item, skin) {
    const fill = fillOf(item.color);
    const p = item.pattern;
    let s = '';
    switch (item.style) {
      case 'gown': {
        const skirt = 'M110 276 L190 276 Q246 360 262 428 Q150 448 38 428 Q54 360 110 276 Z';
        s += withPattern(skirt, fill, p);
        s += path('M150 290 Q140 360 120 438', 'none', `stroke="${SHADE}" stroke-width="4"`) + path('M150 290 Q160 360 180 438', 'none', `stroke="${SHADE}" stroke-width="4"`);
        s += `<circle cx="101" cy="222" r="19" fill="${fill}"/><circle cx="199" cy="222" r="19" fill="${fill}"/>`;
        s += withPattern('M100 210 Q150 197 200 210 L192 282 L108 282 Z', fill, p) + NECKLINE(skin);
        s += path('M106 274 L194 274 L192 290 L108 290 Z', SHINE);
        return s;
      }
      case 'sundress':
        return withPattern('M104 220 L116 204 L126 204 Q150 230 174 204 L184 204 L196 220 L196 282 Q236 330 244 372 Q150 390 56 372 Q64 330 104 282 Z', fill, p) +
          path('M104 278 L196 278 L196 290 L104 290 Z', SHADE);
      case 'tutu': {
        s += path('M100 284 L200 284 L248 346 L52 346 Z', fill);
        for (let x = 60; x <= 240; x += 20) s += `<circle cx="${x}" cy="346" r="13" fill="${fill}"/>`;
        s += path('M100 284 L200 284 L248 346 L52 346 Z', SHINE) + (p ? path('M100 284 L200 284 L248 346 L52 346 Z', PATTERN[p]) : '');
        s += withPattern('M100 210 Q150 197 200 210 L196 292 L104 292 Z', fill, p) + NECKLINE(skin);
        s += heart(150, 288, 9, '#fff');
        return s;
      }
    }
    return s;
  }

  function bottom(item) {
    const fill = fillOf(item.color);
    const p = item.pattern;
    const hip = 'M102 294 L198 294 L198 326 L102 326 Z';
    switch (item.style) {
      case 'pants':
      case 'leggings': {
        const w = item.style === 'pants' ? 34 : 28;
        return withPattern(hip, fill, p) + line(LEG_L[0], [130, 410], fill, w) + line(LEG_R[0], [170, 410], fill, w) +
          (p ? line(LEG_L[0], [130, 410], PATTERN[p], w) + line(LEG_R[0], [170, 410], PATTERN[p], w) : '') +
          line([150, 300], [150, 320], SHADE, 3);
      }
      case 'shorts':
        return withPattern(hip, fill, p) + line(LEG_L[0], [131, 340], fill, 38, 'butt') + line(LEG_R[0], [169, 340], fill, 38, 'butt') +
          (p ? line(LEG_L[0], [131, 340], PATTERN[p], 38, 'butt') + line(LEG_R[0], [169, 340], PATTERN[p], 38, 'butt') : '');
      case 'skirt':
        return withPattern('M102 294 L198 294 L228 370 Q150 382 72 370 Z', fill, p) + path('M102 294 L198 294 L198 304 L102 304 Z', SHADE);
      case 'tutu': {
        let s = path('M102 294 L198 294 L238 348 L62 348 Z', fill);
        for (let x = 70; x <= 230; x += 20) s += `<circle cx="${x}" cy="348" r="12" fill="${fill}"/>`;
        return s + path('M102 294 L198 294 L238 348 L62 348 Z', PATTERN.glitter);
      }
    }
    return '';
  }

  function shoe(item, skin) {
    const fill = fillOf(item.color);
    const x = 124, y = 424;
    switch (item.style) {
      case 'sneakers':
        return `<ellipse cx="${x}" cy="${y}" rx="23" ry="13" fill="${fill}"/>` +
          (item.color === 'rainbow' ? `<ellipse cx="${x}" cy="${y}" rx="23" ry="13" fill="${PATTERN.glitter}"/>` : '') +
          `<path d="M101 428 Q124 442 147 428 L147 433 Q124 446 101 433 Z" fill="#fff" stroke="rgba(0,0,0,.12)"/>` +
          line([118, 416], [130, 416], LINE, 2) + line([118, 421], [130, 421], LINE, 2);
      case 'boots': case 'rainboots':
        return path(`M114 ${item.style === 'boots' ? 372 : 384} L146 ${item.style === 'boots' ? 372 : 384} L146 424 L114 424 Z`, fill) +
          `<ellipse cx="${x - 2}" cy="${y}" rx="23" ry="12" fill="${fill}"/>` +
          path(`M114 ${item.style === 'boots' ? 372 : 384} L146 ${item.style === 'boots' ? 372 : 384} L146 ${item.style === 'boots' ? 382 : 392} L114 ${item.style === 'boots' ? 382 : 392} Z`, SHADE) +
          (item.style === 'rainboots' ? `<ellipse cx="122" cy="400" rx="4" ry="10" fill="${SHINE}"/>` : '');
      case 'sandals':
        return `<ellipse cx="${x}" cy="${y}" rx="21" ry="11" fill="${skin}"/>` +
          `<ellipse cx="${x}" cy="${y + 7}" rx="23" ry="6" fill="${fill}"/>` +
          line([108, 418], [140, 426], fill, 5) + line([140, 418], [108, 426], fill, 5);
      case 'flats':
        return `<ellipse cx="${x}" cy="${y}" rx="21" ry="11" fill="${fill}"/>` +
          `<ellipse cx="${x}" cy="${y - 4}" rx="11" ry="5" fill="${skin}"/>` + `<circle cx="${x}" cy="${y - 8}" r="4" fill="#fff"/>`;
      case 'heels':
        return path(`M136 424 L142 444 L148 444 L146 424 Z`, fill) +
          `<ellipse cx="${x}" cy="${y}" rx="21" ry="11" fill="${fill}"/><ellipse cx="${x}" cy="${y}" rx="21" ry="11" fill="${PATTERN.glitter}"/>` +
          `<ellipse cx="${x}" cy="${y - 4}" rx="10" ry="5" fill="${skin}"/>`;
      case 'glass':
        return `<ellipse cx="${x}" cy="${y}" rx="22" ry="12" fill="rgba(190,235,255,.85)" stroke="#fff" stroke-width="2"/>` +
          `<ellipse cx="${x}" cy="${y}" rx="22" ry="12" fill="${PATTERN.glitter}"/>` + star(x - 8, y - 4, 4, '#fff');
      case 'bunny':
        return `<ellipse cx="${x - 8}" cy="${y - 18}" rx="5" ry="13" fill="#fff" stroke="#FFC2E2" stroke-width="2"/><ellipse cx="${x + 6}" cy="${y - 18}" rx="5" ry="13" fill="#fff" stroke="#FFC2E2" stroke-width="2"/>` +
          `<ellipse cx="${x}" cy="${y}" rx="24" ry="14" fill="#fff" stroke="rgba(0,0,0,.08)"/>` +
          `<circle cx="${x - 7}" cy="${y - 3}" r="2.5" fill="${LINE}"/><circle cx="${x + 7}" cy="${y - 3}" r="2.5" fill="${LINE}"/><circle cx="${x}" cy="${y + 3}" r="3" fill="#FF8FB1"/>`;
    }
    return '';
  }

  function nails(item) {
    if (!item || !item.color) return '';
    const fill = fillOf(item.color);
    const set = ([hx, hy]) => [[-7, 9], [0, 11.5], [7, 9]]
      .map(([dx, dy]) => `<ellipse cx="${hx + dx}" cy="${hy + dy}" rx="3.2" ry="4" fill="${fill}" stroke="rgba(0,0,0,.15)" stroke-width=".8"/>`).join('');
    return set(HAND_L) + set(HAND_R);
  }

  // ---------- Hats ----------
  function hat(item) {
    if (!item || item.style === 'none') return '';
    const c = fillOf(item.color);
    switch (item.style) {
      case 'crown':
        return path('M102 74 L108 26 L128 50 L150 14 L172 50 L192 26 L198 74 Z', 'url(#g-gold)') +
          path('M102 74 L108 26 L128 50 L150 14 L172 50 L192 26 L198 74 Z', PATTERN.glitter) +
          path('M102 62 L198 62 L198 76 L102 76 Z', 'rgba(150,90,0,.2)') +
          `<circle cx="150" cy="56" r="7" fill="#FF4F8B"/><circle cx="122" cy="62" r="5" fill="#4D96FF"/><circle cx="178" cy="62" r="5" fill="#4CD07D"/>`;
      case 'tiara':
        return path('M108 72 Q150 44 192 72 L186 76 Q150 58 114 76 Z', 'url(#g-silver)') +
          path('M136 56 L142 36 L150 50 L158 36 L164 56 Z', 'url(#g-silver)') + `<circle cx="150" cy="54" r="6" fill="#FF6FB5"/>` +
          `<circle cx="126" cy="62" r="3.5" fill="#A9DBFF"/><circle cx="174" cy="62" r="3.5" fill="#A9DBFF"/>`;
      case 'bow': {
        const x = 194, y = 58;
        return path(`M${x} ${y} L${x - 34} ${y - 24} Q${x - 46} ${y} ${x - 34} ${y + 24} Z`, c) +
          path(`M${x} ${y} L${x + 34} ${y - 24} Q${x + 46} ${y} ${x + 34} ${y + 24} Z`, c) +
          `<circle cx="${x}" cy="${y}" r="10" fill="${c}"/><circle cx="${x}" cy="${y}" r="10" fill="${SHADE}"/>`;
      }
      case 'cap':
        return path('M80 98 Q80 34 150 34 Q220 34 220 98 Z', c) + `<ellipse cx="150" cy="96" rx="82" ry="12" fill="${c}"/>` +
          `<ellipse cx="150" cy="96" rx="82" ry="12" fill="${SHADE}"/><circle cx="150" cy="36" r="6" fill="${c}"/>` + star(150, 66, 14, '#fff');
      case 'sunhat':
        return `<ellipse cx="150" cy="74" rx="116" ry="24" fill="#F2D28A"/>` + path('M92 74 Q92 22 150 22 Q208 22 208 74 Z', '#F2D28A') +
          path('M93 60 L207 60 L208 74 L92 74 Z', '#FF6FB5') + `<circle cx="196" cy="62" r="11" fill="#FFD93D"/><circle cx="196" cy="62" r="5" fill="#FF9F43"/>`;
      case 'beanie':
        return path('M76 104 Q76 26 150 26 Q224 26 224 104 Z', c) + path('M74 88 L226 88 L226 108 L74 108 Z', '#fff') +
          path('M74 88 L226 88 L226 108 L74 108 Z', PATTERN.stripes) + `<circle cx="150" cy="24" r="16" fill="#fff"/>`;
      case 'flowers': {
        let s = '';
        const cols = ['#FF6FB5', '#FFD93D', '#A66CFF', '#FF9F43', '#4D96FF', '#FF6FB5', '#FFD93D'];
        for (let i = 0; i < 7; i++) {
          const a = Math.PI + (i / 6) * Math.PI;
          const x = 150 + 74 * Math.cos(a), y = 98 + 50 * Math.sin(a);
          s += `<ellipse cx="${x + 9}" cy="${y + 6}" rx="8" ry="4" fill="#4CD07D" transform="rotate(30 ${x + 9} ${y + 6})"/>`;
          for (let k = 0; k < 5; k++) {
            const b = (k / 5) * Math.PI * 2;
            s += `<circle cx="${(x + 8 * Math.cos(b)).toFixed(1)}" cy="${(y + 8 * Math.sin(b)).toFixed(1)}" r="7" fill="${cols[i]}"/>`;
          }
          s += `<circle cx="${x}" cy="${y}" r="5" fill="#fff"/>`;
        }
        return s;
      }
      case 'cat':
        return path('M84 92 L92 26 L132 60 Z', c) + path('M216 92 L208 26 L168 60 Z', c) +
          path('M94 78 L98 44 L120 62 Z', '#fff') + path('M206 78 L202 44 L180 62 Z', '#fff');
      case 'bunny':
        return `<ellipse cx="118" cy="22" rx="15" ry="46" fill="#fff" stroke="rgba(0,0,0,.08)"/><ellipse cx="118" cy="24" rx="7" ry="34" fill="#FFC2E2"/>` +
          `<ellipse cx="182" cy="22" rx="15" ry="46" fill="#fff" stroke="rgba(0,0,0,.08)"/><ellipse cx="182" cy="24" rx="7" ry="34" fill="#FFC2E2"/>`;
      case 'cone':
        return path('M184 30 Q240 120 232 250 Q216 160 160 60 Z', 'rgba(255,255,255,.7)') +
          path('M116 68 L150 -34 L184 68 Z', c) + path('M116 68 L150 -34 L184 68 Z', PATTERN.glitter) +
          path('M112 60 L188 60 L188 74 L112 74 Z', 'url(#g-gold)') + star(150, -34, 10, '#FFD93D');
      case 'unicorn': {
        let s = path('M136 66 L150 -4 L164 66 Z', 'url(#g-gold)');
        for (let y = 10; y < 62; y += 12) s += line([150 - (66 - y) * 0.2, y + 6], [150 + (66 - y) * 0.2, y], 'rgba(150,90,0,.35)', 2.5);
        s += `<circle cx="120" cy="70" r="9" fill="#FF6FB5"/><circle cx="180" cy="70" r="9" fill="#A66CFF"/><circle cx="134" cy="62" r="6" fill="#FFD93D"/><circle cx="166" cy="62" r="6" fill="#4D96FF"/>`;
        return s;
      }
    }
    return '';
  }

  // ---------- Extras ----------
  function extraBack(item) {
    if (!item) return '';
    switch (item.style) {
      case 'fairywings':
        return `<g opacity=".85">` +
          `<ellipse cx="78" cy="226" rx="44" ry="74" transform="rotate(-32 78 226)" fill="#C9ECFF" stroke="#fff" stroke-width="3"/>` +
          `<ellipse cx="222" cy="226" rx="44" ry="74" transform="rotate(32 222 226)" fill="#C9ECFF" stroke="#fff" stroke-width="3"/>` +
          `<ellipse cx="96" cy="300" rx="28" ry="44" transform="rotate(30 96 300)" fill="#E6D4FF" stroke="#fff" stroke-width="3"/>` +
          `<ellipse cx="204" cy="300" rx="28" ry="44" transform="rotate(-30 204 300)" fill="#E6D4FF" stroke="#fff" stroke-width="3"/>` +
          `<ellipse cx="78" cy="226" rx="44" ry="74" transform="rotate(-32 78 226)" fill="url(#p-glitter)"/>` +
          `<ellipse cx="222" cy="226" rx="44" ry="74" transform="rotate(32 222 226)" fill="url(#p-glitter)"/></g>`;
      case 'butterfly':
        return `<path d="M150 240 C90 140 20 160 40 230 C50 270 100 270 150 250 Z" fill="#FF6FB5"/>` +
          `<path d="M150 240 C210 140 280 160 260 230 C250 270 200 270 150 250 Z" fill="#FF6FB5"/>` +
          `<path d="M150 252 C100 270 60 320 90 340 C120 356 140 300 150 262 Z" fill="#A66CFF"/>` +
          `<path d="M150 252 C200 270 240 320 210 340 C180 356 160 300 150 262 Z" fill="#A66CFF"/>` +
          `<circle cx="72" cy="206" r="13" fill="#FFD93D"/><circle cx="228" cy="206" r="13" fill="#FFD93D"/>` +
          `<circle cx="96" cy="318" r="8" fill="#fff"/><circle cx="204" cy="318" r="8" fill="#fff"/>`;
      case 'cape':
        return path('M98 212 L202 212 L252 440 Q150 456 48 440 Z', fillOf(item.color)) + path('M120 220 L100 440', 'none', `stroke="${SHADE}" stroke-width="4"`) + path('M180 220 L200 440', 'none', `stroke="${SHADE}" stroke-width="4"`);
    }
    return '';
  }

  function extraChest(item) {
    if (!item) return '';
    switch (item.style) {
      case 'necklace':
        return `<path d="M126 206 Q150 238 174 206" stroke="#E6B422" stroke-width="2.5" fill="none"/>` + heart(150, 236, 9, '#FF4F8B');
      case 'pearls': {
        let s = '';
        for (let i = 0; i <= 10; i++) {
          const t = i / 10, x = 124 + 52 * t, y = 206 + 26 * Math.sin(Math.PI * t);
          s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="#FFF8F0" stroke="rgba(0,0,0,.12)"/>`;
        }
        return s;
      }
      case 'cape':
        return [100, 112, 124, 176, 188, 200].map(x => `<circle cx="${x}" cy="${212 + (x < 150 ? (x - 100) * 0.1 : (200 - x) * 0.1)}" r="9" fill="#fff"/>`).join('') +
          `<circle cx="112" cy="214" r="2" fill="${LINE}"/><circle cx="188" cy="214" r="2" fill="${LINE}"/>`;
      case 'scarf':
        return path('M116 194 Q150 214 184 194 L188 214 Q150 236 112 214 Z', fillOf(item.color)) +
          path('M164 214 L180 214 L184 270 L166 270 Z', fillOf(item.color)) + path('M116 194 Q150 214 184 194 L188 214 Q150 236 112 214 Z', PATTERN.stripes) +
          path('M164 214 L180 214 L184 270 L166 270 Z', PATTERN.stripes);
    }
    return '';
  }

  function extraFace(item) {
    if (!item) return '';
    switch (item.style) {
      case 'glasses':
        return `<circle cx="122" cy="138" r="19" fill="rgba(255,255,255,.18)" stroke="#5A3A4A" stroke-width="4"/>` +
          `<circle cx="178" cy="138" r="19" fill="rgba(255,255,255,.18)" stroke="#5A3A4A" stroke-width="4"/>` + line([141, 136], [159, 136], '#5A3A4A', 4);
      case 'sunglasses':
        return path('M100 126 L144 126 Q146 154 122 156 Q100 154 100 126 Z', '#2A1F2D') + path('M156 126 L200 126 Q200 154 178 156 Q154 154 156 126 Z', '#2A1F2D') +
          line([144, 130], [156, 130], '#2A1F2D', 4) + line([108, 132], [120, 132], 'rgba(255,255,255,.5)', 3) + line([164, 132], [176, 132], 'rgba(255,255,255,.5)', 3);
      case 'heartglasses':
        return heart(122, 140, 20, 'rgba(255,79,139,.9)') + heart(178, 140, 20, 'rgba(255,79,139,.9)') + line([140, 132], [160, 132], '#FF4F8B', 4) +
          `<ellipse cx="114" cy="134" rx="5" ry="3" fill="${SHINE}"/><ellipse cx="170" cy="134" rx="5" ry="3" fill="${SHINE}"/>`;
    }
    return '';
  }

  function extraHand(item) {
    if (!item) return '';
    switch (item.style) {
      case 'wand':
        return line([222, 324], [254, 252], '#fff', 6) + line([222, 324], [254, 252], 'rgba(0,0,0,.12)', 2) + star(256, 246, 18, 'url(#g-gold)') +
          star(276, 226, 5, '#FFE680') + star(238, 224, 4, '#fff') + star(282, 258, 4, '#FF6FB5');
      case 'purse':
        return `<path d="M70 318 Q60 290 84 300" stroke="${fillOf(item.color)}" stroke-width="4" fill="none"/>` +
          path('M50 330 L96 330 L100 366 Q73 374 46 366 Z', fillOf(item.color)) + path('M50 330 L96 330 L97 340 L49 340 Z', SHADE) + heart(73, 352, 7, '#fff');
    }
    return '';
  }

  // ---------- Put it all together ----------
  function outfit(look) {
    const o = {};
    for (const k in look) o[k] = look[k] ? ITEM[look[k]] : null;
    return o;
  }

  function draw(look) {
    const o = outfit(look);
    const skin = o.skin ? o.skin.hex : '#F8C9A2';
    const hc = o.hairColor ? o.hairColor.hex : '#6B4226';
    const ec = fillOf(o.eyeColor ? o.eyeColor.color : 'brown');
    const hairStyle = o.hair ? o.hair.style : 'short';

    let s = '<g>';
    s += extraBack(o.extra);
    s += hairBack(hairStyle, hc);

    // legs and feet
    s += line(LEG_L[0], LEG_L[1], skin, 26) + line(LEG_R[0], LEG_R[1], skin, 26);
    if (!o.dress && o.bottom) s += bottom(o.bottom);
    if (o.shoes) s += shoe(o.shoes, skin) + mirror(shoe(o.shoes, skin));

    // body
    s += `<rect x="139" y="182" width="22" height="34" rx="8" fill="${skin}"/>`;
    s += path('M102 212 Q150 200 198 212 L194 302 L106 302 Z', skin);
    s += line(ARM_L[0], ARM_L[1], skin, 22) + line(ARM_R[0], ARM_R[1], skin, 22);
    if (o.dress) s += dress(o.dress, skin);
    else if (o.top) s += top(o.top, skin);
    s += extraChest(o.extra);
    s += `<circle cx="${HAND_L[0]}" cy="${HAND_L[1]}" r="13" fill="${skin}"/><circle cx="${HAND_R[0]}" cy="${HAND_R[1]}" r="13" fill="${skin}"/>`;
    s += nails(o.nails);
    s += extraHand(o.extra);

    // head
    s += `<circle cx="78" cy="138" r="13" fill="${skin}"/><circle cx="222" cy="138" r="13" fill="${skin}"/>`;
    s += `<circle cx="78" cy="138" r="6" fill="${SHADE}"/><circle cx="222" cy="138" r="6" fill="${SHADE}"/>`;
    s += `<ellipse cx="150" cy="128" rx="72" ry="70" fill="${skin}"/>`;
    s += facePaint(o.face ? o.face.style : 'none');
    s += eyes(o.eyes ? o.eyes.style : 'round', ec, skin);
    s += `<path d="M110 114 Q122 106 134 112" stroke="${hc}" stroke-width="4.5" stroke-linecap="round" fill="none"/>` +
         `<path d="M166 112 Q178 106 190 114" stroke="${hc}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`;
    s += `<path d="M146 152 Q150 156 154 152" stroke="rgba(0,0,0,.22)" stroke-width="3" stroke-linecap="round" fill="none"/>`;
    s += mouth(o.lips);
    s += hairFront(hairStyle, hc);
    s += extraFace(o.extra);
    s += hat(o.hat);
    s += '</g>';
    return s;
  }

  const VIEW = {
    full: '18 -44 264 500',
    head: '62 20 176 196',
    face: '84 96 132 100',
    hair: '40 -8 220 330',
    top: '50 182 200 140',
    dress: '30 186 240 264',
    bottom: '56 284 188 166',
    shoes: '88 376 124 76',
    nails: '54 296 50 50',
  };
  const CATEGORY_VIEW = {
    skin: 'head', eyes: 'face', eyeColor: 'face', lips: 'face', face: 'face', hair: 'hair', hairColor: 'hair',
    hat: 'head', top: 'top', dress: 'dress', bottom: 'bottom', shoes: 'shoes', nails: 'nails', extra: 'full',
  };

  function svg(look, view = 'full', cls = '') {
    const clip = view === 'full' ? '' : ' style="overflow:hidden"';
    return `<svg class="${cls}" viewBox="${VIEW[view]}"${clip} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${draw(look)}</svg>`;
  }

  return { svg, draw, outfit, CATEGORY_VIEW, star, heart };
})();

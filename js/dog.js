// The family dog: a white, fluffy dog with pointy ears and a curled tail.
// Drawn in code on the same 1024 x 2560 canvas as the painted family, so he stands at a real dog's
// size next to them (his paws on the same floor line, y = 2440). When a painted dog arrives
// (art/dolls/dog/base.png, see docs/dog-art-prompt.md) the painted one is used instead, wearing the
// same items, because both use the "dog" items in PAINTED_CATALOG.

// Only the part of the canvas where the dog is, so he isn't a tall invisible box in the castle.
const DOG_VIEW = '62 1340 900 1180';

const DogArt = (() => {
  const FUR = 'url(#dog-fur)';
  const RUFF = 'url(#dog-ruff)';
  const INK = '#B9AFD0';
  const DARK = '#2B2233';
  const TRIM = 'rgba(60,30,80,.35)';

  // Shared gradients go in the page-level defs (gradients inside a hidden screen don't paint elsewhere).
  const defs = document.getElementById('dyn-defs');
  if (defs && !document.getElementById('dog-fur')) {
    defs.insertAdjacentHTML('beforeend', `
      <radialGradient id="dog-fur" cx=".42" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F8F6FD"/><stop offset="1" stop-color="#D9D2EA"/></radialGradient>
      <radialGradient id="dog-ruff" cx=".45" cy=".35" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".75" stop-color="#FBFAFE"/><stop offset="1" stop-color="#E4DEF0"/></radialGradient>
      <radialGradient id="dog-pink" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#FFB3C8"/><stop offset="1" stop-color="#F48CAB"/></radialGradient>`);
  }

  const r1 = n => Math.round(n * 10) / 10;

  // A fluffy oval: an ellipse with little bumps all the way around.
  function fluff(cx, cy, rx, ry, n = 18, amp = 0.1) {
    let d = '';
    for (let k = 0; k <= n; k++) {
      const a = (k / n) * 2 * Math.PI - Math.PI / 2;
      const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
      if (!k) { d += `M${r1(x)} ${r1(y)}`; continue; }
      const m = ((k - 0.5) / n) * 2 * Math.PI - Math.PI / 2;
      d += ` Q${r1(cx + rx * (1 + amp) * Math.cos(m))} ${r1(cy + ry * (1 + amp) * Math.sin(m))} ${r1(x)} ${r1(y)}`;
    }
    return d + 'Z';
  }

  function heart(cx, cy, s) {
    return `M${cx} ${cy + s * 0.9} C${cx - s * 1.3} ${cy + s * 0.1} ${cx - s * 0.9} ${cy - s * 0.9} ${cx} ${cy - s * 0.35}
      C${cx + s * 0.9} ${cy - s * 0.9} ${cx + s * 1.3} ${cy + s * 0.1} ${cx} ${cy + s * 0.9}Z`;
  }

  // Color for an item: recolorable items use the paint colors; gold and rainbow use the shared gradients.
  const colorOf = it => {
    if (!it.tint) return null;
    if (it.color === 'gold') return 'url(#g-gold)';
    if (it.color === 'rainbow') return 'url(#g-rainbow)';
    return PAINT_HEX[it.color] || '#FF7DB8';
  };
  // A colored shape with a soft round shine, so clothes look a little 3D.
  const cloth = (d, fill, extra = '') =>
    `<path d="${d}" fill="${fill}" stroke="${TRIM}" stroke-width="5" stroke-linejoin="round"${extra}/><path d="${d}" fill="url(#g-vol)"${extra}/>`;

  // ----- The items -----
  const DRAW = {
    'hat-crown': () => `
      <path d="M440 1578 L430 1478 L472 1522 L512 1458 L552 1522 L594 1478 L584 1578 Q512 1596 440 1578Z" fill="url(#g-gold)" stroke="#C98B12" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="512" cy="1546" r="11" fill="#FF6FB5" stroke="#fff" stroke-width="3"/>
      <circle cx="468" cy="1556" r="7" fill="#4D96FF"/><circle cx="556" cy="1556" r="7" fill="#4D96FF"/>
      <circle cx="430" cy="1476" r="7" fill="#FFE98A"/><circle cx="512" cy="1456" r="8" fill="#FFE98A"/><circle cx="594" cy="1476" r="7" fill="#FFE98A"/>`,
    'hat-tiara': () => `
      <path d="M418 1590 Q512 1548 606 1590" fill="none" stroke="url(#g-silver)" stroke-width="14" stroke-linecap="round"/>
      <path d="M466 1576 L486 1536 L512 1500 L538 1536 L558 1576 Q512 1562 466 1576Z" fill="url(#g-silver)" stroke="#A9AFC6" stroke-width="4"/>
      <circle cx="512" cy="1542" r="13" fill="#FF6FB5" stroke="#fff" stroke-width="3"/>
      <circle cx="458" cy="1574" r="6" fill="#B07CFF"/><circle cx="566" cy="1574" r="6" fill="#B07CFF"/>`,
    'hat-party-tint': it => `<g transform="rotate(12 512 1580)">
      ${cloth('M460 1582 L512 1392 L564 1582 Q512 1604 460 1582Z', colorOf(it))}
      <circle cx="497" cy="1530" r="9" fill="#fff" opacity=".8"/><circle cx="526" cy="1480" r="8" fill="#fff" opacity=".8"/><circle cx="532" cy="1555" r="8" fill="#fff" opacity=".8"/>
      <circle cx="512" cy="1390" r="22" fill="#fff" stroke="${TRIM}" stroke-width="4"/></g>`,
    'hat-bow-tint': it => {
      const c = colorOf(it);
      return `${cloth('M590 1560 C545 1498 500 1526 516 1582 C528 1616 568 1594 590 1560Z', c)}
        ${cloth('M590 1560 C635 1498 680 1526 664 1582 C652 1616 612 1594 590 1560Z', c)}
        ${cloth('M580 1570 L560 1630 L580 1622 L592 1640 L600 1572Z', c)}
        <circle cx="590" cy="1562" r="19" fill="${c}" stroke="${TRIM}" stroke-width="4"/><circle cx="584" cy="1555" r="6" fill="#fff" opacity=".6"/>`;
    },
    'hat-flowers': () => {
      const cols = ['#FF7DB8', '#B07CFF', '#FFD93D', '#6AA8FF', '#FF7DB8', '#B07CFF', '#FFD93D'];
      let s = '';
      cols.forEach((col, k) => {
        const t = k / (cols.length - 1);
        const x = 398 + 228 * t;
        const y = 1606 - Math.sin(t * Math.PI) * 52;
        s += `<ellipse cx="${r1(x - 16)}" cy="${r1(y + 12)}" rx="13" ry="6" fill="#4CD07D" transform="rotate(-30 ${r1(x - 16)} ${r1(y + 12)})"/>`;
        for (let p = 0; p < 5; p++) {
          const a = (p / 5) * 2 * Math.PI;
          s += `<circle cx="${r1(x + 13 * Math.cos(a))}" cy="${r1(y + 13 * Math.sin(a))}" r="12" fill="${col}"/>`;
        }
        s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="9" fill="#FFF3A8" stroke="#F5B921" stroke-width="2"/>`;
      });
      return s;
    },
    'extra-sunglasses': () => `
      <path d="M476 1672 Q512 1656 548 1672" fill="none" stroke="#C2185B" stroke-width="7" stroke-linecap="round"/>
      <path d="${heart(446, 1680, 40)}" fill="#FF6FB5" fill-opacity=".92" stroke="#C2185B" stroke-width="6"/>
      <path d="${heart(578, 1680, 40)}" fill="#FF6FB5" fill-opacity=".92" stroke="#C2185B" stroke-width="6"/>
      <ellipse cx="432" cy="1664" rx="11" ry="7" fill="#fff" opacity=".7"/><ellipse cx="564" cy="1664" rx="11" ry="7" fill="#fff" opacity=".7"/>
      <path d="M408 1668 L370 1650 M616 1668 L654 1650" stroke="#C2185B" stroke-width="7" stroke-linecap="round"/>`,
    'extra-collar-tint': it => `
      ${cloth('M384 1812 Q512 1878 640 1812 L642 1846 Q512 1916 382 1846Z', colorOf(it))}
      <circle cx="430" cy="1846" r="6" fill="#fff" opacity=".8"/><circle cx="594" cy="1846" r="6" fill="#fff" opacity=".8"/>
      <circle cx="512" cy="1904" r="25" fill="url(#g-gold)" stroke="#C98B12" stroke-width="4"/>
      <path d="${heart(512, 1904, 11)}" fill="#FF6FB5"/>`,
    'extra-bandana-tint': it => `
      ${cloth('M378 1812 Q512 1872 646 1812 L606 1882 Q562 1962 512 2012 Q462 1962 418 1882Z', colorOf(it))}
      <circle cx="470" cy="1880" r="8" fill="#fff" opacity=".85"/><circle cx="554" cy="1880" r="8" fill="#fff" opacity=".85"/>
      <circle cx="512" cy="1930" r="8" fill="#fff" opacity=".85"/><circle cx="488" cy="1972" r="6" fill="#fff" opacity=".85"/>
      <circle cx="536" cy="1972" r="6" fill="#fff" opacity=".85"/><circle cx="512" cy="1866" r="7" fill="#fff" opacity=".85"/>`,
    'extra-cape-tint': it => `
      ${cloth('M372 1830 Q246 2060 208 2386 Q512 2430 816 2386 Q778 2060 652 1830Z', colorOf(it))}
      <path d="M208 2386 Q512 2430 816 2386" fill="none" stroke="url(#g-gold)" stroke-width="16" stroke-linecap="round"/>`,
    'extra-wings': () => `<g class="wings" opacity=".85">
      <ellipse cx="326" cy="1940" rx="150" ry="82" transform="rotate(-28 326 1940)" fill="url(#g-rainbow)" fill-opacity=".45" stroke="#fff" stroke-width="6"/>
      <ellipse cx="698" cy="1940" rx="150" ry="82" transform="rotate(28 698 1940)" fill="url(#g-rainbow)" fill-opacity=".45" stroke="#fff" stroke-width="6"/>
      <ellipse cx="356" cy="2100" rx="104" ry="58" transform="rotate(22 356 2100)" fill="url(#g-rainbow)" fill-opacity=".4" stroke="#fff" stroke-width="5"/>
      <ellipse cx="668" cy="2100" rx="104" ry="58" transform="rotate(-22 668 2100)" fill="url(#g-rainbow)" fill-opacity=".4" stroke="#fff" stroke-width="5"/>
      <circle cx="300" cy="1900" r="8" fill="#fff"/><circle cx="724" cy="1900" r="8" fill="#fff"/><circle cx="350" cy="2080" r="6" fill="#fff"/><circle cx="674" cy="2080" r="6" fill="#fff"/></g>`,
    'top-sweater-tint': it => {
      const c = colorOf(it);
      const d = 'M392 1868 Q512 1902 632 1868 C704 1884 742 1972 736 2074 C732 2156 708 2208 664 2230 Q512 2270 360 2230 C316 2208 292 2156 288 2074 C282 1972 320 1884 392 1868Z';
      return `${cloth(d, c)}
        <path d="M388 1866 Q512 1904 636 1866" fill="none" stroke="${c}" stroke-width="24" stroke-linecap="round"/>
        <path d="M388 1866 Q512 1904 636 1866" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="6" stroke-dasharray="4 10" stroke-linecap="round"/>
        <path d="M364 2222 Q512 2260 660 2222" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="8" stroke-dasharray="4 12" stroke-linecap="round"/>
        <path d="M340 1990 q18 60 6 130 M684 1990 q-18 60 -6 130" fill="none" stroke="rgba(60,30,80,.18)" stroke-width="6" stroke-linecap="round"/>
        <path d="${heart(512, 2040, 36)}" fill="#fff" opacity=".85"/>`;
    },
    'top-tutu-tint': it => {
      const c = colorOf(it);
      return `<path d="${fluff(512, 2196, 262, 64, 28, 0.28)}" fill="${c}" stroke="${TRIM}" stroke-width="4"/>
        <path d="${fluff(512, 2186, 236, 46, 24, 0.3)}" fill="#fff" opacity=".35"/>
        ${cloth('M296 2148 Q512 2192 728 2148 L728 2174 Q512 2218 296 2174Z', c)}
        <circle cx="512" cy="2184" r="10" fill="#fff" opacity=".8"/>`;
    },
  };

  // Booties go on the paws, inside each leg so they move with it.
  function bootie(cx, y, s, fill, bottom = 2442) {
    const d = `M${cx - 52 * s} ${bottom} Q${cx - 58 * s} ${y + 22} ${cx - 42 * s} ${y} L${cx + 42 * s} ${y} Q${cx + 58 * s} ${y + 22} ${cx + 52 * s} ${bottom}Z`;
    return `${cloth(d, fill)}<rect x="${cx - 46 * s}" y="${y - 12}" width="${92 * s}" height="24" rx="12" fill="#fff" stroke="${TRIM}" stroke-width="4"/>`;
  }

  // Every drawn item, so the game knows what the drawn dog can wear.
  const draws = item => item.body === 'dog' && (!!DRAW[item.file] || item.file === 'shoes-booties-tint');

  // ----- The dog -----
  function paw(cx, y, rx, ry) {
    return `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${ry}" fill="${FUR}" stroke="${INK}" stroke-width="6"/>
      <path d="M${cx - rx * 0.35} ${y + ry * 0.1} v${ry * 0.6} M${cx} ${y + ry * 0.15} v${ry * 0.7} M${cx + rx * 0.35} ${y + ry * 0.1} v${ry * 0.6}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  }

  // A furry leg: wide at the top, narrower at the ankle, with little tufts on the sides.
  function legPath(cx, top, bottom, wTop, wBot) {
    const h = bottom - top;
    const l = t => cx - (wTop + (wBot - wTop) * t) / 2;
    const r = t => cx + (wTop + (wBot - wTop) * t) / 2;
    let d = `M${l(0)} ${top}`;
    for (const t of [0.25, 0.5, 0.75, 1]) d += ` Q${l(t - 0.125) - 10} ${top + h * (t - 0.125)} ${l(t)} ${top + h * t}`;
    d += ` L${r(1)} ${bottom}`;
    for (const t of [0.75, 0.5, 0.25, 0]) d += ` Q${r(t + 0.125) + 10} ${top + h * (t + 0.125)} ${r(t)} ${top + h * t}`;
    return d + 'Z';
  }

  function frontLeg(cx, cls, boot) {
    return `<g class="leg ${cls}">
      <path d="${legPath(cx, 2100, 2400, 96, 70)}" fill="${FUR}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <ellipse cx="${cx}" cy="2104" rx="50" ry="20" fill="${FUR}"/>
      ${paw(cx, 2410, 52, 28)}
      ${boot ? bootie(cx, 2352, 1, boot) : ''}
    </g>`;
  }

  function hindLeg(cx, boot) {
    return `<path d="${fluff(cx, 2230, 74, 92, 12, 0.1)}" fill="${FUR}" stroke="${INK}" stroke-width="6"/>
      <path d="${legPath(cx, 2270, 2392, 70, 60)}" fill="${FUR}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="${fluff(cx, 2250, 66, 70, 10, 0.08)}" fill="${FUR}"/>
      ${paw(cx, 2400, 44, 22)}${boot ? bootie(cx, 2346, 0.86, boot, 2424) : ''}`;
  }

  function ear(flip) {
    const m = x => (flip ? 1024 - x : x);
    return `<path d="M${m(390)} 1648 L${m(376)} 1446 Q${m(384)} 1426 ${m(402)} 1438 L${m(498)} 1562Z" fill="${FUR}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M${m(400)} 1612 L${m(392)} 1478 L${m(472)} 1568Z" fill="url(#dog-pink)"/>`;
  }

  function head(o) {
    const skull = fluff(512, 1688, 152, 132, 18, 0.07);
    const cheeks = fluff(512, 1752, 168, 84, 18, 0.14);
    return `<g class="head">
      ${ear(false)}${ear(true)}
      <path d="${cheeks}" fill="none" stroke="${INK}" stroke-width="14"/>
      <path d="${skull}" fill="none" stroke="${INK}" stroke-width="14"/>
      <path d="${cheeks}" fill="${FUR}"/>
      <path d="${skull}" fill="${FUR}"/>
      <path d="M470 1590 q-10 -18 4 -30 M552 1590 q10 -18 -4 -30" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".6"/>
      <ellipse cx="512" cy="1776" rx="80" ry="58" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-opacity=".6"/>
      <ellipse cx="418" cy="1742" rx="26" ry="14" fill="#FF8FB0" opacity=".35"/>
      <ellipse cx="606" cy="1742" rx="26" ry="14" fill="#FF8FB0" opacity=".35"/>
      <g class="eyes">
        <ellipse cx="448" cy="1680" rx="26" ry="29" fill="${DARK}"/><ellipse cx="576" cy="1680" rx="26" ry="29" fill="${DARK}"/>
        <circle cx="457" cy="1668" r="10" fill="#fff"/><circle cx="585" cy="1668" r="10" fill="#fff"/>
        <circle cx="441" cy="1692" r="4" fill="#fff"/><circle cx="569" cy="1692" r="4" fill="#fff"/>
        <path d="M424 1646 q22 -12 44 -2 M556 1644 q22 -10 44 2" fill="none" stroke="#CFC6E2" stroke-width="5" stroke-linecap="round"/>
      </g>
      <path d="M512 1770 v18 M512 1788 q-26 24 -48 4 M512 1788 q26 24 48 4" fill="none" stroke="${DARK}" stroke-width="6" stroke-linecap="round"/>
      <path class="tongue" d="M492 1800 Q494 1850 512 1852 Q530 1850 532 1800Z" fill="#FF7FA0" stroke="#E05A82" stroke-width="3"/>
      <path d="M512 1806 v28" stroke="#E05A82" stroke-width="3" stroke-linecap="round"/>
      <path d="M476 1734 Q512 1716 548 1734 Q544 1764 512 1772 Q480 1764 476 1734Z" fill="${DARK}"/>
      <ellipse cx="500" cy="1734" rx="12" ry="6" fill="#fff" opacity=".55"/>
      ${o.extra && o.extra.slot === 'face' ? DRAW[o.extra.file](o.extra) : ''}
      ${o.hat ? DRAW[o.hat.file](o.hat) : ''}
    </g>`;
  }

  function inner(look) {
    const o = {};
    for (const k in look) {
      const it = look[k] ? ITEM[look[k]] : null;
      o[k] = it && draws(it) ? it : null;
    }
    const boot = o.shoes ? colorOf(o.shoes) : null;
    const extraIn = slot => (o.extra && o.extra.slot === slot ? DRAW[o.extra.file](o.extra) : '');
    const body = fluff(512, 2090, 215, 172, 22, 0.06);
    const ruff = fluff(512, 1936, 186, 142, 20, 0.11);
    return `${extraIn('back')}
      <g class="dog-tail">
        <path d="M630 2050 C760 2046 846 1956 806 1832 C786 1770 722 1758 700 1800 C732 1820 752 1862 738 1912 C718 1972 664 1992 626 1992Z" fill="${FUR}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
        <path d="M770 1870 q-10 30 -40 52" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".6"/>
      </g>
      ${hindLeg(346, boot)}${hindLeg(678, boot)}
      <path d="${body}" fill="none" stroke="${INK}" stroke-width="14"/>
      <path d="${ruff}" fill="none" stroke="${INK}" stroke-width="14"/>
      <path d="${body}" fill="${FUR}"/>
      <path d="${ruff}" fill="${RUFF}"/>
      <path d="M440 1960 q-14 22 0 44 M584 1960 q14 22 0 44 M512 2010 q-12 22 0 40" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".55"/>
      ${frontLeg(448, 'leg-l', boot)}${frontLeg(576, 'leg-r dog-paw', boot)}
      ${o.top ? DRAW[o.top.file](o.top) : ''}
      ${extraIn('chest')}
      ${head(o)}`;
  }

  const svg = (viewBox, content, cls = '') =>
    `<svg viewBox="${viewBox}"${cls ? ` class="${cls}"` : ''} style="overflow:hidden" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${content}</svg>`;

  function full(look) {
    return svg(DOG_VIEW, `<g class="doll dog-drawn"><ellipse cx="512" cy="2446" rx="270" ry="28" fill="rgba(60,20,70,.2)"/>${inner(look)}
      <rect class="hit" x="240" y="1420" width="590" height="1040" fill="transparent"/></g>`, 'dog-crop has-hit');
  }

  function around([x0, y0, x1, y1], pad = 0.06) {
    const size = Math.max(x1 - x0, y1 - y0) / (1 - 2 * pad);
    return `${(x0 + x1) / 2 - size / 2} ${(y0 + y1) / 2 - size / 2} ${size} ${size}`;
  }

  // The picture in the item picker: the dog, zoomed in on where the item goes.
  const BOX = {
    hat: [352, 1380, 672, 1700], face: [372, 1600, 652, 1790], chest: [352, 1760, 672, 2040],
    top: [282, 1820, 742, 2300], shoes: [290, 2320, 734, 2460], back: [180, 1780, 844, 2440],
  };
  function thumb(look, item) {
    const box = BOX[item.slot] || BOX[item.cat] || BOX.top;
    return svg(around(box), inner(look));
  }

  function headPic(look) {
    return svg(around([352, 1420, 672, 1860], 0.02), inner(look));
  }

  return { full, thumb, head: headPic, draws };
})();

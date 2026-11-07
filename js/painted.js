// Painted dolls: hand-painted layers (art/dolls/) stacked on top of each other.
// A family member uses a painted doll as soon as the base picture for their body exists
// (see DOLL_ART in js/doll-art.js, made by tools/build_dolls.py); until then they keep the drawn doll.
// Pieces ending in "-tint" are painted in gray and colored in here, so one painting gives many colors.

// [body, file name, category, name, price, extra details]
// "slot" says where an extra goes in the stack; "tint: true" makes one item per color.
const PAINTED_CATALOG = [
  ['woman', 'hair-long', 'hair', 'Long Hair', 0, { style: 'long' }],
  ['woman', 'hair-ponytail', 'hair', 'Ponytail', 0, { style: 'ponytail' }],
  ['woman', 'hair-curls', 'hair', 'Princess Curls', 10, { style: 'wavy' }],
  ['woman', 'hair-bun', 'hair', 'Fancy Bun', 5, { style: 'buns' }],
  ['woman', 'dress-gown', 'dress', 'Pink Princess Gown', 0, { style: 'gown', color: 'pink' }],
  ['woman', 'dress-gown-tint', 'dress', 'Princess Gown', 10, { style: 'gown', tint: true }],
  ['woman', 'dress-sundress', 'dress', 'Yellow Polka Dot Sundress', 0, { style: 'sundress', color: 'yellow', pattern: 'dots' }],
  ['woman', 'dress-party-tint', 'dress', 'Party Dress', 5, { style: 'tutu', tint: true }],
  ['woman', 'top-tee', 'top', 'Blue Star T-Shirt', 0, { style: 'tee', color: 'blue' }],
  ['woman', 'top-tee-tint', 'top', 'T-Shirt', 0, { style: 'tee', tint: true }],
  ['woman', 'top-hoodie-tint', 'top', 'Hoodie', 5, { style: 'hoodie', tint: true }],
  ['woman', 'bottom-skirt', 'bottom', 'Purple Skirt', 0, { style: 'skirt', color: 'purple' }],
  ['woman', 'bottom-skirt-tint', 'bottom', 'Skirt', 0, { style: 'skirt', tint: true }],
  ['woman', 'bottom-shorts-tint', 'bottom', 'Shorts', 0, { style: 'shorts', tint: true }],
  ['woman', 'bottom-jeans', 'bottom', 'Blue Jeans', 0, { style: 'pants', color: 'blue' }],
  ['woman', 'shoes-heels', 'shoes', 'Gold Heels', 15, { style: 'heels', color: 'gold', pattern: 'glitter' }],
  ['woman', 'shoes-sneakers-tint', 'shoes', 'Sneakers', 0, { style: 'sneakers', tint: true }],
  ['woman', 'shoes-boots', 'shoes', 'Brown Boots', 5, { style: 'boots', color: 'brown' }],
  ['woman', 'hat-tiara', 'hat', 'Tiara', 10, { style: 'tiara', color: 'silver' }],
  ['woman', 'hat-crown', 'hat', 'Gold Crown', 15, { style: 'crown', color: 'gold', pattern: 'glitter' }],
  ['woman', 'extra-wings', 'extra', 'Fairy Wings', 20, { style: 'fairywings', slot: 'back' }],
  ['woman', 'extra-necklace', 'extra', 'Heart Necklace', 5, { style: 'necklace', color: 'gold', slot: 'chest' }],
  ['woman', 'extra-sunglasses', 'extra', 'Heart Sunglasses', 10, { style: 'heartglasses', color: 'pink', slot: 'face' }],

  ['man', 'top-tee-tint', 'top', 'T-Shirt', 0, { style: 'tee', tint: true }],
  ['man', 'top-hoodie-tint', 'top', 'Hoodie', 5, { style: 'hoodie', tint: true }],
  ['man', 'top-shirt', 'top', 'Blue Button Shirt', 0, { style: 'tee', color: 'blue' }],
  ['man', 'top-tux', 'top', 'Royal Jacket', 15, { style: 'tux', color: 'navy' }],
  ['man', 'bottom-jeans', 'bottom', 'Blue Jeans', 0, { style: 'pants', color: 'blue' }],
  ['man', 'bottom-shorts-tint', 'bottom', 'Shorts', 0, { style: 'shorts', tint: true }],
  ['man', 'bottom-pants', 'bottom', 'Dress Pants', 5, { style: 'pants', color: 'navy' }],
  ['man', 'shoes-sneakers-tint', 'shoes', 'Sneakers', 0, { style: 'sneakers', tint: true }],
  ['man', 'shoes-dress', 'shoes', 'Dress Shoes', 5, { style: 'heels', color: 'brown' }],
  ['man', 'hat-crown', 'hat', 'King Crown', 15, { style: 'crown', color: 'gold', pattern: 'glitter' }],
  ['man', 'hat-cap-tint', 'hat', 'Baseball Cap', 0, { style: 'cap', tint: true }],
  ['man', 'extra-sunglasses', 'extra', 'Sunglasses', 5, { style: 'sunglasses', color: 'black', slot: 'face' }],
  ['man', 'extra-glasses', 'extra', 'Glasses', 0, { style: 'glasses', slot: 'face' }],

  ['kid', 'hair-pigtails', 'hair', 'Pigtails', 0, { style: 'pigtails' }],
  ['kid', 'hair-ponytail', 'hair', 'Ponytail', 0, { style: 'ponytail' }],
  ['kid', 'hair-long', 'hair', 'Long Hair', 0, { style: 'long' }],
  ['kid', 'hair-braids', 'hair', 'Braids', 5, { style: 'braid' }],
  ['kid', 'dress-gown-tint', 'dress', 'Princess Gown', 10, { style: 'gown', tint: true }],
  ['kid', 'dress-party-tint', 'dress', 'Party Dress', 0, { style: 'tutu', tint: true }],
  ['kid', 'dress-sundress-tint', 'dress', 'Sundress', 0, { style: 'sundress', tint: true }],
  ['kid', 'top-tee-tint', 'top', 'T-Shirt', 0, { style: 'tee', tint: true }],
  ['kid', 'top-hoodie-tint', 'top', 'Bunny Hoodie', 5, { style: 'hoodie', tint: true }],
  ['kid', 'bottom-skirt-tint', 'bottom', 'Skirt', 0, { style: 'skirt', tint: true }],
  ['kid', 'bottom-shorts-tint', 'bottom', 'Shorts', 0, { style: 'shorts', tint: true }],
  ['kid', 'bottom-leggings-tint', 'bottom', 'Leggings', 5, { style: 'leggings', tint: true }],
  ['kid', 'shoes-sneakers-tint', 'shoes', 'Sneakers', 0, { style: 'sneakers', tint: true }],
  ['kid', 'shoes-flats-tint', 'shoes', 'Ballet Shoes', 0, { style: 'flats', tint: true }],
  ['kid', 'shoes-rainboots-tint', 'shoes', 'Rain Boots', 5, { style: 'rainboots', tint: true }],
  ['kid', 'hat-tiara', 'hat', 'Tiara', 10, { style: 'tiara', color: 'silver' }],
  ['kid', 'hat-bow-tint', 'hat', 'Hair Bow', 0, { style: 'bow', tint: true }],
  ['kid', 'extra-wings', 'extra', 'Fairy Wings', 20, { style: 'fairywings', slot: 'back' }],
];

// Colors for the gray "-tint" pieces: [color, extra price]
const PAINT_COLORS = [['pink', 0], ['blue', 0], ['purple', 0], ['yellow', 0], ['green', 5], ['red', 5],
  ['white', 5], ['black', 5], ['gold', 15], ['rainbow', 20]];
const PAINT_HEX = {
  pink: '#FF7DB8', blue: '#6AA8FF', purple: '#B07CFF', yellow: '#FFD84D', green: '#5CD68A', red: '#FF5468',
  white: '#FFFFFF', black: '#5A5470', gold: 'gold', rainbow: 'rainbow',
};

// Hair colors work on any painted hair. Blonde is the hair as painted.
const PAINT_HAIR = [
  ['blonde', 'Blonde Hair', 0, null, null],
  ['brown', 'Brown Hair', 0, '#9A6A48', 'multiply'],
  ['black', 'Black Hair', 0, '#5A4A55', 'multiply'],
  ['red', 'Red Hair', 0, '#E8784A', 'multiply'],
  ['pink', 'Pink Hair', 5, '#FF6FB5', 'color'],
  ['purple', 'Purple Hair', 5, '#A66CFF', 'color'],
  ['blue', 'Blue Hair', 5, '#5AA6FF', 'color'],
  ['mint', 'Mint Hair', 5, '#4CD0A0', 'color'],
];

const Painted = (() => {
  const has = key => !!(typeof DOLL_ART !== 'undefined' && DOLL_ART[key]);
  const src = key => `art/dolls-web/${key}.webp`;

  // Turn the catalog into game items (added to ITEMS so coins, unlocking and the fashion show work as usual).
  for (const [body, file, cat, name, price, opts] of PAINTED_CATALOG) {
    const base = { cat, body, file, painted: true, ...opts };
    if (opts.tint) {
      for (const [color, extra] of PAINT_COLORS) {
        add(cat, `p-${body}-${file}-${color}`, `${COLORS[color].name} ${name}`, price + extra,
          { ...base, color, pattern: ['gold', 'rainbow'].includes(color) ? 'glitter' : opts.pattern });
      }
    } else {
      add(cat, `p-${body}-${file}`, name, price, base);
    }
  }
  for (const [color, name, price, hex, mode] of PAINT_HAIR) {
    add('hairColor', `p-hair-${color}`, name, price, { body: '*', painted: true, color, hex, mode });
  }

  const files = item => item.cat === 'hair' ? [`${item.body}/${item.file}-back`, `${item.body}/${item.file}-front`] : [`${item.body}/${item.file}`];
  const hasHair = body => PAINTED_CATALOG.some(([b, file, cat]) => b === body && cat === 'hair' && has(`${b}/${file}-back`) && has(`${b}/${file}-front`));
  // The kid doll is painted bald (hair is separate), so she waits until a hairstyle exists.
  const bodyReady = body => has(`${body}/base`) && (body === 'man' || hasHair(body));
  const available = item => item.body === '*' || files(item).every(has);

  // ----- Coloring the gray pieces (done once per piece and color, then reused) -----
  const images = {};
  const tinted = {};
  function load(key) {
    if (!images[key]) { images[key] = new Image(); images[key].src = src(key); }
    return images[key];
  }
  // Gold and rainbow stretch across the painted part of the piece only, so small pieces get every color.
  function paint(ctx, box, color) {
    const [x0, y0, x1, y1] = box;
    if (color === 'gold') {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, '#FFE98A'); g.addColorStop(0.5, '#F2B320'); g.addColorStop(1, '#FFE07A');
      return g;
    }
    if (color === 'rainbow') {
      const g = ctx.createLinearGradient(x0, y0, x1, y0 + (y1 - y0) * 0.5);
      ['#FF5E7E', '#FF9F43', '#FFD93D', '#4CD07D', '#4D96FF', '#A66CFF'].forEach((c, i) => g.addColorStop(i / 5, c));
      return g;
    }
    return color;
  }
  // Returns a picture URL for a piece in a color. The first time, the plain piece shows for a moment
  // while the colored copy is made; the copy then swaps in on its own.
  function colored(key, color, mode) {
    if (!color) return src(key);
    const tk = `${key}|${color}|${mode}`;
    if (tinted[tk] && tinted[tk] !== 'pending') return tinted[tk];
    if (!tinted[tk]) {
      tinted[tk] = 'pending';
      const im = load(key);
      const make = () => {
        try {
          const c = document.createElement('canvas');
          c.width = im.naturalWidth; c.height = im.naturalHeight;
          const x = c.getContext('2d');
          x.drawImage(im, 0, 0);
          x.globalCompositeOperation = mode;
          const k = c.width / 1024;
          const box = (DOLL_ART[key] || [0, 0, 1024, 2560]).map(v => v * k);
          x.fillStyle = paint(x, box, color);
          x.fillRect(0, 0, c.width, c.height);
          x.globalCompositeOperation = 'destination-in';
          x.drawImage(im, 0, 0);
          c.toBlob(b => {
            if (!b) return;
            const url = URL.createObjectURL(b);
            tinted[tk] = url;
            document.querySelectorAll('image[data-tk]').forEach(e => { if (e.dataset.tk === tk) e.setAttribute('href', url); });
          });
        } catch (e) { tinted[tk] = src(key); }
      };
      if (im.complete && im.naturalWidth) make(); else im.addEventListener('load', make, { once: true });
    }
    return src(key);
  }

  const layer = (key, color, mode) => {
    const tk = color ? ` data-tk="${key}|${color}|${mode}"` : '';
    return `<image href="${colored(key, color, mode)}"${tk} x="0" y="0" width="1024" height="2560"/>`;
  };

  // The pieces of a look, from back to front.
  function stack(body, look, only) {
    const o = {};
    for (const k in look) o[k] = look[k] ? ITEM[look[k]] : null;
    const ok = it => it && it.painted && (it.body === body) && available(it) && (!only || only.includes(it.cat));
    const hairTint = o.hairColor && o.hairColor.hex ? [o.hairColor.hex, o.hairColor.mode] : [null, null];
    const piece = it => {
      const color = it.tint ? PAINT_HEX[it.color] : null;
      return layer(`${body}/${it.file}`, color, 'multiply');
    };
    const showBase = !only || only.includes('base');
    let s = '';
    if (ok(o.extra) && o.extra.slot === 'back') s += piece(o.extra);
    if (ok(o.hair)) s += layer(`${body}/${o.hair.file}-back`, ...hairTint);
    if (showBase) s += layer(`${body}/base`);
    if (!o.dress && ok(o.bottom)) s += piece(o.bottom);
    if (ok(o.shoes)) s += piece(o.shoes);
    if (!o.dress && ok(o.top)) s += piece(o.top);
    if (ok(o.dress)) s += piece(o.dress);
    if (ok(o.extra) && o.extra.slot === 'chest') s += piece(o.extra);
    if (ok(o.hair)) s += layer(`${body}/${o.hair.file}-front`, ...hairTint);
    if (ok(o.extra) && o.extra.slot === 'face') s += piece(o.extra);
    if (ok(o.hat)) s += piece(o.hat);
    return s;
  }

  const svg = (viewBox, inner, clip) =>
    `<svg viewBox="${viewBox}"${clip ? ' style="overflow:hidden"' : ''} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  function full(body, look) {
    return svg('0 -40 1024 2560', `<g class="doll painted"><ellipse cx="512" cy="2448" rx="190" ry="26" fill="rgba(60,20,70,.2)"/>${stack(body, look)}</g>`);
  }

  // A square view around a box on the canvas, with a little room to spare.
  function around([x0, y0, x1, y1], pad = 0.08) {
    const size = Math.max(x1 - x0, y1 - y0) / (1 - 2 * pad);
    return `${(x0 + x1) / 2 - size / 2} ${(y0 + y1) / 2 - size / 2} ${size} ${size}`;
  }
  const union = keys => keys.map(k => DOLL_ART[k]).filter(Boolean)
    .reduce((a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])]);

  function headBox(body) {
    const [, top] = DOLL_ART[`${body}/base`];
    return [362, top - 40, 662, top + 300];
  }

  const combine = (a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];

  // The picture for one item in the picker: hair and hats on the doll's head, clothes by themselves.
  function thumb(body, look, item) {
    if (item.cat === 'hair' || item.cat === 'hairColor') {
      let box = headBox(body);
      const h = look.hair && ITEM[look.hair];
      if (h && h.body === body && available(h)) {
        const hb = union(files(h));
        box = combine(box, [hb[0], hb[1], hb[2], Math.min(hb[3], hb[1] + 900)]);
      }
      return svg(around(box), stack(body, look, ['base', 'hair', 'hairColor']), true);
    }
    if (item.cat === 'hat' || item.slot === 'face') {
      return svg(around(combine(headBox(body), union(files(item)))), stack(body, look, ['base', 'hair', 'hairColor', item.cat]), true);
    }
    return svg(around(union(files(item))), stack(body, look, [item.cat]), true);
  }

  function head(body, look) {
    return svg(around(headBox(body), 0.02), stack(body, look, ['base', 'hair', 'hairColor', 'hat']), true);
  }

  return { bodyReady, available, full, thumb, head };
})();

// One place for the rest of the game to ask "how do I draw this person?"
const Doll = {
  painted: c => !!c.body && Painted.bodyReady(c.body),
  look: c => (Doll.painted(c) ? c.plook : c.look),
  setLook(c, look) { if (Doll.painted(c)) c.plook = look; else c.look = look; },
  full: (c, look) => (Doll.painted(c) ? Painted.full(c.body, look || c.plook) : Avatar.svg(look || c.look, c.kind)),
  thumb: (c, look, item) => (item.painted ? Painted.thumb(c.body, look, item) : Avatar.thumb(look, item)),
  head: c => (Doll.painted(c) ? Painted.head(c.body, c.plook) : Avatar.head(c.look, c.kind)),
  // Which items can this person wear right now?
  fits(c, item) {
    if (!Doll.painted(c)) return !item.painted;
    if (!item.painted || !Painted.available(item)) return false;
    if (item.body === '*') return ITEMS.some(i => i.cat === 'hair' && i.body === c.body && Painted.available(i));
    return item.body === c.body;
  },
};

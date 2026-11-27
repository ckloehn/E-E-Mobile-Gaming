// The game: screens, coins, the surprise egg and the fashion show.

const SAVE_KEY = 'egg-house-v1';
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const clone = x => JSON.parse(JSON.stringify(x));
const today = () => new Date().toDateString();
const pick = list => list[Math.floor(Math.random() * list.length)];

// ---------- Saving ----------
function freshState() {
  return {
    coins: 30,
    owned: [],
    chars: clone(DEFAULT_CHARACTERS),
    lastEgg: '',
    rewarded: {},
    settings: { autoRead: false, music: true },
    version: 4,
  };
}

// Version 2 made the kids look like Mommy, turned Best Friend into Sister and gave Daddy his own build.
// Mommy keeps her outfit; everyone keeps the name a grown-up gave them.
function migrate(saved) {
  if ((saved.version || 1) >= 2) return migrate3(saved);
  const old = id => saved.chars.find(c => c.id === id);
  saved.chars = clone(DEFAULT_CHARACTERS).map(c => {
    const prev = old(c.id);
    if (prev && prev.name) c.name = prev.name;
    if (c.id === 'mommy' && prev) c.look = prev.look;
    return c;
  });
  saved.version = 2;
  return migrate3(saved);
}

// Version 3 added painted dolls and made the family fair-skinned and blonde with blue eyes.
function migrate3(saved) {
  if ((saved.version || 1) >= 3) return migrate4(saved);
  for (const c of saved.chars) {
    const d = DEFAULT_CHARACTERS.find(x => x.id === c.id);
    if (!d) continue;
    c.body = d.body;
    c.plook = c.plook || clone(d.plook);
    if (c.id === 'daddy') { c.look = clone(d.look); c.kind = d.kind; }
  }
  saved.version = 3;
  return migrate4(saved);
}

// Version 4 added the family dog.
function migrate4(saved) {
  if ((saved.version || 1) >= 4) return saved;
  if (!saved.chars.some(c => c.id === 'dog')) saved.chars.push(clone(DEFAULT_CHARACTERS.find(c => c.id === 'dog')));
  saved.version = 4;
  return saved;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (saved && saved.chars) return { ...freshState(), ...migrate(saved), settings: { ...freshState().settings, ...saved.settings } };
  } catch (e) { /* no saved game yet */ }
  return freshState();
}

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* storage blocked: game still works */ }
}

let state = loadState();

// What is happening right now (not saved)
const ui = {
  char: null,          // character being dressed
  tab: 'hair',
  mode: 'play',        // 'play' or 'show'
  theme: null,
  preview: null,       // { item, before } while trying on a locked item
  eggTaps: 0,
};

// ---------- Helpers ----------
const owns = item => item.price === 0 || state.owned.includes(item.id);

function setCoins(n) {
  state.coins = Math.max(0, n);
  save();
  $$('[data-coins]').forEach(el => {
    el.textContent = state.coins;
    el.parentElement.classList.remove('bump');
    void el.offsetWidth;
    el.parentElement.classList.add('bump');
  });
}

function wear(look, item) {
  // Painted dolls wear a plain top and shorts underneath, so a top doesn't need pants added.
  if (item.painted) {
    if (item.cat === 'dress') { look.dress = item.id; look.top = null; look.bottom = null; }
    else if (item.cat === 'top' || item.cat === 'bottom') { look[item.cat] = item.id; look.dress = null; }
    else look[item.cat] = look[item.cat] === item.id && ['hat', 'extra'].includes(item.cat) ? null : item.id;
    return;
  }
  if (item.cat === 'dress') { look.dress = item.id; look.top = null; look.bottom = null; }
  else if (item.cat === 'top') { look.top = item.id; look.dress = null; look.bottom = look.bottom || 'bottom-pants-blue'; }
  else if (item.cat === 'bottom') { look.bottom = item.id; look.dress = null; look.top = look.top || 'top-tee-white'; }
  else look[item.cat] = item.id;
}

function lookWith(look, item) {
  const l = { ...look };
  wear(l, item);
  return l;
}

function show(id) {
  $$('.screen').forEach(s => { s.hidden = s.id !== `screen-${id}`; });
  if (id === 'castle') Castle.start(); else Castle.stop();
  if (state.settings.music) Sound.startMusic();
}

function openSheet(id) { $(`#sheet-${id}`).hidden = false; decorate($(`#sheet-${id}`)); }
function closeSheet(id) { $(`#sheet-${id}`).hidden = true; }

// Every word marked "say" can be tapped to hear it, and gets a little speaker button.
function decorate(root = document) {
  $$('.say', root).forEach(el => {
    if (el.nextElementSibling && el.nextElementSibling.classList.contains('say-btn')) return;
    const b = document.createElement('button');
    b.className = 'say-btn';
    b.type = 'button';
    b.setAttribute('aria-label', 'Read it to me');
    b.textContent = '🔊';
    el.after(b);
  });
}

function sayEl(el) { Sound.say(el.textContent.trim(), el); }

function confetti(count = 40) {
  const box = $('[data-confetti]');
  const colors = ['#FF6FB5', '#FFD93D', '#4D96FF', '#4CD07D', '#A66CFF', '#FF9F43'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = pick(colors);
    p.style.animationDelay = Math.random() * 0.6 + 's';
    p.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(p);
    setTimeout(() => p.remove(), 3800);
  }
}

function reward(title, bodyHtml, after) {
  $('[data-reward-title]').textContent = title;
  $('[data-reward-body]').innerHTML = bodyHtml;
  ui.afterReward = after || null;
  openSheet('reward');
  Sound.play('fanfare');
  confetti();
  setTimeout(() => Sound.say(title, $('[data-reward-title]')), 700);
}

// ---------- Castle ----------
function renderCastle() {
  const fam = $('[data-family]');
  fam.innerHTML = state.chars.map((c, i) => `
    <div class="actor ${c.kind}" data-actor="${i}" style="left:${Castle.spot(i)}%;--d:${Castle.depth(i)};z-index:${Castle.layer(Castle.depth(i))}">
      <div class="bubble" hidden></div>
      <button class="person" data-action="dress" data-i="${i}" aria-label="Dress up ${escapeHtml(c.name)}">
        <span class="flip">${Doll.full(c)}<span class="reflection" aria-hidden="true">${Doll.full(c)}</span></span>
        <span class="name">${escapeHtml(c.name)}</span>
      </button>
      ${isDog(c) ? `<button class="trick-btn" data-action="trick" data-i="${i}" aria-label="Do a trick">🦴</button>` : ''}
    </div>`).join('');
  $('[data-egg-badge]').hidden = state.lastEgg === today();
  $('.egg-btn').classList.toggle('ready', state.lastEgg !== today());
  $('[data-action="music"]').classList.toggle('off', !state.settings.music);
  decorate($('#screen-castle'));
  if (!$('#screen-castle').hidden) Castle.start();
}

// The family walks around the castle, waves, dances and chats with each other.
// They always face the camera, like dolls on a stage.
const Castle = (() => {
  // x is across the room (percent), d is how far back (0 = front, 1 = back by the throne).
  const home = [16, 38, 62, 84, 50];
  const homeDepth = [0.4, 0.65, 0.05, 0.25, 0.12];
  let actors = [];
  let timers = [];
  let ticker = null;

  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const spot = i => home[i % home.length];
  const depth = i => homeDepth[i % homeDepth.length];
  const layer = d => 10 + Math.round((1 - d) * 50);

  function start() {
    stop();
    actors = state.chars.map((c, i) => ({ i, el: $(`[data-actor="${i}"]`), x: spot(i), d: depth(i), busy: false, dog: isDog(c) }));
    if (!actors.length || !actors[0].el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    later(direct, 1200);
    ticker = setInterval(direct, 2600);
  }

  function stop() {
    clearInterval(ticker);
    timers.forEach(clearTimeout);
    timers = [];
    actors.forEach(a => a.el && a.el.classList.remove('walking', 'waving', 'dancing', 'talking', ...TRICKS.map(t => 'trick-' + t[0])));
    $$('.actor .bubble').forEach(b => { b.hidden = true; });
  }

  // Walk across and forward or back. Further back means higher up the floor and a little smaller.
  function walk(a, x, then, d = a.d) {
    x = Math.max(9, Math.min(91, x));
    d = Math.max(0, Math.min(1, d));
    const secs = Math.max(0.8, Math.hypot(x - a.x, (d - a.d) * 45) * 0.085);
    a.el.classList.add('walking');
    a.el.style.transitionDuration = secs + 's';
    a.el.style.left = x + '%';
    a.el.style.setProperty('--d', d);
    a.el.style.zIndex = layer(d);
    a.x = x;
    a.d = d;
    later(() => { a.el.classList.remove('walking'); if (then) then(); }, secs * 1000);
  }

  function act(a, cls, ms, then) {
    a.el.classList.add(cls);
    later(() => { a.el.classList.remove(cls); if (then) then(); }, ms);
  }

  function say(a, text, ms) {
    const b = $('.bubble', a.el);
    b.innerHTML = `<span class="say">${escapeHtml(text)}</span>`;
    decorate(b);
    b.hidden = false;
    a.el.classList.add('talking');
    if (state.settings.autoRead) Sound.say(text, $('.say', b));
    later(() => { b.hidden = true; a.el.classList.remove('talking'); }, ms);
  }

  // The dog does a trick. With a word, it shows in his speech bubble too.
  function trick(a, id, word, then) {
    const [tid, tword] = TRICKS.find(t => t[0] === id) || pick(TRICKS);
    if (word !== false) say(a, word || tword, 1800);
    act(a, 'trick-' + tid, 1700, then);
  }

  function chat(a, b) {
    if (a.dog || b.dog) return dogChat(a.dog ? b : a, a.dog ? a : b);
    a.busy = b.busy = true;
    const side = a.x < b.x ? -1 : 1;
    let target = b.x + side * 17;
    if (target < 9 || target > 91) target = b.x - side * 17;
    walk(a, target, () => {
      const lines = pick(CHATS);
      lines.forEach((line, k) => later(() => say(k % 2 ? b : a, line, 2900), k * 3100));
      later(() => {
        if (Math.random() < 0.4) { act(a, 'dancing', 1600); act(b, 'dancing', 1600); }
        later(() => { a.busy = b.busy = false; }, 1700);
      }, lines.length * 3100);
    }, b.d);
  }

  // Someone walks over to the dog and they talk. Sometimes he shows off a trick.
  function dogChat(p, dog) {
    p.busy = dog.busy = true;
    const side = p.x < dog.x ? -1 : 1;
    let target = dog.x + side * 14;
    if (target < 9 || target > 91) target = dog.x - side * 14;
    walk(p, target, () => {
      const [first, reply, trickId] = pick(DOG_CHATS);
      const name = state.chars[dog.i].name;
      [first, reply].forEach((line, k) => later(() => say(k ? dog : p, line.replace('{dog}', name), 2900), k * 3100));
      later(() => {
        if (trickId) trick(dog, trickId, false);
        later(() => { p.busy = dog.busy = false; }, 1800);
      }, 2 * 3100);
    }, dog.d);
  }

  // A place on the floor that isn't right on top of someone else.
  function openSpot(a) {
    for (let tries = 0; tries < 30; tries++) {
      const x = 9 + Math.random() * 82, d = Math.random();
      if (actors.every(o => o === a || Math.abs(o.x - x) > 15 || Math.abs(o.d - d) > 0.45)) return [x, d];
    }
    return [a.x, a.d];
  }

  function direct() {
    const idle = actors.filter(a => !a.busy);
    if (!idle.length) return;
    if (idle.length >= 2 && Math.random() < 0.35) {
      const a = pick(idle);
      return chat(a, pick(idle.filter(o => o !== a)));
    }
    const a = pick(idle);
    a.busy = true;
    const done = () => { a.busy = false; };
    const r = Math.random();
    if (a.dog) {
      if (r < 0.5) { const [x, d] = openSpot(a); walk(a, x, done, d); }
      else if (r < 0.75) trick(a, pick(TRICKS)[0], undefined, done);
      else { say(a, pick(BARKS), 1600); act(a, 'waving', 1600, done); }
      return;
    }
    if (r < 0.6) { const [x, d] = openSpot(a); walk(a, x, done, d); }
    else if (r < 0.82) act(a, 'waving', 2200, done);
    else act(a, 'dancing', 2400, done);
  }

  // Tapping the bone: the dog barks and does a trick, even in the middle of walking.
  function tapTrick(i) {
    const a = actors.find(o => o.i === i);
    if (!a || !a.el) return;
    TRICKS.forEach(t => a.el.classList.remove('trick-' + t[0]));
    const was = a.busy;
    a.busy = true;
    trick(a, pick(TRICKS)[0], undefined, () => { if (!was) a.busy = false; });
  }

  return { start, stop, spot, depth, layer, tapTrick, chat: (i, j) => chat(actors[i], actors[j]) };
})();

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- Dress up ----------
function startDressing(i, mode = 'play') {
  ui.char = state.chars[i];
  ui.mode = mode;
  ui.preview = null;
  const banner = $('[data-theme-banner]');
  banner.hidden = mode !== 'show';
  if (mode === 'show') {
    banner.innerHTML = `<span aria-hidden="true">${ui.theme.icon}</span> <span class="say">${ui.theme.name}</span>`;
    decorate(banner);
  }
  $('[data-action="done"]').textContent = mode === 'show' ? 'Walk! 👠' : '✓ Done';
  $('[data-item-label]').innerHTML = `<span class="say">${escapeHtml(ui.char.name)}</span>`;
  decorate($('[data-item-label]'));
  renderTabs();
  renderModel();
  renderItems();
  show('dress');
}

function renderModel(pop) {
  const m = $('[data-model]');
  m.innerHTML = Doll.full(ui.char) +
    (isDog(ui.char) ? '<button class="trick-btn" data-action="model-trick" aria-label="Do a trick">🦴</button>' : '');
  if (pop) { m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop'); }
}

function renderTabs() {
  const cats = CATEGORIES.filter(c => ITEMS.some(i => i.cat === c.id && Doll.fits(ui.char, i)));
  if (!cats.some(c => c.id === ui.tab)) ui.tab = cats.length ? cats[0].id : null;
  $('[data-tabs]').innerHTML = cats.map(c =>
    `<button class="tab ${c.id === ui.tab ? 'on' : ''}" data-action="tab" data-tab="${c.id}" aria-label="${c.name}">${c.icon}</button>`).join('');
}

function renderItems() {
  const look = Doll.look(ui.char);
  const list = ITEMS.filter(i => i.cat === ui.tab && Doll.fits(ui.char, i));
  const box = $('[data-items]');
  if (!list.length) {
    box.innerHTML = '<p class="coming-soon"><span class="say">New clothes are coming soon!</span></p>';
    decorate(box);
    return;
  }
  box.innerHTML = list.map(item => {
    const locked = !owns(item);
    const on = look[item.cat] === item.id;
    return `<button class="item ${on ? 'on' : ''} ${locked ? 'locked' : ''}" data-action="item" data-id="${item.id}" aria-label="${item.name}">
      ${Doll.thumb(ui.char, lookWith(look, item), item)}
      ${item.id.endsWith('-none') ? '<span class="none-mark">✕</span>' : ''}
      ${locked ? `<span class="lock">🪙${item.price}</span>` : ''}
    </button>`;
  }).join('');
  box.scrollLeft = 0;
  box.scrollTop = 0;
  const tab = $('.tab.on');
  if (tab) tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}

function showItemName(item) {
  const label = $('[data-item-label]');
  label.innerHTML = `<span class="say">${item.name}</span>`;
  decorate(label);
  if (state.settings.autoRead) sayEl($('.say', label));
}

function tapItem(id) {
  const item = ITEM[id];
  if (ui.preview) cancelPreview();
  showItemName(item);
  if (owns(item)) {
    wear(Doll.look(ui.char), item);
    save();
    Sound.play('pop');
    renderModel(true);
    renderItems();
    return;
  }
  // Try it on, then offer to buy it
  ui.preview = { item, before: { ...Doll.look(ui.char) } };
  wear(Doll.look(ui.char), item);
  renderModel(true);
  Sound.play('sparkle');
  $('[data-buy-thumb]').innerHTML = Doll.thumb(ui.char, Doll.look(ui.char), item);
  $('[data-buy-name]').textContent = item.name;
  $('[data-buy-price]').textContent = item.price;
  const short = item.price - state.coins;
  const need = $('[data-buy-need]');
  need.hidden = short <= 0;
  need.innerHTML = short > 0 ? `<span class="say">You need ${short} more ${short === 1 ? 'coin' : 'coins'}.</span>` : '';
  $('[data-action="buy-yes"]').disabled = short > 0;
  openSheet('buy');
}

function cancelPreview() {
  if (!ui.preview) return;
  Doll.setLook(ui.char, ui.preview.before);
  ui.preview = null;
  renderModel();
}

function buy() {
  const { item } = ui.preview;
  if (state.coins < item.price) { Sound.play('nope'); return; }
  state.owned.push(item.id);
  ui.preview = null;
  setCoins(state.coins - item.price);
  save();
  Sound.play('buy');
  confetti(20);
  closeSheet('buy');
  renderItems();
}

function done() {
  if (ui.mode === 'show') return runway();
  const key = JSON.stringify(Doll.look(ui.char));
  const praise = pick(PRAISE);
  if (state.rewarded[ui.char.id] !== key) {
    state.rewarded[ui.char.id] = key;
    setCoins(state.coins + 10);
    reward(praise, `<div class="reward-model">${Doll.full(ui.char)}</div><p class="got">+10 🪙</p>`, goHome);
  } else {
    reward(praise, `<div class="reward-model">${Doll.full(ui.char)}</div>`, goHome);
  }
}

function goHome() {
  renderCastle();
  show('castle');
}

// ---------- Surprise egg (once a day) ----------
function openEgg() {
  if (state.lastEgg === today()) {
    Sound.play('nope');
    const hint = $('.castle .hint .say');
    hint.textContent = 'The surprise egg comes back tomorrow!';
    sayEl(hint);
    return;
  }
  ui.eggTaps = 0;
  $('.egg-big').className = 'egg-big';
  $('.egg-big').hidden = false;
  $('[data-egg-prize]').hidden = true;
  $('[data-egg-close]').hidden = true;
  $('[data-egg-title]').textContent = 'Tap the egg!';
  openSheet('egg');
}

function crackEgg() {
  const egg = $('.egg-big');
  ui.eggTaps++;
  Sound.play('crack');
  egg.classList.remove('shake');
  void egg.offsetWidth;
  egg.classList.add('shake', `crack${Math.min(ui.eggTaps, 2)}`);
  if (ui.eggTaps < 3) return;

  state.lastEgg = today();
  const locked = ITEMS.filter(i => !owns(i) && i.price <= 15 && state.chars.some(c => Doll.fits(c, i)));
  const prize = locked.length ? pick(locked) : null;
  if (prize) state.owned.push(prize.id);
  setCoins(state.coins + 25);
  save();

  egg.hidden = true;
  const who = (prize && state.chars.find(c => Doll.fits(c, prize))) || state.chars[0];
  const look = prize ? lookWith(Doll.look(who), prize) : Doll.look(who);
  $('[data-egg-prize]').innerHTML = `
    <p class="got">+25 🪙</p>
    ${prize ? `<div class="prize-thumb">${Doll.thumb(who, look, prize)}</div><p class="prize-name"><span class="say">${prize.name}</span></p>` : ''}`;
  $('[data-egg-prize]').hidden = false;
  $('[data-egg-close]').hidden = false;
  $('[data-egg-title]').textContent = 'Surprise!';
  decorate($('#sheet-egg'));
  Sound.play('fanfare');
  confetti(60);
  setTimeout(() => Sound.say(prize ? `Surprise! You got ${prize.name}!` : 'Surprise! 25 coins!'), 600);
}

// ---------- Fashion show ----------
function startShow() {
  ui.theme = pick(THEMES);
  $('[data-theme-big]').innerHTML = `<span class="theme-icon" aria-hidden="true">${ui.theme.icon}</span><span class="say">${ui.theme.name}</span>`;
  $('[data-pick]').innerHTML = state.chars.map((c, i) => `
    <button class="person mini ${c.kind}" data-action="model" data-i="${i}">
      ${Doll.full(c)}<span class="name">${escapeHtml(c.name)}</span>
    </button>`).join('');
  decorate($('#screen-show'));
  show('show');
  setTimeout(() => sayEl($('[data-theme-big] .say')), 300);
}

const JUDGES = [
  { icon: '🐰', name: 'Bunny' },
  { icon: '🐱', name: 'Kitty' },
  { icon: '🦉', name: 'Owl' },
];

function runway() {
  const look = Doll.look(ui.char);
  const o = Avatar.outfit(look);
  const fancy = Object.values(o).filter(i => i && i.price > 0).length;
  const stars = [
    1 + Math.min(2, Number(ui.theme.score(o)) || 0),
    1 + Math.min(2, Math.floor(fancy / 2)),
    2 + ((o.hat && o.hat.style !== 'none') || (o.extra && o.extra.style !== 'none') ? 1 : 0),
  ];
  const total = stars.reduce((a, b) => a + b, 0);

  $('[data-runway-model]').innerHTML = Doll.full(ui.char, look);
  $('[data-runway-model]').className = 'runway-model walk walking';
  setTimeout(() => $('[data-runway-model]').classList.remove('walking'), 2400);
  $('[data-judges]').innerHTML = JUDGES.map(j => `
    <div class="judge"><div class="card" data-card>${'<span class="s">★</span>'.repeat(3)}</div><span class="face" aria-hidden="true">${j.icon}</span></div>`).join('');
  $('[data-result]').hidden = true;
  show('runway');
  Sound.play('sparkle');

  const cards = $$('[data-card]');
  stars.forEach((n, j) => {
    setTimeout(() => {
      cards[j].classList.add('up');
      $$('.s', cards[j]).forEach((s, k) => {
        if (k < n) setTimeout(() => { s.classList.add('lit'); Sound.play('star'); }, 250 + k * 260);
      });
    }, 2600 + j * 1300);
  });

  setTimeout(() => {
    const prize = total >= 9 ? ['🏆', 'Super Star!'] : total >= 7 ? ['🥇', 'Gold Medal!'] : total >= 5 ? ['🥈', 'Silver Medal!'] : ['🎀', 'Great Job!'];
    const coins = 5 + total * 3;
    setCoins(state.coins + coins);
    reward(prize[1], `<div class="trophy" aria-hidden="true">${prize[0]}</div><p class="stars-total">${'★'.repeat(total)}</p><p class="got">+${coins} 🪙</p>`, goHome);
  }, 2600 + 3 * 1300 + 900);
}

// ---------- Grown-ups ----------
let holdTimer = null;
function openGrownups() {
  $('#set-autoread').checked = state.settings.autoRead;
  $('#set-music').checked = state.settings.music;
  $('[data-names]').innerHTML = state.chars.map((c, i) =>
    `<label class="row"><span class="mini-face">${Doll.head(c)}</span><input type="text" id="name-${c.id}" data-name="${i}" value="${escapeHtml(c.name)}" maxlength="16"></label>`).join('');
  $('[data-reset-confirm]').hidden = true;
  openSheet('grownups');
}

function setMusic(on) {
  state.settings.music = on;
  save();
  if (on) Sound.startMusic(); else Sound.stopMusic();
  $('[data-action="music"]').classList.toggle('off', !on);
}

// ---------- Input ----------
document.addEventListener('click', e => {
  const sayBtn = e.target.closest('.say-btn');
  if (sayBtn) { sayEl(sayBtn.previousElementSibling); return; }
  const word = e.target.closest('.say');
  if (word && !e.target.closest('[data-action]')) { sayEl(word); return; }

  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  Sound.unlock();
  const a = btn.dataset.action;
  switch (a) {
    case 'play': Sound.play('sparkle'); renderCastle(); show('castle'); break;
    case 'music': setMusic(!state.settings.music); break;
    case 'grownups': {
      const hint = $('.castle .hint .say');
      hint.textContent = 'Grown-ups: press and hold the gear.';
      break;
    }
    case 'dress': Sound.play('tap'); startDressing(+btn.dataset.i); break;
    case 'trick': Sound.play('woof'); Castle.tapTrick(+btn.dataset.i); break;
    case 'model-trick': {
      Sound.play('woof');
      const m = $('[data-model]');
      const [id, word] = pick(TRICKS);
      TRICKS.forEach(t => m.classList.remove('trick-' + t[0]));
      void m.offsetWidth;
      m.classList.add('trick-' + id);
      const label = $('[data-item-label]');
      label.innerHTML = `<span class="say">${word}</span>`;
      decorate(label);
      if (state.settings.autoRead) sayEl($('.say', label));
      setTimeout(() => m.classList.remove('trick-' + id), 1700);
      break;
    }
    case 'home': Sound.play('tap'); cancelPreview(); goHome(); break;
    case 'tab': Sound.play('tap'); ui.tab = btn.dataset.tab; renderTabs(); renderItems(); break;
    case 'item': tapItem(btn.dataset.id); break;
    case 'buy-yes': buy(); break;
    case 'buy-no': Sound.play('tap'); cancelPreview(); closeSheet('buy'); break;
    case 'done': done(); break;
    case 'close-reward': closeSheet('reward'); if (ui.afterReward) ui.afterReward(); break;
    case 'egg': openEgg(); break;
    case 'crack': crackEgg(); break;
    case 'close-egg': closeSheet('egg'); renderCastle(); break;
    case 'show': Sound.play('sparkle'); startShow(); break;
    case 'model': Sound.play('tap'); startDressing(+btn.dataset.i, 'show'); break;
    case 'close-grownups': closeSheet('grownups'); renderCastle(); break;
    case 'gift-coins': setCoins(state.coins + 50); Sound.play('coin'); break;
    case 'reset': $('[data-reset-confirm]').hidden = false; break;
    case 'reset-no': $('[data-reset-confirm]').hidden = true; break;
    case 'reset-yes':
      state = freshState(); save(); setCoins(state.coins);
      closeSheet('grownups'); renderCastle(); break;
  }
});

// The gear opens only after a 1.5 second press, so little fingers don't land there by accident.
const gear = $('.grownups');
gear.addEventListener('pointerdown', () => {
  gear.classList.add('holding');
  holdTimer = setTimeout(() => { gear.classList.remove('holding'); openGrownups(); }, 1500);
});
['pointerup', 'pointerleave', 'pointercancel'].forEach(ev =>
  gear.addEventListener(ev, () => { clearTimeout(holdTimer); gear.classList.remove('holding'); }));
gear.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('change', e => {
  if (e.target.id === 'set-autoread') { state.settings.autoRead = e.target.checked; save(); }
  if (e.target.id === 'set-music') setMusic(e.target.checked);
});
document.addEventListener('input', e => {
  if (e.target.dataset.name !== undefined) {
    state.chars[+e.target.dataset.name].name = e.target.value.trim() || 'Friend';
    save();
  }
});

// Stop music when the app is hidden so it doesn't play in the background.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) Sound.stopMusic();
  else if (state.settings.music && $('#screen-title').hidden) Sound.startMusic();
});

// Painted backgrounds are optional: use one if it loads, otherwise keep the drawn one.
$$('[data-art]').forEach(img => {
  const ok = () => img.parentElement.classList.add('has-art');
  const missing = () => img.remove();
  if (img.complete) { if (img.naturalWidth) ok(); else missing(); }
  else { img.addEventListener('load', ok); img.addEventListener('error', missing); }
});

// ---------- Start ----------
setCoins(state.coins);
decorate();

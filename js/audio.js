// Music, sound effects and the read-aloud voice. No sound files needed:
// everything is played with the browser's built-in synthesizer.

const Sound = (() => {
  let ctx = null;
  let master = null;
  let musicGain = null;
  let musicTimer = null;
  let musicOn = false;
  let step = 0;
  let nextTime = 0;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.8;
      master.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.16;
      musicGain.connect(master);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, { type = 'triangle', vol = 0.3, dest = master, slide = 0 } = {}) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g).connect(dest);
    o.start(start);
    o.stop(start + dur + 0.05);
  }

  const N = n => 440 * Math.pow(2, (n - 69) / 12); // MIDI note to frequency

  const SFX = {
    tap: t => tone(660, t, 0.12, { type: 'sine', vol: 0.25, slide: 1.6 }),
    pop: t => tone(420, t, 0.15, { type: 'sine', vol: 0.3, slide: 2.2 }),
    coin: t => { tone(N(88), t, 0.08, { type: 'square', vol: 0.12 }); tone(N(93), t + 0.08, 0.25, { type: 'square', vol: 0.12 }); },
    sparkle: t => [84, 88, 91, 96, 100].forEach((n, i) => tone(N(n), t + i * 0.05, 0.3, { type: 'sine', vol: 0.15 })),
    buy: t => [76, 80, 83, 88].forEach((n, i) => tone(N(n), t + i * 0.07, 0.25, { vol: 0.22 })),
    star: t => { tone(N(84), t, 0.4, { type: 'sine', vol: 0.25 }); tone(N(91), t + 0.05, 0.4, { type: 'sine', vol: 0.15 }); },
    // A friendly little bark: two quick yips that drop in pitch.
    woof: t => [0, 0.2].forEach(d => {
      tone(520, t + d, 0.11, { type: 'sawtooth', vol: 0.16, slide: 0.55 });
      tone(260, t + d, 0.12, { type: 'square', vol: 0.08, slide: 0.6 });
    }),
    nope: t => tone(300, t, 0.2, { type: 'sine', vol: 0.2, slide: 0.7 }),
    crack: t => { tone(180, t, 0.08, { type: 'square', vol: 0.15, slide: 0.5 }); tone(240, t + 0.1, 0.08, { type: 'square', vol: 0.15, slide: 0.5 }); },
    fanfare: t => [[72, 0], [76, 0.15], [79, 0.3], [84, 0.45], [79, 0.65], [84, 0.8]]
      .forEach(([n, d]) => { tone(N(n), t + d, 0.35, { vol: 0.25 }); tone(N(n - 12), t + d, 0.35, { type: 'sine', vol: 0.18 }); }),
  };

  function play(name) {
    if (!ensure()) return;
    SFX[name] && SFX[name](ctx.currentTime + 0.01);
  }

  // A cheerful little castle tune that loops forever.
  const MELODY = [72, 76, 79, 76, 77, 81, 79, 0, 76, 79, 84, 83, 81, 79, 76, 0,
                  72, 74, 76, 79, 81, 79, 76, 74, 72, 76, 74, 71, 72, 0, 0, 0];
  const BASS = [48, 48, 53, 53, 55, 55, 48, 48];
  const BEAT = 0.22;

  function schedule() {
    while (nextTime < ctx.currentTime + 0.4) {
      const m = MELODY[step % MELODY.length];
      if (m) tone(N(m), nextTime, BEAT * 1.6, { vol: 0.5, dest: musicGain });
      if (step % 4 === 0) tone(N(BASS[(step / 4) % BASS.length]), nextTime, BEAT * 3.5, { type: 'sine', vol: 0.6, dest: musicGain });
      if (step % 8 === 4) tone(N(96), nextTime, 0.3, { type: 'sine', vol: 0.12, dest: musicGain });
      nextTime += BEAT;
      step++;
    }
  }

  function startMusic() {
    if (!ensure() || musicTimer) return;
    musicOn = true;
    nextTime = ctx.currentTime + 0.1;
    musicTimer = setInterval(schedule, 100);
  }

  function stopMusic() {
    musicOn = false;
    clearInterval(musicTimer);
    musicTimer = null;
  }

  // ---------- Read aloud ----------
  let voice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith('en'));
    const liked = ['Samantha', 'Karen', 'Moira', 'Tessa', 'Google US English', 'Female'];
    voice = voices.find(v => liked.some(n => v.name.includes(n))) || voices[0] || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  let speakingEl = null;
  function say(text, el) {
    if (!('speechSynthesis' in window) || !text) return;
    speechSynthesis.cancel();
    if (speakingEl) speakingEl.classList.remove('speaking');
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.rate = 0.8;
    u.pitch = 1.15;
    if (el) {
      speakingEl = el;
      el.classList.add('speaking');
      u.onend = u.onerror = () => el.classList.remove('speaking');
    }
    // Duck the music so the words are easy to hear.
    if (musicGain && ctx) {
      musicGain.gain.setTargetAtTime(0.05, ctx.currentTime, 0.1);
      const restore = () => musicGain.gain.setTargetAtTime(0.16, ctx.currentTime, 0.3);
      u.addEventListener('end', restore);
      u.addEventListener('error', restore);
    }
    speechSynthesis.speak(u);
  }

  return { play, startMusic, stopMusic, say, unlock: ensure, get musicOn() { return musicOn; } };
})();

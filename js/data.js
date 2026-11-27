// Everything you can wear, where it lives, and what it costs.
// To add a new item, add one line in the right section below.

const COLORS = {
  pink:      { hex: '#FF6FB5', name: 'Pink' },
  lightpink: { hex: '#FFC2E2', name: 'Light Pink' },
  red:       { hex: '#FF4757', name: 'Red' },
  coral:     { hex: '#FF7F6B', name: 'Coral' },
  orange:    { hex: '#FF9F43', name: 'Orange' },
  yellow:    { hex: '#FFD93D', name: 'Yellow' },
  green:     { hex: '#4CD07D', name: 'Green' },
  teal:      { hex: '#2ED3C6', name: 'Teal' },
  blue:      { hex: '#4D96FF', name: 'Blue' },
  navy:      { hex: '#34508F', name: 'Dark Blue' },
  purple:    { hex: '#A66CFF', name: 'Purple' },
  lavender:  { hex: '#D7C2FF', name: 'Lavender' },
  white:     { hex: '#FFFFFF', name: 'White' },
  gray:      { hex: '#9AA0B5', name: 'Gray' },
  black:     { hex: '#3A3045', name: 'Black' },
  brown:     { hex: '#9C6644', name: 'Brown' },
  gold:      { hex: 'url(#g-gold)', name: 'Gold' },
  silver:    { hex: 'url(#g-silver)', name: 'Silver' },
  rainbow:   { hex: 'url(#g-rainbow)', name: 'Rainbow' },
};

const CATEGORIES = [
  { id: 'skin',      icon: '🖐️', name: 'Skin' },
  { id: 'eyes',      icon: '👀', name: 'Eyes' },
  { id: 'eyeColor',  icon: '👁️', name: 'Eye Color' },
  { id: 'hair',      icon: '💇', name: 'Hair' },
  { id: 'hairColor', icon: '🎨', name: 'Hair Color' },
  { id: 'lips',      icon: '💋', name: 'Lips' },
  { id: 'face',      icon: '😊', name: 'Face Paint' },
  { id: 'top',       icon: '👚', name: 'Tops' },
  { id: 'dress',     icon: '👗', name: 'Dresses' },
  { id: 'bottom',    icon: '👖', name: 'Pants and Skirts' },
  { id: 'shoes',     icon: '👟', name: 'Shoes' },
  { id: 'nails',     icon: '💅', name: 'Nails' },
  { id: 'hat',       icon: '👑', name: 'Hats' },
  { id: 'extra',     icon: '🪄', name: 'Extras' },
];

const ITEMS = [];
const ITEM = {};

function add(cat, id, name, price, props = {}) {
  const item = { cat, id, name, price, ...props };
  ITEMS.push(item);
  ITEM[id] = item;
}

// Clothes come in a style plus a color, so the name teaches the color word.
function addStyled(cat, style, styleName, list, extra = {}) {
  for (const [color, price, pattern] of list) {
    add(cat, `${cat}-${style}-${color}`, `${COLORS[color].name} ${styleName}`, price,
      { style, color, pattern: pattern || (['gold', 'silver', 'rainbow'].includes(color) ? 'glitter' : null), ...extra });
  }
}

// Skin
[['cream', 'Cream', '#FFE3CC', 0], ['peach', 'Peach', '#F8C9A2', 0], ['honey', 'Honey', '#E5A878', 0],
 ['caramel', 'Caramel', '#C68654', 0], ['cocoa', 'Cocoa', '#99603A', 0], ['chocolate', 'Chocolate', '#6E4127', 0],
 ['fairyblue', 'Fairy Blue', '#A9DBFF', 10], ['mint', 'Mint Green', '#B5EDB0', 10], ['lilac', 'Lilac', '#DCC4FF', 10],
].forEach(([id, name, hex, price]) => add('skin', `skin-${id}`, name, price, { hex }));

// Eyes
[['round', 'Round Eyes', 0], ['lashes', 'Eyelashes', 0], ['happy', 'Happy Eyes', 0], ['sleepy', 'Sleepy Eyes', 0],
 ['sparkly', 'Sparkly Eyes', 5], ['wink', 'Wink', 5], ['star', 'Star Eyes', 10], ['heart', 'Heart Eyes', 10],
].forEach(([style, name, price]) => add('eyes', `eyes-${style}`, name, price, { style }));

[['brown', 0], ['blue', 0], ['green', 0], ['gray', 0], ['black', 0], ['purple', 10], ['pink', 10],
 ['teal', 10], ['gold', 15], ['rainbow', 20],
].forEach(([color, price]) => add('eyeColor', `eyec-${color}`, `${COLORS[color].name} Eyes`, price, { color }));

// Hair
[['buzz', 'Buzz Cut', 0], ['short', 'Short Hair', 0], ['bob', 'Bob', 0], ['long', 'Long Hair', 0], ['ponytail', 'Ponytail', 0],
 ['pigtails', 'Pigtails', 0], ['buns', 'Space Buns', 0], ['curly', 'Curly Hair', 0], ['puffs', 'Puffs', 5],
 ['braid', 'Braid', 5], ['spiky', 'Spiky Hair', 5], ['wavy', 'Princess Waves', 10], ['superlong', 'Super Long Hair', 15],
].forEach(([style, name, price]) => add('hair', `hair-${style}`, name, price, { style }));

[['black', 'Black', '#2E2433', 0], ['brown', 'Brown', '#6B4226', 0], ['blonde', 'Blonde', '#F2CF6B', 0],
 ['ginger', 'Red', '#D9653B', 0], ['gray', 'Gray', '#B9B9C9', 0], ['pink', 'Pink', '#FF8AC8', 5],
 ['blue', 'Blue', '#5AA6FF', 5], ['purple', 'Purple', '#A66CFF', 5], ['green', 'Green', '#4CD07D', 5],
 ['gold', 'Gold', 'url(#g-gold)', 15], ['rainbow', 'Rainbow', 'url(#g-rainbow)', 15],
].forEach(([id, name, hex, price]) => add('hairColor', `hairc-${id}`, `${name} Hair`, price, { hex, color: id }));

// Lips
add('lips', 'lips-none', 'Big Smile', 0);
[['pink', 0], ['red', 0], ['coral', 0], ['purple', 5], ['lightpink', 5], ['gold', 10], ['rainbow', 15]]
  .forEach(([color, price]) => add('lips', `lips-${color}`, `${COLORS[color].name} Lipstick`, price, { color }));

// Face paint
[['none', 'No Face Paint', 0], ['blush', 'Rosy Cheeks', 0], ['freckles', 'Freckles', 0], ['stars', 'Star Stickers', 5],
 ['hearts', 'Heart Cheeks', 5], ['eyeshadow', 'Rainbow Eyeshadow', 10], ['glitter', 'Glitter Face', 10],
 ['whiskers', 'Kitty Whiskers', 10],
].forEach(([style, name, price]) => add('face', `face-${style}`, name, price, { style }));

// Tops
addStyled('top', 'tee', 'T-Shirt', [['pink', 0], ['blue', 0], ['white', 0], ['yellow', 0], ['green', 0]]);
addStyled('top', 'startee', 'Star Shirt', [['purple', 5], ['navy', 5]], { print: 'star' });
addStyled('top', 'hearttee', 'Heart Shirt', [['white', 5], ['lightpink', 5]], { print: 'heart' });
addStyled('top', 'long', 'Long Sleeve Shirt', [['red', 0], ['purple', 0], ['teal', 5, 'stripes']]);
addStyled('top', 'tank', 'Tank Top', [['orange', 0], ['teal', 0], ['pink', 5, 'dots']]);
addStyled('top', 'crop', 'Crop Top', [['lightpink', 5], ['rainbow', 20]]);
addStyled('top', 'hoodie', 'Hoodie', [['purple', 5], ['blue', 5], ['gray', 5]]);
addStyled('top', 'ruffle', 'Ruffle Blouse', [['white', 10], ['lavender', 10], ['gold', 20]]);

// Dresses
addStyled('dress', 'gown', 'Princess Gown', [['pink', 0], ['blue', 0], ['purple', 10], ['white', 15], ['gold', 25], ['rainbow', 30]]);
addStyled('dress', 'sundress', 'Sundress', [['yellow', 0], ['green', 0], ['orange', 5, 'dots'], ['lightpink', 5, 'dots']]);
addStyled('dress', 'tutu', 'Party Dress', [['lightpink', 0], ['lavender', 5], ['teal', 10, 'glitter'], ['rainbow', 20]]);

// Pants and skirts
addStyled('bottom', 'pants', 'Pants', [['blue', 0], ['black', 0], ['pink', 5], ['white', 5]]);
addStyled('bottom', 'shorts', 'Shorts', [['blue', 0], ['yellow', 0], ['pink', 0], ['green', 5, 'stripes']]);
addStyled('bottom', 'skirt', 'Skirt', [['red', 0], ['purple', 0], ['pink', 5, 'dots']]);
addStyled('bottom', 'tutu', 'Tutu', [['lightpink', 5], ['rainbow', 15]]);
addStyled('bottom', 'leggings', 'Leggings', [['purple', 5], ['rainbow', 15]]);

// Shoes
addStyled('shoes', 'sneakers', 'Sneakers', [['white', 0], ['pink', 0], ['blue', 0], ['rainbow', 15]]);
addStyled('shoes', 'boots', 'Boots', [['brown', 0], ['black', 5], ['pink', 5]]);
addStyled('shoes', 'rainboots', 'Rain Boots', [['yellow', 0], ['green', 5]]);
addStyled('shoes', 'sandals', 'Sandals', [['brown', 0], ['pink', 5]]);
addStyled('shoes', 'flats', 'Ballet Shoes', [['lightpink', 0], ['red', 5]]);
addStyled('shoes', 'heels', 'Sparkly Heels', [['gold', 20], ['silver', 20]]);
addStyled('shoes', 'skates', 'Roller Skates', [['pink', 10], ['purple', 10], ['white', 10]]);
add('shoes', 'shoes-glass', 'Glass Slippers', 25, { style: 'glass' });
add('shoes', 'shoes-bunny', 'Bunny Slippers', 15, { style: 'bunny', color: 'white' });

// Nails
add('nails', 'nails-none', 'No Nail Polish', 0);
[['pink', 0], ['red', 0], ['purple', 0], ['blue', 0], ['yellow', 0], ['green', 0], ['silver', 10], ['gold', 10], ['rainbow', 15]]
  .forEach(([color, price]) => add('nails', `nails-${color}`, `${COLORS[color].name} Nails`, price, { color }));

// Hats
[['none', 'No Hat', 0], ['bow', 'Big Bow', 0, 'pink'], ['cap', 'Baseball Cap', 0, 'blue'], ['sunhat', 'Sun Hat', 5],
 ['beanie', 'Winter Hat', 5, 'red'], ['tiara', 'Tiara', 10], ['flowers', 'Flower Crown', 10], ['cat', 'Kitty Ears', 10, 'pink'],
 ['bunny', 'Bunny Ears', 10, 'white'], ['crown', 'Gold Crown', 15], ['cone', 'Princess Hat', 20, 'pink'], ['unicorn', 'Unicorn Horn', 20],
].forEach(([style, name, price, color]) => add('hat', `hat-${style}`, name, price, { style, color }));

// Extras
[['none', 'No Extras', 0], ['glasses', 'Glasses', 0], ['sunglasses', 'Sunglasses', 5], ['heartglasses', 'Heart Sunglasses', 10],
 ['necklace', 'Heart Necklace', 5], ['pearls', 'Pearl Necklace', 10], ['scarf', 'Cozy Scarf', 5, 'red'],
 ['purse', 'Purse', 5, 'pink'], ['wand', 'Magic Wand', 15], ['cape', 'Royal Cape', 15, 'red'],
 ['fairywings', 'Fairy Wings', 20], ['butterfly', 'Butterfly Wings', 20],
].forEach(([style, name, price, color]) => add('extra', `extra-${style}`, name, price, { style, color }));

// The castle family. Grown-ups can rename everyone in the grown-ups menu.
const DEFAULT_CHARACTERS = [
  { id: 'mommy', name: 'Mommy', kind: 'adult', body: 'woman',
    plook: { hair: 'p-woman-hair-long', hairColor: 'p-hair-blonde', dress: 'p-woman-dress-sundress', top: null, bottom: null,
      shoes: 'p-woman-shoes-heels', hat: null, extra: null },
    look: {
    skin: 'skin-peach', eyes: 'eyes-lashes', eyeColor: 'eyec-blue', hair: 'hair-long', hairColor: 'hairc-blonde',
    lips: 'lips-pink', face: 'face-none', top: null, dress: 'dress-sundress-green', bottom: null,
    shoes: 'shoes-sandals-brown', nails: 'nails-pink', hat: 'hat-none', extra: 'extra-none' } },
  { id: 'daddy', name: 'Daddy', kind: 'broad', body: 'man',
    plook: { dress: null, top: 'p-man-top-tee-tint-blue', bottom: 'p-man-bottom-jeans', shoes: 'p-man-shoes-sneakers-tint-white',
      hat: null, extra: null },
    look: {
    skin: 'skin-peach', eyes: 'eyes-round', eyeColor: 'eyec-blue', hair: 'hair-buzz', hairColor: 'hairc-blonde',
    lips: 'lips-none', face: 'face-none', top: 'top-long-red', dress: null, bottom: 'bottom-pants-black',
    shoes: 'shoes-sneakers-white', nails: 'nails-none', hat: 'hat-none', extra: 'extra-glasses' } },
  { id: 'me', name: 'Me', kind: 'kid', body: 'kid',
    plook: { hair: 'p-kid-hair-pigtails', hairColor: 'p-hair-blonde', dress: 'p-kid-dress-party-tint-pink', top: null, bottom: null,
      shoes: 'p-kid-shoes-flats-tint-pink', hat: 'p-kid-hat-bow-tint-pink', extra: null },
    look: {
    skin: 'skin-peach', eyes: 'eyes-lashes', eyeColor: 'eyec-blue', hair: 'hair-pigtails', hairColor: 'hairc-blonde',
    lips: 'lips-none', face: 'face-blush', top: null, dress: 'dress-tutu-lightpink', bottom: null,
    shoes: 'shoes-flats-lightpink', nails: 'nails-purple', hat: 'hat-bow', extra: 'extra-none' } },
  { id: 'sister', name: 'Sister', kind: 'kid', body: 'kid',
    plook: { hair: 'p-kid-hair-ponytail', hairColor: 'p-hair-blonde', dress: null, top: 'p-kid-top-tee-tint-pink',
      bottom: 'p-kid-bottom-skirt-tint-purple', shoes: 'p-kid-shoes-sneakers-tint-white', hat: null, extra: null },
    look: {
    skin: 'skin-peach', eyes: 'eyes-lashes', eyeColor: 'eyec-blue', hair: 'hair-ponytail', hairColor: 'hairc-blonde',
    lips: 'lips-none', face: 'face-blush', top: 'top-tee-pink', dress: null, bottom: 'bottom-skirt-purple',
    shoes: 'shoes-sneakers-white', nails: 'nails-pink', hat: 'hat-none', extra: 'extra-none' } },
  // The family dog. Give him his real name in the grown-ups menu (it stays on the device).
  { id: 'dog', name: 'Puppy', kind: 'dog', body: 'dog',
    plook: { top: null, shoes: null, hat: null, extra: 'p-dog-extra-collar-tint-blue' }, look: {} },
];

// Fashion show themes. Each one scores 0 to 3 for how well an outfit fits.
const THEMES = [
  { id: 'royal', icon: '👑', name: 'Royal Ball', score: o =>
      (o.dress?.style === 'gown') + ['crown', 'tiara', 'cone'].includes(o.hat?.style) +
      (['cape', 'pearls', 'necklace', 'wand'].includes(o.extra?.style) || ['heels', 'glass'].includes(o.shoes?.style)) },
  { id: 'rainbow', icon: '🌈', name: 'Rainbow Day', score: o => Math.min(3, countWhere(o, i => i.color === 'rainbow')) },
  { id: 'pink', icon: '💖', name: 'Pink Party', score: o => Math.min(3, countWhere(o, i => ['pink', 'lightpink'].includes(i.color))) },
  { id: 'beach', icon: '🏖️', name: 'Beach Day', score: o =>
      (o.bottom?.style === 'shorts' || ['tank', 'crop'].includes(o.top?.style) || o.dress?.style === 'sundress') +
      (o.shoes?.style === 'sandals') + (['sunglasses', 'heartglasses'].includes(o.extra?.style) || o.hat?.style === 'sunhat') },
  { id: 'snow', icon: '❄️', name: 'Snow Day', score: o =>
      ['long', 'hoodie'].includes(o.top?.style) + ['boots', 'rainboots'].includes(o.shoes?.style) +
      (o.hat?.style === 'beanie' || o.extra?.style === 'scarf') },
  { id: 'fairy', icon: '🧚', name: 'Fairy Garden', score: o =>
      ['fairywings', 'butterfly', 'wand'].includes(o.extra?.style) + (o.hat?.style === 'flowers') +
      (countWhere(o, i => ['green', 'purple', 'lavender'].includes(i.color)) > 0) },
  { id: 'sparkle', icon: '✨', name: 'Super Sparkly', score: o =>
      Math.min(3, countWhere(o, i => i.pattern === 'glitter' || ['gold', 'silver'].includes(i.color) || i.id === 'face-glitter' || i.id === 'eyes-sparkly')) },
];

function countWhere(outfit, test) {
  return Object.values(outfit).filter(i => i && test(i)).length;
}

const PRAISE = ['Beautiful!', 'So pretty!', 'Amazing!', 'Wow, so stylish!', 'Fabulous!', 'Super cool!', 'Gorgeous!', 'Looking great!'];

// Little things the family says to each other while they walk around the castle.
// Short, simple words for a new reader. Tap a bubble to hear it.
const CHATS = [
  ['I like your dress!', 'Thank you! I like your shoes!'],
  ['Want to have a tea party?', 'Yes! With cupcakes!'],
  ['Let\'s go to the fashion show!', 'Yay! I will wear a crown!'],
  ['What is your favorite color?', 'Pink! And purple!'],
  ['Do you want to dance?', 'Yes! La la la!'],
  ['The castle is so pretty!', 'It has rainbows!'],
  ['I love you!', 'I love you too!'],
  ['Let\'s play dress up!', 'Okay! You pick first!'],
  ['Look, a rainbow!', 'So many colors!'],
  ['Are you hungry?', 'Yes! Let\'s have pizza!'],
  ['Your hair looks pretty!', 'Thank you! I like it too!'],
  ['Can we go to the park?', 'Yes! Let\'s go swing!'],
  ['Good morning!', 'Good morning! Did you sleep well?'],
  ['Hug time!', 'Big hug!'],
];

// What the family and the dog say to each other. The person talks first, then the dog.
// {dog} becomes the dog's name. A third word makes him do that trick after talking.
const DOG_CHATS = [
  ['Hi, {dog}!', 'Woof! Hi! I love you!'],
  ['Who is a good boy?', 'Me! Woof woof!'],
  ['Do you want a treat?', 'Yes please! Woof!'],
  ['Let\'s go for a walk!', 'Yay! I love walks!'],
  ['Can you sit?', 'I can sit! Look!', 'sit'],
  ['Can you spin?', 'Woof! Watch me spin!', 'spin'],
  ['Shake my hand!', 'Here is my paw!', 'paw'],
  ['Can you roll over?', 'Yes! Roll, roll!', 'roll'],
  ['Jump, {dog}, jump!', 'Boing! Boing!', 'jump'],
  ['You look so cute!', 'Thank you! Woof!'],
  ['Do you want to play ball?', 'Ball! Ball! Ball!'],
  ['Time for a bath!', 'Oh no! Woof!'],
  ['I love you, {dog}!', 'I love you too! Lick lick!'],
  ['Want to go to the fashion show?', 'Yes! I will wear my bow!'],
];

// Dog tricks: [id, the word in his speech bubble]
const TRICKS = [['sit', 'Sit!'], ['spin', 'Spin!'], ['roll', 'Roll over!'], ['paw', 'Shake!'], ['jump', 'Jump!'], ['dance', 'Dance!']];
const BARKS = ['Woof!', 'Woof woof!', 'Arf arf!', 'Bark bark!'];

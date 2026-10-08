
// =====================================================================
//  SCENES — one function per world, drawn in 9:16 world units (W x H), placed with LX / LY / UNIT so 1:1 re-lays out.
//  The coffee bean is the constant: an oval, no face. Cut-paper hands carry each step.
//  Colour rule: red-brown is the cherry and the bean only. The sun is yellow. Nothing else takes those colours.
//  Worlds not yet drawn (dry, mortar, pour, sip) are plain stubs until the look check is approved.
// =====================================================================
const RED = '#c23b2e', REDD = '#7a1f17', CLAY = '#b5532f', CLAYD = '#7b3420', BEAN = '#6b3d22', BEAND = '#3b2214';
const SKIN = PAL.skin2 ?? '#e0ad86', SLEEVE = PAL.blue;
function wokPts(cx, cy, rx, ry, n = 40) {   // the lower half of an ellipse: a bowl under its rim
  const P = []; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI; P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return P;
}
function beanPts(x, y, rx, ry, a) { return ellipsePts(x, y, rx, ry, a, 40); }

// ---- the bridge shapes: each is where its object sits at the end of one world or the start of the next
const CHERRY_AT = () => ({ x: LX(0.5), y: LY(0.42), r: 150 * UNIT });
const BEAN_AT = () => ({ x: LX(0.5), y: LY(0.42), rx: 70 * UNIT, ry: 100 * UNIT });
const SUN_AT = () => ({ x: LX(0.8), y: LY(0.2), r: 120 * UNIT });
const WOK_AT = () => ({ x: LX(0.5), y: LY(0.56), rx: 330 * UNIT, ry: 60 * UNIT });
const MORTAR_AT = () => ({ x: LX(0.5), y: LY(0.5), rx: 280 * UNIT, ry: 70 * UNIT });
const GROUNDS_AT = () => ({ x: LX(0.5), y: LY(0.62), rx: 200 * UNIT, ry: 60 * UNIT });
const GLASS_AT = () => ({ x: LX(0.5), y: LY(0.45), rx: 150 * UNIT, ry: 30 * UNIT });

// ---- world 1: a red cherry on a branch; a hand picks it
function sceneCherry() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.mint, { key: 'wall1', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,255,255,0.18)', 5, 90) });
  cut(capsulePts(LX(-0.05), LY(0.22), LX(1.05), LY(0.3), 26 * UNIT), PAL.wood, { key: 'branch1' });
  // background life: two leaves sway on the branch, an unripe green cherry
  [[0.16, 0.2, -0.5], [0.84, 0.27, 0.4]].forEach(([fx, fy, a0], i) => {
    const a = a0 + Math.sin(TT * 1.3 + i) * 0.06;
    cut(ellipsePts(LX(fx), LY(fy), 110 * UNIT, 42 * UNIT, a, 26), PAL.green, { key: 'leaf1' + i, crayon: PAL.greenD, crAl: 0.3 });
  });
  const c = CHERRY_AT(), bob = Math.sin(TT * 1.1) * 4 * UNIT;
  const cy = c.y + bob;
  cut(capsulePts(c.x, cy - c.r * 0.7, c.x + 20 * UNIT, cy - c.r - 110 * UNIT, 12 * UNIT), PAL.greenD, { key: 'stalk1' });
  cut(ellipsePts(c.x - c.r * 0.22, cy, c.r * 0.84, c.r * 0.92, 0, 40), RED, { key: 'cherryL', crayon: REDD, crAl: 0.3, sb: 14 });
  cut(ellipsePts(c.x + c.r * 0.22, cy, c.r * 0.84, c.r * 0.92, 0, 40), RED, { key: 'cherryR', crayon: REDD, crAl: 0.3, sb: 14, shadow: false });
  cut(capsulePts(c.x, cy - c.r * 0.82, c.x + 2 * UNIT, cy + c.r * 0.7, 4 * UNIT), REDD, { key: 'crease1', shadow: false, grain: 0.2 });
  cut(ellipsePts(c.x - c.r * 0.35, cy - c.r * 0.35, c.r * 0.18, c.r * 0.12, -0.6, 14), '#f2b2a0', { key: 'hi1', shadow: false });
  // a hand picks it from the right
  hand(c.x + c.r * 1.5, cy + c.r * 0.25, 1.1 * UNIT, Math.PI + 0.45, SKIN, SLEEVE, { key: 'pick1' });
  capStrip('It starts as a cherry.');
}

// ---- world 2: beans drying on a sun yard (the sun is the bridge object into world 3)
function sceneDry() { cut(rect(-30, -30, W + 60, H + 60, 0), PAL.cream, { key: 'wall2', shadow: false, tear: 0, shade: false }); cut(ellipsePts(BEAN_AT().x, BEAN_AT().y, BEAN_AT().rx, BEAN_AT().ry, 0, 40), BEAN, { key: 'bean2' }); }
// ---- worlds 3 to 7: stubs until the look check is approved
function sceneWok() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.mustard, { key: 'wall3', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.12)', 30, 80) });
  // wood fire under the wok, placed from the wok's own bottom so every format shows it; flames flicker on the 2s clock
  const w = WOK_AT(), base = w.y + w.ry * 2.6;
  cut(capsulePts(LX(0.3), base + 100 * UNIT, LX(0.7), base + 106 * UNIT, 26 * UNIT), PAL.woodD, { key: 'log3a' });
  cut(capsulePts(LX(0.36), base + 108 * UNIT, LX(0.64), base + 102 * UNIT, 22 * UNIT), PAL.woodD, { key: 'log3b' });
  for (let i = 0; i < 5; i++) {
    const fx = LX(0.36 + i * 0.07), k = 1 + Math.sin(TT * 3 + i) * 0.12;
    cut(ellipsePts(fx, base + 50 * UNIT, 26 * UNIT * k, 50 * UNIT * k, 0, 16), i % 2 ? '#f6cf55' : '#ec7a4f', { key: 'flame3' + i, shadow: false, tear: 0.6 });
  }
  cut(wokPts(w.x, w.y, w.rx, w.ry * 2.6), CLAY, { key: 'wok3', crayon: CLAYD, crAl: 0.35, sb: 12 });
  cut(ellipsePts(w.x, w.y, w.rx, w.ry, 0, 48), CLAYD, { key: 'wokrim3', shadow: false, tear: 0.6 });
  // beans tossed in the wok, bobbing with the stir
  const R = RNG('beans3');
  for (let i = 0; i < 14; i++) {
    const a = R.r(0.15, 0.85) * Math.PI, bx = w.x - Math.cos(a) * w.rx * 0.8 * R.f(), by = w.y - 6 * UNIT + Math.sin(TT * 2 + i) * 10 * UNIT;
    cut(ellipsePts(bx, by, 22 * UNIT, 30 * UNIT, R.n(0.5), 14), BEAN, { key: 'bn3' + i, shadow: false, tear: 0.4 });
  }
  // a spatula stirs from the right
  hand(w.x + w.rx * 0.9, w.y - w.ry * 0.2 + Math.sin(TT * 2) * 8 * UNIT, 1.0 * UNIT, Math.PI + 0.7, SKIN, SLEEVE, { key: 'stir3' });
  // smoke: pale wisps rising, a bit of life
  [0.4, 0.55, 0.7].forEach((fx, i) => {
    const y0 = LY(0.4) - ((TT * 40 + i * 90) % 220) * UNIT;
    cut(ellipsePts(LX(fx) + Math.sin(TT + i) * 20 * UNIT, y0, 34 * UNIT, 28 * UNIT, 0, 14), '#f4efe6', { key: 'smk3' + i, shadow: false, tear: 0.3 });
  });
  capStrip('Roasted.');
}
function sceneMortar() { cut(rect(-30, -30, W + 60, H + 60, 0), PAL.cream, { key: 'wall4', shadow: false, tear: 0, shade: false }); cut(ellipsePts(GROUNDS_AT().x, GROUNDS_AT().y, GROUNDS_AT().rx, GROUNDS_AT().ry, 0, 40), '#3b2214', { key: 'grounds4' }); }
function scenePour() { cut(rect(-30, -30, W + 60, H + 60, 0), PAL.cream, { key: 'wall5', shadow: false, tear: 0, shade: false }); cut(ellipsePts(GLASS_AT().x, GLASS_AT().y, GLASS_AT().rx, GLASS_AT().ry, 0, 40), '#cfe2ee', { key: 'glass5' }); }
// ---- world 6: the glass, the grounds sinking, steam rising (the wait)
function sceneWait() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.navy, { key: 'wall6', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,230,180,0.10)', 4, 70) });
  cut(rect(-30, LY(0.8), W + 60, H, 0), PAL.wood, { key: 'table6', tear: 0, pat: pat.grainWood('rgba(120,60,20,0.18)'), sy: -6 });
  // the glass: a clear tumbler, the coffee inside, the top of the coffee sits at LY(0.4)
  const gx = LX(0.5), top = LY(0.4), bot = LY(0.8);
  const glassP = [[gx - 230 * UNIT, top], [gx + 230 * UNIT, top], [gx + 180 * UNIT, bot], [gx - 180 * UNIT, bot]];
  cut(glassP, '#cfe2ee', { key: 'glass6', sb: 10, sy: 6 });
  cut([[gx - 210 * UNIT, top + 60 * UNIT], [gx + 210 * UNIT, top + 60 * UNIT], [gx + 165 * UNIT, bot - 6 * UNIT], [gx - 165 * UNIT, bot - 6 * UNIT]], '#6b3d22', { key: 'coffee6', shadow: false, tear: 0.6, shade: false });
  // the grounds sink one by one from the surface to the bottom, each on its own clock
  const R = RNG('sink6');
  for (let i = 0; i < 46; i++) {
    const delay = R.f() * 1.1, p = Math.min(1, Math.max(0, (TT - (E0 + 0.1 + delay)) / 1.6));
    const x = gx + R.r(-160, 160) * UNIT, y0 = top + 80 * UNIT + R.f() * 40 * UNIT, y1 = bot - 20 * UNIT - R.f() * 40 * UNIT;
    cut(ellipsePts(x, y0 + (y1 - y0) * p, 9 * UNIT, 7 * UNIT, R.n(0.5), 10), BEAND, { key: 'gr6' + i, shadow: false, tear: 0.3, grain: 0.4 });
  }
  // steam curls off the top of the coffee
  [-40, 0, 40].forEach((dx, i) => {
    const y0 = top - ((TT * 50 + i * 70) % 260) * UNIT;
    cut(capsulePts(gx + dx * UNIT, y0, gx + dx * UNIT + Math.sin(TT + i) * 22 * UNIT, y0 - 70 * UNIT, 14 * UNIT, 6), '#f4efe6', { key: 'steam6' + i, shadow: false, tear: 0.3 });
  });
  capStrip('Wait for the grounds to sink.');
}
function sceneSip() { cut(rect(-30, -30, W + 60, H + 60, 0), PAL.navy, { key: 'wall7', shadow: false, tear: 0, shade: false }); }

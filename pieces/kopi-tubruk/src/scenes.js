
// =====================================================================
//  SCENES — one function per world, drawn in 9:16 world units (W x H), placed with LX / LY / UNIT so 1:1 re-lays out.
//  The coffee bean is the constant: an oval with a crease, no face. Cut-paper hands carry each step (blue sleeve).
//  Colour rule: red-brown is the cherry and the beans only. The sun is yellow. Nothing else takes those colours.
//  Times below are seconds from the start of each world (t = TT - E0); E8 = one 8th at 120 BPM.
// =====================================================================
const RED = '#c23b2e', REDD = '#7a1f17', CLAY = '#b5532f', CLAYD = '#7b3420', BEAN = '#6b3d22', BEAND = '#3b2214', ROAST = '#4a2a16';
const LEAF = '#2f5f3a', LEAFHI = '#8cc794', SKIN = PAL.skin2 ?? '#e0ad86', SLEEVE = PAL.blue, STEAM = '#f4efe6';
const STONE = '#8a8078', STONED = '#5b5249', STEEL = '#8fb1c1', STEELD = '#5b8aa0', CLOUD = '#8a5a3a';
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeS = (x) => { const k = clamp01(x); return k * k * (3 - 2 * k); };
// blend two #rrggbb colours by t (0 = a, 1 = b)
function lerpHex(a, b, t) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b), k = clamp01(t);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('');
}
// the lower half of an ellipse: a bowl under its rim
function wokPts(cx, cy, rx, ry, n = 40) {
  const P = []; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI; P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return P;
}
// a roasted bean: an oval with its crease (an S-curve along the long axis, rot = a)
function bean(x, y, rx, ry, a, key, color = BEAN) {
  cut(ellipsePts(x, y, rx, ry, a, 30), color, { key, tear: 0.5, crayon: BEAND, crAl: 0.25, sb: 6 });
  const lx = -Math.sin(a), ly = Math.cos(a), px = Math.cos(a), py = Math.sin(a), P = [];
  for (let i = 0; i <= 10; i++) { const u = i / 10 - 0.5, off = Math.sin(u * Math.PI * 2) * rx * 0.22; P.push([x + lx * u * ry * 1.4 + px * off, y + ly * u * ry * 1.4 + py * off]); }
  ink(P, { w: 5 * UNIT, color: BEAND, key: key + 'c', amt: 0.4 });
}
// a curling ribbon (smoke, steam): an ink line that drifts sideways as it rises from (x, y0) to y1
function ribbon(x, y0, y1, amp, phase, w, color, key) {
  const P = []; for (let i = 0; i <= 14; i++) { const v = i / 14; P.push([x + Math.sin(v * 5 + phase) * amp * (0.4 + v), y0 + (y1 - y0) * v]); }
  ink(P, { w: w * UNIT, color, key, amt: 0.6 });
}
// a paper hand around something: a sleeve behind the palm, a palm, fingers wrapped on the near side, a thumb
function gripHand(hx, hy, ang, s, key) {
  const ux = Math.cos(ang), uy = Math.sin(ang), px = -uy, py = ux;
  cut(capsulePts(hx - ux * 230 * s, hy - uy * 230 * s, hx - ux * 30 * s, hy - uy * 30 * s, 84 * s, 4), SLEEVE, { key: key + 's' });
  cut(ellipsePts(hx, hy, 56 * s, 46 * s, ang, 22), SKIN, { key: key + 'p' });
  for (let i = -1; i <= 1; i++) cut(capsulePts(hx + px * i * 24 * s + ux * 26 * s, hy + py * i * 24 * s + uy * 26 * s, hx + px * i * 24 * s + ux * 66 * s, hy + py * i * 24 * s + uy * 66 * s, 20 * s, 5), SKIN, { key: key + 'f' + i, shadow: false });
  cut(capsulePts(hx + px * 44 * s - ux * 6 * s, hy + py * 44 * s - uy * 6 * s, hx + px * 20 * s + ux * 50 * s, hy + py * 20 * s + uy * 50 * s, 22 * s, 5), SKIN, { key: key + 't', shadow: false });
}
// a paper hand pinching a tip at (tx, ty): thumb and index finger meet on the tip, sleeve from the wrist (wx, wy)
function pinchHand(tx, ty, wx, wy, s, key) {
  const dx = tx - wx, dy = ty - wy, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux;
  cut(capsulePts(wx + ux * 220 * s, wy + uy * 220 * s, wx, wy, 84 * s, 4), SLEEVE, { key: key + 's' });
  const kx = wx + ux * 110 * s, ky = wy + uy * 110 * s;
  cut(ellipsePts(kx, ky, 66 * s, 54 * s, Math.atan2(dy, dx), 22), SKIN, { key: key + 'p' });
  cut(capsulePts(kx + px * 46 * s, ky + py * 46 * s, tx + px * 16 * s, ty + py * 16 * s, 24 * s, 6), SKIN, { key: key + 't', shadow: false });
  cut(capsulePts(kx - px * 40 * s, ky - py * 40 * s, tx - px * 12 * s, ty - py * 12 * s, 22 * s, 6), SKIN, { key: key + 'i', shadow: false });
}
// a glossy coffee cherry: a slightly oval body in two lobes, a crease, a highlight
function cherryAt(x, y, r, key) {
  cut(ellipsePts(x - r * 0.2, y, r * 0.8, r * 0.98, 0, 40), RED, { key: key + 'L', crayon: REDD, crAl: 0.3, sb: 14 });
  cut(ellipsePts(x + r * 0.2, y, r * 0.8, r * 0.98, 0, 40), RED, { key: key + 'R', crayon: REDD, crAl: 0.3, sb: 14, shadow: false });
  cut(capsulePts(x, y - r * 0.8, x + 2 * UNIT, y + r * 0.7, 4 * UNIT), REDD, { key: key + 'cr', shadow: false, grain: 0.2 });
  cut(ellipsePts(x - r * 0.4, y - r * 0.38, r * 0.16, r * 0.1, -0.6, 12), '#f2b2a0', { key: key + 'hi', shadow: false });
}
// a glossy leaf pair from a node: the two leaves point opposite ways
function leafPair(nx, ny, a, len, key) {
  [a, a + Math.PI].forEach((dir, i) => {
    const cx = nx + Math.cos(dir) * len * 0.5, cy = ny + Math.sin(dir) * len * 0.5;
    cut(ellipsePts(cx, cy, len * 0.5, 52 * UNIT, dir, 26), LEAF, { key: key + i, shadow: true, sb: 6 });
    ink([[nx + Math.cos(dir) * len * 0.12, ny + Math.sin(dir) * len * 0.12], [nx + Math.cos(dir) * len * 0.82, ny + Math.sin(dir) * len * 0.82]], { w: 5 * UNIT, color: LEAFHI, key: key + 'v' + i, amt: 0.3 });
  });
}
// a clear glass: the outline from its mouth (y = mouthY) to its base (bot); half(y) is the half-width at height y
function glassPts(gx, mouthY, bot, rTop, rBot) {
  return { top: [[gx - rTop, mouthY], [gx + rTop, mouthY], [gx + rBot, bot], [gx - rBot, bot]],
    half: (y) => rTop + (rBot - rTop) * clamp01((y - mouthY) / (bot - mouthY)) };
}

// ---- the bridge shapes: where each object sits at the end of one world and the start of the next
const CHERRY_AT = () => ({ x: LX(0.5), y: LY(0.42), r: 110 * UNIT });
const BEAN_AT = () => ({ x: LX(0.5), y: LY(0.42), rx: 70 * UNIT, ry: 100 * UNIT });
const SUN_AT = () => ({ x: LX(0.8), y: LY(0.2), r: 120 * UNIT });
const WOK_AT = () => ({ x: LX(0.5), y: LY(0.56), rx: 330 * UNIT, ry: 60 * UNIT });
const MORTAR_AT = () => ({ x: LX(0.5), y: LY(0.4), rx: 170 * UNIT, ry: 36 * UNIT });
const GROUNDS_AT = () => ({ x: LX(0.5), y: LY(0.4), rx: 150 * UNIT, ry: 30 * UNIT });
const GLASS_AT = () => ({ x: LX(0.5), y: LY(0.45), rx: 150 * UNIT, ry: 30 * UNIT });

// ---- world 1: a close-up of five ripe cherries packed tight against the branch at one leaf node, no stems; a paper hand pinches one
function sceneCherry() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.mint, { key: 'wall1', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,255,255,0.18)', 5, 90) });
  const bY = (fx) => LY(0.12 + (fx + 0.05) / 1.1 * 0.24);   // the branch's centre line at horizontal fraction fx
  cut(capsulePts(LX(-0.05), LY(0.12), LX(1.05), LY(0.36), 46 * UNIT), PAL.wood, { key: 'branch1' });
  [[0.2, 0.18], [0.78, 0.31]].forEach(([fx, fy], i) => leafPair(LX(fx), LY(fy), -0.9, 230 * UNIT, 'lf' + i));
  // five cherries against the branch, touching it and each other; they sway a little on the 2s clock
  const sway = Math.sin(TT * 1.2) * 4 * UNIT, pk = [[0.44, 84, 0], [0.56, 84, 0], [0.5, 84, 50], [0.38, 80, 40], [0.62, 80, 40]];
  const at = pk.map(([fx, r, dy], i) => ({ x: LX(fx) + sway * (i % 2 ? 0.5 : -0.5), y: bY(fx) + 23 * UNIT + r * 0.85 * UNIT + dy * UNIT + Math.sin(TT * 1.1 + i) * 3 * UNIT, r: r * UNIT }));
  at.forEach((c, i) => cherryAt(c.x, c.y, c.r, 'ch' + i));
  // the paper hand pinches the centre cherry at its right edge, the blue sleeve coming in from the right
  const c = at[2];
  pinchHand(c.x + c.r * 0.82, c.y, LX(1.0), LY(0.56), 1.2 * UNIT, 'pick1');
  capStrip('It starts as a cherry.');
}

// ---- world 2: beans spread on a sun yard; a rake sweeps them; the big sun is the bridge object into the wok
function sceneDry() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.sky, { key: 'wall2', shadow: false, tear: 0, shade: false });
  const s = SUN_AT(), rise = Math.sin(TT * 0.8) * 4 * UNIT;
  cut(ellipsePts(s.x, s.y + rise, s.r, s.r, 0, 48), PAL.yellow, { key: 'sun2', crayon: '#e6b23a', crAl: 0.3, sb: 14 });
  cut(rect(-30, LY(0.34), W + 60, H, 0), PAL.woodL, { key: 'yard2', tear: 0, pat: pat.grainWood('rgba(120,60,20,0.14)'), sy: -6 });
  // beans stay above 0.66 of the height, clear of the caption strip in both formats
  const R = RNG('dry2');
  for (let i = 0; i < 14; i++) {
    const fx = 0.12 + R.f() * 0.76, fy = 0.46 + R.f() * 0.2;
    if (Math.abs(fx - 0.5) < 0.1 && Math.abs(fy - 0.42) < 0.08) continue;
    bean(LX(fx), LY(fy), 22 * UNIT, 32 * UNIT, R.n(0.9), 'sb2' + i);
  }
  const b = BEAN_AT();   // the big bean the wok picks up, drawn at its bridge position
  bean(b.x, b.y, b.rx, b.ry, 0, 'bigbean2');
  // the rake: its head sweeps left and right over the beans, a four-tooth comb at the working end
  const hx = LX(0.96), hy = LY(0.5), sw = Math.sin(TT * 0.9) * 40 * UNIT, tx = LX(0.6) + sw, ty = LY(0.64);
  const dx = hx - tx, dy = hy - ty, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux;
  cut(capsulePts(hx, hy, tx, ty, 16 * UNIT, 6), PAL.woodD, { key: 'rake2' });
  for (let i = 0; i < 4; i++) { const bx = tx + px * (i - 1.5) * 22 * UNIT, by = ty + py * (i - 1.5) * 22 * UNIT; ink([[bx, by], [bx + ux * 60 * UNIT, by + uy * 60 * UNIT]], { w: 6 * UNIT, color: PAL.woodD, key: 'tooth2' + i, amt: 0.2 }); }
  gripHand(hx, hy, Math.atan2(ty - hy, tx - hx), 1.1 * UNIT, 'rake2h');
  capStrip('Sun-dried.');
}

// ---- world 3: a clay wok over crossed logs and teardrop flames; roasted beans tossed, smoke ribbons, a wooden spatula
function sceneWok() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.mustard, { key: 'wall3', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.12)', 30, 80) });
  const w = WOK_AT(), base = w.y + w.ry * 2.2;
  cut(capsulePts(LX(0.3), base + 84 * UNIT, LX(0.7), base + 104 * UNIT, 24 * UNIT), PAL.woodD, { key: 'logA3' });
  cut(capsulePts(LX(0.7), base + 84 * UNIT, LX(0.3), base + 104 * UNIT, 24 * UNIT), PAL.woodD, { key: 'logB3' });
  for (let i = 0; i < 5; i++) {
    const fx = LX(0.36 + i * 0.07), k = 1 + Math.sin(TT * 3 + i) * 0.1, sway = Math.sin(TT * 2 + i) * 6 * UNIT;
    const yb = base + 52 * UNIT, h = (84 + (i % 2) * 36) * UNIT * k, col = i % 2 ? '#f6cf55' : '#ec7a4f';
    cut(ellipsePts(fx, yb, 22 * UNIT * k, 22 * UNIT * k, 0, 18), col, { key: 'fb3' + i, shadow: false, tear: 0.4 });
    cut([[fx - 22 * UNIT * k, yb], [fx + sway, yb - h], [fx + 22 * UNIT * k, yb]], col, { key: 'ft3' + i, shadow: false, tear: 0.4 });
  }
  cut(wokPts(w.x, w.y, w.rx, w.ry * 2.2), CLAY, { key: 'bowl3', crayon: CLAYD, crAl: 0.35, sb: 12 });
  cut(ellipsePts(w.x, w.y, w.rx, w.ry, 0, 48), CLAYD, { key: 'rim3', shadow: false, tear: 0.6 });
  cut(ellipsePts(w.x, w.y, w.rx * 0.92, w.ry * 0.8, 0, 48), '#5a2b18', { key: 'inside3', shadow: false, tear: 0.4 });
  const R = RNG('beans3');
  for (let i = 0; i < 9; i++) {
    const bx = w.x - w.rx * 0.7 + i * (w.rx * 1.4 / 8), by = w.y + Math.sin(TT * 2 + i) * 6 * UNIT;
    bean(bx + R.n(12) * UNIT, by + R.n(6) * UNIT, 20 * UNIT, 28 * UNIT, R.n(0.7), 'rb3' + i, ROAST);
  }
  [[-0.5, 90], [0.1, 150], [0.45, 70], [-0.15, 230]].forEach(([fx, up], i) => {
    const bob = Math.sin(TT * 2.2 + i * 1.7) * 14 * UNIT;
    bean(w.x + fx * w.rx, w.y - up * UNIT + bob, 20 * UNIT, 28 * UNIT, 0.5 + i * 0.6, 'toss3' + i, ROAST);
  });
  [[-120, 0.0], [0, 1.3], [120, 2.6]].forEach(([dx, ph], i) => ribbon(w.x + dx * UNIT, w.y - 140 * UNIT, w.y - 620 * UNIT, 46 * UNIT, TT * 1.4 + ph, 14, STEAM, 'smk3' + i));
  const pdx = w.x + w.rx * 0.2, pdy = w.y + w.ry * 0.5, hx = LX(0.9), hy = LY(0.44) + Math.sin(TT * 2) * 8 * UNIT;
  const ang = Math.atan2(pdy - hy, pdx - hx);
  cut(capsulePts(hx, hy, pdx, pdy, 14 * UNIT, 6), PAL.woodL, { key: 'spat3' });
  cut(ellipsePts(pdx, pdy, 36 * UNIT, 22 * UNIT, ang, 22), PAL.wood, { key: 'paddle3', crayon: PAL.woodD, crAl: 0.3 });
  gripHand(hx, hy, ang, 1.1 * UNIT, 'stir3');
  capStrip('Roasted.');
}

// ---- world 4: a tall stone mortar (lumpang) standing on the ground; roasted beans break into grounds; a thick wooden pestle (alu) pounds on each 8th
function sceneMortar() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.pink, { key: 'wall4', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,255,255,0.2)', 5, 80) });
  const m = MORTAR_AT(), g = GROUNDS_AT(), base = LY(0.7), ground = LY(0.7);
  cut(rect(-30, ground, W + 60, H, 0), PAL.woodL, { key: 'floor4', tear: 0, pat: pat.grainWood('rgba(120,60,20,0.14)'), sy: -6 });
  // the body: a tall, deep stone pot, wider at the rim, narrower at the foot
  const L = [], Rt = [];
  for (let i = 0; i <= 10; i++) { const u = i / 10, half = m.rx * (1 - 0.22 * u); L.push([m.x - half, m.y + (base - m.y) * u]); Rt.unshift([m.x + half, m.y + (base - m.y) * u]); }
  cut([...L, ...Rt], STONE, { key: 'mortar4', crayon: STONED, crAl: 0.3, sb: 12 });
  cut(ellipsePts(m.x, m.y, m.rx, m.ry, 0, 48), STONED, { key: 'mouth4', shadow: false, tear: 0.5 });
  // roasted beans sit in the bowl; each one breaks into grounds at its own time
  const t = TT - E0, R = RNG('mort4');
  for (let i = 0; i < 5; i++) {
    const bx = m.x - 100 * UNIT + i * 50 * UNIT, by = m.y + 14 * UNIT + (i % 2) * 8 * UNIT, tb = 0.6 + i * 0.5;
    if (t < tb) bean(bx, by, 18 * UNIT, 24 * UNIT, R.n(0.8), 'mb4' + i, ROAST);
    else for (let j = 0; j < 5; j++) cut(ellipsePts(bx + R.r(-22, 22) * UNIT, by + R.r(-8, 8) * UNIT, 6 * UNIT, 5 * UNIT, 0, 10), BEAND, { key: 'gr4' + i + j, shadow: false, tear: 0.2, grain: 0.4 });
  }
  cut(ellipsePts(g.x, g.y + 40 * UNIT, g.rx * 0.9, g.ry * 0.5, 0, 36), BEAND, { key: 'grounds4', tear: 0.5, grain: 0.7, shadow: false });
  // the pestle lifts a little between 8ths and is driven into the bowl on each one; grounds jump on every knock
  const lift = 100 * UNIT * Math.pow(Math.abs(Math.sin(Math.PI * t / E8)), 0.6);
  const tipX = m.x + 20 * UNIT, tipY = m.y + 40 * UNIT - lift, topX = LX(0.86), topY = LY(0.14) + lift * 0.4;
  const ang = Math.atan2(tipY - topY, tipX - topX);
  cut(capsulePts(topX, topY, tipX, tipY, 52 * UNIT, 8), PAL.wood, { key: 'alu4', crayon: PAL.woodD, crAl: 0.3 });
  const hit = Math.floor(t / E8), age = t - hit * E8;
  for (let j = 0; j < 5; j++) {
    const kr = RNG('knock' + (hit % 8) + '_' + j), vx = kr.r(-90, 90) * UNIT, vy = kr.r(120, 220) * UNIT;
    const px = tipX + vx * age / E8, py = m.y + 30 * UNIT - vy * age / E8 + 900 * UNIT * age * age / (E8 * E8);
    if (age < E8 * 0.9) cut(ellipsePts(px, py, 7 * UNIT, 6 * UNIT, 0, 10), BEAND, { key: 'jump4' + j, shadow: false, tear: 0.2, grain: 0.3 });
  }
  gripHand(topX, topY, ang, 1.2 * UNIT, 'hand4');
  capStrip('Pounded whole.');
}

// ---- world 5: a kettle pours boiling water straight onto the grounds in a glass; the grounds swirl up through the whole glass
function scenePour() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.teal, { key: 'wall5', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.1)', 26, 70) });
  const gl = GLASS_AT(), bot = LY(0.66), gp = glassPts(gl.x, gl.y, bot, gl.rx, gl.rx * 0.78);
  cut(gp.top, '#cfe2ee', { key: 'glass5', sb: 10, sy: 6 });
  const t = TT - E0, p = clamp01(t / 2.4), lvl = bot - 50 * UNIT - (bot - gl.y - 120 * UNIT) * p, hw = gp.half(lvl);
  cut([[gl.x - hw + 8 * UNIT, lvl], [gl.x + hw - 8 * UNIT, lvl], [gl.x + gl.rx * 0.78 - 10 * UNIT, bot - 10 * UNIT], [gl.x - gl.rx * 0.78 + 10 * UNIT, bot - 10 * UNIT]], BEAN, { key: 'coffee5', shadow: false, tear: 0.5, shade: false });
  // the water lands and the grounds swirl up through the glass: a cloud that grows as the pour goes on
  const cl = clamp01((t - 0.4) / 2.2), R = RNG('swirl5');
  for (let i = 0; i < 60; i++) {
    const seed = R.f(), ang = R.f() * TAU, rr = (0.15 + 0.8 * R.f()) * gl.rx * 0.8, spin = t * (1.4 + seed * 1.6) + ang;
    const rise = 0.2 + 0.8 * ((i * 0.37) % 1), y = bot - 24 * UNIT - cl * (bot - gl.y - 90 * UNIT) * rise;
    if (i > 8 + 52 * cl) continue;
    cut(ellipsePts(gl.x + Math.cos(spin) * rr * (0.5 + 0.5 * cl), y + Math.sin(spin) * 10 * UNIT, 8 * UNIT, 6 * UNIT, 0, 10), i % 3 ? BEAND : CLOUD, { key: 'sw5' + i, shadow: false, tear: 0.2, grain: 0.3 });
  }
  cut(ellipsePts(gl.x, gl.y, gl.rx, gl.ry, 0, 40), '#eef6fa', { key: 'mouth5', shadow: false, tear: 0.3 });
  // the kettle, drawn in parts: body, neck, lid knob, spout, handle; a paper hand holds the handle
  const kx = LX(0.22), ky = LY(0.2);
  cut(ellipsePts(kx, ky, 92 * UNIT, 80 * UNIT, 0, 36), STEEL, { key: 'kettle5', crayon: STEELD, crAl: 0.3, sb: 10 });
  cut(ellipsePts(kx - 30 * UNIT, ky - 40 * UNIT, 26 * UNIT, 12 * UNIT, -0.4, 14), '#d7e9f0', { key: 'khi5', shadow: false });
  cut(rect(kx - 36 * UNIT, ky - 96 * UNIT, 72 * UNIT, 26 * UNIT, 6), STEELD, { key: 'neck5', shadow: false });
  cut(ellipsePts(kx, ky - 110 * UNIT, 14 * UNIT, 10 * UNIT, 0, 14), '#2a1d18', { key: 'knob5', shadow: false });
  const sx = gl.x - 40 * UNIT, sy = gl.y - 170 * UNIT;
  cut([[kx + 70 * UNIT, ky - 20 * UNIT], [sx, sy - 10 * UNIT], [sx, sy + 10 * UNIT], [kx + 70 * UNIT, ky + 40 * UNIT]], STEEL, { key: 'spout5', shadow: false });
  ink(Array.from({ length: 11 }, (_, i) => { const a = Math.PI * (0.2 + i / 10 * 1.6); return [kx - 100 * UNIT + Math.cos(a) * 46 * UNIT, ky + Math.sin(a) * -46 * UNIT - 30 * UNIT]; }), { w: 12 * UNIT, color: STEELD, key: 'handle5', amt: 0.2 });
  gripHand(kx - 110 * UNIT, ky - 10 * UNIT, 0, 1.0 * UNIT, 'hand5');
  ink([[sx, sy], [gl.x - 10 * UNIT, gl.y - 60 * UNIT], [gl.x - 4 * UNIT + Math.sin(TT * 4) * 3 * UNIT, lvl]], { w: 14 * UNIT, color: '#cfe2ee', key: 'stream5', amt: 0.5 });
  [[-60, 0.0], [0, 1.1], [60, 2.2]].forEach(([dx, ph], i) => ribbon(gl.x + dx * UNIT, gl.y - 40 * UNIT, gl.y - 360 * UNIT, 40 * UNIT, TT * 1.3 + ph, 13, STEAM, 'steam5' + i));
  cut(rect(-30, bot - 6 * UNIT, W + 60, H, 0), PAL.wood, { key: 'table5', tear: 0, pat: pat.grainWood('rgba(120,60,20,0.18)'), sy: -6 });
  tag('No filter.', CX, H - SAFE.bottom - 144, 50, { rot: 0.01, tape: false });
  tag('Boiling water, straight on.', CX, H - SAFE.bottom - 60, 50, { rot: 0.01, tape: false });
}

// ---- world 6: the glass starts cloudy and settles: the grounds sink to a sediment layer that thickens; a thin ring on top early
function sceneWait() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.navy, { key: 'wall6', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,230,180,0.10)', 4, 70) });
  cut(rect(-30, LY(0.68), W + 60, H, 0), PAL.wood, { key: 'table6', tear: 0, pat: pat.grainWood('rgba(120,60,20,0.18)'), sy: -6 });
  const gx = LX(0.5), mouthY = LY(0.3), bot = LY(0.66), gp = glassPts(gx, mouthY, bot, 200 * UNIT, 165 * UNIT);
  const t = TT - E0, cloud = clamp01(1 - t / 2.2), surf = mouthY + 40 * UNIT;
  cut(gp.top, '#cfe2ee', { key: 'glass6', sb: 10, sy: 6 });
  const hw = gp.half(surf);
  cut([[gx - hw + 8 * UNIT, surf], [gx + hw - 8 * UNIT, surf], [gx + 165 * UNIT - 10 * UNIT, bot - 8 * UNIT], [gx - 165 * UNIT + 10 * UNIT, bot - 8 * UNIT]], lerpHex(BEAN, CLOUD, cloud), { key: 'coffee6', shadow: false, tear: 0.6, shade: false });
  cut(ellipsePts(gx, mouthY, 200 * UNIT, 26 * UNIT, 0, 40), '#eef6fa', { key: 'mouth6', shadow: false, tear: 0.3 });
  // the thin ring of grounds on the surface, early on only
  if (t < 1.4) for (let i = 0; i < 26; i++) { const a = i / 26 * TAU; cut(ellipsePts(gx + Math.cos(a) * (hw - 16 * UNIT), surf + Math.sin(a) * 14 * UNIT, 6 * UNIT, 5 * UNIT, 0, 8), BEAND, { key: 'ring6' + i, shadow: false, tear: 0.2, grain: 0.3 }); }
  // the sediment layer thickens as the grounds land
  const sp = clamp01(t / 2.4), sedTop = bot - (18 + 80 * sp) * UNIT, sedHw = gp.half(sedTop);
  cut([[gx - sedHw + 6 * UNIT, sedTop], [gx + sedHw - 6 * UNIT, sedTop], [gx + 165 * UNIT - 12 * UNIT, bot - 8 * UNIT], [gx - 165 * UNIT + 12 * UNIT, bot - 8 * UNIT]], BEAND, { key: 'sed6', shadow: false, tear: 0.8, grain: 0.9 });
  // the cloud settles: each grain drops from its swirl to the sediment on its own clock
  const R = RNG('sink6');
  for (let i = 0; i < 40; i++) {
    const x0 = gx + R.r(-150, 150) * UNIT, y0 = surf + 30 * UNIT + R.f() * (bot - surf - 60 * UNIT);
    const x1 = gx + R.r(-120, 120) * UNIT, y1 = sedTop - 6 * UNIT - R.f() * 14 * UNIT, ts = (i % 10) / 10 * 1.6, q = easeS((t - ts) / 1.6);
    if (q >= 1) { cut(ellipsePts(x1, y1, 8 * UNIT, 6 * UNIT, 0, 10), BEAND, { key: 'gr6' + i, shadow: false, tear: 0.2, grain: 0.3 }); continue; }
    cut(ellipsePts(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q + Math.sin(t * 2 + i) * 6 * UNIT * (1 - q), 8 * UNIT, 6 * UNIT, 0, 10), i % 4 ? BEAND : CLOUD, { key: 'gr6' + i, shadow: false, tear: 0.2, grain: 0.3 });
  }
  [[-70, 0.0], [0, 1.1], [70, 2.2]].forEach(([dx, ph], i) => ribbon(gx + dx * UNIT, mouthY - 40 * UNIT, mouthY - 300 * UNIT, 34 * UNIT, TT * 1.2 + ph, 13, STEAM, 'steam6' + i));
  capStrip('Wait for the grounds to sink.');
}

// ---- world 7: the sip. The same clear glass tilts toward the camera in a paper hand; the sky goes from pre-dawn navy to a warm dawn; the sun rises behind; steam curls toward it
function sceneSip() {
  const t = clamp01((TT - E0) / 2.0), dawn = easeS((TT - E0) / 4);
  cut(rect(-30, -30, W + 60, H + 60, 0), lerpHex(PAL.night, '#f4c58a', dawn), { key: 'wall7', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,230,180,0.14)', 4, 70) });
  const sunY = LY(0.62) - (LY(0.62) - LY(0.3)) * dawn, sunX = LX(0.64);
  cut(ellipsePts(sunX, sunY, 170 * UNIT, 170 * UNIT, 0, 48), PAL.yellow, { key: 'sun7', crayon: '#e6b23a', crAl: 0.3, sb: 14 });
  // the glass: same clear glass and coffee as worlds 5 and 6, lifted and tilted toward the camera
  const gx = LX(0.5), rimY = LY(0.36), botY = LY(0.9), rT = 230 * UNIT, rB = 180 * UNIT, o = 0.35 + 0.65 * t, th = 0.14 * t;
  const R2 = (P) => rot(P, gx, botY, th);
  const body = [[gx - rT, rimY], [gx + rT, rimY], [gx + rB, botY], [gx - rB, botY]];
  cut(R2(body), '#cfe2ee', { key: 'glass7', sb: 10, sy: 6 });
  const half = (y) => rT + (rB - rT) * clamp01((y - rimY) / (botY - rimY)), lvlY = rimY + 70 * UNIT, sedY = botY - 60 * UNIT;
  cut(R2([[gx - half(lvlY) + 8 * UNIT, lvlY], [gx + half(lvlY) - 8 * UNIT, lvlY], [gx + rB - 10 * UNIT, botY - 8 * UNIT], [gx - rB + 10 * UNIT, botY - 8 * UNIT]]), ROAST, { key: 'coffee7', shadow: false, tear: 0.4, shade: false });
  cut(R2([[gx - half(sedY) + 6 * UNIT, sedY], [gx + half(sedY) - 6 * UNIT, sedY], [gx + rB - 12 * UNIT, botY - 8 * UNIT], [gx - rB + 12 * UNIT, botY - 8 * UNIT]]), BEAND, { key: 'sed7', shadow: false, tear: 0.8, grain: 0.9 });
  cut(R2(ellipsePts(gx, lvlY, half(lvlY) - 8 * UNIT, 30 * UNIT * o, 0, 40)), ROAST, { key: 'surf7', shadow: false, tear: 0.3 });
  cut(R2(ellipsePts(gx, rimY, rT, 36 * UNIT * o, 0, 40)), '#eef6fa', { key: 'rim7', shadow: false, tear: 0.3 });
  // steam curls up toward the sun
  [[-90, 0.0], [0, 1.2], [90, 2.4]].forEach(([dx, ph], i) => ribbon(gx + dx * UNIT, rimY - 30 * UNIT, sunY + 150 * UNIT, 50 * UNIT, TT * 1.1 + ph, 15, STEAM, 'steam7' + i));
  // the hand lifts from the lower left and holds the glass's side
  gripHand(gx - 190 * UNIT, LY(0.8) - 60 * UNIT * t, 0, 1.2 * UNIT, 'hand7');
}

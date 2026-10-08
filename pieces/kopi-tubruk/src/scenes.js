
// =====================================================================
//  SCENES — one function per world, drawn in 9:16 world units (W x H), placed with LX / LY / UNIT so 1:1 re-lays out.
//  The coffee bean is the constant: an oval with a crease, no face. Cut-paper hands carry each step (blue sleeve).
//  Colour rule: red-brown is the cherry and the beans only. The sun is yellow. Nothing else takes those colours.
// =====================================================================
const RED = '#c23b2e', REDD = '#7a1f17', CLAY = '#b5532f', CLAYD = '#7b3420', BEAN = '#6b3d22', BEAND = '#3b2214', ROAST = '#4a2a16';
const LEAF = '#2f5f3a', LEAFHI = '#8cc794', SKIN = PAL.skin2 ?? '#e0ad86', SLEEVE = PAL.blue, STEAM = '#f4efe6';
const clamp01 = (x) => Math.min(1, Math.max(0, x));

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
// a glossy cherry: two lobes, a crease, a highlight
function cherryAt(x, y, r, key) {
  cut(ellipsePts(x - r * 0.22, y, r * 0.84, r * 0.92, 0, 40), RED, { key: key + 'L', crayon: REDD, crAl: 0.3, sb: 14 });
  cut(ellipsePts(x + r * 0.22, y, r * 0.84, r * 0.92, 0, 40), RED, { key: key + 'R', crayon: REDD, crAl: 0.3, sb: 14, shadow: false });
  cut(capsulePts(x, y - r * 0.82, x + 2 * UNIT, y + r * 0.7, 4 * UNIT), REDD, { key: key + 'cr', shadow: false, grain: 0.2 });
  cut(ellipsePts(x - r * 0.4, y - r * 0.38, r * 0.16, r * 0.1, -0.6, 12), '#f2b2a0', { key: key + 'hi', shadow: false });
}
// a glossy leaf from a node: a pair of leaves points opposite ways
function leafPair(nx, ny, a, len, key) {
  [a, a + Math.PI].forEach((dir, i) => {
    const cx = nx + Math.cos(dir) * len * 0.5, cy = ny + Math.sin(dir) * len * 0.5;
    cut(ellipsePts(cx, cy, len * 0.5, 52 * UNIT, dir, 26), LEAF, { key: key + i, shadow: true, sb: 6 });
    ink([[nx + Math.cos(dir) * len * 0.12, ny + Math.sin(dir) * len * 0.12], [nx + Math.cos(dir) * len * 0.82, ny + Math.sin(dir) * len * 0.82]], { w: 5 * UNIT, color: LEAFHI, key: key + 'v' + i, amt: 0.3 });
  });
}
// the cut-paper coffee in a glass: the liquid's half-width narrows from the mouth down to the base
function glassPts(gx, mouthY, bot, rTop, rBot) {
  return { top: [[gx - rTop, mouthY], [gx + rTop, mouthY], [gx + rBot, bot], [gx - rBot, bot]],
    half: (y) => rTop + (rBot - rTop) * clamp01((y - mouthY) / (bot - mouthY)) };
}

// ---- the bridge shapes: where each object sits at the end of one world and the start of the next
const CHERRY_AT = () => ({ x: LX(0.5), y: LY(0.42), r: 110 * UNIT });
const BEAN_AT = () => ({ x: LX(0.5), y: LY(0.42), rx: 70 * UNIT, ry: 100 * UNIT });
const SUN_AT = () => ({ x: LX(0.8), y: LY(0.2), r: 120 * UNIT });
const WOK_AT = () => ({ x: LX(0.5), y: LY(0.56), rx: 330 * UNIT, ry: 60 * UNIT });
const MORTAR_AT = () => ({ x: LX(0.5), y: LY(0.5), rx: 280 * UNIT, ry: 70 * UNIT });
const GROUNDS_AT = () => ({ x: LX(0.5), y: LY(0.5), rx: 200 * UNIT, ry: 44 * UNIT });
const GLASS_AT = () => ({ x: LX(0.5), y: LY(0.45), rx: 150 * UNIT, ry: 30 * UNIT });

// ---- world 1: a close-up of a cluster of ripe cherries on the branch, a paper hand pinches one
function sceneCherry() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.mint, { key: 'wall1', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,255,255,0.18)', 5, 90) });
  cut(capsulePts(LX(-0.05), LY(0.12), LX(1.05), LY(0.36), 46 * UNIT), PAL.wood, { key: 'branch1' });
  // opposite leaf pairs at the nodes along the branch
  [[0.2, 0.18], [0.78, 0.31]].forEach(([fx, fy], i) => leafPair(LX(fx), LY(fy), -0.9, 230 * UNIT, 'lf' + i));
  // the cluster hangs from one node at the leaf axil, bobbing on the 2s clock
  const nodeX = LX(0.52), nodeY = LY(0.27), sway = Math.sin(TT * 1.2) * 6 * UNIT;
  const cs = [[0.5, 0.42, 110], [0.3, 0.52, 100], [0.7, 0.52, 100], [0.42, 0.64, 92], [0.62, 0.66, 92]];
  cs.forEach(([fx, fy, r], i) => {
    const x = LX(fx) + sway * (i % 2 ? 1 : -1), y = LY(fy) + Math.sin(TT * 1.1 + i) * 4 * UNIT;
    cut(capsulePts(nodeX, nodeY, x, y - r * UNIT * 0.8, 9 * UNIT, 6), LEAF, { key: 'stk' + i, shadow: false });
    cherryAt(x, y, r * UNIT, 'ch' + i);
  });
  // the paper hand pinches the centre cherry at its right edge, sleeve from the right side
  pinchHand(LX(0.5) + 110 * UNIT * 0.9, LY(0.42) + 6 * UNIT, LX(1.0), LY(0.58), 1.2 * UNIT, 'pick1');
  capStrip('It starts as a cherry.');
}

// ---- world 2: beans spread on a sun yard, a rake; the big sun is the bridge object into the wok
function sceneDry() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.sky, { key: 'wall2', shadow: false, tear: 0, shade: false });
  const s = SUN_AT(), rise = Math.sin(TT * 0.8) * 4 * UNIT;
  cut(ellipsePts(s.x, s.y + rise, s.r, s.r, 0, 48), PAL.yellow, { key: 'sun2', crayon: '#e6b23a', crAl: 0.3, sb: 14 });
  cut(rect(-30, LY(0.34), W + 60, H, 0), PAL.woodL, { key: 'yard2', tear: 0, pat: pat.grainWood('rgba(120,60,20,0.14)'), sy: -6 });
  const R = RNG('dry2');
  for (let i = 0; i < 16; i++) {
    const fx = 0.12 + R.f() * 0.76, fy = 0.46 + R.f() * 0.36;
    if (Math.abs(fx - 0.5) < 0.1 && Math.abs(fy - 0.42) < 0.08) continue;
    bean(LX(fx), LY(fy), 22 * UNIT, 32 * UNIT, R.n(0.9), 'sb2' + i);
  }
  const b = BEAN_AT();   // the big bean that becomes the wok's first bean, drawn at its bridge position
  bean(b.x, b.y, b.rx, b.ry, 0, 'bigbean2');
  // a rake: a wooden handle from the upper right, teeth at the working end
  const hx = LX(0.96), hy = LY(0.5), tx = LX(0.6), ty = LY(0.74), ang = Math.atan2(ty - hy, tx - hx);
  cut(capsulePts(hx, hy, tx, ty, 16 * UNIT, 6), PAL.woodD, { key: 'rake2' });
  for (let i = 0; i < 4; i++) { const u = 0.7 + i * 0.06; ink([[tx + (hx - tx) * (0.12 - u * 0.1), ty + (hy - ty) * (0.12 - u * 0.1)], [tx + (hx - tx) * (0.12 - u * 0.1) - Math.cos(ang) * 0, ty + (hy - ty) * (0.12 - u * 0.1) + 40 * UNIT]], { w: 6 * UNIT, color: PAL.woodD, key: 'tooth2' + i, amt: 0.2 }); }
  gripHand(hx, hy, Math.atan2(ty - hy, tx - hx), 1.1 * UNIT, 'rake2h');
  capStrip('Sun-dried.');
}

// ---- world 3: a clay wok over crossed logs and teardrop flames; roasted beans tossed, smoke ribbons, a wooden spatula
function sceneWok() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.mustard, { key: 'wall3', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.12)', 30, 80) });
  const w = WOK_AT(), base = w.y + w.ry * 2.2;
  // crossed logs under the wok, teardrop flames rising from them
  cut(capsulePts(LX(0.3), base + 84 * UNIT, LX(0.7), base + 104 * UNIT, 24 * UNIT), PAL.woodD, { key: 'logA3' });
  cut(capsulePts(LX(0.7), base + 84 * UNIT, LX(0.3), base + 104 * UNIT, 24 * UNIT), PAL.woodD, { key: 'logB3' });
  for (let i = 0; i < 5; i++) {
    const fx = LX(0.36 + i * 0.07), k = 1 + Math.sin(TT * 3 + i) * 0.1, sway = Math.sin(TT * 2 + i) * 6 * UNIT;
    const yb = base + 52 * UNIT, h = (84 + (i % 2) * 36) * UNIT * k, col = i % 2 ? '#f6cf55' : '#ec7a4f';
    cut(ellipsePts(fx, yb, 22 * UNIT * k, 22 * UNIT * k, 0, 18), col, { key: 'fb3' + i, shadow: false, tear: 0.4 });
    cut([[fx - 22 * UNIT * k, yb], [fx + sway, yb - h], [fx + 22 * UNIT * k, yb]], col, { key: 'ft3' + i, shadow: false, tear: 0.4 });
  }
  // the clay wok: a bowl under its rim, a dark interior, the roasted beans on the surface
  cut(wokPts(w.x, w.y, w.rx, w.ry * 2.2), CLAY, { key: 'bowl3', crayon: CLAYD, crAl: 0.35, sb: 12 });
  cut(ellipsePts(w.x, w.y, w.rx, w.ry, 0, 48), CLAYD, { key: 'rim3', shadow: false, tear: 0.6 });
  cut(ellipsePts(w.x, w.y, w.rx * 0.92, w.ry * 0.8, 0, 48), '#5a2b18', { key: 'inside3', shadow: false, tear: 0.4 });
  const R = RNG('beans3');
  for (let i = 0; i < 9; i++) {
    const bx = w.x - w.rx * 0.7 + i * (w.rx * 1.4 / 8), by = w.y + Math.sin(TT * 2 + i) * 6 * UNIT;
    bean(bx + R.n(12) * UNIT, by + R.n(6) * UNIT, 20 * UNIT, 28 * UNIT, R.n(0.7), 'rb3' + i, ROAST);
  }
  // a few beans tossed mid-stir above the rim
  [[-0.5, 90], [0.1, 150], [0.45, 70], [-0.15, 230]].forEach(([fx, up], i) => {
    const bob = Math.sin(TT * 2.2 + i * 1.7) * 14 * UNIT;
    bean(w.x + fx * w.rx, w.y - up * UNIT + bob, 20 * UNIT, 28 * UNIT, 0.5 + i * 0.6, 'toss3' + i, ROAST);
  });
  // smoke rises as curling ribbons from the rim
  [[-120, 0.0], [0, 1.3], [120, 2.6]].forEach(([dx, ph], i) => ribbon(w.x + dx * UNIT, w.y - 140 * UNIT, w.y - 620 * UNIT, 46 * UNIT, TT * 1.4 + ph, 14, STEAM, 'smk3' + i));
  // a paper hand with a wooden spatula stirring the wok from the right
  const pdx = w.x + w.rx * 0.2, pdy = w.y + w.ry * 0.5, hx = LX(0.9), hy = LY(0.44) + Math.sin(TT * 2) * 8 * UNIT;
  const ang = Math.atan2(pdy - hy, pdx - hx);
  cut(capsulePts(hx, hy, pdx, pdy, 14 * UNIT, 6), PAL.woodL, { key: 'spat3' });
  cut(ellipsePts(pdx, pdy, 36 * UNIT, 22 * UNIT, ang, 22), PAL.wood, { key: 'paddle3', crayon: PAL.woodD, crAl: 0.3 });
  gripHand(hx, hy, ang, 1.1 * UNIT, 'stir3');
  capStrip('Roasted.');
}

// ---- world 4: a stone mortar (lumpang) with roasted beans and grounds; a wooden pestle (alu) pounds on the 8ths
function sceneMortar() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.pink, { key: 'wall4', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,255,255,0.2)', 5, 80) });
  const m = MORTAR_AT(), g = GROUNDS_AT();
  cut(wokPts(m.x, m.y, m.rx, m.ry * 1.8), PAL.tweed, { key: 'mortar4', crayon: '#5b4b3a', crAl: 0.3, sb: 12 });
  cut(ellipsePts(m.x, m.y, m.rx, m.ry, 0, 48), '#4d4236', { key: 'mouth4', shadow: false, tear: 0.5 });
  // roasted beans, then the grounds heaped at the bottom of the bowl
  const R = RNG('mort4');
  for (let i = 0; i < 6; i++) bean(m.x - 160 * UNIT + i * 60 * UNIT, m.y - 10 * UNIT + R.n(10) * UNIT, 18 * UNIT, 24 * UNIT, R.n(0.8), 'mb4' + i, ROAST);
  cut(ellipsePts(g.x, g.y, g.rx, g.ry, 0, 40), BEAND, { key: 'grounds4', tear: 0.5, grain: 0.7 });
  // the pestle comes down on each 8th; grounds fly up with each hit
  const bounce = Math.abs(Math.sin(TT * Math.PI * 2)) * 60 * UNIT;
  const tipX = m.x + 60 * UNIT, tipY = m.y - 40 * UNIT + bounce, topX = LX(0.84), topY = LY(0.2) + bounce * 0.4;
  const ang = Math.atan2(tipY - topY, tipX - topX);
  cut(capsulePts(topX, topY, tipX, tipY, 26 * UNIT, 6), PAL.wood, { key: 'alu4', crayon: PAL.woodD, crAl: 0.3 });
  for (let i = 0; i < 6; i++) cut(ellipsePts(tipX - 80 * UNIT + i * 30 * UNIT, tipY - 20 * UNIT - R.f() * 50 * UNIT, 6 * UNIT, 5 * UNIT, 0, 10), BEAND, { key: 'fly4' + i, shadow: false, grain: 0.4 });
  gripHand(topX, topY, ang, 1.1 * UNIT, 'hand4');
  capStrip('Pounded whole.');
}

// ---- world 5: boiling water poured from a kettle straight onto the grounds in a glass; steam ribbons; the busiest moment
function scenePour() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.teal, { key: 'wall5', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.1)', 26, 70) });
  const gl = GLASS_AT(), bot = LY(0.66), gp = glassPts(gl.x, gl.y, bot, gl.rx, gl.rx * 0.78);
  cut(gp.top, '#cfe2ee', { key: 'glass5', sb: 10, sy: 6 });
  // coffee rises as the water goes in; the grounds sit on the bottom
  const p = clamp01((TT - E0) / 2.4), lvl = bot - 50 * UNIT - (bot - gl.y - 120 * UNIT) * p;
  const hw = gp.half(lvl);
  cut([[gl.x - hw + 8 * UNIT, lvl], [gl.x + hw - 8 * UNIT, lvl], [gl.x + gl.rx * 0.78 - 10 * UNIT, bot - 10 * UNIT], [gl.x - gl.rx * 0.78 + 10 * UNIT, bot - 10 * UNIT]], BEAN, { key: 'coffee5', shadow: false, tear: 0.5, shade: false });
  cut(ellipsePts(gl.x, gl.y, gl.rx, gl.ry, 0, 40), '#eef6fa', { key: 'mouth5', shadow: false, tear: 0.3 });
  const R = RNG('pour5');
  for (let i = 0; i < 24; i++) cut(ellipsePts(gl.x + R.r(-120, 120) * UNIT, bot - 24 * UNIT - R.f() * 36 * UNIT, 8 * UNIT, 6 * UNIT, 0, 10), BEAND, { key: 'gp5' + i, shadow: false, tear: 0.2, grain: 0.3 });
  // the kettle, held by a paper hand at its handle; the water stream lands on the grounds
  const kx = LX(0.2), ky = LY(0.2);
  cut(ellipsePts(kx, ky, 92 * UNIT, 74 * UNIT, 0, 30), '#8fb8c9', { key: 'kettle5', crayon: '#5b8aa0', crAl: 0.3 });
  cut(capsulePts(kx + 60 * UNIT, ky + 10 * UNIT, gl.x - 50 * UNIT, gl.y - 170 * UNIT, 18 * UNIT, 6), '#8fb8c9', { key: 'spout5' });
  ink([[gl.x - 50 * UNIT, gl.y - 170 * UNIT], [gl.x - 10 * UNIT, gl.y - 60 * UNIT], [gl.x - 6 * UNIT + Math.sin(TT * 4) * 3 * UNIT, lvl]], { w: 14 * UNIT, color: '#cfe2ee', key: 'stream5', amt: 0.5 });
  gripHand(kx - 60 * UNIT, ky - 80 * UNIT, Math.PI * 0.85, 1.0 * UNIT, 'hand5');
  // steam ribbons rise from the glass
  [[-60, 0.0], [0, 1.1], [60, 2.2]].forEach(([dx, ph], i) => ribbon(gl.x + dx * UNIT, gl.y - 40 * UNIT, gl.y - 360 * UNIT, 40 * UNIT, TT * 1.3 + ph, 13, STEAM, 'steam5' + i));
  cut(rect(-30, bot - 6 * UNIT, W + 60, H, 0), PAL.wood, { key: 'table5', tear: 0, pat: pat.grainWood('rgba(120,60,20,0.18)'), sy: -6 });
  tag('No filter.', CX, H - SAFE.bottom - 144, 50, { rot: 0.01, tape: false });
  tag('Boiling water, straight on.', CX, H - SAFE.bottom - 60, 50, { rot: 0.01, tape: false });
}

// ---- world 6: the glass, the grounds sinking: a thin ring on top early, a sediment layer that thickens, a few drifting down
function sceneWait() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.navy, { key: 'wall6', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,230,180,0.10)', 4, 70) });
  cut(rect(-30, LY(0.68), W + 60, H, 0), PAL.wood, { key: 'table6', tear: 0, pat: pat.grainWood('rgba(120,60,20,0.18)'), sy: -6 });
  const gx = LX(0.5), mouthY = LY(0.3), bot = LY(0.66), gp = glassPts(gx, mouthY, bot, 200 * UNIT, 165 * UNIT);
  cut(gp.top, '#cfe2ee', { key: 'glass6', sb: 10, sy: 6 });
  const surf = mouthY + 40 * UNIT, hw = gp.half(surf);
  cut([[gx - hw + 8 * UNIT, surf], [gx + hw - 8 * UNIT, surf], [gx + 165 * UNIT - 10 * UNIT, bot - 8 * UNIT], [gx - 165 * UNIT + 10 * UNIT, bot - 8 * UNIT]], BEAN, { key: 'coffee6', shadow: false, tear: 0.6, shade: false });
  cut(ellipsePts(gx, mouthY, 200 * UNIT, 26 * UNIT, 0, 40), '#eef6fa', { key: 'mouth6', shadow: false, tear: 0.3 });
  const t = TT - E0;
  // the thin ring of grounds on the surface, early on only
  if (t < 1.4) for (let i = 0; i < 26; i++) { const a = i / 26 * TAU; cut(ellipsePts(gx + Math.cos(a) * (hw - 16 * UNIT), surf + Math.sin(a) * 14 * UNIT, 6 * UNIT, 5 * UNIT, 0, 8), BEAND, { key: 'ring6' + i, shadow: false, tear: 0.2, grain: 0.3 }); }
  // the sediment layer thickens over the shot
  const sp = clamp01(t / 2.4), sedTop = bot - (18 + 80 * sp) * UNIT, sedHw = gp.half(sedTop);
  cut([[gx - sedHw + 6 * UNIT, sedTop], [gx + sedHw - 6 * UNIT, sedTop], [gx + 165 * UNIT - 12 * UNIT, bot - 8 * UNIT], [gx - 165 * UNIT + 12 * UNIT, bot - 8 * UNIT]], BEAND, { key: 'sed6', shadow: false, tear: 0.8, grain: 0.9 });
  // a few grounds still drifting down through the coffee
  for (let i = 0; i < 8; i++) {
    const q = (t * 0.35 + i / 8) % 1, x = gx + Math.sin(i * 2.3) * 110 * UNIT, y = surf + 20 * UNIT + q * (sedTop - surf - 40 * UNIT);
    cut(ellipsePts(x, y, 8 * UNIT, 6 * UNIT, 0, 10), BEAND, { key: 'drift6' + i, shadow: false, tear: 0.2, grain: 0.3 });
  }
  // steam ribbons curl up from the coffee's surface
  [[-70, 0.0], [0, 1.1], [70, 2.2]].forEach(([dx, ph], i) => ribbon(gx + dx * UNIT, mouthY - 40 * UNIT, mouthY - 300 * UNIT, 34 * UNIT, TT * 1.2 + ph, 13, STEAM, 'steam6' + i));
  capStrip('Wait for the grounds to sink.');
}

// ---- world 7: pre-dawn navy; the cup close-up, the sun rising behind it, steam curling toward the sun; no caption
function sceneSip() {
  cut(rect(-30, -30, W + 60, H + 60, 0), PAL.night, { key: 'wall7', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,230,180,0.14)', 4, 70) });
  const gx = LX(0.5), rimY = LY(0.5), t = clamp01((TT - E0) / 4), sunY = LY(0.6) - (LY(0.6) - LY(0.3)) * t;
  cut(ellipsePts(LX(0.62), sunY, 170 * UNIT, 170 * UNIT, 0, 48), PAL.yellow, { key: 'sun7', crayon: '#e6b23a', crAl: 0.3, sb: 14 });
  // the glass body runs off the bottom of the frame; the rim and coffee surface sit at the middle
  cut([[gx - 250 * UNIT, rimY], [gx + 250 * UNIT, rimY], [gx + 200 * UNIT, H + 60], [gx - 200 * UNIT, H + 60]], '#cfe2ee', { key: 'glass7', sb: 10, sy: 6 });
  cut(ellipsePts(gx, rimY, 250 * UNIT, 36 * UNIT, 0, 40), '#eef6fa', { key: 'rim7', shadow: false, tear: 0.3 });
  cut(ellipsePts(gx, rimY + 6 * UNIT, 226 * UNIT, 28 * UNIT, 0, 40), ROAST, { key: 'surf7', shadow: false, tear: 0.3 });
  // steam curls up toward the sun
  [[-90, 0.0], [0, 1.2], [90, 2.4]].forEach(([dx, ph], i) => ribbon(gx + dx * UNIT, rimY - 30 * UNIT, sunY + 150 * UNIT, 50 * UNIT, TT * 1.1 + ph, 15, STEAM, 'steam7' + i));
  // the hand lifts the glass from the lower left
  gripHand(LX(0.22), LY(0.86), -0.35, 1.2 * UNIT, 'hand7');
}

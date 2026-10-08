
// =====================================================================
//  ERAS, CAMERAS, BRIDGES — read by kit/morph.js
//  ERA_BG: each era's dominant colour (the fade to blank paper during a morph).
//  BRIDGES: at tc the object A (end of the old world) morphs into B (start of the new one).
//  Four shape morphs: cherry -> bean, sun -> wok mouth, wok mouth -> mortar mouth, grounds -> glass.
//  CUTS (hard cuts) are not listed here: every era boundary without a bridge is a hard cut.
// =====================================================================
const ERA_BG = [PAL.mint, PAL.sky, PAL.mustard, PAL.pink, PAL.teal, PAL.navy, PAL.night];
function pieceCam(era, t) { return null; }
const ell = (o, c) => ({ P: ellipsePts(o.x, o.y, o.rx ?? o.r, o.ry ?? o.r, 0, 64), c });
const BRIDGES = [
  { tc: MORPHS[0], d: 0.4, A: () => ell(CHERRY_AT(), RED), B: () => ell(BEAN_AT(), BEAN) },
  { tc: MORPHS[1], d: 0.4, A: () => ell(SUN_AT(), PAL.yellow), B: () => ell(WOK_AT(), CLAY) },
  { tc: MORPHS[2], d: 0.4, A: () => ell(WOK_AT(), CLAY), B: () => ell(MORTAR_AT(), PAL.wood) },
  { tc: MORPHS[3], d: 0.4, A: () => ell(GROUNDS_AT(), BEAND), B: () => ell(GLASS_AT(), '#cfe2ee') },
];

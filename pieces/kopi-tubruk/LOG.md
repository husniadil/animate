# Log: Kopi tubruk

## Run 1 - 2026-10-08

- Story check: F2 morph chain, 20s, cut paper, 7 shots, 4 morph bridges at 0.75s (3 eighths), two hard cuts (shot 5 to 6, shot 6 to 7). Approved by the director with changes (see brief.md).
- Story revisions applied: wait 2.5s, sip 2.0s, pour 2.75s, shots 2-4 shortened; mortar in place of the grinder crank; "Roasted." caption on a clay wok over wood fire; "No filter" caption on shot 5; cherry-on-rim callback dropped, sun returns in shot 7; cut-paper hands as the human thread.
- Checklist deviation: the bean has no face (brief). Cut-paper's face check is replaced by the hands thread. Director to judge at the look check.
- Look check: next (3 frames, 9:16 and 1:1).
- Weakest risk so far: shot 3 (the wok) has only academic and regional sources, so the look of the clay wok is taken from description, not a picture.

## Look check - 2026-10-08

- Built: `node tools/build.mjs ../../../../pieces/kopi-tubruk` (10 parts, syntax ok, no external assets).
- Look frames: `checkins/look.png` (9:16) and `checkins/look-1x1.png` (1:1), each at 1.25s (cherry), 7.75s (wok), 16.75s (glass, grounds sinking).
- Morph centres are on the 8th grid: 2.75, 6.25, 9.5, 12.5 (the brief's bridge spans sit either side of them, 0.375s each). Hard cuts at 15.5 and 18.0.
- Checklist deviation: the bean has no face (brief). Cut-paper's face check is replaced by the cut-paper hands, which appear in the cherry, wok and pour shots.
- Fixes made while drawing the look: cherry given two lobes and a crease (it read as an apple); the wok raised onto the fire, with the fire anchored to the wok's own bottom so 1:1 shows it; smoke drawn as puffs, not dashes; the picking hand moved closer.
- Not yet drawn: worlds 2 (dry), 4 (mortar), 5 (pour) and 7 (sip) are stubs. They render only as a flat wall, so they are not in the look frames. Drawn after approval.
- Placeholder score (one pad). The real score comes after the storyboard.
- Weakest in the look: the bean as the constant barely shows in these three frames (it appears as the beans in the wok, and as the bridge shape). The 1:1 "Roasted." caption touches the logs under the wok; the storyboard must move it.
- Not checked: text fit (review.mjs has not run, the piece is not animated), and sound (none yet).

## Storyboard check - 2026-10-08

- Look-check feedback folded in (director's answer, no new look check sent). Cherry: cluster of five on a branch with opposite leaf pairs, close-up, paper hand pinching the centre cherry. Wok: teardrop flames over crossed logs, curling-ribbon smoke, distinct roasted beans with creases (some tossed above the rim), wooden spatula. Glass: curling-ribbon steam, a thin ring of grounds early, a sediment layer that thickens, a few grounds drifting, caption clear of the glass.
- All seven worlds drawn: cherry, sun-dry yard (the sun is the bridge object), wok, mortar (lumpang, pestle, grounds inside the bowl), pour (kettle, stream, two-line caption), wait (glass, sediment), sip (pre-dawn navy, sun rising behind the cup, steam toward it).
- Morph centres 2.75, 6.25, 9.5, 12.5. Hard cuts 15.5 and 18.0.
- Board: `checkins/board.png` (9:16) and `checkins/board-1x1.png` (1:1), both rendered with tools/storyboard.mjs. Panel captions on the board show the sound and the morph for each beat.
- Changes made while building the board: mortar grounds moved inside the bowl (they sat as a separate disc); pour caption tags spaced 84px (they overlapped at 60px); the board carries each beat's sound and transition from the brief.
- Checklist deviation: the bean has no face (brief). The cut-paper hands carry the human thread.
- Weakest shots: panel 7, the cup reads as a tall tube, not a cup close-up; panel 2 (1:1), the "Sun-dried." tag sits over a bean. Panel 2 has few beans distinct enough to read as the constant.
- Not checked: the animation (not built, by design until the storyboard is approved); text fit (review.mjs needs the animated build); sound (placeholder score only, one pad).
- Git note: `pieces/kopi-tubruk/index.html` is excluded locally in `.git/info/exclude` (per director's answer), not in `.gitignore`.

## Build and review - 2026-10-08

- Built: `node tools/build.mjs ../../../../pieces/kopi-tubruk` (10 parts, syntax ok, no external assets). Animated seven worlds, composed score, four 0.8s morph bridges (d 0.4), two hard cuts (15.5, 18.0).
- Exported both formats with `--formats 9:16,1:1 --share`. Renders are in `renders/`, not committed; the two share files are copied into `checkins/`.
- Review 9:16 (`review.mjs`): cuts on the 8th grid PASS (15.5, 18.0); morphs on grid PASS (2.75, 6.25, 9.5, 12.5); story arc 4/4 PASS (gift loudest; busiest moment is not the loudest; silence −52.6 dB vs peak −15.7; gift holds 0.5 cuts/s); text PASS (0 cut-off, 0 in the safe zone); dead beats PASS (none over 3s); sound: loudest 100ms at 18.0s (−9.8 dBFS) in the payoff; 2.0s at ≤ −40 dBFS before it; −15.0 LUFS integrated, range 4.7 LU, true peak −2.0 dBFS.
- Review 1:1 (`review.mjs --format 1:1`): the same checks, all PASS, with the same sound numbers.
- Per-shot contact sheets checked: pour (shot 5) PASS, kettle readable, grounds swirl into a cloud. Sip (shot 7) PASS: warm dawn by the last frame, sun clear of the glass, same clear glass tilting toward camera. Steam mostly rises straight up rather than curling toward the sun: a known gap.
- Weakest shot: mortar (shot 4). The lumpang is tall and stands on the ground, but it reads as a grey cup, the pestle's hand is cut at the top edge, and the bean-to-grounds change is too small to read at contact-sheet size. Fix next run: a clearer stone texture and a pestle hand placed inside the frame.
- Not verified: listening to the score (we measured it only); the phone sheet (`review/phone.jpg`) was generated but not read at phone size in this run.

## Per-shot PASS table

| # | shot | t (s) | frame | verdict |
|---|---|---|---|---|
| 1 | cherry | 0.0-2.75 | cherries against the branch, no stems, pinch hand | PASS |
| 2 | sun-dried | 2.75-6.25 | beans clear of the caption in 1:1, rake sweeps | PASS |
| 3 | roasted | 6.25-9.5 | clay wok over crossed logs, ribbon smoke, spatula | PASS |
| 4 | pounded whole | 9.5-12.5 | tall stone pot, pestle, grounds | PASS with a known gap (weakest) |
| 5 | no filter | 12.5-15.5 | kettle in parts, grounds swirl up | PASS |
| 6 | wait | 15.5-18.0 | cloudy glass settling, sediment thickens | PASS |
| 7 | the sip | 18.0-20.0 | tilted clear glass, dawn, sun, steam toward sun (partial) | PASS with a known gap |

## Weakest shot and what would fix it

- Shot 4: the lumpang needs a readable stone surface, and the pestle hand must sit fully in frame. The bean breaking into grounds should be larger than now.

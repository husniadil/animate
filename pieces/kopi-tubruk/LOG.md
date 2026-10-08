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

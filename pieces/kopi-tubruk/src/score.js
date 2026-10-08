  // =====================================================================
  //  SCORE — composed in code on the 120 BPM grid (E8 = 0.25s). The arc: thin, groove, crackle, knocks, the busiest pour,
  //  a silence (the wait), then one chord stab and sub on the sip (the loudest), then a flat chord.
  // =====================================================================
  const T = TIMELINE, cu = T.cues;
  to = 'm';
  // 1 cherry (0-2.75): a thin pad and a chime on the cherry
  pad(0.0, 2.75, ['D3', 'A3'], 0.02, { type: 'triangle', cut: 700, att: 0.2, rel: 0.3 });
  chime(cu.pick, [nz('D5'), nz('A5')], 0.1);
  // 2 sun-dry (2.75-6.25): the shuffle starts on the 8ths, a bass on the beat, a short motif
  pad(2.75, 6.25, ['D3', 'A3', 'D4'], 0.025, { cut: 900, att: 0.2, rel: 0.2 });
  for (let n = 0; n < 14; n++) noiseHit(2.75 + n * E8, 0.05, 'highpass', 4000, 0.7, 0.035, n % 2 ? 0.2 : -0.2);
  for (let b = 0; b < 4; b++) bass(2.75 + b * BEAT, nz('D2'), 0.16);
  [['D4', 2.75], ['E4', 3.5], ['A4', 4.25], ['D5', 5.0]].forEach(([n, t]) => pluck(t, nz(n), 0.09, 0, 0.4, 3000, 0.25));
  // 3 wok (6.25-9.5): crackle on the 16ths, the groove builds
  pad(6.25, 9.5, ['D3', 'A3', 'D4'], 0.03, { cut: 1100, att: 0.2, rel: 0.2 });
  for (let n = 0; n < 40; n++) noiseHit(6.25 + n * E16, 0.03, 'bandpass', 2200 + (n * 317) % 1400, 1.2, 0.02 + 0.02 * (n / 40), ((n * 13) % 7) / 10 - 0.35);
  for (let b = 0; b < 6; b++) bass(6.25 + b * BEAT, nz('D2'), 0.2);
  // 4 mortar (9.5-12.5): every 8th is a knock on the pestle, a sub on each beat
  pad(9.5, 12.5, ['D3', 'G3'], 0.025, { cut: 700, att: 0.2, rel: 0.3 });
  for (let n = 0; n < 24; n++) noiseHit(9.5 + n * E8, 0.07, 'lowpass', 520, 0.8, 0.22, n % 2 ? 0.15 : -0.15);
  for (let b = 0; b < 3; b++) sub(9.5 + b * BEAT * 2, 0.18);
  // 5 pour (12.5-15.5): the water hiss, a riser into the pour, the busiest moment: plucks on the 16ths
  noiseHit(12.5, 2.9, 'highpass', 6000, 0.5, 0.02);
  riser(12.5, 15.4, 0.05);
  pad(12.5, 15.5, ['D3', 'A3', 'D4', 'Fs4'], 0.035, { cut: 1400, att: 0.3, rel: 0.2 });
  for (let n = 0; n < 24; n++) pluck(12.5 + n * E16 * 2, nz(['D5', 'E5', 'Fs5', 'A5', 'B5', 'D6'][n % 6]), 0.05, n % 2 ? 0.25 : -0.25, 0.25, 4200, 0.3);
  // 6 wait (15.5-18.0): the silence. A faint pad only, nothing else
  pad(15.5, 18.0, ['D3', 'A3'], 0.006, { cut: 400, att: 0.8, rel: 0.5 });
  // 7 sip (18.0-20.0): the payoff. A chord stab and a sub on the hit, a flat chord after it
  to = 'm';
  [['D4', 0], ['Fs4', 0], ['A4', 0], ['D5', 0]].forEach(([n]) => pluck(18.0, nz(n), 0.22, 0, 0.45, 3200, 0.3));
  sub(18.0, 0.55);
  noiseHit(18.0, 0.06, 'lowpass', 900, 0.7, 0.3);
  pad(18.0, 20.0, ['D3', 'A3', 'Fs4', 'D4'], 0.05, { cut: 1600, att: 0.02, rel: 0.4 });

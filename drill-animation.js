// Animated overhead teaching views. Positions are schematic; CAPP 60-33 controls.
const DRILL_ANIMATION_POSES = {
  attention: { feet: [[78, 88, -20], [116, 88, 20]], face: 0 },
  wide: { feet: [[55, 88, -20], [139, 88, 20]], face: 0 },
  aboutSet: { feet: [[78, 75, -20], [107, 116, 5]], face: 0, pivot: [117, 120] },
  rear: { feet: [[78, 88, 160], [116, 88, 200]], face: 180, pivot: [117, 120] },
  rightTurn: { feet: [[78, 88, 70], [116, 88, 110]], face: 90, pivot: [89, 111] },
  right: { feet: [[78, 88, 70], [116, 88, 110]], face: 90 },
  leftForward: { feet: [[78, 48, -20], [116, 100, 20]], face: 0 },
  march: { feet: [[78, 48, -20], [116, 100, 20]], face: 0 },
  run: { feet: [[78, 35, -20], [116, 110, 20]], face: 0 },
  rightOut: { feet: [[78, 88, -20], [155, 88, 20]], face: 0 },
  shiftRight: { feet: [[115, 88, -20], [153, 88, 20]], face: 0 },
  rearSet: { feet: [[78, 53, -20], [116, 100, 20]], face: 0 },
  rearPivot: { feet: [[78, 88, 160], [116, 88, 200]], face: 180, pivot: [109, 97] },
  rearMarch: { feet: [[78, 112, 160], [116, 55, 200]], face: 180 },
  pivotRight: { feet: [[78, 88, 70], [116, 88, 110]], face: 90, pivot: [89, 111] },
  rightMarch: { feet: [[67, 88, 70], [132, 88, 110]], face: 90 },
  pivotLeft: { feet: [[78, 88, -110], [116, 88, -70]], face: -90, pivot: [127, 111] },
  leftMarch: { feet: [[67, 88, -110], [132, 88, -70]], face: -90 },
  salute: { feet: [[78, 88, -20], [116, 88, 20]], face: 0, hand: true },
  eyesRight: { feet: [[78, 88, -20], [116, 88, 20]], face: 0, head: 45 },
  relaxed: { feet: [[68, 88, -20], [128, 88, 20]], face: 0 }
};

const DRILL_FORMATION_POSES = {
  line: [[42, 47], [118, 76], [168, 48], [42, 109], [118, 117], [169, 104]],
  align: [[55, 59], [105, 59], [155, 59], [55, 101], [105, 101], [155, 101]],
  column: [[105, 47], [105, 105]],
  offset: [[105, 47], [135, 108]],
  ranks: [[55, 57], [105, 57], [155, 57], [55, 89], [105, 89], [155, 89]],
  openRanks: [[55, 42], [105, 42], [155, 42], [55, 112], [105, 112], [155, 112]],
  disperse: [[35, 36], [105, 57], [175, 32], [44, 119], [112, 110], [180, 135]]
};

const drillLerp = (a, b, t) => a + (b - a) * t;
const drillEase = (t) => t * t * (3 - 2 * t);

function drillAnimatedFrame(fromName, toName, amount) {
  const aGroup = DRILL_FORMATION_POSES[fromName];
  const bGroup = DRILL_FORMATION_POSES[toName];
  if (aGroup || bGroup) {
    const a = aGroup || bGroup;
    const b = bGroup || aGroup;
    const size = Math.max(a.length, b.length);
    return `${Array.from({ length: size }, (_, i) => {
      const [ax, ay] = a[i] || a[a.length - 1];
      const [bx, by] = b[i] || b[b.length - 1];
      const x = drillLerp(ax, bx, amount), y = drillLerp(ay, by, amount);
      return `<g><circle cx="${x}" cy="${y}" r="13" class="formation-cadet ${i === 1 ? "formation-you" : ""}"/><path d="M${x} ${y - 4}v-7" class="formation-facing"/></g>`;
    }).join("")}<text x="105" y="19" text-anchor="middle" class="scene-front">FRONT ↑</text>`;
  }
  const a = DRILL_ANIMATION_POSES[fromName] || DRILL_ANIMATION_POSES.attention;
  const b = DRILL_ANIMATION_POSES[toName] || DRILL_ANIMATION_POSES.attention;
  const foot = (i, name) => {
    const [x, y, angle] = a.feet[i].map((v, n) => drillLerp(v, b.feet[i][n], amount));
    return `<g transform="translate(${x + 10} ${y + 22}) rotate(${angle})"><rect x="-10" y="-22" width="20" height="44" rx="8" class="scene-foot"/><text x="0" y="5" text-anchor="middle" class="scene-foot-label">${name}</text></g>`;
  };
  const face = drillLerp(a.face, b.face, amount);
  const pivot = amount < .5 ? a.pivot : b.pivot;
  const hand = (a.hand ? 1 - amount : 0) + (b.hand ? amount : 0);
  const head = drillLerp(a.head || 0, b.head || 0, amount);
  return `<text x="105" y="19" text-anchor="middle" class="scene-front">FRONT ↑</text>${foot(0, "L")}${foot(1, "R")}<g transform="rotate(${face} 105 76)"><circle cx="105" cy="75" r="11" class="scene-body"/><path d="M105 71v-11" class="scene-facing" transform="rotate(${head} 105 75)"/><path d="M115 76l10 -18" class="scene-hand" opacity="${Math.max(0, Math.min(1, hand))}"/></g>${pivot ? `<circle cx="${pivot[0]}" cy="${pivot[1]}" r="7" class="scene-pivot"/>` : ""}`;
}

function initDrillAnimations() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".drill-animation").forEach((root) => {
    const frames = DRILL_SCENES[root.dataset.sceneKey];
    if (!frames) return;
    const scene = root.querySelector(".drill-animation-scene");
    const title = root.querySelector(".drill-animation-stage");
    const cue = root.querySelector(".drill-animation-cue");
    const play = root.querySelector("[data-drill-play]");
    const restart = root.querySelector("[data-drill-restart]");
    const steps = [...root.querySelectorAll("[data-drill-stage]")];
    let elapsed = 0, started = 0, running = false, raf = 0;
    const stageMs = 1900;
    const last = (frames.length - 1) * stageMs;
    const draw = () => {
      const index = Math.max(0, Math.min(frames.length - 1, Math.floor(elapsed / stageMs) || 0));
      const next = Math.min(frames.length - 1, index + 1);
      const phase = (elapsed % stageMs) / stageMs;
      const blend = index === next ? 0 : drillEase(Math.max(0, Math.min(1, (phase - .22) / .72)));
      scene.innerHTML = drillAnimatedFrame(frames[index][1], frames[next][1], blend);
      title.textContent = `${String(index + 1).padStart(2, "0")} · ${frames[index][0]}`;
      cue.textContent = frames[index][2];
      steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
        step.setAttribute("aria-current", i === index ? "step" : "false");
      });
      root.querySelector(".drill-animation-progress").style.width = `${last ? elapsed / last * 100 : 100}%`;
      play.textContent = running ? "Pause" : "Play";
    };
    const pause = () => { running = false; cancelAnimationFrame(raf); draw(); };
    const tick = (now) => {
      if (!running || !root.isConnected) return;
      elapsed = Math.max(0, Math.min(last, now - started));
      draw();
      if (elapsed >= last) { pause(); return; }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      if (elapsed >= last) elapsed = 0;
      started = performance.now() - elapsed;
      running = true;
      raf = requestAnimationFrame(tick);
      draw();
    };
    play.addEventListener("click", () => running ? pause() : start());
    restart.addEventListener("click", () => { pause(); elapsed = 0; start(); });
    steps.forEach((step, i) => step.addEventListener("click", () => { pause(); elapsed = i * stageMs; draw(); }));
    root.closest("details")?.addEventListener("toggle", (event) => {
      if (event.target.open && !reduceMotion) start(); else pause();
    });
    draw();
    if (!root.closest("details") && !reduceMotion) start();
    if (root.closest("details")?.open && !reduceMotion) start();
  });
}

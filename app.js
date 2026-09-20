const main = document.querySelector("#main-content");
const nav = document.querySelector("#primary-nav");
const menuToggle = document.querySelector("#menu-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const PROGRESS_KEY = "northshore-progress-v1";

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}

let progress = loadProgress();
const completedCount = () => MODULES.filter((module) => progress[module.id]?.passed).length;
const percentComplete = () => Math.round((completedCount() / MODULES.length) * 100);

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function resourceByTitle(title) {
  return RESOURCES.find((resource) => resource.title === title);
}

function moduleStatus(module) {
  const record = progress[module.id];
  if (record?.passed) return "Completed";
  if (record?.viewed || Number.isInteger(record?.lesson)) return "In progress";
  return "Not started";
}

function moduleCard(module) {
  const status = moduleStatus(module);
  const lesson = Math.min(progress[module.id]?.lesson || 0, module.sections.length - 1);
  return `
    <article class="module-card">
      <div class="module-card-top"><span class="module-number">MODULE ${module.number}</span></div>
      <h3>${module.title}</h3>
      <p>${module.description}</p>
      <div class="module-meta">
        <span>${module.time}</span>
        <span class="status-chip ${status.toLowerCase().replace(" ", "-")}">${status}</span>
        <a href="#module/${module.id}/${lesson}">${status === "Not started" ? "Start" : "Continue"} →</a>
      </div>
    </article>`;
}

function progressRing(value) {
  return `<div class="progress-ring" style="--value:${value}" aria-label="${value}% complete"><strong>${value}%</strong><span>complete</span></div>`;
}

function renderHome() {
  const done = completedCount();
  const next = MODULES.find((module) => !progress[module.id]?.passed) || MODULES[0];
  const dayQuestion = MODULES.flatMap((module) => module.quiz)[new Date().getDate() % 35];
  main.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div>
          <p class="hero-location">BOTHELL, WASHINGTON <span>—</span> PCR-WA-068</p>
          <p class="eyebrow">CIVIL AIR PATROL · UNITED STATES AIR FORCE AUXILIARY</p>
          <h1><span>NORTHSHORE</span><span>CADET LEARNING CENTER</span></h1>
          <p class="hero-slogan">A place to lead. A mission to serve.</p>
          <p class="hero-copy">Learn the knowledge every CAP cadet should know through short lessons, realistic scenarios, and knowledge checks.</p>
          <div class="hero-actions">
            <a class="button" href="#module/${next.id}/${progress[next.id]?.lesson || 0}">${done ? "Continue learning" : "Start learning"}</a>
            <a class="button secondary" href="#progress">View progress</a>
          </div>
        </div>
      </div>
      <div class="hero-bottom"><span>VOLUNTEERS. LEADERS. AVIATORS.</span><span>WASHINGTON WING <b>/</b> PACIFIC REGION</span></div>
    </section>
    <section class="page-shell">
      <div class="section-heading">
        <div><p class="eyebrow">Academy path</p><h2>Seven focused modules</h2></div>
        <p>Work in order or choose the topic you need. Quiz scores and completion stay on this device.</p>
      </div>
      <div class="module-grid">${MODULES.map(moduleCard).join("")}</div>
      <div class="dashboard-strip">
        <div><p class="eyebrow">Question of the day</p><h3>${dayQuestion.q}</h3><a href="#practice">Test your answer in Practice Center →</a></div>
        ${progressRing(percentComplete())}
      </div>
      <div class="callout"><span class="callout-icon" aria-hidden="true">◆</span><div><strong>Accuracy first</strong><p>Official Civil Air Patrol publications control. Changing leadership information and unverified paragraph references are clearly marked for staff review.</p></div></div>
      <a class="drill-home-link" href="#drill"><span><small>DRILL FIELD GUIDE</small><strong>Achievement 1 & 2 drill, step by step</strong><em>Learn to fall in, practice by the numbers, and see foot positions.</em></span><b aria-hidden="true">→</b></a>
    </section>`;
}

function drillFootDiagram(kind) {
  const diagrams = {
    fallin: ["Finish at attention after dressing", [[111, 67, -22, "L"], [161, 67, 22, "R"]], "Heels together · toes equally out"],
    attention: ["Position of attention · top view", [[111, 67, -22, "L"], [161, 67, 22, "R"]], "Heels together · about 45° between feet"],
    parade: ["Parade rest · top view", [[86, 67, -22, "L"], [186, 67, 22, "R"]], "Left foot out · heels 12 in apart"],
    about: ["About face · count one", [[111, 60, -22, "L"], [156, 102, 8, "R"]], "Ball of right foot behind and left of left heel"],
    rightface: ["Right face · count one pivot", [[111, 67, -22, "L"], [161, 67, 22, "R"]], "Pivot: ball of LEFT + heel of RIGHT"],
    cover: ["Cover in column", [[111, 67, -22, "L"], [161, 67, 22, "R"]], "Feet end at attention after small alignment steps"],
    atease: ["At ease", [[111, 67, -22, "L"], [161, 67, 22, "R"]], "RIGHT foot stays in place"],
    forward: ["Forward march · first step", [[111, 36, -22, "L"], [161, 95, 22, "R"]], "LEFT foot steps off first"],
    halt: ["Halt · finish", [[111, 67, -22, "L"], [161, 67, 22, "R"]], "Trailing foot joins the lead foot"],
    openranks: ["Open ranks · two elements", [[111, 36, -22, "L"], [161, 36, 22, "R"]], "1st element: 3 paces · 2nd: 2 paces"],
    rightstep: ["Right step · count one", [[99, 67, -22, "L"], [191, 67, 22, "R"]], "RIGHT foot out 12 in; LEFT foot joins on count two"],
    flank: ["Flank pivot · then step off", [[111, 67, -22, "L"], [161, 67, 22, "R"]], "Right flank: ball of LEFT · left flank: ball of RIGHT"],
    rear: ["To the rear · pivot", [[111, 67, -22, "L"], [161, 67, 22, "R"]], "Turn right on the balls of BOTH feet"]
  };
  if (!diagrams[kind]) return "";
  const [title, feet, note] = diagrams[kind];
  return `<figure class="foot-diagram"><figcaption>${title}</figcaption><svg viewBox="0 0 300 170" role="img" aria-label="${title}. ${note}"><text x="150" y="22" text-anchor="middle" class="diagram-front">FRONT ↑</text><line x1="35" y1="132" x2="265" y2="132" class="diagram-ground"/>${feet.map(([x, y, angle, label]) => `<g transform="rotate(${angle} ${x + 12} ${y + 29})"><rect x="${x}" y="${y}" width="24" height="58" rx="9" class="diagram-foot"/><text x="${x + 12}" y="${y + 34}" text-anchor="middle" class="diagram-label">${label}</text></g>`).join("")}</svg><p>${note}</p><small>Not to scale · view from above</small></figure>`;
}

function drillFormationExample(elements, total) {
  // The guide is separate. Total includes the flight sergeant in the final formation.
  const fullFiles = Math.floor(total / elements);
  const extras = total % elements;
  const rowCounts = Array.from({ length: elements }, (_, row) => fullFiles + (row >= elements - extras ? 1 : 0));
  const cadet = (x, y, label, kind = "") => `<g><circle cx="${x}" cy="${y}" r="15" class="formation-cadet ${kind}"/><path d="M${x} ${y - 5}v-8" class="formation-facing"/><text x="${x}" y="${y + 4}" text-anchor="middle">${label}</text></g>`;
  const svg = `<svg viewBox="0 0 500 410" role="img" aria-label="Overhead final formation: ${total} cadets in ${elements} elements. Row lengths from front to back are ${rowCounts.join(", ")}. Extra positions are on the left of the rear elements; the flight sergeant occupies the final leftmost position in the last element."><text x="250" y="28" text-anchor="middle" class="formation-direction">FRONT ↑ · everyone faces this way</text><path d="M360 100V${100 + (elements - 1) * 70}" class="formation-guide-line"/>${cadet(420, 100, "G", "formation-guide")}${rowCounts.map((count, row) => {
    const y = 100 + row * 70;
    return `<text x="22" y="${y + 4}" class="formation-row-label">ELEMENT ${row + 1}</text>${Array.from({ length: count }, (_, col) => {
      const lastSpot = row === elements - 1 && col === count - 1;
      const extraSpot = col === fullFiles;
      return cadet(360 - col * 60, y, lastSpot ? "FS" : col === 0 ? `E${row + 1}` : "C", lastSpot ? "formation-sergeant" : extraSpot ? "formation-extra" : "");
    }).join("")}`;
  }).join("")}<text x="25" y="382" class="formation-caption">G = guide · E = element leader · C = cadet · FS = flight sergeant</text></svg>`;
  return { svg, rowCounts, extras };
}

function drillFormationDiagram() {
  const example = drillFormationExample(4, 14);
  return `<figure class="formation-diagram"><figcaption>What if the flight does not make a perfect rectangle?</figcaption><div class="formation-example-controls" aria-label="Formation examples"><button type="button" data-formation-example="3,8">8 cadets · 3 elements</button><button type="button" data-formation-example="4,14" class="active">14 cadets · 4 elements</button><button type="button" data-formation-example="4,16">16 cadets · 4 elements</button></div><div class="formation-example-graphic">${example.svg}</div><p class="formation-example-result" aria-live="polite">14 cadets in four elements: 3, 3, 4, and 4 across from front to back. The two extra positions extend the left side of the third and fourth elements.</p><p><b>Where do you go?</b> If you are not an element leader, join any open place to the left of an element leader, then dress right and cover. If the rows are uneven, the flight staff squares them off after the flight forms; do not guess a new spot or leave an element leader without direction.</p><p><b>How it ends:</b> The right-hand element leaders stay in one front-to-back file. Every element has the same core width; extra cadets extend the left side of the last element first, then the next-to-last. The flight sergeant initially calls FALL IN from in front, then occupies the final position in the last element when the flight is squared off.</p><small>Final formation viewed from above · guide shown separately · total includes the flight sergeant · schematic, not to scale</small></figure>`;
}

function initFormationExamples() {
  const graphic = document.querySelector(".formation-example-graphic");
  const result = document.querySelector(".formation-example-result");
  document.querySelectorAll("[data-formation-example]").forEach((button) => button.addEventListener("click", () => {
    const [elements, total] = button.dataset.formationExample.split(",").map(Number);
    const example = drillFormationExample(elements, total);
    graphic.innerHTML = example.svg;
    const extrasText = example.extras ? `${example.extras} extra ${example.extras === 1 ? "position extends" : "positions extend"} the left side of the rear ${example.extras === 1 ? "element" : "elements"}.` : "No extra positions are needed; every element has the same width.";
    result.textContent = `${total} cadets in ${elements} elements: ${example.rowCounts.join(", ")} across from front to back. ${extrasText}`;
    document.querySelectorAll("[data-formation-example]").forEach((item) => item.classList.toggle("active", item === button));
  }));
}

function drillSceneSvg(pose, label) {
  const positions = {
    attention: [[78, 88, -20], [116, 88, 20], 0], wide: [[57, 88, -20], [137, 88, 20], 0],
    aboutSet: [[78, 75, -20], [107, 116, 5], 0], rear: [[78, 88, 160], [116, 88, 200], 180],
    rightTurn: [[78, 88, 70], [116, 88, 110], 90], right: [[78, 88, 70], [116, 88, 110], 90],
    leftForward: [[78, 48, -20], [116, 100, 20], 0], march: [[78, 48, -20], [116, 100, 20], 0],
    run: [[78, 35, -20], [116, 110, 20], 0], rightOut: [[78, 88, -20], [155, 88, 20], 0],
    shiftRight: [[115, 88, -20], [153, 88, 20], 0], rearSet: [[78, 53, -20], [116, 100, 20], 0],
    rearPivot: [[78, 88, 160], [116, 88, 200], 180], rearMarch: [[78, 112, 160], [116, 55, 200], 180],
    pivotRight: [[78, 88, 70], [116, 88, 110], 90], rightMarch: [[67, 88, 70], [132, 88, 110], 90],
    pivotLeft: [[78, 88, -110], [116, 88, -70], -90], leftMarch: [[67, 88, -110], [132, 88, -70], -90]
  };
  const formation = ["line", "align", "column", "offset", "ranks", "openRanks", "disperse"].includes(pose);
  if (formation) {
    const spread = pose === "openRanks" ? 48 : 31;
    const offset = pose === "offset" ? 18 : pose === "disperse" ? 25 : 0;
    const front = pose === "openRanks" ? 43 : 56;
    const circles = (pose === "column" || pose === "offset") ? [[95, 46], [95 + offset, 103]] : [[56, front], [105, front], [154, front], [56, front + spread], [105 + offset, front + spread], [154, front + spread]];
    return `<svg viewBox="0 0 210 155" role="img" aria-label="${label}; overhead formation"><text x="105" y="18" text-anchor="middle" class="scene-front">FRONT ↑</text>${circles.map(([x,y],i) => `<g><circle cx="${x}" cy="${y}" r="13" class="formation-cadet ${i === 1 || (circles.length === 2 && i === 1) ? "formation-you" : ""}"/><path d="M${x} ${y - 4}v-7" class="formation-facing"/></g>`).join("")}${pose === "align" ? '<path d="M105 56l20 -17" class="scene-action"/>' : ""}</svg>`;
  }
  const still = ["salute", "eyesRight", "relaxed"].includes(pose);
  const [left, right, heading] = positions[pose] || positions[pose === "relaxed" ? "wide" : "attention"];
  const foot = ([x, y, rotation], name) => `<g transform="rotate(${rotation} ${x + 10} ${y + 22})"><rect x="${x}" y="${y}" width="20" height="44" rx="8" class="scene-foot"/><text x="${x + 10}" y="${y + 26}" text-anchor="middle" class="scene-foot-label">${name}</text></g>`;
  const pivot = ({aboutSet: [117, 120, "R ball"], rearPivot: [109, 97, "both balls"], pivotRight: [89, 111, "L ball"], pivotLeft: [127, 111, "R ball"], rightTurn: [91, 111, "L ball / R heel"]})[pose];
  return `<svg viewBox="0 0 210 155" role="img" aria-label="${label}; ${pivot ? `pivot at ${pivot[2]}` : "foot position viewed from above"}"><text x="105" y="18" text-anchor="middle" class="scene-front">FRONT ↑</text>${foot(left, "L")}${foot(right, "R")}<path d="M105 78v-21" class="scene-facing" transform="rotate(${heading} 105 78)"/>${pivot ? `<circle cx="${pivot[0]}" cy="${pivot[1]}" r="7" class="scene-pivot"/><text x="105" y="146" text-anchor="middle" class="scene-pivot-label">PIVOT: ${pivot[2].toUpperCase()}</text>` : ""}${still ? `<text x="105" y="145" text-anchor="middle" class="scene-pivot-label">${pose === "salute" ? "RIGHT HAND ↑" : pose === "eyesRight" ? "HEAD ↗ · FEET STILL" : "RIGHT FOOT PLANTED"}</text>` : ""}</svg>`;
}

function drillVisualSequence(key) {
  const frames = DRILL_SCENES[key] || DRILL_SCENES.attention;
  return `<figure class="drill-sequence"><figcaption>Movement from above · ${frames.length} stages</figcaption><div class="drill-animation" data-scene-key="${key}"><div class="drill-animation-head"><div><strong class="drill-animation-stage"></strong><p class="drill-animation-cue" aria-live="off"></p></div><div class="drill-animation-controls"><button type="button" data-drill-play>Play</button><button type="button" data-drill-restart>Replay</button></div></div><svg class="drill-animation-scene" viewBox="0 0 210 155" role="img" aria-label="Animated overhead demonstration of ${key.replaceAll("-", " ")}"></svg><div class="drill-animation-track"><span class="drill-animation-progress"></span></div><div class="drill-animation-steps" aria-label="Animation stages">${frames.map(([stage], i) => `<button type="button" data-drill-stage="${i}"><span>${String(i + 1).padStart(2, "0")}</span>${stage}</button>`).join("")}</div></div><details class="drill-snapshots"><summary>See all positions as still diagrams</summary><div class="drill-frames">${frames.map(([stage, pose, cue], i) => `<div class="drill-frame"><strong><span>${String(i + 1).padStart(2, "0")}</span> ${stage}</strong>${drillSceneSvg(pose, `${stage}. ${cue}`)}<p>${cue}</p></div>`).join("")}</div></details><small>L/R = left/right foot · yellow dot = pivot · diagrams are schematic, not to scale</small></figure>`;
}

function renderDrill(id = "fall-in") {
  const guide = DRILL_GUIDES.find((item) => item.id === id);
  const selected = guide ? guide.id : "fall-in";
  const tabs = `<nav class="drill-tabs" aria-label="Drill lessons"><a href="#drill/fall-in" ${selected === "fall-in" ? 'aria-current="page"' : ""}>How to fall in</a>${DRILL_GUIDES.map((item) => `<a href="#drill/${item.id}" ${selected === item.id ? 'aria-current="page"' : ""}>${item.title}</a>`).join("")}</nav>`;
  const fallIn = `<div class="drill-intro"><p class="eyebrow">First formation skill</p><h2>How to fall in</h2><p>FALL IN forms a flight in line. In a normal full flight, the guide takes position first, then the first element leader lines up to the guide's left. The other element leaders line up behind the first. Cadets fill the open places to the left of those leaders.</p><p>A full flight normally has two to four elements. The smaller Achievement 1 test deliberately uses one element; its scorecard setup is not the layout of a full flight.</p>${drillFormationDiagram()}<h3>By the numbers: find your place</h3><ol class="drill-count-list">${FALL_IN_STEPS.map((step, i) => `<li><b>${String(i + 1).padStart(2, "0")}</b><span>${step}</span></li>`).join("")}</ol>${drillVisualSequence("fallin")}<p class="drill-source-note">CAPP 60-33 §4.3.1 explains the flight formation. On the Achievement 1 scorecard, FALL IN includes automatic dress and ready front.</p></div>`;
  const moves = guide ? `<div class="drill-intro"><p class="eyebrow">${guide.subtitle}</p><h2>${guide.title} drill test</h2><p>${guide.setup}</p><p class="drill-source-note">Use “BY THE NUMBERS” to slow a multi-count movement: execute count one on the command of execution, then have the instructor call “Ready, TWO” for count two. Marching beats below are study cues; follow the instructor's command timing and the full manual.</p></div><div class="drill-move-list">${guide.moves.map(([command, counts], i) => `<details class="drill-move" ${i === 0 ? "open" : ""}><summary><span class="drill-move-number">${String(i + 1).padStart(2, "0")}</span><strong>${command}</strong><span class="drill-move-hint">By the numbers ↓</span></summary><div class="drill-move-body"><ol class="drill-count-list">${counts.map((count, j) => `<li><b>${String(j + 1).padStart(2, "0")}</b><span>${count}</span></li>`).join("")}</ol>${drillVisualSequence(DRILL_SCENE_KEYS[guide.id][i])}</div></details>`).join("")}</div>` : "";
  main.innerHTML = `<section class="module-hero drill-hero"><div class="page-shell"><p class="eyebrow">Field-ready study guide</p><h1 class="page-title">Drill by the numbers</h1><p>Build movements slowly, see where the feet go, then practice at normal cadence with your element or flight.</p></div></section><section class="page-shell drill-page">${tabs}<div class="drill-learning-note"><strong>How “by the numbers” works</strong><p>For a two-count movement, the first count happens on the command of execution. The instructor calls <b>Ready, TWO</b> for count two. Continue by the numbers until the instructor says <b>WITHOUT THE NUMBERS</b>. The illustrations are teaching aids, not exact scale drawings.</p></div>${guide ? moves : fallIn}<div class="drill-official"><h2>Practice with the official standard</h2><p>This site is not a scored CAP drill test. A senior-member testing officer evaluates the CAPP 60-34 scorecard. Confirm any difference against the current official publications and your instructor.</p><div><a href="${DRILL_SOURCES.manual}" target="_blank" rel="noopener">CAPP 60-33 · Drill & Ceremonies ↗</a><a href="${DRILL_SOURCES.tests}" target="_blank" rel="noopener">CAPP 60-34 · Practical Tests ↗</a></div></div></section>`;
  initDrillAnimations();
  if (!guide) initFormationExamples();
}

function renderModules() {
  main.innerHTML = `<section class="page-shell"><div class="section-heading"><div><p class="eyebrow">Training library</p><h1 class="page-title">Learning modules</h1></div><p>Complete each five-question knowledge check with a score of ${SITE_CONFIG.passingScore}% or higher.</p></div><div class="module-grid">${MODULES.map(moduleCard).join("")}</div></section>`;
}

function renderActivity(activity) {
  if (!activity) return "";
  if (["timeline", "hierarchy", "oath"].includes(activity.type)) {
    return `<section class="activity-card"><p class="eyebrow">Interactive</p><h3>${activity.title}</h3><div class="reveal-list">${activity.items.map((item, i) => `<button class="reveal-button" type="button" data-reveal="${i}" aria-expanded="false"><span>${item[0]}</span><strong>${item[1]}</strong></button><div class="reveal-panel" data-panel="${i}" hidden>${item[2] || item[1]}</div>`).join("")}</div></section>`;
  }
  if (activity.type === "ladder") {
    return `<section class="activity-card"><p class="eyebrow">Interactive</p><h3>${activity.title}</h3><div class="promotion-ladder">${activity.items.map((item) => `<div><span>${item[0]}</span><strong>${item[1]}</strong><small>${item[2]}</small></div>`).join("")}</div></section>`;
  }
  if (["checklist", "uniform"].includes(activity.type)) {
    return `<section class="activity-card"><p class="eyebrow">${activity.type === "uniform" ? "Inspection lab" : "Reference drill"}</p><h3>${activity.title}</h3>${activity.prompt ? `<p>${activity.prompt}</p>` : ""}<div class="check-grid">${activity.items.map((item, i) => `<label><input type="checkbox" data-check="${i}"><span><strong>${item[0]}</strong><small>${item[1]}</small></span></label>`).join("")}</div><p class="activity-feedback" aria-live="polite">Select an item to reveal its inspection note.</p></section>`;
  }
  if (activity.type === "scenario") {
    return `<section class="activity-card"><p class="eyebrow">Scenario trainer</p><h3>${activity.title}</h3><p>${activity.prompt}</p><div class="scenario-options">${activity.options.map((option, i) => `<button type="button" data-scenario="${i}">${String.fromCharCode(65 + i)}. ${option}</button>`).join("")}</div><p class="activity-feedback" aria-live="polite">Choose the best response.</p></section>`;
  }
  return "";
}

function renderSources(module) {
  return `<section class="sources"><h3>Sources & regulations</h3><p>Use the current official publication when guidance changes.</p><div>${module.sources.map((title) => { const source = resourceByTitle(title); return `<a href="${source.url}" target="_blank" rel="noopener">${source.title}<span>${source.subtitle}</span></a>`; }).join("")}</div></section>`;
}

function renderModule(id, requestedLesson = 0) {
  const module = MODULES.find((item) => item.id === id);
  if (!module) return renderNotFound();
  const lessonIndex = Math.max(0, Math.min(Number(requestedLesson) || 0, module.sections.length - 1));
  const lesson = module.sections[lessonIndex];
  progress[id] = { ...progress[id], viewed: true, lesson: Math.max(progress[id]?.lesson || 0, lessonIndex) };
  saveProgress();
  const moduleIndex = MODULES.indexOf(module);
  const lessonPercent = Math.round(((lessonIndex + 1) / module.sections.length) * 100);
  const cards = lesson.cards ? `<div class="lesson-cards">${lesson.cards.map((item) => `<div><strong>${item[0]}</strong><span>${item[1]}</span></div>`).join("")}</div>` : "";
  const steps = lesson.steps ? `<ol class="step-list">${lesson.steps.map((step) => `<li>${step}</li>`).join("")}</ol>` : "";
  const oath = lesson.oath ? `<blockquote class="oath">“I pledge that I will serve faithfully in the Civil Air Patrol Cadet Program, and that I will attend meetings regularly, participate actively in unit activities, obey my officers, wear my uniform properly, and advance my education and training rapidly to prepare myself to be of service to my community, state and nation.”</blockquote>` : "";
  main.innerHTML = `
    <section class="module-hero"><div class="page-shell"><a class="back-link" href="#modules">← All modules</a><p class="eyebrow">Module ${module.number} of ${MODULES.length}</p><h1 class="page-title">${module.title}</h1><p>${module.description}</p><div class="module-progress"><span>Lesson ${lessonIndex + 1} of ${module.sections.length}</span><div class="meter"><i style="width:${lessonPercent}%"></i></div><strong>${lessonPercent}%</strong></div></div></section>
    <section class="learning-shell">
      <aside class="lesson-outline" aria-label="Module lessons"><span>Module outline</span>${module.sections.map((item, i) => `<a href="#module/${id}/${i}" ${i === lessonIndex ? 'aria-current="step"' : ""}><b>${String(i + 1).padStart(2, "0")}</b>${item.title}</a>`).join("")}<a class="quiz-link" href="#quiz/${id}">Knowledge check</a></aside>
      <article class="lesson-content">
        <p class="eyebrow">${lesson.kicker}</p><h2>${lesson.title}</h2>${oath}${lesson.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}${cards}${steps}<div class="takeaway"><span>Key takeaway</span><strong>${lesson.takeaway}</strong></div>
        ${lessonIndex === module.sections.length - 1 ? renderActivity(module.activity) : ""}
        ${lessonIndex === module.sections.length - 1 ? renderSources(module) : ""}
        <nav class="lesson-nav" aria-label="Lesson navigation">${lessonIndex > 0 ? `<a class="button ghost" href="#module/${id}/${lessonIndex - 1}">← Previous lesson</a>` : moduleIndex > 0 ? `<a class="button ghost" href="#module/${MODULES[moduleIndex - 1].id}/${MODULES[moduleIndex - 1].sections.length - 1}">← Previous module</a>` : `<a class="button ghost" href="#modules">← Modules</a>`}${lessonIndex < module.sections.length - 1 ? `<a class="button" href="#module/${id}/${lessonIndex + 1}">Next lesson →</a>` : `<a class="button" href="#quiz/${id}">Take knowledge check →</a>`}</nav>
      </article>
    </section>`;
  wireActivity(module.activity);
}

function wireActivity(activity) {
  document.querySelectorAll("[data-reveal]").forEach((button) => button.addEventListener("click", () => {
    const panel = document.querySelector(`[data-panel="${button.dataset.reveal}"]`);
    const open = panel.hidden;
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  }));
  document.querySelectorAll("[data-check]").forEach((input) => input.addEventListener("change", () => {
    const feedback = document.querySelector(".activity-feedback");
    const notes = [...document.querySelectorAll("[data-check]:checked")].map((item) => activity.items[Number(item.dataset.check)][1]);
    feedback.textContent = notes.length ? notes.join(" ") : "Select an item to reveal its inspection note.";
  }));
  document.querySelectorAll("[data-scenario]").forEach((button) => button.addEventListener("click", () => {
    const chosen = Number(button.dataset.scenario);
    document.querySelectorAll("[data-scenario]").forEach((item) => item.classList.remove("correct", "incorrect"));
    button.classList.add(chosen === activity.answer ? "correct" : "incorrect");
    document.querySelector(".activity-feedback").textContent = chosen === activity.answer ? `Correct. ${activity.feedback}` : `Not quite. ${activity.feedback}`;
  }));
}

function renderQuiz(id) {
  const module = MODULES.find((item) => item.id === id);
  if (!module) return renderNotFound();
  const best = progress[id]?.score;
  main.innerHTML = `<section class="page-shell narrow"><a class="back-link" href="#module/${id}/${module.sections.length - 1}">← Back to module</a><p class="eyebrow">Module ${module.number} knowledge check</p><h1 class="page-title">${module.title}</h1><p class="lede">Answer all ${module.quiz.length} questions. A score of ${SITE_CONFIG.passingScore}% is required to complete the module.${Number.isFinite(best) ? ` Your best score is ${best}%.` : ""}</p><form id="quiz-form" class="quiz-form">${module.quiz.map((question, qIndex) => `<fieldset><legend><span>${qIndex + 1}</span>${question.q}</legend>${question.options.map((option, oIndex) => `<label><input type="radio" name="q${qIndex}" value="${oIndex}" required><span>${option}</span></label>`).join("")}<div class="quiz-explanation" id="explain-${qIndex}" hidden></div></fieldset>`).join("")}<button class="button" type="submit">Submit answers</button><div id="quiz-result" class="quiz-result" aria-live="polite"></div></form></section>`;
  document.querySelector("#quiz-form").addEventListener("submit", (event) => gradeQuiz(event, module));
}

function gradeQuiz(event, module) {
  event.preventDefault();
  const form = event.currentTarget;
  let correct = 0;
  module.quiz.forEach((question, index) => {
    const selected = Number(new FormData(form).get(`q${index}`));
    const passed = selected === question.answer;
    if (passed) correct += 1;
    const explanation = document.querySelector(`#explain-${index}`);
    explanation.hidden = false;
    explanation.className = `quiz-explanation ${passed ? "correct" : "incorrect"}`;
    explanation.innerHTML = `<strong>${passed ? "Correct" : `Review: ${question.options[question.answer]}`}</strong><span>${question.why}</span>`;
  });
  const score = Math.round((correct / module.quiz.length) * 100);
  const passed = score >= SITE_CONFIG.passingScore;
  progress[module.id] = { ...progress[module.id], viewed: true, score: Math.max(progress[module.id]?.score || 0, score), passed: progress[module.id]?.passed || passed, completedAt: passed ? new Date().toISOString() : progress[module.id]?.completedAt };
  saveProgress();
  const nextIndex = MODULES.indexOf(module) + 1;
  const nextAction = passed ? (nextIndex < MODULES.length ? `<a class="button" href="#module/${MODULES[nextIndex].id}/0">Next module →</a>` : `<a class="button" href="#progress">View completion record</a>`) : `<button class="button" type="button" id="retry-quiz">Retry quiz</button>`;
  const result = document.querySelector("#quiz-result");
  result.className = `quiz-result ${passed ? "pass" : "retry"}`;
  result.innerHTML = `<div><span>Your score</span><strong>${score}%</strong><p>${correct} of ${module.quiz.length} correct. ${passed ? "Module complete." : `Review the explanations and try again. You need ${SITE_CONFIG.passingScore}%.`}</p></div>${nextAction}`;
  result.scrollIntoView({ behavior: "smooth", block: "center" });
  document.querySelector("#retry-quiz")?.addEventListener("click", () => renderQuiz(module.id));
}

function renderProgress() {
  const done = completedCount();
  main.innerHTML = `<section class="page-shell"><div class="section-heading"><div><p class="eyebrow">Local training record</p><h1 class="page-title">Cadet training progress</h1></div><p>Saved only in this browser. It is not an official CAP training record.</p></div><div class="progress-overview">${progressRing(percentComplete())}<div><strong>${done} / ${MODULES.length}</strong><span>modules completed</span><div class="meter"><i style="width:${percentComplete()}%"></i></div></div></div><div class="progress-list">${MODULES.map((module) => { const record = progress[module.id] || {}; const status = moduleStatus(module); return `<article><span class="progress-index">${module.number}</span><div><h3>${module.title}</h3><p>${status}${Number.isFinite(record.score) ? ` · Best quiz score ${record.score}%` : ""}</p></div><span class="status-chip ${status.toLowerCase().replace(" ", "-")}">${status}</span><a href="#module/${module.id}/${record.lesson || 0}">${record.passed ? "Review" : "Continue"}</a></article>`; }).join("")}</div><div class="progress-actions"><button class="button" id="print-progress" type="button">Print completion record</button><button class="text-button danger" id="reset-progress" type="button">Reset progress on this device</button></div><div class="callout"><span class="callout-icon">i</span><div><strong>Unofficial record</strong><p>This printout is a study aid and does not replace eServices, squadron testing, approvals, or official promotion records.</p></div></div></section>`;
  document.querySelector("#print-progress").addEventListener("click", () => window.print());
  document.querySelector("#reset-progress").addEventListener("click", () => {
    if (window.confirm("Reset every saved lesson, score, and completion status on this device?")) { progress = {}; saveProgress(); renderProgress(); }
  });
}

function glossaryCards(items) {
  return items.map((item) => `<article class="glossary-card"><strong>${item.term}</strong><p>${item.definition}</p></article>`).join("");
}

function renderGlossary() {
  main.innerHTML = `<section class="page-shell"><p class="eyebrow">Quick reference</p><h1 class="page-title">CAP glossary</h1><label class="search-box"><span>Search terms</span><input id="glossary-search" type="search" placeholder="Try OCP, wing, or NCO" autocomplete="off"></label><p id="glossary-count" class="result-count">${GLOSSARY.length} terms</p><div id="glossary-grid" class="glossary-grid">${glossaryCards(GLOSSARY)}</div></section>`;
  document.querySelector("#glossary-search").addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    const filtered = GLOSSARY.filter((item) => `${item.term} ${item.definition}`.toLowerCase().includes(query));
    document.querySelector("#glossary-grid").innerHTML = glossaryCards(filtered);
    document.querySelector("#glossary-count").textContent = `${filtered.length} term${filtered.length === 1 ? "" : "s"}`;
  });
}

function renderResources() {
  const categories = ["All", ...new Set(RESOURCES.map((item) => item.category))];
  main.innerHTML = `<section class="page-shell"><div class="section-heading"><div><p class="eyebrow">Official library</p><h1 class="page-title">Resources & regulations</h1></div><p>Links open current official sources. Always check publication dates and attached interim changes.</p></div><div class="filter-row" role="group" aria-label="Filter resources">${categories.map((category, i) => `<button class="filter-chip ${i === 0 ? "active" : ""}" type="button" data-category="${category}">${category}</button>`).join("")}</div><div id="resource-grid" class="resource-grid">${resourceCards(RESOURCES)}</div><div class="callout"><span class="callout-icon">!</span><div><strong>Publication note</strong><p>CAPR 30-1 is the current organization regulation listed by NHQ. CAPR 20-1 now covers the Inspector General program, so older references to CAPR 20-1 for organization should be reviewed.</p></div></div></section>`;
  document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-category]").forEach((item) => item.classList.remove("active")); button.classList.add("active");
    const items = button.dataset.category === "All" ? RESOURCES : RESOURCES.filter((item) => item.category === button.dataset.category);
    document.querySelector("#resource-grid").innerHTML = resourceCards(items);
  }));
}

function resourceCards(items) {
  return items.map((resource) => `<article class="resource-card"><span>${resource.category}</span><h3>${resource.title}</h3><strong>${resource.subtitle}</strong><p>${resource.note}</p><a href="${resource.url}" target="_blank" rel="noopener">Open official source ↗</a></article>`).join("");
}

let practiceState = { mode: "question", item: null };
function randomPracticeItem(mode) {
  if (mode === "card") return GLOSSARY[Math.floor(Math.random() * GLOSSARY.length)];
  const pool = MODULES.flatMap((module) => module.quiz.map((question) => ({ ...question, module: module.title })));
  return pool[Math.floor(Math.random() * pool.length)];
}

function renderPractice(mode = "question") {
  practiceState = { mode, item: randomPracticeItem(mode) };
  const item = practiceState.item;
  main.innerHTML = `<section class="page-shell narrow"><p class="eyebrow">No score · unlimited retries</p><h1 class="page-title">Practice Center</h1><div class="practice-modes"><button class="filter-chip ${mode === "question" ? "active" : ""}" data-practice-mode="question">Random questions</button><button class="filter-chip ${mode === "card" ? "active" : ""}" data-practice-mode="card">CAP flashcards</button></div><div id="practice-stage" class="practice-stage">${mode === "question" ? `<span>${item.module}</span><h2>${item.q}</h2><div class="scenario-options">${item.options.map((option, i) => `<button type="button" data-practice-answer="${i}">${String.fromCharCode(65 + i)}. ${option}</button>`).join("")}</div><p class="activity-feedback" aria-live="polite">Choose the best answer.</p>` : `<span>Flashcard</span><h2>${item.term}</h2><p class="flashcard-answer" hidden>${item.definition}</p><button class="button" type="button" id="reveal-card">Reveal answer</button>`}</div><button class="text-button" type="button" id="next-practice">New ${mode === "question" ? "question" : "card"} →</button><div class="practice-topics"><span>Practice across</span>${MODULES.map((module) => `<a href="#quiz/${module.id}">${module.title}</a>`).join("")}</div></section>`;
  document.querySelectorAll("[data-practice-mode]").forEach((button) => button.addEventListener("click", () => renderPractice(button.dataset.practiceMode)));
  document.querySelector("#next-practice").addEventListener("click", () => renderPractice(mode));
  document.querySelector("#reveal-card")?.addEventListener("click", (event) => { document.querySelector(".flashcard-answer").hidden = false; event.currentTarget.hidden = true; });
  document.querySelectorAll("[data-practice-answer]").forEach((button) => button.addEventListener("click", () => {
    const chosen = Number(button.dataset.practiceAnswer);
    document.querySelectorAll("[data-practice-answer]").forEach((item) => item.classList.remove("correct", "incorrect"));
    button.classList.add(chosen === item.answer ? "correct" : "incorrect");
    document.querySelector(".activity-feedback").textContent = `${chosen === item.answer ? "Correct." : `Answer: ${item.options[item.answer]}.`} ${item.why}`;
  }));
}

function renderNotFound() {
  main.innerHTML = `<section class="page-shell narrow"><p class="eyebrow">Navigation check</p><h1 class="page-title">Page not found</h1><p>That training page is not in the flight plan.</p><a class="button" href="#home">Return home</a></section>`;
}

function render() {
  const route = location.hash.slice(1) || "home";
  const [page, id, lesson] = route.split("/");
  document.querySelectorAll(".primary-nav a").forEach((link) => link.removeAttribute("aria-current"));
  const navPage = ["module", "quiz"].includes(page) ? "modules" : page;
  document.querySelector(`.primary-nav a[href="#${navPage}"]`)?.setAttribute("aria-current", "page");
  if (page === "home") renderHome();
  else if (page === "modules") renderModules();
  else if (page === "drill") renderDrill(id);
  else if (page === "module") renderModule(id, lesson);
  else if (page === "quiz") renderQuiz(id);
  else if (page === "progress") renderProgress();
  else if (page === "glossary") renderGlossary();
  else if (page === "resources") renderResources();
  else if (page === "practice") renderPractice();
  else renderNotFound();
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

const savedTheme = localStorage.getItem("northshore-theme");
document.documentElement.dataset.theme = savedTheme || "dark";
function updateThemeLabel() { themeToggle.setAttribute("aria-label", `Switch to ${document.documentElement.dataset.theme === "dark" ? "light" : "dark"} theme`); }
updateThemeLabel();
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("northshore-theme", next);
  updateThemeLabel();
});

window.addEventListener("hashchange", render);
render();

// Optional WebMCP surface: the same read and navigate actions available in the UI.
const modelContext = typeof document !== "undefined" ? document.modelContext : undefined;
if (modelContext?.registerTool) {
  const lifecycle = new AbortController();
  const register = (tool) => {
    try { void Promise.resolve(modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); }
    catch { /* Unsupported or blocked WebMCP implementations are safe to ignore. */ }
  };
  register({
    name: "get_training_progress",
    title: "Read training progress",
    description: "Read this browser's Northshore Cadet Learning Center completion count, scores, and current module status.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() {
      return { completed: completedCount(), total: MODULES.length, percent: percentComplete(), modules: MODULES.map((module) => ({ id: module.id, title: module.title, status: moduleStatus(module), score: progress[module.id]?.score || null })) };
    }
  });
  register({
    name: "search_glossary",
    title: "Search CAP glossary",
    description: "Find CAP terms in the Northshore glossary without changing training progress.",
    inputSchema: { type: "object", properties: { query: { type: "string", description: "A CAP term or phrase to search for." } }, required: ["query"], additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute(input) {
      const query = String(input?.query || "").trim().toLowerCase();
      if (!query) return { results: [] };
      return { results: GLOSSARY.filter((item) => `${item.term} ${item.definition}`.toLowerCase().includes(query)).slice(0, 12) };
    }
  });
  register({
    name: "start_module",
    title: "Open a training module",
    description: "Navigate the visible site to a named Northshore training module and lesson.",
    inputSchema: { type: "object", properties: { moduleId: { type: "string", description: "One of the module ids in the site data." }, lesson: { type: "integer", minimum: 0 } }, required: ["moduleId"], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      const module = MODULES.find((item) => item.id === input?.moduleId);
      if (!module) throw new Error("Unknown module id");
      const lesson = Math.max(0, Math.min(Number(input?.lesson) || 0, module.sections.length - 1));
      location.hash = `module/${module.id}/${lesson}`;
      return { moduleId: module.id, title: module.title, lesson };
    }
  });
  register({
    name: "open_practice_center",
    title: "Open Practice Center",
    description: "Navigate the visible site to the no-score Practice Center.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute() { location.hash = "practice"; return { route: "practice" }; }
  });
}

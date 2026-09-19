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
      <div class="module-card-top"><span class="module-number">MODULE ${module.number}</span><span class="module-icon" aria-hidden="true">${module.icon}</span></div>
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
    <section class="meeting-strip" aria-labelledby="invitation-title">
      <div class="meeting-inner">
        <div><p class="eyebrow">YOU'RE INVITED</p><h2 id="invitation-title">Start with a learning module.</h2></div>
        <div class="meeting-detail"><span>01</span><div><strong>New cadets</strong><small>Begin with history, core values, and the oath.</small></div></div>
        <div class="meeting-detail"><span>07</span><div><strong>Ready for inspection</strong><small>Finish with grooming and uniform review.</small></div></div>
        <a class="text-link" href="#modules">View the training path →</a>
      </div>
    </section>
    <section class="page-shell">
      <div class="feature-lead"><div><p class="eyebrow">ONE ACADEMY. THREE HABITS.</p><h2>Purpose in every lesson.</h2></div><p>Build the habits that connect Northshore's three missions: develop leaders, serve when it matters, and explore what is possible.</p></div>
      <div class="mission-cards"><a href="#module/core-values/0"><span>01</span><strong>Develop tomorrow's leaders</strong><small>Leadership, character, fitness, and followership.</small><em>Explore the cadet path →</em></a><a href="#module/customs/0"><span>02</span><strong>Serve when it matters</strong><small>Professional habits for a ready, respectful team.</small><em>Practice customs →</em></a><a href="#module/history/0"><span>03</span><strong>Explore what's possible</strong><small>History, aerospace, and a future without limits.</small><em>Start with history →</em></a></div>
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
    </section>`;
  const home = main.querySelector(".page-shell");
  home.insertAdjacentHTML("beforeend", `
    <section class="why-section" aria-labelledby="why-title">
      <div class="why-grid">
        <div class="why-photos"><img src="images/cadet.jpg" alt="Cadets learning together" /><img src="images/volunteer.jpg" alt="Civil Air Patrol volunteer preparing for service" /><small>Learning is stronger when it is shared.</small></div>
        <div class="why-copy"><p class="eyebrow">WHY NORTHSHORE?</p><h2 id="why-title">Find your people. Discover your potential.</h2><p>Bring curiosity and a willingness to serve. This learning center gives you a clear starting point, practical repetition, and a place to return when you need a refresher.</p><div class="reason-list"><div><b>01</b><span><strong>Leadership through experience</strong>Learn how small, consistent choices build trust.</span></div><div><b>02</b><span><strong>Service with a purpose</strong>Connect every standard to the people it protects.</span></div><div><b>03</b><span><strong>A shared passion for aviation</strong>Explore the mission from the ground to the sky.</span></div></div></div>
      </div>
    </section>
    <section class="section horizon-section" aria-labelledby="horizon-title"><div class="section-inner"><div class="section-heading"><div><p class="eyebrow">ON THE HORIZON</p><h2 id="horizon-title">Next in your academy path</h2></div><a class="text-link" href="#modules">View all modules →</a></div><div class="event-list"><article class="event-card"><div class="date-tile"><span>NEXT</span><strong>01</strong></div><div><span class="micro">ACADEMY PATH</span><h3>Continue your next module</h3><p>Pick up where you left off in ${MODULES.find((module) => module.id === next.id)?.title || "your next lesson"}.</p><small>Saved locally in this browser.</small></div><a href="#module/${next.id}/${progress[next.id]?.lesson || 0}" aria-label="Continue your next module">↗</a></article><article class="event-card"><div class="date-tile"><span>ANY</span><strong>TIME</strong></div><div><span class="micro">PRACTICE CENTER</span><h3>Rehearse before the check</h3><p>Use flashcards and scenarios without changing your score.</p><small>Study at your own pace.</small></div><a href="#practice" aria-label="Open Practice Center">↗</a></article><article class="event-card"><div class="date-tile"><span>READ</span><strong>NOW</strong></div><div><span class="micro">OFFICIAL LIBRARY</span><h3>Keep current with CAP guidance</h3><p>Use the live publications and references behind each module.</p><small>Official sources control when guidance changes.</small></div><a href="#resources" aria-label="Open official resources">↗</a></article></div></div></section>
    <section class="section news-section" aria-labelledby="news-title"><div class="section-inner"><div class="section-heading"><div><p class="eyebrow">FROM CAP.NEWS</p><h2 id="news-title">Civil Air Patrol news</h2></div><a class="text-link" href="https://www.cap.news" target="_blank" rel="noopener">All CAP news ↗</a></div><p class="news-source">Stay connected to the national mission beyond your next lesson.</p><div class="news-grid"><a class="news-card" href="#module/history/0"><span class="micro">HISTORY</span><h3>Understand where CAP began</h3><p>Trace the organization’s service from its founding to today.</p></a><a class="news-card" href="#module/core-values/0"><span class="micro">CADET PROGRAMS</span><h3>Build character through practice</h3><p>Use core values and the oath as a daily standard.</p></a><a class="news-card" href="#module/grooming/0"><span class="micro">CURRENT GUIDANCE</span><h3>Check the latest references</h3><p>Return to the official library when regulations change.</p></a></div></div></section>
    <section class="recruit-strip"><div class="recruit-inner"><div><p class="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>Start your training.</h2></div><a class="button" href="#module/${next.id}/${progress[next.id]?.lesson || 0}">Begin the next lesson →</a></div></section>`);
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

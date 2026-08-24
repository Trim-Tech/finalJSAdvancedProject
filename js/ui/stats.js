/* ============================================================================
 * ui/stats.js  —  Paneli i statistikave
 * MËSIMI: Java 2 (të dhëna të derivuara) + Java 9 (DOM)
 *
 * Vini re: ky modul NUK llogarit asgjë. Ai vetëm e shfaq atë që
 * `core/statistics.js` ka llogaritur. Ndarja "llogarit vs shfaq" e mban
 * matematikën të testueshme dhe UI-në të thjeshtë.
 * ==========================================================================*/

import { buildSummary } from "../core/statistics.js";
import { teamProgress } from "../core/ranks.js";
import { plural } from "../core/utils.js";
import { $, clear, el } from "./dom.js";

/* ═══════════════════════════════════════════════════════════════════════
 * NUMRA QË "NGJITEN" — një animacion me requestAnimationFrame (Java 8)
 *
 * Një numër që kërcen nga 7 në 12 është informatë. I njëjti numër që ngjitet
 * 7 → 8 → 9 … 12 është informatë PLUS: syri e kap se diçka u shtua.
 *
 * Dy detaje që e ndajnë një animacion të mirë nga një i bezdisshëm:
 *   1. Nëse numri nuk ka ndryshuar, MOS animo fare (ndryshe çdo shkronjë
 *      e shkruar në kërkim do t'i rindizte të katër kutitë).
 *   2. Nëse animacioni i vjetër është ende duke ecur, ANULOJE — përndryshe
 *      dy rAF-e do të luftojnë për të njëjtin element dhe numri dridhet.
 * ═════════════════════════════════════════════════════════════════════ */
const running = new Map(); // element → id i rAF-it aktiv
const previous = new Map(); // element → vlera e fundit e treguar

function countUp(node, value, { decimals = 0, suffix = "" } = {}) {
  if (!node) return;

  const from = previous.get(node) ?? 0;
  previous.set(node, value);

  const write = (n) => (node.textContent = `${n.toFixed(decimals)}${suffix}`);

  if (from === value) return write(value);

  cancelAnimationFrame(running.get(node)); // rregulli #2
  const started = performance.now();
  const DURATION = 520;

  const frame = (now) => {
    const t = Math.min((now - started) / DURATION, 1);
    // ease-out cubic: nis shpejt, ndalet butë. Duket "e gjallë", jo mekanike.
    const eased = 1 - (1 - t) ** 3;
    write(from + (value - from) * eased);

    if (t < 1) running.set(node, requestAnimationFrame(frame));
    else running.delete(node);
  };

  running.set(node, requestAnimationFrame(frame));
}

export function renderStats(state) {
  const summary = buildSummary(state.students);

  countUp($("#statTotal"), summary.total);
  $("#statTotalHint").textContent =
    summary.total === 0
      ? "Asnjë student i regjistruar"
      : `${plural(summary.passing, "kalues", "kalues")} nga ${summary.total}`;

  countUp($("#statAverage"), summary.average, { decimals: 2 });
  $("#statMedian").textContent = summary.median;

  /* `percent()` kthen deri në një shifër dhjetore (87.5). Nëse e animojmë me
     `decimals: 0`, 87.5 do të shfaqej "88%" ndërsa shiriti nën të qëndron
     në 87.5% — dy numra që s'përputhen për të njëjtën gjë. Prandaj vendosim
     shifrat sipas vlerës: "100%" mbetet i pastër, "87.5%" mbetet i saktë. */
  countUp($("#statPassRate"), summary.passRate, {
    decimals: Number.isInteger(summary.passRate) ? 0 : 1,
    suffix: "%",
  });
  $("#statPassMeter").style.width = `${summary.passRate}%`;
  // Ngjyra e shiritit ndryshon sipas vlerës — feedback vizual pa tekst.
  $("#statPassMeter").dataset.tone =
    summary.passRate >= 75 ? "ok" : summary.passRate >= 40 ? "warn" : "danger";

  /* Vetëm `textContent`, kurrë `innerHTML`.
     Përveç sigurisë (XSS), ka një arsye praktike: `innerHTML` i zëvendëson
     TË GJITHË fëmijët. Nëse një fëmijë ka ID që e lexojmë në vizatimin tjetër,
     ai do të kishte zhdukur — dhe vizatimi i dytë do pëlciste me
     "Cannot set properties of null". Ky ishte një bug i vërtetë në këtë projekt. */
  $("#statTop").textContent = summary.top ? summary.top.name : "—";
  $("#statTopGrade").textContent = summary.top ? summary.top.grade : "—";
  $("#statAge").textContent = summary.averageAge;

  renderTeamLevel(state.students);
  renderCourseBreakdown(summary.courses);
}

/* ═══════════════════════════════════════════════════════════════════════
 * NIVELI I KLASËS — e njëjta e dhënë, veshje tjetër.
 * `teamProgress()` (te core/ranks.js) e mbledh XP-në e të gjithëve dhe e
 * kthen në nivel. Këtu vetëm e shfaqim. Zero matematikë në këtë skedar.
 * ═════════════════════════════════════════════════════════════════════ */
function renderTeamLevel(students) {
  const { level, xp, fill, toNextLevel, rank } = teamProgress(students);

  const badge = $("#teamLevel");
  if (badge) badge.textContent = String(level);

  const icon = $("#teamRankIcon");
  if (icon) icon.textContent = rank.icon;

  const bar = $("#teamXpFill");
  if (bar) {
    bar.style.width = `${fill}%`;
    bar.className = `xp__fill xp__fill--${rank.key}`;
  }

  const label = $("#teamXpLabel");
  if (label) {
    label.textContent =
      students.length === 0
        ? "Shto studentin e parë për të nisur nivelin 1."
        : `${xp} XP · edhe ${toNextLevel} XP deri te niveli ${level + 1}`;
  }
}

/** Një rresht për secilin kurs, me shirit proporcional. */
function renderCourseBreakdown(courses) {
  const container = clear($("#courseBreakdown"));

  if (courses.length === 0) {
    container.append(el("p", { class: "hint", text: "Asnjë e dhënë për të grupuar." }));
    return;
  }

  const max = Math.max(...courses.map((course) => course.count));

  for (const { course, count, average, passRate } of courses) {
    container.append(
      el(
        "div",
        { class: "breakdown__row" },
        el("span", { class: "breakdown__label", text: course }),
        el(
          "div",
          { class: "breakdown__bar" },
          el("div", {
            class: "breakdown__fill",
            style: `width:${(count / max) * 100}%`,
            "data-tone": passRate >= 75 ? "ok" : passRate >= 40 ? "warn" : "danger",
          })
        ),
        el("span", {
          class: "breakdown__value",
          text: `${count} · ⌀ ${average} · ${passRate}%`,
        })
      )
    );
  }
}

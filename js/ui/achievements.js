/* ============================================================================
 * ui/achievements.js  —  Vitrina e trofeve
 * MËSIMI: Java 2 (Set) + Java 9 (DOM) + Java 10 (localStorage)
 *
 * Ky modul bën DY punë që duken një:
 *   1. VIZATON gjendjen aktuale (cilat trofe janë të zhbllokuara).
 *   2. DALLON se ÇFARË ËSHTË E RE që nga hera e fundit — dhe vetëm atëherë
 *      feston me konfeti.
 *
 * Puna #2 kërkon kujtesë. Nëse mbanim vetëm listën aktuale, atëherë ÇDO
 * rivizatim (pra çdo shkronjë e shkruar në kërkim!) do të festonte sërish.
 * Prandaj ruajmë të zhbllokuarat në localStorage dhe krahasojmë me `Set`.
 * ==========================================================================*/

import { evaluateAchievements } from "../core/achievements.js";
import { buildSummary } from "../core/statistics.js";
import { local } from "../services/storage.js";
import { $, clear, el, toggle } from "./dom.js";
import { burst } from "./confetti.js";
import { toastSuccess } from "./toast.js";

const SEEN_KEY = "sm.achievements";

/** Të zhbllokuarat që i kemi festuar tashmë. `Set` → kontroll O(1). */
let celebrated = new Set();
let ready = false;

export function initAchievements() {
  const saved = local.read(SEEN_KEY, []);
  celebrated = new Set(Array.isArray(saved) ? saved : []);
  ready = true;
}

/**
 * Thirret nga `app/render.js` pas çdo ndryshimi të state-it.
 * @param {{ students: object[] }} state
 */
export function renderAchievements(state) {
  const grid = $("#achievementGrid");
  if (!grid) return;

  const summary = buildSummary(state.students);
  const { list, unlockedIds, unlocked, total } = evaluateAchievements(state.students, summary);

  /* ---------------------------------------------------- 1) vizatimi ---- */
  clear(grid);
  for (const item of list) {
    grid.append(
      el(
        "div",
        {
          class: `trophy${item.unlocked ? " trophy--unlocked" : ""}`,
          // `title` = tooltip nativ. Zero JavaScript, punon edhe me tastierë.
          title: item.unlocked ? `${item.title} — e zhbllokuar!` : item.hint,
        },
        el("span", { class: "trophy__icon", text: item.unlocked ? item.icon : "🔒" }),
        el("span", { class: "trophy__title", text: item.title }),
        el("span", { class: "trophy__hint", text: item.unlocked ? "E ZHBLLOKUAR" : item.hint })
      )
    );
  }

  const counter = $("#achievementCount");
  if (counter) counter.textContent = `${unlocked} / ${total}`;

  const bar = $("#achievementMeter");
  if (bar) bar.style.width = `${(unlocked / total) * 100}%`;

  toggle($("#achievementAllDone"), unlocked === total && total > 0);

  /* ------------------------------------------- 2) çfarë është E RE? ---- */
  if (!ready) return;

  const fresh = unlockedIds.filter((id) => !celebrated.has(id));
  if (fresh.length === 0) {
    /* Nëse një trofe u "zhbllokua" dhe pastaj humbi (p.sh. u fshinë studentët),
       e heqim nga kujtesa — që ta festojë sërish herën tjetër. Ndryshe
       aplikacioni do të festonte vetëm një herë në jetë. */
    const stillValid = new Set(unlockedIds);
    if ([...celebrated].some((id) => !stillValid.has(id))) {
      celebrated = stillValid;
      persist();
    }
    return;
  }

  for (const id of fresh) celebrated.add(id);
  persist();

  const first = list.find((item) => item.id === fresh[0]);
  toastSuccess(`${first.icon} Trofe e re: ${first.title}!`, { duration: 5000 });
  burst({ count: 120, y: 0.3 });
}

function persist() {
  try {
    local.write(SEEN_KEY, [...celebrated]);
  } catch (error) {
    // Trofetë nuk janë të dhëna të përdoruesit — nuk ia vlen një toast.
    console.warn("[achievements] nuk u ruajtën:", error);
  }
}

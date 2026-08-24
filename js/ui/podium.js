/* ============================================================================
 * ui/podium.js  —  Podiumi: tre studentët më të mirë
 * MËSIMI: Java 2 (sort me krahasim të dyfishtë) + Java 9 (DOM nga të dhëna)
 *
 * DETAJ QË NDRYSHON GJITHÇKA — RENDITJA E DYFISHTË:
 *   `sort((a, b) => b.grade - a.grade)` i rendit notat, po me nota të barabarta
 *   rendi mbetet i rastësishëm dhe podiumi "kërcen" pas çdo rivizatimi.
 *   Prandaj kur notat janë baraz, vendos EMRI (`localeCompare`). Rezultati:
 *   i njëjti input jep gjithmonë të njëjtin podium. Kjo quhet renditje STABILE.
 * ==========================================================================*/

import { progressOf } from "../core/ranks.js";
import { $, clear, el, toggle } from "./dom.js";

/** Vendi 1, 2, 3 — medaljet dhe lartësia e shkallës në CSS. */
const PLACES = [
  { medal: "🥇", label: "I pari", key: "gold" },
  { medal: "🥈", label: "I dyti", key: "silver" },
  { medal: "🥉", label: "I treti", key: "bronze" },
];

export function renderPodium(state) {
  const container = $("#podium");
  if (!container) return;

  const top = [...state.students]
    .sort((a, b) => b.grade - a.grade || a.name.localeCompare(b.name, "sq"))
    .slice(0, 3);

  toggle($("#podiumEmpty"), top.length === 0);
  clear(container);

  for (const [index, student] of top.entries()) {
    const place = PLACES[index];
    const { rank, fill } = progressOf(student);

    container.append(
      el(
        "article",
        { class: `podium__slot podium__slot--${place.key}`, style: `--slot-index:${index}` },
        el("span", { class: "podium__medal", text: place.medal }),
        el("span", { class: "podium__avatar", text: student.initials }),
        el("p", { class: "podium__name", text: student.name }),
        el("p", { class: "podium__rank", text: `${rank.icon} ${rank.label}` }),
        el(
          "div",
          { class: "xp" },
          el("div", { class: `xp__fill xp__fill--${rank.key}`, style: `width:${fill}%` })
        ),
        el("p", { class: "podium__meta", text: `Nota ${student.grade} · ${student.course}` }),
        // `.podium__step` është shkalla nën secilin — lartësia vjen nga CSS.
        el("div", { class: "podium__step" }, el("span", { text: place.label }))
      )
    );
  }
}

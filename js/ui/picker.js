/* ============================================================================
 * ui/picker.js  —  «Kush përgjigjet?» — zgjedhësi i rastësishëm
 * MËSIMI: Java 5 (sleep i promisifikuar) + Java 6 (async/await në një lak) +
 *         Java 8 (pse `await` NUK e bllokon faqen) + Java 9 (<dialog>)
 *
 * ═══════════════════════════════════════════════════════════════════════
 *  KY ËSHTË DEMOJA MË E MIRË E `await` NË TË GJITHË PROJEKTIN.
 *
 *  Animacioni "ruleta që ngadalësohet" shkruhet si një lak i thjeshtë:
 *
 *      while (…) { trego një emër; await sleep(vonesa); vonesa *= 1.14; }
 *
 *  Lexohet si kod sinkron — nga lart poshtë, pa asnjë callback. Por gjatë
 *  çdo `await`, thread-i i vetëm i JavaScript-it është I LIRË: shfletuesi
 *  vizaton, animacionet lëvizin, butonat përgjigjen.
 *
 *  Krahasoje me `while (performance.now() < until) {}` te «🥶 Blloko 1.5s»
 *  në Laborator: i njëjti lak, e njëjta kohëzgjatje, dhe faqja ngrin plotësisht.
 *  Ndryshimi i vetëm është `await`. Kjo është e gjithë poenta e Javës 8.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { sleep } from "../core/utils.js";
import { progressOf } from "../core/ranks.js";
import { $, $$ } from "./dom.js";
import { burst } from "./confetti.js";
import { toastInfo } from "./toast.js";

const SPIN_MS = 2400;
const START_DELAY = 55; // sa shpejt ndërrohen emrat në fillim
const SLOWDOWN = 1.13; // > 1 → çdo hap pak më i ngadaltë (ease-out)

let dialog, nameNode, subNode, rankNode, spinButton, closeButton;
let spinning = false;
let getStudents = () => [];

export function initPicker({ store }) {
  dialog = $("#pickerDialog");
  nameNode = $("#pickerName");
  subNode = $("#pickerSub");
  rankNode = $("#pickerRank");
  spinButton = $("#pickerSpin");
  closeButton = $("#pickerClose");

  if (!dialog) return;

  getStudents = () => store.getState().students;

  /* Dy butona, i njëjti veprim: një te paneli, një te veprimet e shpejta.
     `$$` kthen varg të vërtetë → `forEach` pa konvertime. */
  $$("#pickBtn, #pickBtn2").forEach((button) =>
    button.addEventListener("click", openPicker)
  );
  spinButton.addEventListener("click", spin);
  closeButton.addEventListener("click", () => dialog.close());

  /* Mos e lër përdoruesin ta mbyllë me `Esc` në mes të rrotullimit —
     do të mbetej `spinning = true` përgjithmonë dhe butoni i bllokuar. */
  dialog.addEventListener("cancel", (event) => {
    if (spinning) event.preventDefault();
  });
}

/** Hap dialogun dhe rrotullo menjëherë — një klikim, jo dy. */
export function openPicker() {
  if (!dialog) return;

  const students = getStudents();
  if (students.length === 0) {
    toastInfo("Lista është bosh — shto studentë ose shtyp «Mbush me shembuj».");
    return;
  }

  if (!dialog.open) dialog.showModal();
  spin();
}

async function spin() {
  if (spinning) return; // mbrojtje nga klikimi i dyfishtë

  const students = getStudents();
  if (students.length === 0) return;

  spinning = true;
  spinButton.disabled = true;
  closeButton.disabled = true; // pa këtë, dialogu mbyllet dhe laku vazhdon të shkruajë
  dialog.classList.add("picker--spinning");
  rankNode.textContent = "";
  subNode.textContent = "Duke zgjedhur…";

  /* Fituesi vendoset QË TANI, para animacionit.
     Pse? Sepse animacioni është dekor: nëse do ta zgjidhnim "kur ndalet",
     një ngadalësim i shfletuesit do ta ndryshonte rezultatin. Logjika
     e parë, pamja e dytë — gjithmonë. */
  const winner = students[Math.floor(Math.random() * students.length)];

  let delay = START_DELAY;
  let elapsed = 0;

  while (elapsed < SPIN_MS) {
    const flash = students[Math.floor(Math.random() * students.length)];
    nameNode.textContent = flash.name;

    await sleep(delay); // ← faqja mbetet plotësisht e gjallë gjatë kësaj pauze

    elapsed += delay;
    delay *= SLOWDOWN;
  }

  spinning = false;
  spinButton.disabled = false;
  closeButton.disabled = false;

  /* Përdoruesi mund ta ketë mbyllur dialogun ndërkohë (ose të ketë ndërruar tab).
     Laku nuk mund të "anulohet" në mes, por REZULTATI po: nëse skena nuk është
     më në ekran, dalim në heshtje — pa konfeti mbi një dialog të mbyllur. */
  if (!dialog.open) return;

  /* --------------------------------------------------------- fituesi --- */
  const { rank } = progressOf(winner);

  nameNode.textContent = winner.name;
  rankNode.textContent = `${rank.icon} ${rank.label}`;
  rankNode.className = `picker__rank rank rank--${rank.key}`;
  subNode.textContent = `${winner.course} · nota ${winner.grade} · ${winner.age} vjeç`;

  dialog.classList.remove("picker--spinning");
  dialog.classList.add("picker--landed");
  burst({ count: 100, y: 0.42 });

  // Heqim klasën e "uljes" pasi mbaron animacioni, që të ripërdoret.
  setTimeout(() => dialog.classList.remove("picker--landed"), 900);

  spinButton.focus();
}

/* ============================================================================
 * core/achievements.js  —  Arritjet (achievements / trofetë)
 * MËSIMI: Java 2 (map / filter / every / some / Set) + Java 4 (të dhëna ≠ pamje)
 *
 * MODELI: çdo arritje është një objekt me një funksion `test(students, summary)`.
 * Kjo do të thotë se për të shtuar një trofe të re NUK shkruhet asnjë `if` i ri
 * askund — vetëm një element në vargun më poshtë. Ky është "open for extension,
 * closed for modification" (i njëjti rregull si te `ui/labs/index.js`).
 *
 * ⚠️ Asnjë arritje nuk e njeh DOM-in. Ato vetëm THONË "e zhbllokuar apo jo";
 * festimi (konfeti, toast) është punë e `ui/achievements.js`.
 * ==========================================================================*/

import { GRADES } from "../config.js";

/**
 * @typedef {{ id: string, icon: string, title: string, hint: string,
 *             test: (students: object[], summary: object) => boolean }} Achievement
 */

/** @type {Achievement[]} */
export const ACHIEVEMENTS = [
  {
    id: "first-step",
    icon: "🚀",
    title: "Hapi i parë",
    hint: "Shto studentin e parë.",
    test: (students) => students.length >= 1,
  },
  {
    id: "squad",
    icon: "👥",
    title: "Skuadra",
    hint: "Mblidh 5 studentë.",
    test: (students) => students.length >= 5,
  },
  {
    id: "army",
    icon: "🏟️",
    title: "Armata",
    hint: "Mblidh 15 studentë.",
    test: (students) => students.length >= 15,
  },
  {
    id: "diamond",
    icon: "💎",
    title: "Diamanti i parë",
    hint: `Regjistro një student me notë ${GRADES.MAX}.`,
    // `some` = "a ekziston të paktën një?" — ndalon sapo gjen të parin.
    test: (students) => students.some((student) => student.grade === GRADES.MAX),
  },
  {
    id: "no-one-left",
    icon: "🛡️",
    title: "Askush nuk mbetet",
    hint: "Të paktën 3 studentë, dhe të gjithë kalues.",
    // `every` = "a vlen për TË GJITHË?"
    test: (students) => students.length >= 3 && students.every((student) => student.passed),
  },
  {
    id: "golden-average",
    icon: "🧠",
    title: "Mesatarja e artë",
    hint: "Mesatarja e klasës 4.00 ose më lart.",
    test: (students, summary) => students.length >= 3 && summary.average >= 4,
  },
  {
    id: "explorer",
    icon: "🗺️",
    title: "Eksplorues",
    hint: "Studentë në 3 kurse të ndryshme.",
    // `Set` heq dublikatat vetë — pa asnjë cikël.
    test: (students) => new Set(students.map((student) => student.course)).size >= 3,
  },
  {
    id: "full-house",
    icon: "🎯",
    title: "Shtëpi plot",
    hint: "Të pesë notat, të paktën nga një herë.",
    test: (students, summary) =>
      Object.values(summary.distribution).every((count) => count > 0),
  },
];

/**
 * Vlerëson të gjitha arritjet njëherësh.
 * @returns {{ list: object[], unlockedIds: string[], unlocked: number, total: number }}
 */
export function evaluateAchievements(students, summary) {
  const list = ACHIEVEMENTS.map((achievement) => ({
    id: achievement.id,
    icon: achievement.icon,
    title: achievement.title,
    hint: achievement.hint,
    /* try/catch (Java 7): një trofe e shkruar gabim nuk ka të drejtë
       t'i fshijë shtatë të tjerat nga ekrani. */
    unlocked: safeTest(achievement, students, summary),
  }));

  const unlockedIds = list.filter((item) => item.unlocked).map((item) => item.id);

  return { list, unlockedIds, unlocked: unlockedIds.length, total: list.length };
}

function safeTest(achievement, students, summary) {
  try {
    return Boolean(achievement.test(students, summary));
  } catch (error) {
    console.error(`[achievements] "${achievement.id}" dështoi:`, error);
    return false;
  }
}

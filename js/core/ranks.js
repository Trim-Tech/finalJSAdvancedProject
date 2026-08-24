/* ============================================================================
 * core/ranks.js  —  Sistemi i GRADAVE dhe i XP-së
 * MËSIMI: Java 2 (funksione të pastra, map/reduce) + Java 4 (të dhëna ≠ pamje)
 *
 * IDEJA: një notë nga 1 deri në 5 është e saktë, por e ftohtë. Në lojëra e
 * njëjta informatë jepet si GRADË (rank) dhe si shirit XP-je — dhe befas
 * duket sa larg je nga niveli tjetër.
 *
 * Ky skedar është 100% i pastër: merr një `Student`, kthen një objekt.
 * Zero DOM, zero ngjyra CSS të fiksuara — vetëm një `tone` që CSS-i e lexon.
 * Kështu, nëse nesër duam grada të tjera, prekim VETËM këtë skedar.
 * ==========================================================================*/

import { GRADES } from "../config.js";
import { clamp, percent, round } from "./utils.js";

/** Sa XP vlen një notë. Nota 5 → 1000 XP → shiriti mbushet plot. */
export const XP_PER_GRADE = 200;
export const XP_MAX = GRADES.MAX * XP_PER_GRADE;

/**
 * Gradat, nga më e ulëta te më e larta.
 * `tone` nuk është ngjyrë — është një EMËR që CSS-i e përkthen në ngjyrë
 * (`.rank--diamant`). Logjika nuk duhet të dijë kurrë se çfarë është "#38e8ff".
 */
export const RANKS = [
  { key: "novic",   label: "Novic",   icon: "🪨", grade: 1 },
  { key: "bronz",   label: "Bronz",   icon: "🥉", grade: 2 },
  { key: "argjend", label: "Argjend", icon: "🥈", grade: 3 },
  { key: "ar",      label: "Ar",      icon: "🥇", grade: 4 },
  { key: "diamant", label: "Diamant", icon: "💎", grade: 5 },
];

/** Nota → grada. `find` kthen `undefined` nëse s'ka gjë — prandaj `??`. */
export const rankOf = (grade) =>
  RANKS.find((rank) => rank.grade === clamp(Math.round(grade), GRADES.MIN, GRADES.MAX)) ??
  RANKS[0];

/**
 * Gjithçka që i duhet një karte studenti për shiritin e XP-së.
 * @returns {{ rank: object, xp: number, xpMax: number, fill: number, next: object|null }}
 */
export function progressOf(student) {
  const rank = rankOf(student.grade);
  const xp = student.grade * XP_PER_GRADE;
  // `next` është `null` kur je në majë — UI-ja e përdor për të thënë "MAX".
  const next = RANKS[RANKS.indexOf(rank) + 1] ?? null;

  return { rank, xp, xpMax: XP_MAX, fill: percent(xp, XP_MAX), next };
}

/**
 * XP-ja e gjithë klasës, si një lojtar i vetëm.
 * Niveli rritet çdo 1000 XP — pra afërsisht "një student i shkëlqyer = një nivel".
 */
export function teamProgress(students) {
  const xp = students.reduce((total, student) => total + student.grade * XP_PER_GRADE, 0);
  const level = Math.floor(xp / XP_MAX) + 1;
  const intoLevel = xp % XP_MAX;

  return {
    xp,
    level,
    fill: percent(intoLevel, XP_MAX),
    toNextLevel: XP_MAX - intoLevel,
    /** Grada mesatare e klasës — një ikonë e vetme që përmbledh gjithçka. */
    rank: rankOf(students.length === 0 ? GRADES.MIN : round(xp / students.length / XP_PER_GRADE, 0)),
  };
}

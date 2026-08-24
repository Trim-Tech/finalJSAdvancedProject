/* ============================================================================
 * models/Student.js  —  Klasa Student
 * MËSIMI: Java 3 — extends, super, getters, metoda statike (factory methods)
 *
 * KUJDES I MADH (pyetje e provimit!):
 * Kur ruajmë në localStorage, objekti kthehet në TEKST. Kur e lexojmë,
 * marrim një objekt të thjeshtë `{}` — pa metoda, pa gettera!
 * Zgjidhja: `Student.fromJSON()` e "ringjall" objektin si instancë e klasës.
 * ==========================================================================*/

import { Person } from "./Person.js";
import { COURSES, GRADES, GRADE_LABELS } from "../config.js";
import { clamp, titleCase, toNumber } from "../core/utils.js";

export class Student extends Person {
  constructor({
    id,
    name,
    age,
    grade = GRADES.MIN,
    email = "",
    course = COURSES[0],
    createdAt = new Date().toISOString(),
  } = {}) {
    // `super()` DUHET të thirret i pari — përpara se të përdorim `this`.
    super({ id, name, age });

    /* I njëjti rregull si te Person: pastro në hyrje.
     * `email.trim()` pëlciste me `email: null` në një skedar JSON të importuar —
     * dhe ngaqë `importFromJson` i ndërton të gjithë me `map()`, NJË rekord i
     * prishur e vriste TË GJITHË importin. `String(x ?? "")` e zgjidh njëherë e mirë. */
    this.grade = clamp(Math.round(toNumber(grade, GRADES.MIN)), GRADES.MIN, GRADES.MAX);
    this.email = String(email ?? "").trim().toLowerCase();
    this.course = String(course ?? "").trim() || COURSES[0];
    this.createdAt = Student.safeDate(createdAt);
  }

  /* ------------------------------------------------------------ getters --- */

  get passed() {
    return this.grade >= GRADES.PASSING;
  }

  get gradeLabel() {
    return GRADE_LABELS[this.grade] ?? "—";
  }

  /** Klasë CSS për ngjyrën e "badge"-it. UI-ja vetëm e lexon. */
  get gradeTone() {
    if (this.grade >= 4) return "ok";
    if (this.grade >= GRADES.PASSING) return "warn";
    return "danger";
  }

  /* ------------------------------------------------------------ metoda --- */

  /**
   * OVERRIDE + `super.describe()`:
   * ripërdorim punën e prindit dhe i shtojmë tonën.
   */
  describe() {
    return `${super.describe()} — ${this.course}, nota ${this.grade} (${this.gradeLabel})`;
  }

  /** Kthen një Student TË RI me ndryshimet — pa prekur origjinalin. */
  withChanges(patch = {}) {
    return new Student({ ...this.toJSON(), ...patch });
  }

  /** Spread i `super.toJSON()` + fushat e kësaj klase. */
  toJSON() {
    return {
      ...super.toJSON(),
      grade: this.grade,
      email: this.email,
      course: this.course,
      createdAt: this.createdAt,
    };
  }

  /* --------------------------------------------- metoda statike (factory) --- */

  /** Datë e vlefshme ISO, ose "tani". Mbron renditjen sipas datës. */
  static safeDate(value) {
    const date = new Date(value ?? "");
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }

  /** Objekt i thjeshtë (nga localStorage/JSON) → instancë e vërtetë Student. */
  static fromJSON(raw) {
    return new Student(raw);
  }

  /** Përkthen përgjigjen e randomuser.me në modelin TONË (Java 6 & 7). */
  static fromApiUser(user, { course = COURSES[0] } = {}) {
    const { name = {}, dob = {}, email = "" } = user ?? {};
    return new Student({
      name: titleCase(`${name.first ?? "Pa"} ${name.last ?? "Emër"}`),
      age: clamp(Math.round(toNumber(dob.age, 20)), 6, 100),
      grade: Student.randomGrade(),
      email,
      course,
    });
  }

  static randomGrade() {
    return Math.floor(Math.random() * (GRADES.MAX - GRADES.MIN + 1)) + GRADES.MIN;
  }

  /**
   * Kthen një FUNKSION krahasues për `Array.prototype.sort`.
   * Higher-order function si metodë statike (Java 2 + Java 3).
   */
  static comparator(sortKey = "created-desc") {
    const [field, direction] = sortKey.split("-");
    const sign = direction === "asc" ? 1 : -1;

    const readers = {
      name: (s) => s.name,
      grade: (s) => s.grade,
      age: (s) => s.age,
      created: (s) => s.createdAt,
    };
    const read = readers[field] ?? readers.created;

    return (a, b) => {
      const [x, y] = [read(a), read(b)];
      if (typeof x === "string") return x.localeCompare(y, "sq") * sign;
      return (x - y) * sign;
    };
  }
}

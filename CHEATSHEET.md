# ⚡ Fletë referimi — JavaScript Advanced

Referencë e shpejtë. Çdo shembull është **marrë nga ky projekt** — kërkojeni në kod.

---

## 1 · ES6+ bazë

```js
// let / const — kurrë më `var`
let counter = 0;          // ndryshon
const GRADES = { MAX: 5 };  // referenca nuk ndryshon (objekti brenda, po!)
GRADES.MAX = 10;          // ✅ lejohet
// GRADES = {};           // ❌ TypeError

// Arrow functions
const double = (n) => n * 2;              // kthim implicit
const greet = (name) => `Përshëndetje ${name}`;
const make = (name) => ({ name });        // ⚠️ objekt → kllapa!

// `this` në arrow: merret nga jashtë, NUK rilidhet
button.addEventListener("click", () => this.save());  // `this` = konteksti jashtë

// Template literals
const label = `${student.name} — nota ${student.grade} (${student.gradeLabel})`;

// Destructuring
const { name, age = 18, email: mail } = student;   // rename + default
const [first, second, ...rest] = students;
const { coords: { latitude, longitude } } = position;  // i thelluar
```

**Në projekt:** `core/utils.js`, `models/Person.js:26`

---

## 2 · Funksione të avancuara

```js
// Default parameters
const round = (value, decimals = 2) => { /* … */ };

// REST: mbledh argumentet në varg
const sum = (...numbers) => numbers.reduce((t, n) => t + n, 0);
sum(1, 2, 3);                 // 6

// SPREAD: shpërndan vargun/objektin
sum(...[1, 2, 3]);            // 6
const copy = [...students];               // kopje e sipërfaqes
const merged = { ...defaults, ...custom }; // i dyti mbishkruan të parin

// Higher-order function: merr/kthen funksion
const debounce = (fn, delay = 250) => {
  let timerId = null;                     // ← CLOSURE: jeton mes thirrjeve
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

// Metodat e vargjeve që duhen ditur për provim
students.map(s => s.grade);                      // transformo → varg i re
students.filter(s => s.passed);                  // zgjedh → varg i re
students.reduce((acc, s) => acc + s.grade, 0);   // palos → një vlerë
students.find(s => s.id === id);                 // i pari që përputhet
students.findIndex(s => s.id === id);            // pozicioni, ose -1
students.some(s => s.passed);                    // të paktën një?
students.every(s => s.passed);                   // të gjithë?
[...students].sort((a, b) => a.grade - b.grade); // ⚠️ sort MUTON → kopjo!
Object.entries(obj); Object.keys(obj); Object.fromEntries(pairs);
[...new Set(array)];                             // hiq dublikatat
```

**Në projekt:** `core/statistics.js` (zero cikle `for`), `core/utils.js:118`

---

## 3 · Klasa

```js
class Person {
  #id;                            // FUSHË PRIVATE (vetëm brenda klasës)

  constructor({ id, name, age }) { // destructuring i objektit
    this.#id = id;
    this.name = name;
    this.age = age;
  }

  get id() { return this.#id; }    // GETTER: person.id (pa kllapa!)
  set nickname(v) { this._nick = v; }

  describe() { return `${this.name}, ${this.age} vjeç`; }

  toJSON() {                       // JSON.stringify e thërret VETË
    return { id: this.#id, name: this.name, age: this.age };
  }
}

class Student extends Person {
  constructor({ name, age, grade }) {
    super({ name, age });          // ⚠️ I PARI, para `this`
    this.grade = grade;
  }

  get passed() { return this.grade >= 2; }

  describe() {                     // OVERRIDE
    return `${super.describe()} — nota ${this.grade}`;  // ripërdor prindin
  }

  static fromJSON(raw) { return new Student(raw); }     // FACTORY
}

student instanceof Student;  // true
student instanceof Person;   // true
```

### ⚠️ Kurthi #1 i localStorage

```js
localStorage.setItem("s", JSON.stringify(student));
const back = JSON.parse(localStorage.getItem("s"));
back.passed;              // undefined!  — objekt i thjeshtë, pa getters
back.describe();          // TypeError!
Student.fromJSON(back).passed;   // ✅ ringjallur si klasë
```

**Në projekt:** `models/Student.js`, `services/storage.js:106`

---

## 4 · Module

```js
// export me emër (i preferuar)
export const PI = 3.14;
export function sum(a, b) { return a + b; }
export class Student {}

// import
import { sum, PI } from "./utils.js";        // ⚠️ .js i DETYRUESHËM
import { sum as add } from "./utils.js";     // riemërtim
import * as utils from "./utils.js";         // namespace
import Student from "./Student.js";          // default (rrallë në këtë projekt)

// re-export ("barrel file")
export { Person } from "./Person.js";
export { Student } from "./Student.js";

// import dinamik → kthen Promise, ngarkon vetëm kur duhet
const { showTab } = await import("./ui/tabs.js");
```

```html
<script type="module" src="js/main.js"></script>
<!-- module → defer automatik + strict mode + scope i vetin -->
<!-- ⚠️ kërkon server: Live Server, JO file:// -->
```

**Në projekt:** `models/index.js`, `main.js:118`

---

## 5 · Asinkron: tre stile

```js
/* ─── 1) CALLBACK (i vjetër) ─── */
fetchData((error, data) => {
  if (error) { handle(error); return; }   // gabimi = argumenti i PARË
  use(data);
});

/* ─── 2) PROMISE ─── */
fetchData()
  .then(data => transform(data))          // kthimi kalon te .then tjetër
  .then(result => use(result))
  .catch(error => handle(error))          // kap gabimin e ÇDO hapi
  .finally(() => hideSpinner());          // gjithmonë

// Krijimi i një Promise (= "promisifikim")
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* ─── 3) ASYNC / AWAIT (i preferuar) ─── */
async function load() {
  try {
    const data = await fetchData();       // lexohet si sinkron
    return transform(data);
  } catch (error) {
    handle(error);                        // i njëjti catch si për sinkron
  } finally {
    hideSpinner();
  }
}
// ⚠️ funksioni `async` kthen GJITHMONË një Promise
```

### Konkurrenca

```js
// 🐢 njëra pas tjetrës: 3 × 700ms = 2100ms
for (const url of urls) results.push(await fetch(url));

// 🐇 njëkohësisht: 700ms
const results = await Promise.all(urls.map(u => fetch(u)));

Promise.all(ps)         // një dështon → i gjithë dështon
Promise.allSettled(ps)  // pret të gjitha: [{status:"fulfilled"|"rejected"}]
Promise.race(ps)        // i pari që PËRFUNDON (sukses ose gabim)
Promise.any(ps)         // i pari që SUKSESON
```

**Në projekt:** `services/mockApi.js` (tre stilet), `services/api.js:120`

---

## 6 · Fetch

```js
async function request(url, { timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    // ⚠️⚠️ RRESHTI MË I HARRUAR: fetch NUK hedh gabim për 404/500!
    if (!response.ok) throw new ApiError(`Gabim ${response.status}`);

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw new ApiError("Timeout");
    throw new ApiError("Offline ose CORS");     // TypeError → rrjeti
  } finally {
    clearTimeout(timer);                        // pa këtë → rrjedhje
  }
}

// POST
await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

**Në projekt:** `services/api.js:24`

---

## 7 · Gabimet & JSON

```js
class AppError extends Error {
  constructor(message, { cause = null } = {}) {
    super(message);
    this.name = "AppError";      // pa këtë → "Error" për të gjithë
    this.cause = cause;
  }
}
class ValidationError extends AppError { /* + this.fields */ }

// `instanceof` vendos SI reagojmë
try { save(); }
catch (error) {
  if (error instanceof ValidationError) markFields(error.fields);
  else if (error instanceof ApiError) toast("Provo sërish");
  else throw error;              // nuk e njohim → e lëmë të kalojë lart
}

// JSON
JSON.stringify(obj);           // → tekst (thërret toJSON() nëse ekziston)
JSON.stringify(obj, null, 2);  // i lexueshëm, me indentim
JSON.parse(text);              // → objekt (HEDH SyntaxError për tekst të thyer)

// Gjithmonë me try/catch
try { data = JSON.parse(text); } catch { data = fallback; }
```

**Në projekt:** `core/errors.js`, `services/storage.js:60`

---

## 8 · Event loop

```
┌───────────────────────────────────────────────────────────┐
│ 1. CALL STACK      kodi sinkron — deri në fund, pa pauzë   │
│ 2. MICROTASKS      .then, await, queueMicrotask            │
│                    → radha zbrazet E TËRA                  │
│ 3. MACROTASKS      setTimeout, setInterval, eventët        │
│                    → VETËM NJË, pastaj kthehu te #2        │
└───────────────────────────────────────────────────────────┘
```

```js
console.log("1");                              // sinkron
setTimeout(() => console.log("4"), 0);         // macrotask — i FUNDIT
Promise.resolve().then(() => console.log("3")); // microtask
console.log("2");                              // sinkron
// Dalja: 1 · 2 · 3 · 4
```

- `setTimeout(fn, 0)` ≠ "tani" — është "pas gjithçkaje sinkrone dhe pas microtask-eve"
- `while (…) {}` bllokon **gjithçka**: animacionet, klikimet, timer-at
- `requestAnimationFrame` = "para vizatimit të radhës" (~60/sek)

**Në projekt:** `ui/labs/eventLoopLab.js`, `app/render.js:55`

---

## 9 · DOM

```js
// Zgjedhja
document.querySelector("#id");
[...document.querySelectorAll(".klasa")];   // → varg i vërtetë

// Krijimi — i sigurt
const li = document.createElement("li");
li.textContent = userInput;                 // ✅ trajtohet si TEKST
li.innerHTML = userInput;                   // ❌ XSS!

// <template> + cloneNode (Java 9)
const node = template.content.firstElementChild.cloneNode(true);  // true = i thellë
node.querySelector('[data-slot="name"]').textContent = student.name;

// DocumentFragment: 100 rreshta → 1 reflow
const fragment = document.createDocumentFragment();
for (const s of students) fragment.append(buildRow(s));
list.append(fragment);

// DELEGIM: një listener për të gjithë butonat (edhe të ardhshmit)
list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  handle(button.dataset.action, button.closest(".student").dataset.id);
});

// Formularët
form.addEventListener("submit", (event) => {
  event.preventDefault();                   // pa këtë → faqja rifreskohet!
  const values = Object.fromEntries(new FormData(form).entries());
});

// dataset ↔ data-*
element.dataset.id;         // <li data-id="…">
element.hidden = true;      // atribut nativ, më i pastër se style.display
element.classList.toggle("aktiv", condition);
```

### Regex

```js
/^\p{L}[\p{L}\s'-]{1,49}$/u   // shkronja të ÇDO alfabeti (ë, ç ✓). /u = i detyrueshëm
/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i   // email "sa duhet"
/^\d+$/                        // vetëm numra të plotë
/^(?:\+383|0)4[3-9]\d{6}$/     // numër telefoni kosovar

pattern.test(text);            // → true / false
text.match(pattern);           // → varg ose null
text.replace(/x/g, "y");       // g = të gjitha
```

**Në projekt:** `ui/dom.js`, `ui/studentList.js`, `core/validation.js:20`

---

## 10 · Storage & Web APIs

```js
// localStorage — mbijeton mbylljen e shfletuesit
localStorage.setItem("key", JSON.stringify(data));
JSON.parse(localStorage.getItem("key") ?? "null");
localStorage.removeItem("key");

// sessionStorage — vetëm sa jeton tab-i (ideal për gjendje UI)
sessionStorage.setItem("activeTab", "panel");

// ⚠️ mund të HEDHIN gabim: dritare private, kuota (~5MB) e mbushur
try { localStorage.setItem(k, v); } catch { /* kalo në memorie */ }

// Eventi `storage` shkrepet në TABS-AT E TJERA (jo në atë që shkroi)
window.addEventListener("storage", (event) => sync(event.key));

// Geolocation — API me callback → mbështille në Promise
const getPosition = () => new Promise((resolve, reject) =>
  navigator.geolocation.getCurrentPosition(
    (pos) => resolve(pos.coords),
    (err) => reject(new Error(err.message)),
    { timeout: 10000, enableHighAccuracy: true }
  )
);

// Notifications — kërko lejen VETËM pas klikimit
if (await Notification.requestPermission() === "granted") {
  new Notification("Titulli", { body: "Teksti" });
}

// Shkarkim skedari (Blob + Object URL)
const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
Object.assign(document.createElement("a"), { href: url, download: "f.json" }).click();
URL.revokeObjectURL(url);                   // pa këtë → rrjedhje memorie

// Lexim skedari
const text = await new Promise((res, rej) => {
  const reader = new FileReader();
  reader.onload = () => res(reader.result);
  reader.onerror = () => rej(new Error("Dështoi"));
  reader.readAsText(file);
});
```

> **⚠️ Secure context:** Geolocation, Notifications dhe Clipboard punojnë
> **vetëm** në `http://localhost` ose `https://` — nuk punojnë në `file://`.

**Në projekt:** `services/storage.js`, `services/geolocation.js`, `ui/importExport.js`

---

## 11 · Modelet e arkitekturës

```js
/* OBSERVER / PUB-SUB — bërthama e Redux, Vue, Zustand */
function createStore(initial = {}) {
  let state = { ...initial };               // privat falë closure-it
  const listeners = new Set();

  const getState = () => Object.freeze({ ...state });
  const setState = (patch) => {
    state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
    listeners.forEach(fn => fn(getState()));
  };
  const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

  return { getState, setState, subscribe };
}

/* IMMUTABILITY — kurrë mos muto, gjithmonë krijo të re */
students.push(s);                    // ❌ nuk e vë re asnjë abonent
setState(p => ({ students: [s, ...p.students] }));   // ✅

/* DEPENDENCY INJECTION — merri varësitë, mos i importo */
const createActions = (store) => ({ /* … */ });   // ✅ e testueshme

/* FACTORY */
const createLogPanel = (selector) => ({ line, clear, group });
```

**Rregulli i shtresave:** varësitë vetëm nga poshtë-lart.

```
data  →  core  →  services  →  ui  →  app
(core nuk e njeh ui · ui nuk vendos · vetëm app vendos)
```

**Në projekt:** `core/store.js`, `app/actions.js`, `README.md`

---

## 12 · Debug në DevTools (F12)

| Vegël | Përdorimi |
|---|---|
| `debugger;` | breakpoint direkt në kod |
| **Sources → klik në numrin e rreshtit** | breakpoint |
| **Call Stack** | kush e thirri këtë funksion |
| **Scope** | vlerat e variablave në atë moment |
| **Watch** | ndiq një shprehje |
| `console.table(array)` | vargje objektesh në tabelë |
| `console.group()` / `groupEnd()` | grupim i log-eve |
| `console.time("x")` / `timeEnd("x")` | matje kohe |
| `console.trace()` | nga ku erdhi thirrja |
| **Network → Offline / Slow 3G** | testo trajtimin e gabimeve |
| **Application → Local Storage** | shiko/fshij të dhënat |
| **Elements → Event Listeners** | sa listener-a ka vërtet |

```js
// Në këtë projekt, në Console:
akademia.store.getState()
akademia.actions.seed()
akademia.store.getState().students[0].describe()
```

---

## 🧯 Dhjetë gabimet më të shpeshta

| # | Gabimi | Rregullimi |
|---|---|---|
| 1 | `fetch` nuk hyn në `catch` për 404 | kontrollo `if (!response.ok) throw …` |
| 2 | Objekti nga `localStorage` pa metoda | `Student.fromJSON(raw)` |
| 3 | Formulari rifreskon faqen | `event.preventDefault()` |
| 4 | `await` në `for` — shumë i ngadalshëm | `Promise.all(items.map(…))` |
| 5 | `sort()` ndryshoi vargun origjinal | `[...array].sort(…)` |
| 6 | `import` nuk punon | Live Server + `.js` në fund të path-it |
| 7 | Listener-at rriten pas çdo rivizatimi | delegim në prind |
| 8 | `this` është `undefined` | arrow function, ose `.bind(this)` |
| 9 | `Object.freeze` nuk mbrojti vargun | freeze është "shallow" |
| 10 | `input.value` është tekst, jo numër | `Number(value)` |

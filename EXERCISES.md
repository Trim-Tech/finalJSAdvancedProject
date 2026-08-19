# 📝 Detyra & Ushtrime

**JavaScript Advanced · 7Scantech Academy**
Të gjitha detyrat punohen **brenda këtij projekti**. Kështu studenti nuk shkruan
"kod ushtrimi" që hidhet, por rritet një aplikacion i vërtetë — javë pas javë.

**Vështirësia:** 🟢 e lehtë (10–20 min) · 🟡 e mesme (30–45 min) · 🔴 sfidë (1 h+)

**Si dorëzohet:** ZIP i folderit + screenshot i rezultatit. Emri i skedarit:
`emri-mbiemri-java-XX.zip`

---

## Muaji 1 · Koncepte të thelluara

### Java 1 — ES6+, template literals, destructuring

**1.1** 🟢 Hapni `js/core/utils.js`. Shkruani `initialsOf(fullName)` që kthen
inicialet (`"Ardit Krasniqi"` → `"AK"`) duke përdorur **vetëm** arrow function,
`split`, `map` dhe template literals. Krahasojeni me getter-in `initials` në
`models/Person.js`.

**1.2** 🟢 Në `js/data/seed.js` shtoni 4 studentë të rinj. Përdorni
**destructuring** për t'i lexuar në një `console.log` në formatin:
`"Ardit Krasniqi (21) — Frontend"`.

**1.3** 🟡 Rishkruani këtë funksion të vjetër në ES6+ (arrow, destructuring,
template literals, default params). Vendosni versionin tuaj në `utils.js`:

```js
function describeStudent(student) {
  var name = student.name;
  var grade = student.grade;
  if (grade === undefined) { grade = 1; }
  return "Studenti " + name + " ka noten " + grade;
}
```

**1.4** 🔴 `js/config.js` përdor objekte për grupim. Shtoni një objekt të re
`SCHOOL = { name, city, year }` dhe shfaqni `"7Scantech · Prishtinë · 2026"`
në `footer` — duke prekur vetëm `config.js` dhe një rresht në `main.js`.

> **Detyrë shtëpie (syllabus):** rishkruani një funksion me sintaksë arrow. ✅ 1.3

---

### Java 2 — Funksione të avancuara & HOF

**2.1** 🟢 Në `js/core/statistics.js` shtoni `worstStudent(students)` —
kundërshtari i `topStudent`. Përdorni `reduce`. Shfaqeni në një kartë të re
statistikash në panel.

**2.2** 🟡 Shtoni `gradeSpread(students)` që kthen `{ min, max, diff }`
me **një** `reduce` (pa `Math.min(...arr)`).

**2.3** 🟡 Shkruani `throttle(fn, ms)` në `utils.js` — kushëriri i `debounce`.
`debounce` pret qetësinë; `throttle` lejon maksimumi një thirrje për `ms`.
Shpjegoni në koment kur përdoret secili.

**2.4** 🟡 `sum(...numbers)` përdor rest. Shkruani `average(...numbers)` që
ripërdor `sum` (jo kod të kopjuar) dhe kthen `0` për zero argumente.

**2.5** 🔴 Shtoni `pipe(...fns)` në `utils.js`: `pipe(a, b, c)(x) === c(b(a(x)))`.
Pastaj rishkruani zinxhirin në `core/selectors.js` me `pipe`.

> **Mini-projekt (syllabus): Expense Tracker.** Kopjoni këtë projekt në një folder
> të re dhe zëvendësoni `Student` me `Expense { title, amount, category, date }`.
> Ruani `store.js`, `validation.js`, `storage.js` — do të shihni sa pak duhet
> ndryshuar. Kjo është vlera e arkitekturës.

---

### Java 3 — Objekte, `this`, klasa

**3.1** 🟢 Në `models/Student.js` shtoni getter-in `ageGroup`:
`< 18` → `"I mitur"`, `18–25` → `"I ri"`, `> 25` → `"I rritur"`.
Shfaqeni në rreshtin e studentit (`ui/studentList.js` + një `data-slot` në HTML).

**3.2** 🟡 Krijoni `js/models/Teacher.js` — `class Teacher extends Person` me
`subject`, `yearsOfExperience` dhe metodën `describe()` që thërret
`super.describe()`. Shtojeni në barrel-in `models/index.js`.

**3.3** 🟡 Shtoni metodën statike `Student.fromCsvLine("Ana Ana,20,4,Frontend")`
që kthen një `Student`. Trajtoni rreshtat e gabuar me `throw`.

**3.4** 🟡 Në `Person.js` shtoni fushën private `#createdBy` dhe getter-in
`createdBy`. Provoni në Console `person.#createdBy` — shpjegoni gabimin.

**3.5** 🔴 Shtoni `Student.prototype.compareTo(other)` që kthen `-1 | 0 | 1`
sipas notës, pastaj moshës, pastaj emrit. Përdorni atë brenda
`Student.comparator("smart")`.

> **Detyrë shtëpie (syllabus):** klasa `Car` + projekt me klasën `Student`. ✅ 3.2, 3.3

---

### Java 4 — Module & debugging

**4.1** 🟢 Krijoni `js/core/index.js` si barrel për të gjithë `core/`.
Përditësoni **një** import në `main.js` për t'a përdorur.

**4.2** 🟡 Zhvendosni `escapeHtml`, `normalize` dhe `titleCase` nga `utils.js`
në një modul të re `js/core/text.js`. Rregulloni të gjithë importet.
*(Këshillë: kërkoni në VS Code me `Ctrl+Shift+F`.)*

**4.3** 🟡 **Ushtrim debug-imi.** Vendosni breakpoint në `app/actions.js`,
funksioni `addStudent`. Shtoni një student dhe shkruani përgjigjet:
- Sa thirrje ka **Call Stack**?
- Çka ka `input` në **Scope**?
- Cili rresht ekzekutohet pas `setState`?

**4.4** 🟡 Përdorni `console.table(akademia.store.getState().students)`,
`console.group()`, `console.time()`. Shtoni një `console.table` të dobishme
në `app/render.js` (pastaj komentojeni).

**4.5** 🔴 `main.js` ka një `import()` **dinamik** (`await import(...)`).
Gjejeni, shpjegoni pse është dinamik dhe konvertoni `ui/lessonMap.js`
në import dinamik që ngarkohet vetëm kur hapet tab-i.

---

### Java 4 (Dita 2) — 🧪 Quiz 1: Sintaksa e avancuar

Përgjigjet gjenden në kod — kërkojini.

1. Çfarë shtyp `console.log(typeof (() => {}))`?
2. Pse `const student = {}` lejon `student.name = "x"`?
3. Ç'ndryshim ka `[...array]` nga `array`?
4. Në `sortBy(items, valueFn, direction = "asc")` — çka ndodh me `sortBy(a, f, null)`?
5. Pse `Object.freeze()` në `store.js` nuk mbron `state.students.push()`?
   *(Përgjigje: freeze është "shallow". Sfidë: si t'a rregulloni?)*
6. Çka kthen `Student.comparator("grade-desc")` — një numër apo një funksion?
7. Pse `models/index.js` nuk përmban asnjë klasë?
8. Ç'ndryshim ka `??` nga `||`? Gjeni një `??` në projekt dhe shpjegojeni.
9. Çka bën `groups[key] ??= []`?
10. Pse `#id` nuk shfaqet në `JSON.stringify(student)` pa `toJSON()`?

---

## Muaji 2 · JavaScript asinkron

### Java 5 — Callbacks & Promises

**5.1** 🟢 Në `services/mockApi.js` shtoni `fetchCoursesCallback(callback)` që
kthen `COURSES` pas 500ms, me konventën `(error, data)`.

**5.2** 🟡 Shkruani versionin Promise të tij, `fetchCoursesPromise()`,
**pa** e kopjuar logjikën — mbështillni funksionin me callback.
Kjo është *promisifikimi*.

**5.3** 🟡 Shtoni një buton të pestë në Laboratori që demonstron
**callback hell**: tri kërkesa të varura me callback-e të mbivendosura.
Pastaj shtoni versionin me `async/await` pranë. Krahasoni rreshtat.

**5.4** 🔴 `ui/modal.js` kthen Promise. Shtoni `promptDialog({ title, label })`
që kthen `Promise<string|null>` dhe përdoreni për të riemërtuar një student.

> **Hands-on (syllabus): thirrje API e simuluar me setTimeout.** ✅ 5.1, 5.2

---

### Java 6 — async/await & Fetch

**6.1** 🟢 Në `services/api.js` shtoni `fetchOneStudent()` që merr **një**
person nga randomuser.me dhe kthen një `Student`.

**6.2** 🟡 Shtoni një buton «🎲 Një student i rastësishëm» që e përdor.
Trajtoni gjendjen `disabled` + `finally` si në `app/quickActions.js`.

**6.3** 🟡 Ndryshoni `API.timeoutMs` në `50` dhe klikoni «Importo nga API».
Përshkruani çka ndodh dhe **cili rresht** e kap gabimin.
Rikthejeni në `8000`.

**6.4** 🔴 Shtoni `services/weatherApi.js` që merr motin e Prishtinës nga
[open-meteo.com](https://open-meteo.com) (pa çelës):
`https://api.open-meteo.com/v1/forecast?latitude=42.66&longitude=21.17&current=temperature_2m`
Shfaqeni temperaturën në topbar pranë citatit. Përdorni `request()` ekzistues.

> **Mini-projekt (syllabus): Weather App.** ✅ 6.4 është bërthama e tij.
> **Detyrë shtëpie:** marrja e të dhënave nga një API publik me Fetch. ✅ 6.1

---

### Java 7 — Error handling & JSON

**7.1** 🟢 Në `core/errors.js` shtoni `class DuplicateError extends AppError`.
Hedhini nga `actions.addMany()` kur **të gjithë** studentët janë dublikatë,
dhe kapeni në `quickActions.js` me mesazh të veçantë.

**7.2** 🟡 Shtoni një rregull të re validimi: **email unik**.
Nëse email-i ekziston → `ValidationError` me fushën `email`.
*(Këshillë: `validation.js` nuk e njeh listën e studentëve — mendoni ku duhet të jetojë kjo kontrollë.)*

**7.3** 🟡 Krijoni një skedar `test.json` të thyer me dorë (fshini një `}`).
Provoni t'a importoni. Pse merret mesazhi "nuk është JSON i vlefshëm"
dhe **nuk** rrëzohet aplikacioni? Gjeni dy `try` të mbivendosur.

**7.4** 🔴 Shtoni versionim në eksport: `{ schemaVersion: 2, ... }`.
Shkruani në `actions.importFromJson` një *migrim* që lexon edhe skedarët e
vjetër pa `schemaVersion` (ku `grade` ishte 1–10) dhe i konverton në 1–5.

---

### Java 8 — Event loop & konkurrenca

**8.1** 🟢 Parashikoni rendin e daljes **para** se t'a ekzekutoni, pastaj
provojeni në Laboratori:
```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
queueMicrotask(() => console.log("D"));
console.log("E");
```
Shkruani rendin dhe **pse**.

**8.2** 🟡 Në `ui/labs/eventLoopLab.js` shtoni një demo për `Promise.race`:
dy `sleep()` me kohë të ndryshme — kush "fiton".

**8.3** 🟡 Shtoni `Promise.any` dhe krahasojeni me `race`:
çka ndodh kur i pari **dështon**?

**8.4** 🟡 Në `services/api.js` `loadRemoteBundle` përdor `allSettled`.
Rishkruajeni me `Promise.all` dhe shpjegoni pse UI-ja bëhet **më e keqe**.
Pastaj kthejeni.

**8.5** 🔴 Shkruani `mapLimit(items, limit, asyncFn)` në `core/utils.js` —
ekzekuton maks. `limit` kërkesa njëkohësisht. Përdoreni për të importuar 20
studentë me maksimum 3 kërkesa paralele.

---

### Java 8 (Dita 2) — 🧪 Quiz 2: Async JavaScript

1. Çka kthen një funksion `async` që bën `return 5`?
2. `await` brenda `for` — pse është i ngadalshëm? Cila funksion në
   `mockApi.js` e provon?
3. Pse `fetch("url-i-gabuar")` **nuk** hyn në `catch` për status 404?
   Cili rresht në `api.js` e rregullon?
4. Ç'ndryshim ka `Promise.all` nga `Promise.allSettled`?
5. Për çka shërben `AbortController`?
6. Pse `finally` në `request()` është i domosdoshëm?
7. Në `try { await x() } catch (e) {}` — çka kapet: gabime sinkrone,
   asinkrone, apo të dyja?
8. Pse `setTimeout(fn, 0)` nuk ekzekutohet menjëherë?
9. Ç'bën `requestAnimationFrame` në `app/render.js` dhe pse nuk është `setTimeout`?
10. Shkruani `sleep(ms)` nga kujtesa.

---

## Muaji 3 · JS në shfletues & projekte

### Java 9 — DOM i avancuar & formularë

**9.1** 🟢 Shtoni një fushë `phone` në formular: HTML + `data-error` +
rregull në `RULES` + fushë në `Student`. Regex për numra kosovarë:
`/^(?:\+383|0)4[3-9]\d{6}$/`

**9.2** 🟡 Në `index.html` shtoni `<template id="courseCardTemplate">` dhe
rishkruani `renderCourseBreakdown` në `ui/stats.js` me `fromTemplate` +
`fillSlots` në vend të `el()`.

**9.3** 🟡 Shtoni butonin «📋 Kopjo» në secilin rresht studenti që kopjon
`student.describe()` në clipboard (`navigator.clipboard.writeText`).
Përdorni **delegim** — pa `addEventListener` të re.

**9.4** 🟡 **Ushtrim XSS.** Shtoni një student me emër
`<img src=x onerror="alert(1)">`. Pse nuk ndodh gjë?
Pastaj ndryshoni përkohësisht `fillSlots` nga `textContent` në `innerHTML`
dhe provoni sërish. **Rikthejeni.** Shkruani çka mësuat.

**9.5** 🔴 Shtoni renditje me *drag & drop* në listë (`draggable="true"`,
eventët `dragstart`/`dragover`/`drop`) dhe ruani rendin manual në state.

> **Hands-on (syllabus): Login/Register mock app.** Ripërdorni `validation.js`,
> `form.js` dhe `storage.js` — mjafton të zëvendësoni fushat.
> **Detyrë shtëpie:** validim formulari me regex. ✅ 9.1

---

### Java 10 — Storage & Web APIs

**10.1** 🟢 Ruani gjerësinë e panelit majtas në `localStorage` dhe kthejeni
pas refresh-it.

**10.2** 🟡 Shtoni butonin «🗄 Arkivo» që zhvendos një student në një çelës
tjetër `sm.archive` dhe një tab të vogël për t'i shfaqur.

**10.3** 🟡 Shtoni `services/clipboard.js` dhe eksportoni të gjithë listën
si CSV në clipboard.

**10.4** 🟡 Në `webApiLab.js` shtoni Battery Status API dhe
`navigator.language`, `screen.width`, `devicePixelRatio`.

**10.5** 🔴 Shtoni një **çelës të IndexedDB** (ose `localStorage` me 500
studentë) dhe krahasoni kohën e ruajtjes me `console.time`.
Kur bëhet `localStorage` problem?

> **Mini-projekt (syllabus): Geolocation + Leaflet.**
> `services/geolocation.js` ju jep koordinatat. Shtoni Leaflet nga CDN
> (si Chart.js në `index.html`) dhe vendosni një pin në lokacionin e studentit.
> **Rregull:** i gjithë kodi i Leaflet-it **vetëm** në `js/charts/map.js` —
> ashtu si Chart.js jeton vetëm në `gradeCharts.js`.

---

### Java 11 — Biblioteka & modularizim

**11.1** 🟢 Shtoni një grafik të tretë: numri i studentëve **sipas kursit**
(`type: "bar"`, horizontal me `indexAxis: "y"`). Vetëm në `gradeCharts.js`.

**11.2** 🟡 Nxirrni `GRADE_COLORS` nga `gradeCharts.js` në `config.js` dhe
lexojini nga CSS custom properties me `getComputedStyle`.

**11.3** 🟡 Bëni `store.js` të ruajë **historinë** e 10 gjendjeve të fundit
dhe shtoni `undo()` / `redo()` të plotë (jo vetëm për fshirje).

**11.4** 🟡 Zëvendësoni Chart.js me një bibliotekë tjetër (ApexCharts /
Frappe Charts). **Kufizim:** mund të prekni **vetëm**
`js/charts/gradeCharts.js` dhe `<script>` në `index.html`.
Nëse ia dilni — arkitektura punon. Nëse ju duhet të prekni skedarë të tjerë,
gjeni **pse** dhe rregullojeni.

**11.5** 🔴 Ndani `ui/labs/` në një aplikacion të veçantë që importon
`core/` dhe `services/` nga këtu (pa kopjuar kod).

> **Hands-on (syllabus): modularizim i Weather App.** Ndani projektin tuaj të
> Javës 6 në `config / services / ui / app` — pikërisht si këtu.

---

### Java 12 — Përsëritje & 🧪 Quiz 3

**Quiz 3** mbulon Javët 1–11. 10 pyetje nga quiz-et 1 & 2 + 10 të reja
mbi arkitekturën:

1. Pse `core/` nuk importon kurrë nga `ui/`?
2. Ku ndryshohen të dhënat — dhe **vetëm** ku?
3. Çka do thyhej nëse `ui/studentList.js` do bënte `state.students.push(x)`?
4. Pse `selectVisibleStudents` nuk ruhet në state?
5. Cilat tri gjëra bën `app/render.js` që `ui/*` nuk mund t'i bëjë?
6. Pse `createActions(store)` merr `store` si argument?
7. Cila skedar e njeh fjalën `Chart` — dhe pse vetëm ai?
8. Pse `services/storage.js` ka `memory` si rezervë?
9. Ku do t'a shtonit "fshij shumë studentë njëherësh" dhe pse?
10. Vizatoni diagramin e rrjedhës së të dhënave nga kujtesa.

---

## 🏁 Projekti Final

**Kohë:** 1 javë · **Prezantim:** 10 min + 5 min pyetje

Zgjedhni **një**. Të tre kërkojnë të njëjtat aftësi — zgjedhja është e temës,
jo e vështirësisë.

### Opsioni A · 📊 Menaxher i Bibliotekës
Libra me `title`, `author`, `isbn`, `year`, `status` (i lirë / i huazuar).
- `class Book extends Item`, huazim me datë kthimi
- Kërkim nga [Open Library API](https://openlibrary.org/dev/docs/api/search) me ISBN
- Grafik: libra sipas dekadës
- Njoftim kur afati i kthimit skadon

### Opsioni B · 🌤 Weather Dashboard
- Kërkim qyteti + Geolocation për lokacionin aktual
- [open-meteo.com](https://open-meteo.com) — pa çelës API
- Parashikim 7-ditor në grafik vijë
- Qytetet e ruajtura në `localStorage`, i fundit i hapur në `sessionStorage`
- Trajtim i qytetit që nuk ekziston, i offline-it, i timeout-it

### Opsioni C · 💸 Expense Tracker
- `class Expense`, kategori, buxhet mujor
- Grafik doughnut sipas kategorisë + vijë sipas ditës
- Eksport CSV + import JSON
- Alarm kur kalohet buxheti (Notification API)

---

### 📋 Rubrika e vlerësimit (100 pikë)

| Kriteri | Pikë | Çka kërkohet |
|---|:---:|---|
| **Module & strukturë** | 20 | Të paktën 6 module me përgjegjësi të ndarë. `main.js` vetëm bootstrap. Zero logjikë në HTML. |
| **Klasa & ES6+** | 15 | Të paktën një klasë me `extends`, getter, metodë statike. Arrow, destructuring, spread në përdorim natyral. |
| **Async & Fetch** | 20 | `async/await` mbi një API të vërtetë. `response.ok` i kontrolluar. Gjendje loading. `Promise.all` ose `allSettled` ku ka kuptim. |
| **Trajtim gabimesh** | 15 | `try/catch/finally`. Të paktën një klasë gabimi e vetja. Aplikacioni **nuk** rrëzohet offline. |
| **DOM & formularë** | 15 | `<template>` ose `createElement` (jo `innerHTML` me të dhëna përdoruesi). Validim me regex. Delegim eventesh. |
| **Storage** | 5 | `localStorage` për të dhëna, `sessionStorage` për UI. Rezistent ndaj JSON të thyer. |
| **Prezantim** | 10 | Shpjegim i arkitekturës. Një demo live. Një gabim që u rregullua dhe si. |

**Bonus (+10):** temë e errët · aksesueshmëri (`aria-*`, tastierë) ·
shkurtesa tastiere · animacione · `README.md` i vetja.

**Zbritje:** `alert()` në kod prodhimi (−5) · logjikë biznesi brenda
`ui/` (−5) · `var` (−5) · kod i kopjuar pa kuptim (−20).

---

## ✅ Lista e vetëkontrollit para dorëzimit

- [ ] Hapet me Live Server pa gabime në Console
- [ ] Punon edhe **offline** (provoni: DevTools → Network → Offline)
- [ ] Të dhënat mbijetojnë `F5`
- [ ] Formulari nuk pranon të dhëna të pavlefshme
- [ ] Zero `alert()`, zero `var`, zero `console.log` të harruar
- [ ] Nuk ka skedar mbi 200 rreshta pa arsye
- [ ] `README.md` shpjegon si t'a hapësh dhe çka bën
- [ ] Emrat e variablave në anglisht, komentet ku duhet
- [ ] Provuar në dy shfletues
- [ ] Provuar në ekran të vogël (DevTools → Responsive)

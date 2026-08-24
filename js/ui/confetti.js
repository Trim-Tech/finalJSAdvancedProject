/* ============================================================================
 * ui/confetti.js  —  Konfeti, pa asnjë bibliotekë
 * MËSIMI: Java 8 (requestAnimationFrame & event loop) + Java 9 (DOM) +
 *         Java 10 (matchMedia — respektimi i preferencave të përdoruesit)
 *
 * PSE PA BIBLIOTEKË? Sepse i gjithë efekti është 60 rreshta, dhe një
 * bibliotekë konfeti peshon më shumë se e gjithë `core/` bashkë. Rregull i
 * mirë: mos shto varësi për diçka që e kupton plotësisht.
 *
 * MËSIMI I FSHEHUR — pse `requestAnimationFrame` dhe jo `setInterval(16)`:
 *   • rAF sinkronizohet me rifreskimin e ekranit → zero "kërcime"
 *   • rAF NDALON kur tab-i është në sfond → nuk harxhon bateri
 *   • setInterval-i i akumulon detyrat nëse faqja ngec (provoje "🥶 Blloko 1.5s")
 * ==========================================================================*/

/** Ngjyrat ndjekin identitetin e aplikacionit: blu, cyan, ar. */
const COLORS = ["#2f81ff", "#38e8ff", "#7c5cff", "#ffd166", "#ffffff", "#00d18f"];

const GRAVITY = 0.16;
const DRAG = 0.992;
const LIFE_MS = 2600;

let layer = null;

/** Krijon (njëherë) shtresën ku fluturon konfeti. */
function getLayer() {
  if (layer?.isConnected) return layer;
  layer = document.createElement("div");
  layer.className = "confetti-layer";
  // `aria-hidden` → lexuesit e ekranit e injorojnë. Dekori nuk lexohet me zë.
  layer.setAttribute("aria-hidden", "true");
  document.body.append(layer);
  return layer;
}

/** A ka kërkuar përdoruesi më pak animacion? Atëherë nuk ka konfeti. Pikë. */
const reducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/**
 * @param {{ count?: number, x?: number, y?: number, power?: number }} options
 *        `x` / `y` janë 0–1 (pjesë e ekranit), jo pikselë — kështu efekti
 *        është i njëjtë në telefon dhe në monitor 4K.
 */
export function burst({ count = 90, x = 0.5, y = 0.35, power = 13 } = {}) {
  if (reducedMotion()) return;

  const stage = getLayer();
  const originX = window.innerWidth * x;
  const originY = window.innerHeight * y;

  /* Të gjitha grimcat jetojnë në NJË varg dhe vizatohen nga NJË rAF.
     90 timer-a të veçantë do ta gjunjëzonin faqen. */
  const pieces = Array.from({ length: count }, () => {
    const node = document.createElement("i");
    node.className = "confetti-piece";
    node.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    node.style.width = `${6 + Math.random() * 6}px`;
    node.style.height = `${8 + Math.random() * 8}px`;
    stage.append(node);

    const angle = Math.random() * Math.PI * 2;
    const speed = power * (0.35 + Math.random() * 0.9);

    return {
      node,
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4, // "-4" = një shtytje fillestare lart
      spin: (Math.random() - 0.5) * 24,
      angle: Math.random() * 360,
    };
  });

  const startedAt = performance.now();

  const frame = (now) => {
    const elapsed = now - startedAt;
    const fade = 1 - elapsed / LIFE_MS;

    for (const piece of pieces) {
      piece.vy += GRAVITY;
      piece.vx *= DRAG;
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.angle += piece.spin;

      // `transform` (jo `top`/`left`) → animacion në GPU, pa rillogaritje layout-i.
      piece.node.style.transform =
        `translate3d(${piece.x}px, ${piece.y}px, 0) rotate(${piece.angle}deg)`;
      piece.node.style.opacity = String(Math.max(fade, 0));
    }

    if (elapsed < LIFE_MS) {
      requestAnimationFrame(frame);
    } else {
      // PASTRIMI: pa këtë, 90 nyje mbeten në DOM pas çdo festimi.
      for (const piece of pieces) piece.node.remove();
      if (stage.childElementCount === 0) stage.remove();
    }
  };

  requestAnimationFrame(frame);
}

/** Festë e vogël, e lidhur me një element konkret në ekran. */
export function burstFrom(element, options = {}) {
  if (!element?.getBoundingClientRect) return burst(options);

  const box = element.getBoundingClientRect();
  burst({
    count: 55,
    power: 10,
    x: (box.left + box.width / 2) / window.innerWidth,
    y: (box.top + box.height / 2) / window.innerHeight,
    ...options,
  });
}

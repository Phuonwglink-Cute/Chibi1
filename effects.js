export function initEffects() {
  const layer = document.getElementById("effects-layer");
  if (!layer) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counts = reducedMotion
    ? { sparkles: 10, petals: 6, hearts: 4, orbs: 2 }
    : { sparkles: 24, petals: 12, hearts: 8, orbs: 4 };

  const spawn = (cls, count, opts = {}) => {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = cls;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.animationDelay = `${Math.random() * (opts.delayMax ?? 10)}s`;
      el.style.animationDuration = `${(opts.durationMin ?? 4) + Math.random() * (opts.durationRange ?? 6)}s`;

      if (opts.sizeMin != null) {
        const size = opts.sizeMin + Math.random() * (opts.sizeRange ?? 4);
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
      }

      if (opts.opacityMin != null) {
        const opacity = opts.opacityMin + Math.random() * (opts.opacityRange ?? 0.5);
        el.style.opacity = String(opacity);
      }

      layer.appendChild(el);
    }
  };

  spawn("sparkle", counts.sparkles, {
    sizeMin: 2,
    sizeRange: 3,
    durationMin: 3,
    durationRange: 5,
    delayMax: 7,
    opacityMin: 0.45,
    opacityRange: 0.45
  });

  spawn("petal", counts.petals, {
    sizeMin: 12,
    sizeRange: 8,
    durationMin: 10,
    durationRange: 8,
    delayMax: 10,
    opacityMin: 0.35,
    opacityRange: 0.4
  });

  spawn("heart", counts.hearts, {
    sizeMin: 10,
    sizeRange: 6,
    durationMin: 12,
    durationRange: 8,
    delayMax: 12,
    opacityMin: 0.28,
    opacityRange: 0.32
  });

  spawn("orb", counts.orbs, {
    sizeMin: 36,
    sizeRange: 18,
    durationMin: 16,
    durationRange: 12,
    delayMax: 12,
    opacityMin: 0.12,
    opacityRange: 0.12
  });

  spawnChibiRunners(layer, reducedMotion ? 2 : 4);
}


function spawnChibiRunners(layer, count) {
  const palettes = [
    { body: "#ffe9f4", blush: "#ff9fcf", accent: "#ff74b8" },
    { body: "#fff4fb", blush: "#ffc1dd", accent: "#c27cff" },
    { body: "#fef1f8", blush: "#ffb1d9", accent: "#ff8dc2" }
  ];

  for (let i = 0; i < count; i++) {
    const palette = palettes[i % palettes.length];
    const el = document.createElement("span");
    el.className = "chibi-runner";
    el.style.setProperty("--top", `${18 + Math.random() * 62}%`);
    el.style.setProperty("--dur", `${16 + Math.random() * 10}s`);
    el.style.setProperty("--delay", `${Math.random() * 8}s`);
    el.style.setProperty("--scale", `${0.72 + Math.random() * 0.3}`);
    el.innerHTML = `
      <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
        <ellipse cx="37" cy="26" rx="10" ry="23" fill="${palette.body}" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
        <ellipse cx="83" cy="26" rx="10" ry="23" fill="${palette.body}" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
        <circle cx="60" cy="58" r="30" fill="${palette.body}" stroke="rgba(255,255,255,.72)" stroke-width="2"/>
        <ellipse cx="60" cy="79" rx="24" ry="18" fill="rgba(255,255,255,.72)" />
        <circle cx="48" cy="56" r="5" fill="#47324f"/>
        <circle cx="72" cy="56" r="5" fill="#47324f"/>
        <circle cx="45" cy="60" r="3.5" fill="${palette.blush}" opacity=".95"/>
        <circle cx="75" cy="60" r="3.5" fill="${palette.blush}" opacity=".95"/>
        <path d="M54 66c4 4 8 4 12 0" stroke="#47324f" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M36 84c7-8 41-8 48 0" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round" fill="none" opacity=".85"/>
        <circle cx="60" cy="90" r="9" fill="${palette.accent}" opacity=".18"/>
      </svg>
    `;
    layer.appendChild(el);
  }
}


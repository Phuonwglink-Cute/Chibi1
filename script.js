import { PROFILE, GALLERY, SVG_ICONS } from "./config.js";
import { initMusic } from "./music.js";
import { initEffects } from "./effects.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function iconMarkup(name) {
  const path = SVG_ICONS[name];
  return path
    ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"></path></svg>`
    : "";
}

function bindProfile() {
  $$("[data-bind='name']").forEach((el) => (el.textContent = PROFILE.name));
  $$("[data-bind='title']").forEach((el) => (el.textContent = PROFILE.title));
  $$("[data-bind='subtitle']").forEach((el) => (el.textContent = PROFILE.subtitle));
  $$("[data-bind='about']").forEach((el) => (el.textContent = PROFILE.about));
  $$("[data-bind='footer']").forEach((el) => (el.textContent = PROFILE.footer));

  const chips = $("#chip-row");
  if (chips) {
    chips.innerHTML = "";
    PROFILE.chips.forEach((chip) => {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = chip;
      chips.appendChild(span);
    });
  }

  const socials = $("#social-row");
  if (socials) {
    socials.innerHTML = "";
    PROFILE.socials.forEach((social) => {
      const a = document.createElement("a");
      a.className = "social-btn glass";
      a.href = social.href;
      a.setAttribute("aria-label", social.label);
      a.innerHTML = `
        <span class="social-icon">${iconMarkup(social.icon)}</span>
        <span class="social-copy">
          <strong>${social.label}</strong>
          <small>${social.sub}</small>
        </span>
      `;
      socials.appendChild(a);
    });
  }

  const highlights = $("#highlights");
  if (highlights) {
    highlights.innerHTML = "";
    PROFILE.highlights.forEach((item) => {
      const card = document.createElement("article");
      card.className = "mini-card glass reveal";
      card.innerHTML = `
        <div class="mini-icon">${item.icon}</div>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      `;
      highlights.appendChild(card);
    });
  }
}

function buildGallery() {
  const grid = $("#gallery-grid");
  if (!grid) return;

  grid.innerHTML = "";
  GALLERY.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gallery-card glass reveal";
    btn.dataset.index = String(index);
    btn.setAttribute("aria-label", `Mở ảnh ${String(index + 1).padStart(2, "0")}`);
    btn.innerHTML = `
      <span class="album-frame" aria-hidden="true"></span>
      <img class="gallery-photo" src="${item.src}" alt="${item.title}" loading="lazy">
      <span class="gallery-tag">${String(index + 1).padStart(2, "0")}</span>
      <span class="gallery-overlay">${item.title}</span>
    `;
    btn.addEventListener("click", () => openLightbox(index));
    grid.appendChild(btn);
  });
}

let lightboxIndex = 0;

function openLightbox(index) {
  lightboxIndex = index;
  const lightbox = $("#lightbox");
  const img = $("#lightbox-image");
  const title = $("#lightbox-title");
  if (!lightbox || !img || !title) return;

  const item = GALLERY[lightboxIndex];
  img.src = item.src;
  img.alt = item.title;
  title.textContent = item.title;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  const lightbox = $("#lightbox");
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function stepLightbox(delta) {
  lightboxIndex = (lightboxIndex + delta + GALLERY.length) % GALLERY.length;
  const item = GALLERY[lightboxIndex];
  const img = $("#lightbox-image");
  const title = $("#lightbox-title");
  if (img) img.src = item.src;
  if (title) title.textContent = item.title;
}

function setupLightbox() {
  const lightbox = $("#lightbox");
  const prev = $("#lightbox-prev");
  const next = $("#lightbox-next");
  const close = $("#lightbox-close");
  if (!lightbox || !prev || !next || !close) return;

  prev.addEventListener("click", () => stepLightbox(-1));
  next.addEventListener("click", () => stepLightbox(1));
  close.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  let startX = 0;
  const img = $("#lightbox-image");
  if (img) {
    img.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    img.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        diff < 0 ? stepLightbox(1) : stepLightbox(-1);
      }
    }, { passive: true });
  }
}

function setupReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  els.forEach((el) => io.observe(el));
}

function setupNav() {
  const drawer = $("#mobileDrawer");
  const menuBtn = $("#menuBtn");
  const closeBtn = $("#closeMenu");

  const closeDrawer = () => {
    if (!drawer || !menuBtn) return;
    drawer.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
  };

  const openDrawer = () => {
    if (!drawer || !menuBtn) return;
    drawer.classList.add("is-open");
    document.body.classList.add("menu-open");
    menuBtn.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
  };

  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", () => {
      drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  $$(".nav a, .drawer-nav a, .brand").forEach((a) => {
    a.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  document.addEventListener("click", (e) => {
    if (!drawer || !drawer.classList.contains("is-open")) return;
    const panel = $(".drawer-panel");
    if (panel && !panel.contains(e.target) && e.target !== menuBtn) {
      closeDrawer();
    }
  });
}

function setupBackTop() {
  const btn = $("#backTop");
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle("is-visible", window.scrollY > 600);
  };
  toggle();

  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", toggle, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  bindProfile();
  buildGallery();
  setupLightbox();
  setupReveal();
  setupNav();
  setupBackTop();
  initMusic();
  initEffects();
});

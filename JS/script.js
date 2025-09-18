"use strict";

/* ===========================
   Barra de progreso (scroll)
   =========================== */
(function () {
  const progress = document.getElementById("progress");
  function onScroll() {
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    const scrolled = total > 0 ? h.scrollTop / total : 0;
    if (progress) progress.style.width = scrolled * 100 + "%";
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ===========================
   Reveal on view (IO)
   =========================== */
(function () {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    els.forEach((el) => io.observe(el));
})();

/* ===========================
   Cursor suave + CSS vars
   =========================== */
(function () {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  let cx = 0, cy = 0, tx = 0, ty = 0;
  const lerp = (a, b, n) => a + (b - a) * n;

  function raf() {
    cx = lerp(cx, tx, 0.18);
    cy = lerp(cy, ty, 0.18);
    cursor.style.transform = `translate(${cx - 7}px, ${cy - 7}px)`;
    requestAnimationFrame(raf);
  }

  window.addEventListener("pointermove",(e) => {
    tx = e.clientX;
    ty = e.clientY;
    const root = document.documentElement;
    root.style.setProperty("--mx", e.clientX + "px");
    root.style.setProperty("--my", e.clientY + "px");
  },{ passive: true });
  requestAnimationFrame(raf);
})();

/* ===========================
   Parallax fondo del HERO
   =========================== */
(function () {
  const bg = document.getElementById("bg");
  if (!bg) return;

  window.addEventListener("pointermove",(e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    bg.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
  },{ passive: true });
})();

/* ===========================
   Efecto "magnetic"
   =========================== */
(function () {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });
})();

/* ===========================
   Mouse coords locales (tilt/hover)
   =========================== */
(function () {
  document.querySelectorAll(".skill, .proj .thumb, .work-tile").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });
})();

/* ===========================
   Tilt cards
   =========================== */
(function () {
  document.querySelectorAll(".tilt").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "rotateY(0) rotateX(0)";
    });
  });
})();

/* ===========================
   Split de H1 (animación letras)
   =========================== */
(function () {
  const el = document.querySelector("[data-split]");
  if (!el) return;

  const raw = (el.textContent || "").trim().replace(/\s+/g, " ");
  el.setAttribute("aria-label", raw);

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const words = raw.split(" ");
  let i = 0;

  const html = words.map((w, wi) => {
      const letters = Array.from(w).map((ch) => {
        const out = `<span class="char" style="display:inline-block;transform:translateY(30px);opacity:0;transition:transform .6s ${i*12}ms, opacity .6s ${i*12}ms">${esc(ch)}</span>`;
        i++;
        return out;
      }).join("");
      i++;
      return `<span class="word" style="white-space:nowrap;display:inline-block">${letters}</span>${wi < words.length - 1 ? " " : ""}`;
    }).join("");

  el.innerHTML = html;

  requestAnimationFrame(() => {
    el.querySelectorAll(".char").forEach((s) => {
      s.style.transform = "translateY(0)";
      s.style.opacity = "1";
    });
  });
})();

/* ===========================
   Accesibilidad: focus al saltar con #
   =========================== */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        setTimeout(() => target.removeAttribute("tabindex"), 500);
      }
    });
  });
})();

/* ===========================
   Modal genérico (si hubiera .proj)
   =========================== */
(function () {
  const pills = document.querySelectorAll(".pill");
  const projs = document.querySelectorAll(".proj");

  function setFilter(tag) {
    pills.forEach((p) =>
      p.setAttribute("aria-pressed", p.dataset.filter === tag ? "true" : "false")
    );
    projs.forEach((card) => {
      if (tag === "all") {
        card.style.display = "block";
        return;
      }
      const tags = (card.dataset.tags || "").toLowerCase();
      card.style.display = tags.includes(tag.toLowerCase()) ? "block" : "none";
    });
  }
  if (pills.length) {
    pills.forEach((p) => p.addEventListener("click", () => setFilter(p.dataset.filter)));
    setFilter("all");
  }

  const modal = document.getElementById("modal");
  if (!modal) return;

  const mTitle = document.getElementById("mTitle");
  const mHero = document.getElementById("mHero");
  const mDesc = document.getElementById("mDesc");
  const mLink = document.getElementById("mLink");
  const mClose = document.getElementById("mClose");

  function openModal(card) {
    mTitle.textContent = card.dataset.title || "Proyecto";
    mDesc.textContent = card.dataset.desc || "";
    mLink.href = card.dataset.link || "#";

    const thumb = card.querySelector(".thumb");
    const cs = thumb ? getComputedStyle(thumb) : null;
    const bgImg = cs ? cs.backgroundImage : "none";
    const bgCol = cs ? cs.backgroundColor : "#141414";

    mHero.style.backgroundColor = bgCol || "#141414";
    mHero.style.backgroundImage = bgImg && bgImg !== "none" ? bgImg : "none";

    modal.classList.add("open");
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (!modal.hasAttribute("hidden")) modal.setAttribute("hidden", "");
  }

  projs.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keypress", (e) => { if (e.key === "Enter") openModal(card); });
  });

  if (mClose) mClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
})();

/* ===========================
   Tester tipográfico (Prolexia)
   =========================== */
(function () {
  const specimen = document.getElementById("specimen");
  if (!specimen) return;

  const fontSel = document.getElementById("fontSel");
  const size = document.getElementById("size");
  const track = document.getElementById("track");
  const leading = document.getElementById("leading");
  const sval = document.getElementById("sval");
  const tval = document.getElementById("tval");
  const lval = document.getElementById("lval");

  function applyType() {
    specimen.style.fontFamily = fontSel ? fontSel.value : specimen.style.fontFamily;
    specimen.style.fontWeight = 400;
    specimen.style.fontSize = (size ? size.value : 64) + "px";
    specimen.style.letterSpacing = (track ? track.value : 0) + "px";
    specimen.style.lineHeight = leading ? leading.value : 1.15;

    if (sval && size) sval.textContent = size.value;
    if (tval && track) tval.textContent = track.value;
    if (lval && leading) lval.textContent = leading.value;
  }

  [fontSel, size, track, leading].forEach((el) => el && el.addEventListener("input", applyType));
  applyType();

  document.querySelectorAll(".swatches button").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.scheme === "light") {
        document.documentElement.style.setProperty("--bg", "#f6f6f6");
        document.documentElement.style.setProperty("--fg", "#111");
      } else {
        document.documentElement.style.setProperty("--bg", "#0b0b0b");
        document.documentElement.style.setProperty("--fg", "#eaeaea");
      }
      document.body.style.background = "var(--bg)";
      document.body.style.color = "var(--fg)";
    });
  });
})();

/* ===========================
   Menú hamburguesa
   =========================== */
(function () {
  function wireMenu() {
    const btn = document.querySelector(".nav-toggle");
    const menu =
      document.getElementById("siteMenu") ||
      document.querySelector(".nav .menu") ||
      document.querySelector(".menu");

    if (!btn || !menu) return false;
    if (btn.dataset.wired) return true;

    const closeBtn = menu.querySelector(".nav-close");

    const openMenu = () => {
      menu.classList.add("open");
      menu.removeAttribute("hidden");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Cerrar menú");
      document.body.classList.add("menu-open");
      const first = menu.querySelector("a");
      if (first) first.focus();
    };

    const closeMenu = () => {
      menu.classList.remove("open");
      menu.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Abrir menú");
      document.body.classList.remove("menu-open");
    };

    const toggleMenu = () => (menu.classList.contains("open") ? closeMenu() : openMenu());

    btn.addEventListener("click", toggleMenu);
    if (closeBtn) closeBtn.addEventListener("click", (e) => { e.stopPropagation(); closeMenu(); });

    // Cierra al hacer click dentro (links)
    menu.addEventListener("click", closeMenu);

    // ESC para cerrar
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

    // Si pasa a desktop, cerramos
    const mq = window.matchMedia("(min-width: 961px)");
    const mqHandler = (e) => { if (e.matches) closeMenu(); };
    if (mq.addEventListener) mq.addEventListener("change", mqHandler);
    else if (mq.addListener) mq.addListener(mqHandler);

    btn.dataset.wired = "1";
    return true;
  }

  if (!wireMenu()) {
    const mo = new MutationObserver(() => { if (wireMenu()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener("DOMContentLoaded", wireMenu, { once: true });
    window.addEventListener("load", wireMenu, { once: true });
  }
})();

/* ===================================================
   HUB de trabajos + detalles (index) / listado (works)
   =================================================== */
(function () {
  const hub = document.getElementById("workHub");
  const details = document.querySelectorAll(".work-detail");

  // Detectar works.html
  const isWorksPage =
    document.body.classList.contains("page-works") ||
    /works(\.html)?$/i.test(location.pathname) ||
    (!hub && details.length > 0);

  if (isWorksPage) {
    // Abrir todos los bloques y garantizar visibilidad
    details.forEach((d) => {
      d.classList.add("open", "fluid");
      d.removeAttribute("hidden");
      d.setAttribute("aria-hidden", "false");
      const setH = () => d.style.setProperty("--detail-h", Math.max(d.scrollHeight, 0) + "px");
      setH();

      d.querySelectorAll("img, video").forEach((m) => {
        if (m.tagName === "IMG" && m.complete) return;
        m.addEventListener("load", setH, { once: true });
        if (m.tagName === "VIDEO") m.addEventListener("loadedmetadata", setH, { once: true });
      });

      if ("ResizeObserver" in window) {
        const ro = new ResizeObserver(setH);
        ro.observe(d);
        d._ro = ro;
      }
    });
    return;
  }

  // ======= MODO HUB (index.html) =======
  if (!hub) return;

  const groups = Array.from(hub.querySelectorAll(".work-group"));
  const TRANSITION_MS = 480;

  const openPanel = (panel) => {
    panel.hidden = false;
    requestAnimationFrame(() => {
      panel.style.pointerEvents = "auto";
      panel.style.opacity = "1";
      panel.style.maxHeight = panel.scrollHeight + "px";
    });
  };

  const closePanel = (panel) => {
    panel.style.opacity = "0";
    panel.style.maxHeight = "0px";
    panel.style.pointerEvents = "none";
    setTimeout(() => { panel.hidden = true; }, TRANSITION_MS);
  };

  const closeAllGroups = (except = null) => {
    groups.forEach((g) => {
      if (g !== except && g.classList.contains("open")) {
        const b = g.querySelector(".work-tile");
        const p = g.querySelector(".submenu");
        g.classList.remove("open");
        if (b) b.setAttribute("aria-expanded", "false");
        if (p) closePanel(p);
      }
    });
  };

  groups.forEach((group) => {
    const btn = group.querySelector(".work-tile");
    const panel = group.querySelector(".submenu");
    if (!btn || !panel) return;

    panel.hidden = true;
    panel.style.maxHeight = "0px";
    panel.style.opacity = "0";
    panel.style.pointerEvents = "none";
    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = group.classList.contains("open");
      if (isOpen) {
        group.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        closePanel(panel);
      } else {
        closeAllGroups(group);
        group.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        openPanel(panel);
      }
    });

    group._closeGroup = () => {
      if (group.classList.contains("open")) {
        group.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        closePanel(panel);
      }
    };
  });

  const closeDetails = (except = null) => {
    details.forEach((d) => {
      if (d !== except) {
        d.classList.remove("open");
        d.style.setProperty("--detail-h", "0px");
        d.setAttribute("aria-hidden", "true");
        if (d._ro) {
          try { d._ro.disconnect(); } catch (_) {}
          d._ro = null;
        }
      }
    });
  };

  function openOrToggleDetail(link) {
    const id = link.dataset.target;
    if (!id) return;
    const detail = document.getElementById("detail-" + id);
    if (!detail) return;

    const group = link.closest(".work-group");
    const submenu = group ? group.querySelector(".submenu") : null;

    if (submenu && detail.previousElementSibling !== submenu) {
      submenu.insertAdjacentElement("afterend", detail);
    }

    if (detail.classList.contains("open")) {
      detail.classList.remove("open");
      detail.style.setProperty("--detail-h", "0px");
      detail.setAttribute("aria-hidden", "true");
      if (detail._ro) { try { detail._ro.disconnect(); } catch (_) {} detail._ro = null; }
      if (group && group._closeGroup) group._closeGroup();
      return;
    }

    closeDetails(detail);
    detail.classList.add("open");
    detail.removeAttribute("hidden");
    detail.setAttribute("aria-hidden", "false");

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => {
        detail.style.setProperty("--detail-h", (detail.scrollHeight || 0) + "px");
      });
      ro.observe(detail);
      detail._ro = ro;
    }

    requestAnimationFrame(() => {
      detail.style.setProperty("--detail-h", (detail.scrollHeight || 0) + "px");
      detail.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    detail.querySelectorAll("img").forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", () => {
        detail.style.setProperty("--detail-h", detail.scrollHeight + "px");
      }, { once: true });
    });
  }

  hub.querySelectorAll('.subitem[data-target]').forEach((link) => {
    link.addEventListener("click", (e) => { e.preventDefault(); openOrToggleDetail(link); });
  });

  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDetails(); });
})();

/* =========================================
   Header fijo + shrink + compensación de alto
   ========================================= */
(function () {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const ROOT = document.documentElement;
  const BODY = document.body;
  const SHRINK_AT = 80; // px

  if (!BODY.classList.contains("has-fixed-header")) BODY.classList.add("has-fixed-header");

  function measureHeader() {
    const h = header.offsetHeight || 72;
    ROOT.style.setProperty("--header-h", h + "px");
  }

  let small = false, stuck = false;
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;

    if (y > 2 && !stuck) { header.classList.add("is-stuck"); stuck = true; }
    else if (y <= 2 && stuck) { header.classList.remove("is-stuck"); stuck = false; }

    if (BODY.classList.contains("menu-open")) return;

    if (y > SHRINK_AT && !small) { header.classList.add("shrink"); small = true; measureHeader(); }
    else if (y <= SHRINK_AT && small) { header.classList.remove("shrink"); small = false; measureHeader(); }
  }

  const ro = ("ResizeObserver" in window) ? new ResizeObserver(measureHeader) : null;
  if (ro) ro.observe(header);

  new MutationObserver(measureHeader).observe(header, { attributes: true, attributeFilter: ["class","style"] });

  window.addEventListener("resize", measureHeader);
  window.addEventListener("orientationchange", measureHeader);
  document.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener("load", () => { measureHeader(); onScroll(); }, { once: true });
})();

/* =========================================
   Carrusel Drag & Snap (sin botones)
   ========================================= */
(function () {
  const carousels = document.querySelectorAll(".snap-carousel");
  carousels.forEach(initSnapCarousel);

  function initSnapCarousel(root){
    const track = root.querySelector(".snap-track");
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let velocity = 0;
    let lastX = 0;
    let lastT = 0;
    let rafId = 0;

    const friction = 0.94;   // inercia
    const vClamp   = 70;     // límite velocidad px/frame aprox.

    const onPointerDown = (e) => {
      isDown = true;
      track.classList.add("dragging");
      startX = e.clientX;
      startScroll = track.scrollLeft;
      velocity = 0;
      lastX = e.clientX;
      lastT = performance.now();
      cancelMomentum();
      track.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      track.scrollLeft = startScroll - dx;

      // medir velocidad
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const dist = e.clientX - lastX;
        velocity = -dist / (dt / 16.67); // px por frame (~60fps)
        lastX = e.clientX;
        lastT = now;
      }
      e.preventDefault();
    };

    const onPointerUp = (e) => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove("dragging");
      track.releasePointerCapture(e.pointerId);
      startMomentum(velocity);
    };

    track.addEventListener("pointerdown", onPointerDown, { passive:false });
    track.addEventListener("pointermove", onPointerMove, { passive:false });
    window.addEventListener("pointerup", onPointerUp);

    function momentum() {
      track.scrollLeft += velocity;
      velocity *= friction;
      if (Math.abs(velocity) > 0.5) {
        rafId = requestAnimationFrame(momentum);
      } else {
        snapToNearest();
      }
    }
    function startMomentum(v) {
      velocity = Math.max(-vClamp, Math.min(vClamp, v));
      rafId = requestAnimationFrame(momentum);
    }
    function cancelMomentum() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }
    function snapToNearest() {
      const w = track.clientWidth; // cada slide ocupa 100% del viewport
      const i = Math.round(track.scrollLeft / w);
      track.scrollTo({ left: i * w, behavior: "smooth" });
    }

    // Si se cambia el tamaño, re-encaja
    window.addEventListener("resize", () => {
      // esperar al reflow y ajustar
      setTimeout(() => {
        const w = track.clientWidth;
        const i = Math.round(track.scrollLeft / w);
        track.scrollLeft = i * w;
      }, 60);
    });
  }
})();


// /* ===============================
//    PROLEXIA — Visualizador de glifos
// ==================================*/
// (function(){
//   const root     = document.querySelector('#prolexia-glyphs');
//   if(!root) return;

//   // --- Datos de glifos (puedes añadir/ordenar a gusto)
//   const glyphs = [
//     ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
//     ..."abcdefghijklmnopqrstuvwxyz",
//     ..."0123456789",
//     ..."ÁÉÍÓÚÜÑÇÀÈÌÒÙÂÊÎÔÛÃÕÄËÏÖÜŸÐÞ",
//     ..."áéíóúüñçàèìòùâêîôûãõäëïöüÿðþß",
//     ..."¿?¡!&@#%*()[]{}<>/\\|=+—–-·•…",
//   ];

//   // --- Elementos
//   const grid      = root.querySelector('#glyphGrid');
//   const weightTabs= root.querySelectorAll('.weight-tab');
//   const fontSel   = root.querySelector('#fontSelect');
//   const bigInput  = root.querySelector('#largeGlyph');
//   const sizeRange = root.querySelector('#sizeRange');
//   const sizeOut   = root.querySelector('#sizeOut');

//   // --- Render grid
//   grid.innerHTML = glyphs.map(ch=> `<button class="glyph-cell" type="button" aria-label="${ch}">${ch}</button>`).join('');

//   // --- Estado
//   let currentWght = 300;
//   let currentFont = fontSel.value;

//   // --- Helpers
//   const applyTypography = ()=>{
//     root.style.setProperty('--wght', currentWght);
//     [grid, bigInput].forEach(el=>{
//       el.style.fontFamily = `"${currentFont}", system-ui, -apple-system, Segoe UI, Arial, sans-serif`;
//       el.style.fontVariationSettings = `"wght" ${currentWght}`;
//       el.style.fontWeight = currentWght; // fallback
//     });
//   };

//   // --- Eventos
//   grid.addEventListener('click', e=>{
//     const btn = e.target.closest('.glyph-cell');
//     if(!btn) return;
//     bigInput.value = btn.textContent;
//   });

//   weightTabs.forEach(tab=>{
//     tab.addEventListener('click', ()=>{
//       weightTabs.forEach(t=>t.classList.remove('active'));
//       tab.classList.add('active');
//       currentWght = +tab.dataset.wght || 400;
//       applyTypography();
//     });
//   });

//   fontSel.addEventListener('change', ()=>{
//     currentFont = fontSel.value;
//     applyTypography();
//   });

//   sizeRange.addEventListener('input', ()=>{
//     const v = +sizeRange.value;
//     bigInput.style.fontSize = v + 'px';
//     sizeOut.textContent = v;
//   });

//   // Permite teclear directamente
//   bigInput.addEventListener('input', ()=>{
//     // nada extra; mantenemos el valor tecleado
//   });

//   // --- Init
//   applyTypography();
// })();


(() => {
  // ====== 1) Conjunto de glifos ======
  const A_Z  = Array.from({length:26}, (_,i)=>String.fromCharCode(65+i));
  const a_z  = Array.from({length:26}, (_,i)=>String.fromCharCode(97+i));
  const nums = Array.from({length:10}, (_,i)=>String(i));

  const acentosMay = ['Á','É','Í','Ó','Ú','Ü','Ñ','Ç','À','È','Ì','Ò','Ù','Â','Ê','Î','Ô','Û','Ã','Õ','Ä','Ë','Ï','Ö','Ÿ'];
  const acentosMin = ['á','é','í','ó','ú','ü','ñ','ç','à','è','ì','ò','ù','â','ê','î','ô','û','ã','õ','ä','ë','ï','ö','ÿ'];
  const signos     = ['.',',',';','‧',':','…','!','¡','?','¿','-','–','—','_','/','\\','(',')','[',']','{','}','«','»',
                      '\'','"','@','#','$','%','&','*','+','=','<','>','^','~','|'];

  // Puedes recortar/ampliar esta lista si quieres:
  const GLYPHS = [...A_Z, ...a_z, ...nums, ...acentosMay, ...acentosMin, ...signos];

  // ====== 2) Referencias ======
  const grid     = document.getElementById('glyphGrid');
  const largeInp = document.getElementById('largeGlyph');
  const sizeRng  = document.getElementById('sizeRange');
  const sizeOut  = document.getElementById('sizeOut');

  if (!grid || !largeInp || !sizeRng || !sizeOut) {
    console.warn('[Prolexia Glyphs] Faltan nodos esperados en el DOM.');
    return;
  }

  // ====== 3) Render del grid ======
  grid.setAttribute('role','grid');
  grid.innerHTML = ''; // limpia

  const frag = document.createDocumentFragment();
  GLYPHS.forEach((ch, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'glyph-key';
    btn.textContent = ch;
    btn.dataset.ch = ch;
    btn.setAttribute('aria-label', `Glifo ${ch}`);
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('role','gridcell');
    frag.appendChild(btn);
  });
  grid.appendChild(frag);

  // ====== 4) Interacciones ======
  // Click en un glifo -> lo muestra en grande
  grid.addEventListener('click', (e) => {
    const key = e.target.closest('.glyph-key');
    if (!key) return;
    largeInp.value = key.dataset.ch || key.textContent;
    largeInp.focus();
  });

  // Tecla Enter/Espacio sobre un glifo enfocado -> selecciona
  grid.addEventListener('keydown', (e) => {
    const key = e.target.closest('.glyph-key');
    if (!key) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      key.click();
    }
  });

  // Cambiar tamaño con el slider
  const applySize = (val) => {
    largeInp.style.fontSize = `${val}px`;
    sizeOut.textContent = val;
  };
  applySize(sizeRng.value);
  sizeRng.addEventListener('input', (e) => applySize(e.target.value));

  // Al escribir en el visor grande, se ve al momento (sin recortar)
  largeInp.addEventListener('input', () => {
    // Nada que hacer: el propio input renderiza lo tecleado
    // Si prefieres mantener SOLO el último carácter, descomenta:
    // largeInp.value = (largeInp.value.slice(-1) || 'A');
  });

  // ====== 5) Ajustes visuales por si no tienes CSS aplicado ======
  // Puedes quitar este bloque si ya estilizas en tu CSS global.
  const ensureBaseStyles = () => {
    const id = 'glyphs-inline-base';
    if (document.getElementById(id)) return;
    const css = `
      #prolexia-glyphs .glyph-grid{
        display:grid;gap:.5rem;
        grid-template-columns:repeat(auto-fill,minmax(42px,1fr));
      }
      #prolexia-glyphs .glyph-key{
        display:inline-grid;place-items:center;
        height:42px;border-radius:12px;border:1px solid rgba(255,255,255,.12);
        background:rgba(255,255,255,.04); color:#eaeaea; cursor:pointer;
        transition:transform .12s ease, border-color .12s ease, box-shadow .12s ease;
        font: 600 16px/1 var(--font-prolexia, inherit);
      }
      #prolexia-glyphs .glyph-key:focus{ outline:2px solid rgba(102,255,204,.6); outline-offset:2px; }
      #prolexia-glyphs .large-glyph-wrap{
        margin-top: clamp(28px,6vh,60px);
        display:grid;gap:1rem;justify-items:center;
      }
      #prolexia-glyphs #largeGlyph{
        width: min(90%, 900px); text-align:center; background:transparent;
        border:1px dashed rgba(255,255,255,.15); border-radius:16px;
        color:#fff; padding:1.25rem 1rem; font: 700 160px/1 var(--font-prolexia, inherit);
      }
      #prolexia-glyphs .large-controls{
        display:flex;align-items:center;gap:.6rem; color:#cfcfcf;
      }
      #prolexia-glyphs input[type="range"]{ width:min(720px, 86vw); }
    `;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  };
  ensureBaseStyles();
})();
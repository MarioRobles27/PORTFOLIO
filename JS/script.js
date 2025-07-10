// ———— 1. GSAP plugins ———— //
gsap.registerPlugin(ScrollTrigger, CSSRulePlugin, Flip);

// ———— 2. Utilidades y helpers ———— //

// SplitText utility solo para los selectores correctos (NO year-text)
function splitText(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    const text = el.textContent;
    el.innerHTML = "";
    text.split("").forEach(char => {
      const span = document.createElement("span");
      span.classList.add("reveal-char");
      span.textContent = char === " " ? "\u00A0" : char;
      el.appendChild(span);
    });
  });
}

// ———— 3. Animación nativa de scroll (no GSAP) ———— //

// Utilidad para detectar visibilidad
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
    rect.bottom >= 0
  );
}

function handleScrollAnimation() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach(el => {
    if (isElementInViewport(el)) {
      el.classList.add('visible');
    } else {
      // Si quieres resetear el efecto al salir del viewport, descomenta:
      // el.classList.remove('visible');
    }
  });
}

// ———— 4. Animaciones y listeners ———— //
document.addEventListener("DOMContentLoaded", function() {

  // Split solo textos puros, NO year-text
  splitText(".line1");
  splitText(".line2");
  splitText(".nombre");
  splitText(".profesion");

  // Animación POP letras
  gsap.fromTo(".reveal-char",
    { y: 50, opacity: 0, scale: 0.3 },
    {
      y: 0, opacity: 1, scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.05,
      scrollTrigger: {
        trigger: ".main-header h1",
        start: "top 75%",
        toggleActions: "restart none none none",
        immediateRender: false,
      }
    }
  );

  // Animación números de año
  gsap.fromTo(".year-text",
    { scale: 0, opacity: 0, rotate: -20 },
    {
      scale: 1,
      opacity: 1,
      rotate: 0,
      ease: "elastic.out(1, 0.5)",
      stagger: 0.15,
      scrollTrigger: {
        trigger: ".main-header h1",
        start: "top 75%",
        toggleActions: "restart none none none",
        immediateRender: false,
      }
    }
  );

  // Animación Nombre y Profesión
  gsap.fromTo(".subtitle p",
    { y: 60, scale: 0.9, opacity: 0, filter: "blur(6px)" },
    {
      y: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      ease: "power4.out",
      stagger: 0.25,
      scrollTrigger: {
        trigger: ".header-content",
        start: "top 75%",
        toggleActions: "restart none none none",
        immediateRender: false,
      }
    }
  );

  // 🔽 Scroll al portfolio desde el círculo
  const circle = document.querySelector('.contenedor-circulo');
  if (circle) {
    circle.addEventListener('click', function () {
      document.querySelector('.portfolio-container').scrollIntoView({
        behavior: 'smooth'
      });
    });
  }

  // 🔽 Menú toggle (simulado)
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      alert('Menú de navegación se abrirá aquí');
    });
  }

  // ———— FLIP SCROLL ANIMATION (dejas igual) ———— //
  let flipCtx;
  function createFlipTimeline() {
    if (flipCtx) flipCtx.revert();

    flipCtx = gsap.context(() => {
      const initialText = document.querySelector(".anim-initial .anim-text");
      const secondText  = document.querySelector(".anim-second  .anim-text");
      const thirdText   = document.querySelector(".anim-third   .anim-text");

      const secondState = Flip.getState(".anim-second .anim-marker");
      const thirdState  = Flip.getState(".anim-third  .anim-marker");
      const cfg = { ease: "none", duration: 1 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".anim-initial",
          start: "top center",
          endTrigger: ".anim-final",
          end: "top center",
          scrub: 1
        }
      });

      tl.to(initialText, { opacity: 1, duration: 0.5 })
        .add(Flip.fit(".anim-box", secondState, cfg))
        .to(initialText, { opacity: 0, duration: 0.3 }, "<")
        .to(secondText,  { opacity: 1, duration: 0.5 }, "<")
        .add(Flip.fit(".anim-box", thirdState, cfg), "+=0.5")
        .to(secondText, { opacity: 0, duration: 0.3 }, "<")
        .to(thirdText,  { opacity: 1, duration: 0.5 }, "<");
    });
  }
  createFlipTimeline();
  window.addEventListener("resize", createFlipTimeline);

  // ———— ANIMACIÓN ON SCROLL para bloques nativos (ejemplo: header-content) ———— //
  handleScrollAnimation(); // Por si el header ya es visible al cargar

});

// Siempre escucha el scroll (y resize por si acaso)
window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('resize', handleScrollAnimation);

// ———— Debug sólo si lo necesitas ———— //
console.log("GSAP loaded?", typeof gsap !== "undefined");
console.log("ScrollTrigger loaded?", typeof ScrollTrigger !== "undefined");

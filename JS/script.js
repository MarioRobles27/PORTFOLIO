// 🔌 Registro de plugins GSAP
gsap.registerPlugin(ScrollTrigger, CSSRulePlugin);

// Hover: acelera y escala ligeramente
document.querySelectorAll(".section-title").forEach(title => {
  title.addEventListener("mouseenter", () => {
    gsap.to(estrellaRule, {
      cssRule: {
        scale: 1.2,
        rotation: "+=30"
      },
      duration: 0.6,
      ease: "power2.out"
    });
  });
  title.addEventListener("mouseleave", () => {
    gsap.to(estrellaRule, {
      cssRule: {
        scale: 1,
        rotation: "+=0"
      },
      duration: 0.6,
      ease: "power2.inOut"
    });
  });
});

// 🔽 Scroll al portfolio desde el círculo
const circle = document.querySelector('.contenedor-circulo');
if (circle) {
  circle.addEventListener('click', function () {
    document.querySelector('.portfolio-container').scrollIntoView({
      behavior: 'smooth'
    });
  });
}

// 🔽 Menú toggle
const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
  menuToggle.addEventListener('click', function () {
    alert('Menú de navegación se abrirá aquí');
  });
}

// 🔠 Función para dividir letras
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

// 🧩 Divide en letras
splitText(".line1");
splitText(".line2");
splitText(".nombre");
splitText(".profesion");

// ✨ ANIMACIÓN “POP & BOUNCE” por letra (corregida)
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
      toggleActions: "play none none reverse",
      immediateRender: false,
      // markers: true  // descomenta para debug
    }
  }
);

// 🧨 ANIMACIÓN de letras (reveal-scroll interactivo)
// gsap.to(".reveal-char", {
//   scrollTrigger: {
//     trigger: ".header-content",
//     start: "top 80%",
//     end: "top 30%",
//     scrub: true
//   },
//   opacity: 1,
//   y: 0,
//   duration: 1,
//   ease: "power3.out",
//   stagger: {
//     each: 0.04,
//     from: "start"
//   }
// });

// 🔥 Animación PORT (ahora letra a letra)
gsap.fromTo(".year",
  { scale: 0, opacity: 0, rotate: -20 },
  {
    scrollTrigger: {
      trigger: ".header-content",
      start: "top 85%",
      end: "top 50%",
      scrub: 1,
    },
    scale: 1,
    opacity: 1,
    rotate: 0,
    ease: "elastic.out(1, 0.5)",
    stagger: 0.15
  }
);

// ✨ Nombre y profesión con blur y subida
gsap.fromTo(".subtitle p",
  { y: 60, scale: 0.9, opacity: 0, filter: "blur(6px)" },
  {
    scrollTrigger: {
      trigger: ".header-content",
      start: "top 75%",
      end: "top 40%",
      scrub: 1,
    },
    y: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    ease: "power4.out",
    stagger: 0.25
  }
);

// ––––– Flip + ScrollTrigger + frases –––––
gsap.registerPlugin(Flip, ScrollTrigger);

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

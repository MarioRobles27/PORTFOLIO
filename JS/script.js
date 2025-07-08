
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

// Animación: cada letra gira desde X=90° (opacity:0) → X=0° (opacity:1)
gsap.fromTo(".reveal-char",
  {
    rotationX: 90,
    opacity: 0
  },
  {
    rotationX: 0,
    opacity: 1,
    ease: "power2.out",
    duration: 2,         // duración total “virtual”
    stagger: 0.05,       // retardo entre letras
    scrollTrigger: {
      trigger: ".main-header h1",  // título como disparador
      start: "top 70%",             // cuando el top del h1 alcance el 70% del viewport
      end: "top 30%",               // fin de la zona de scrubbing
      scrub: true,                  // anima según scroll y revierte suave
      // markers: true,            // descomenta para ver puntos de inicio/fin
    }
  }
);


// 🧨 ANIMACIÓN de letras (reveal-scroll interactivo)
gsap.to(".reveal-char", {
  scrollTrigger: {
    trigger: ".header-content",
    start: "top 80%",
    end: "top 30%",
    scrub: true
  },
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out",
  stagger: {
    each: 0.04,
    from: "start"
  }
});

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
    // referencias a los textos
    const initialText = document.querySelector(".anim-initial .anim-text");
    const secondText  = document.querySelector(".anim-second  .anim-text");
    const thirdText   = document.querySelector(".anim-third   .anim-text");

    // estados de destino
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

    // 1) al principio, muestro el texto inicial
    tl.to(initialText, { opacity: 1, duration: 0.5 });

    // 2) encaja en segundo cubo
    tl.add(Flip.fit(".anim-box", secondState, cfg))
      // oculto inicial y muestro segundo
      .to(initialText, { opacity: 0, duration: 0.3 }, "<")
      .to(secondText,  { opacity: 1, duration: 0.5 }, "<");

    // 3) encaja en tercer cubo
    tl.add(Flip.fit(".anim-box", thirdState, cfg), "+=0.5")
      // oculto segundo y muestro tercero
      .to(secondText, { opacity: 0, duration: 0.3 }, "<")
      .to(thirdText,  { opacity: 1, duration: 0.5 }, "<");
  });
}

createFlipTimeline();
window.addEventListener("resize", createFlipTimeline);

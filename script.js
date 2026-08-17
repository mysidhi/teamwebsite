gsap.registerPlugin(ScrollTrigger);

// ============================================================
// ELEMENTS
// ============================================================

const hero = document.querySelector(".hero");
const cards = document.querySelectorAll(".card");
const nav = document.querySelector("#nav");
const subline = document.querySelector("#subline");
const bigResults = document.querySelector(".big-results");
const smallTeam = document.querySelector(".small-team");
const bigLetters = document.querySelectorAll(".big-results .letter");
const teamCards = document.querySelectorAll(".t-card");
const statsInner = document.querySelector(".stats-inner");

// ============================================================
// SAFETY
// ============================================================

if (!hero) {
  console.warn("GSAP: .hero element not found");
}

// ============================================================
// CARD REST ROTATION
// ============================================================

cards.forEach((card) => {
  const rot = parseFloat(card.dataset.rot) || 0;
  card.dataset.restRot = rot;
});

// ============================================================
// INITIAL STATES
// ============================================================

if (nav) {
  gsap.set(nav, {
    opacity: 0,
    y: -20
  });
}

gsap.set(".small-team .word > span", {
  y: "105%"
});

if (bigLetters.length) {
  gsap.set(bigLetters, {
    y: 80,
    opacity: 0
  });
}

if (subline) {
  gsap.set(subline, {
    opacity: 0,
    y: 20
  });
}

gsap.set(cards, {
  y: -800,
  opacity: 0,
  scale: 0.7,
  rotation: (i, el) =>
    (parseFloat(el.dataset.restRot) || 0) + 25
});

gsap.set(teamCards, {
  opacity: 0,
  y: 80
});

if (statsInner) {
  gsap.set(statsInner, {
    opacity: 0,
    y: 60
  });
}

// ============================================================
// INTRO TIMELINE
// ============================================================

const intro = gsap.timeline({
  defaults: {
    ease: "power3.out"
  }
});

if (nav) {
  intro.to(
    nav,
    {
      opacity: 1,
      y: 0,
      duration: 0.8
    },
    0.1
  );
}

intro.to(
  ".small-team .word > span",
  {
    y: "0%",
    duration: 0.9,
    stagger: 0.08
  },
  0.3
);

if (bigLetters.length) {
  intro.to(
    bigLetters,
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.05,
      ease: "back.out(1.6)"
    },
    0.55
  );
}

intro.to(
  cards,
  {
    y: 0,
    opacity: 1,
    scale: 1,
    rotation: (i, el) =>
      parseFloat(el.dataset.restRot) || 0,
    duration: 1.1,
    stagger: {
      each: 0.08,
      from: "center"
    },
    ease: "back.out(1.4)"
  },
  0.8
);

if (subline) {
  intro.to(
    subline,
    {
      opacity: 1,
      y: 0,
      duration: 0.8
    },
    1.6
  );
}

// ============================================================
// CARD FLOAT
// ============================================================

cards.forEach((card, i) => {

  const restRot =
    parseFloat(card.dataset.restRot) || 0;

  gsap.to(card, {
    y: 8 + (i % 3) * 5,
    rotation:
      restRot +
      (i % 2 === 0 ? 1.5 : -1.5),

    duration: 3 + (i % 4) * 0.5,

    delay: 3 + i * 0.1,

    ease: "sine.inOut",

    yoyo: true,
    repeat: -1,

    paused: true,

    id: `float-${i}`
  });

});

// Start floating AFTER intro

intro.call(() => {

  cards.forEach((card, i) => {

    const tween = gsap.getById(`float-${i}`);

    if (tween) {
      tween.play();
    }

  });

});

// ============================================================
// MOUSE PARALLAX
// ============================================================

let mx = 0;
let my = 0;

let tx = 0;
let ty = 0;

if (hero) {

  hero.addEventListener("mousemove", (e) => {

    const rect =
      hero.getBoundingClientRect();

    mx =
      ((e.clientX - rect.left) /
        rect.width -
        0.5) * 2;

    my =
      ((e.clientY - rect.top) /
        rect.height -
        0.5) * 2;

  });

  hero.addEventListener("mouseleave", () => {

    mx = 0;
    my = 0;

  });

}

// Parallax using CSS variables instead of GSAP transform

function parallax() {

  tx += (mx - tx) * 0.05;
  ty += (my - ty) * 0.05;

  cards.forEach((card) => {

    const depth =
      parseFloat(card.dataset.depth) || 8;

    card.style.setProperty(
      "--px",
      `${tx * depth}px`
    );

    card.style.setProperty(
      "--py",
      `${ty * depth * 0.5}px`
    );

  });

  requestAnimationFrame(parallax);
}

parallax();

// ============================================================
// CARD HOVER
// ============================================================

cards.forEach((card) => {

  const originalZ =
    getComputedStyle(card).zIndex;

  card.addEventListener("mousemove", (e) => {

    const rect =
      card.getBoundingClientRect();

    const px =
      (e.clientX - rect.left) /
        rect.width -
      0.5;

    const py =
      (e.clientY - rect.top) /
        rect.height -
      0.5;

    gsap.to(card, {

      rotateX: -py * 16,
      rotateY: px * 16,

      scale: 1.08,

      zIndex: 20,

      duration: 0.35,

      ease: "power2.out",

      transformPerspective: 700,

      overwrite: "auto"

    });

  });

  card.addEventListener("mouseleave", () => {

    gsap.to(card, {

      rotateX: 0,
      rotateY: 0,

      scale: 1,

      zIndex: originalZ,

      duration: 0.6,

      ease: "elastic.out(1, 0.6)",

      overwrite: "auto"

    });

  });

  card.addEventListener("click", () => {

    gsap.fromTo(
      card,

      {
        scale: 1.08
      },

      {
        scale: 1,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      }
    );

  });

});

// ============================================================
// HERO SCROLL ANIMATION
// ============================================================

if (hero) {

  const moves = [
    { x: -260, y: -40, rot: -25 },
    { x: -200, y: 20, rot: -18 },
    { x: -120, y: 80, rot: -10 },
    { x: -40, y: 120, rot: -4 },
    { x: 40, y: 120, rot: 4 },
    { x: 120, y: 80, rot: 12 },
    { x: 200, y: 20, rot: 22 },
    { x: 260, y: -40, rot: 28 }
  ];

  const scrollTimeline =
    gsap.timeline({
      scrollTrigger: {

        trigger: hero,

        start: "top top",
        end: "bottom top",

        scrub: 0.8,

        pin: false,

        invalidateOnRefresh: true

      }
    });

  if (bigResults) {

    scrollTimeline.to(
      bigResults,
      {
        scale: 1.15,
        opacity: 0.6,
        ease: "none"
      },
      0
    );

  }

  if (smallTeam) {

    scrollTimeline.to(
      smallTeam,
      {
        y: -60,
        opacity: 0,
        ease: "none"
      },
      0
    );

  }

  cards.forEach((card, i) => {

    const move =
      moves[i] || moves[moves.length - 1];

    const rest =
      parseFloat(card.dataset.restRot) || 0;

    scrollTimeline.to(
      card,
      {
        x: move.x,
        y: move.y,
        rotation: rest + move.rot,
        ease: "none"
      },
      0
    );

  });

  if (subline) {

    scrollTimeline.to(
      subline,
      {
        opacity: 0,
        ease: "none"
      },
      0
    );

  }

}

// ============================================================
// TEAM REVEAL
// ============================================================

const teamHead =
  document.querySelector(".team-head");

const teamGrid =
  document.querySelector(".team-grid");

if (teamHead) {

  gsap.from(
    ".eyebrow, .team-head h2, .team-head p",
    {

      opacity: 0,
      y: 30,

      duration: 0.9,

      stagger: 0.1,

      ease: "power3.out",

      scrollTrigger: {

        trigger: teamHead,

        start: "top 80%",

        toggleActions:
          "play none none reverse"

      }

    }
  );

}

if (teamGrid && teamCards.length) {

  gsap.to(
    teamCards,
    {

      opacity: 1,
      y: 0,

      duration: 1,

      stagger: 0.08,

      ease: "back.out(1.3)",

      scrollTrigger: {

        trigger: teamGrid,

        start: "top 80%",

        toggleActions:
          "play none none reverse"

      }

    }
  );

}

// ============================================================
// STATS REVEAL
// ============================================================

const stats =
  document.querySelector(".stats");

if (stats && statsInner) {

  gsap.to(
    statsInner,
    {

      opacity: 1,
      y: 0,

      duration: 1.2,

      ease: "power3.out",

      scrollTrigger: {

        trigger: stats,

        start: "top 80%",

        toggleActions:
          "play none none reverse"

      }

    }
  );

}

// ============================================================
// COUNTERS
// ============================================================

if (stats) {

  ScrollTrigger.create({

    trigger: stats,

    start: "top 75%",

    once: true,

    onEnter: () => {

      document
        .querySelectorAll(".stat-block .num")
        .forEach((el) => {

          const target =
            parseFloat(
              el.dataset.count
            ) || 0;

          const span =
            el.querySelector("span");

          if (!span) return;

          const counter = {
            value: 0
          };

          gsap.to(counter, {

            value: target,

            duration: 2,

            ease: "power2.out",

            onUpdate: () => {

              span.textContent =
                Math.floor(
                  counter.value
                ).toLocaleString();

            }

          });

        });

    }

  });

}

// ============================================================
// BUTTON CLICK
// ============================================================

document
  .querySelectorAll(
    ".nav-cta, .arrow-pill"
  )
  .forEach((btn) => {

    btn.addEventListener(
      "click",
      () => {

        gsap.fromTo(

          btn,

          {
            scale: 1
          },

          {

            scale: 0.93,

            duration: 0.12,

            yoyo: true,

            repeat: 1,

            ease: "power2.inOut"

          }

        );

      }
    );

  });

// ============================================================
// BIG RESULTS HOVER
// ============================================================

const bigResultsWrap =
  document.querySelector(
    ".big-results-wrap"
  );

if (bigResultsWrap) {

  bigResultsWrap.addEventListener(
    "mouseenter",
    () => {

      gsap.to(
        ".big-results .letter",
        {

          y: -8,

          duration: 0.5,

          stagger: 0.03,

          ease: "back.out(1.6)"

        }
      );

    }
  );

  bigResultsWrap.addEventListener(
    "mouseleave",
    () => {

      gsap.to(
        ".big-results .letter",
        {

          y: 0,

          duration: 0.6,

          stagger: 0.03,

          ease: "elastic.out(1, 0.6)"

        }
      );

    }
  );

}

// ============================================================
// REFRESH SCROLLTRIGGER
// ============================================================

window.addEventListener(
  "load",
  () => {

    ScrollTrigger.refresh();

  }
);
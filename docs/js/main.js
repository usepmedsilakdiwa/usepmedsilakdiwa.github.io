/* Native JavaScript: accessible mobile nav, project filters, reveal-on-scroll. */
(() => {
  "use strict";

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectGrid = document.querySelector("#project-grid");
  const projectCards = projectGrid
    ? Array.from(projectGrid.querySelectorAll(".project-card"))
    : [];

  // Use the exact Shuffle.js library included in Thomson's docs build.
  // Shuffle handles the vanish/shrink, staggered opacity, and animated
  // repositioning of the remaining cards after each filter selection.
  let projectShuffle = null;
  if (projectGrid && projectCards.length && window.Shuffle) {
    projectShuffle = new window.Shuffle(projectGrid, {
      itemSelector: ".project-card",
      speed: 650,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      gutterWidth: 0,
      staggerAmount: 35,
      staggerAmountMax: 180,
      useTransforms: true,
      filterMode: window.Shuffle.FilterMode.ANY
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      if (projectShuffle) {
        projectShuffle.filter(filter);
      } else {
        // Graceful fallback if the plugin is unavailable.
        projectCards.forEach(card => {
          card.hidden = !(filter === "all" || card.dataset.category === filter);
        });
      }
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 3, 2) * 75}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();
})();

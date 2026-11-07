/* Native JavaScript: Filter with Smooth Scale & Fade Animation */
(() => {
  "use strict";

  // Mobile nav toggle
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
  }

  const gridElement = document.querySelector("#project-grid");
  const filterButtons = document.querySelectorAll(".filter-button");
  const cards = gridElement ? Array.from(gridElement.querySelectorAll(".project-card")) : [];

  // Initialize cards as visible with a nice load-in stagger
  cards.forEach((card, index) => {
    card.classList.add("is-visible");
    card.style.transitionDelay = `${index * 40}ms`;
  });

  // Filter button event listeners with animated transitions
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filterGroup = button.dataset.group || "all";

      filterButtons.forEach(btn => {
        const isActive = btn === button;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

      let visibleCounter = 0;
      cards.forEach(card => {
        const groupsAttr = card.getAttribute("data-groups") || "";
        const matches = filterGroup === "all" || groupsAttr.includes(filterGroup);

        if (matches) {
          card.classList.remove("is-hidden");
          card.style.transitionDelay = `${visibleCounter * 50}ms`;
          card.classList.add("is-visible");
          visibleCounter++;
        } else {
          card.classList.remove("is-visible");
          card.classList.add("is-hidden");
        }
      });
    });
  });

  // Reveal on scroll observer
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
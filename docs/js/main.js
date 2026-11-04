/* Native JavaScript: Guaranteed Animated Filtering */
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

  let shuffleInstance = null;

  // Attempt to initialize Shuffle.js
  if (gridElement && window.Shuffle) {
    try {
      shuffleInstance = new window.Shuffle(gridElement, {
      itemSelector: ".project-card",
      speed: 450,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      gutterWidth: 24, // Matches the spacing between columns
      columnThreshold: 0.01,
      useTransforms: true,
      filterMode: window.Shuffle.FilterMode.ANY
      });
      console.log("🟢 Shuffle.js loaded and active!");
    } catch (e) {
      console.warn("⚠️ Shuffle initialization error:", e);
    }
  } else {
    console.log("🟡 window.Shuffle not detected. Using guaranteed CSS transition animation fallback.");
  }

  // Filter button event listeners
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filterGroup = button.dataset.group || "all";

      filterButtons.forEach(btn => {
        const isActive = btn === button;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

      if (shuffleInstance) {
        // Use Shuffle.js if available
        if (filterGroup === "all") {
          shuffleInstance.filter(window.Shuffle.ALL_ITEMS);
        } else {
          shuffleInstance.filter(filterGroup);
        }
      } else {
        // GUARANTEED ANIMATED FALLBACK (Smooth Fade & Scale)
        cards.forEach(card => {
          const groupsAttr = card.getAttribute("data-groups") || "";
          const matches = filterGroup === "all" || groupsAttr.includes(filterGroup);

          if (matches) {
            card.style.display = "";
            card.style.transition = "opacity 400ms ease, transform 400ms ease";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            }, 20);
          } else {
            card.style.transition = "opacity 300ms ease, transform 300ms ease";
            card.style.opacity = "0";
            card.style.transform = "scale(0.9)";
            setTimeout(() => {
              if (card.style.opacity === "0") {
                card.style.display = "none";
              }
            }, 300);
          }
        });
      }
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
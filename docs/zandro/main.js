/* Native JavaScript: "All Contents" Default Filter Execution */
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

  // Function to apply filter and sync active button states
  function applyFilter(groupName) {
    const isAll = groupName === "all" || groupName === "Shuffle.ALL_ITEMS" || !groupName;

    // 1. Update filter button active states
    filterButtons.forEach(btn => {
      const matches = btn.dataset.group === groupName || (isAll && btn.dataset.group === "all");
      btn.classList.toggle("is-active", matches);
      btn.setAttribute("aria-pressed", String(matches));
    });

    // 2. Update header navigation links active state
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.dataset.navFilter === groupName || (isAll && link.dataset.navFilter === "all")) {
        link.classList.add("active");
      } else if (link.dataset.navFilter) {
        link.classList.remove("active");
      }
    });

    // 3. Execute Shuffle.js filter or fallback directly
    if (shuffleInstance) {
      if (isAll) {
        shuffleInstance.filter(window.Shuffle.ALL_ITEMS);
      } else {
        shuffleInstance.filter(groupName);
      }
    } else {
      cards.forEach(card => {
        const groupsAttr = card.getAttribute("data-groups") || "";
        const matches = isAll || groupsAttr.includes(groupName);

        if (matches) {
          card.style.display = "flex";
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
          card.style.pointerEvents = "auto";
        } else {
          card.style.display = "none";
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          card.style.pointerEvents = "none";
        }
      });
    }
  }

  // Filter button click listeners
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filterGroup = button.dataset.group || "all";
      applyFilter(filterGroup);
    });
  });

  // Initialize Shuffle.js and directly show All Contents on load
  function initShuffleAndFilter() {
    if (gridElement && window.Shuffle) {
      try {
        shuffleInstance = new window.Shuffle(gridElement, {
          itemSelector: ".project-card",
          speed: 350,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          gutterWidth: 24,
          columnThreshold: 0.01,
          useTransforms: true,
          filterMode: window.Shuffle.FilterMode.ANY
        });
      } catch (e) {
        console.warn("⚠️ Shuffle initialization warning:", e);
      }
    }

    // Default to 'all' on startup
    applyFilter("all");
  }

  // Execute on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShuffleAndFilter);
  } else {
    initShuffleAndFilter();
  }

  // Floating Header Link Smooth Scroll + Filter Transition
  document.querySelectorAll('.nav-link[data-nav-filter]').forEach(headerLink => {
    headerLink.addEventListener('click', (e) => {
      e.preventDefault();
      const targetGroup = headerLink.dataset.navFilter;
      const projectsSection = document.querySelector('#projects');

      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        applyFilter(targetGroup);
      }
    });
  });

  // Nav target scroll (Home & About Me)
  document.querySelectorAll('.nav-link[data-nav-target]').forEach(targetLink => {
    targetLink.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = targetLink.dataset.navTarget;
      const targetSection = document.querySelector(`#${targetId}`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      targetLink.classList.add('active');
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

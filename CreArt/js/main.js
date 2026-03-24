document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const homeHero = document.querySelector(".hero--home");
  const navLogo = nav?.querySelector(".logo-img");

  const syncNavTheme = () => {
    if (!nav || !homeHero) return;

    const heroBottom = homeHero.getBoundingClientRect().bottom;
    const isOnDarkHero = heroBottom > nav.offsetHeight + 24;

    nav.classList.toggle("nav--on-dark", isOnDarkHero);

    if (navLogo?.dataset.logoDark && navLogo?.dataset.logoLight) {
      navLogo.src = isOnDarkHero ? navLogo.dataset.logoLight : navLogo.dataset.logoDark;
    }
  };

  const syncNavOnScroll = () => {
    if (!nav) return;
    nav.classList.toggle("nav--scrolled", window.scrollY > 24);
    syncNavTheme();
  };

  syncNavOnScroll();
  window.addEventListener("scroll", syncNavOnScroll, { passive: true });
  window.addEventListener("resize", syncNavTheme);

  if (navToggle && mobileMenu) {
    const setMenuState = (isOpen) => {
      navToggle.classList.toggle("active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      mobileMenu.classList.toggle("active", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    navToggle.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("active");
      setMenuState(isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });
  }

  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -48px 0px"
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const accordions = document.querySelectorAll("[data-accordion]");
  accordions.forEach((accordion) => {
    const header = accordion.querySelector(".accordion__header");
    const body = accordion.querySelector(".accordion__body");

    if (!header || !body) return;

    header.addEventListener("click", () => {
      const isActive = accordion.classList.contains("active");

      accordions.forEach((item) => {
        item.classList.remove("active");
        const itemHeader = item.querySelector(".accordion__header");
        const itemBody = item.querySelector(".accordion__body");
        if (itemHeader) itemHeader.setAttribute("aria-expanded", "false");
        if (itemBody) itemBody.style.maxHeight = "";
      });

      if (!isActive) {
        accordion.classList.add("active");
        header.setAttribute("aria-expanded", "true");
        body.style.maxHeight = `${body.scrollHeight}px`;
      }
    });
  });

  const counters = document.querySelectorAll(".stats__number[data-target]");
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number.parseInt(element.getAttribute("data-target"), 10);
        animateCounter(element, target);
        observer.unobserve(element);
      });
    }, { threshold: 0.45 });

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  function animateCounter(element, target) {
    if (Number.isNaN(target)) return;

    const duration = 1800;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString("es-CL");

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }

  const filterButtons = document.querySelectorAll(".filter-btn[data-filter]");
  const portfolioItems = document.querySelectorAll(".portfolio__item[data-category]");

  if (filterButtons.length && portfolioItems.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("filter-btn--active"));
        button.classList.add("filter-btn--active");

        portfolioItems.forEach((item) => {
          const shouldShow = filter === "all" || item.dataset.category === filter;
          item.classList.toggle("hidden", !shouldShow);
        });
      });
    });
  }

  const forms = document.querySelectorAll("form[data-success-message], form#contactForm");
  forms.forEach((form) => {
    const button = form.querySelector('button[type="submit"]');
    const feedback = form.querySelector(".form-feedback");
    const successMessage = form.dataset.successMessage || "Gracias. Recibimos tu mensaje.";

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!button) return;

      const originalLabel = button.textContent;
      button.disabled = true;
      button.textContent = "Enviando...";

      window.setTimeout(() => {
        button.disabled = false;
        button.textContent = originalLabel;
        form.reset();
        if (feedback) feedback.textContent = successMessage;
      }, 900);
    });
  });
});

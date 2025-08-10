// === Preloader: smooth hide with minimum show time ===
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const shownAt = performance.timing?.domLoading || performance.now();
  const minShow = 700; // ms
  const elapsed = performance.now() - shownAt;
  const wait = Math.max(0, minShow - elapsed);

  if (!preloader) return;
  setTimeout(() => {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }, wait);
});

// === Reveal on scroll ===
function handleScrollAnimation() {
  const elements = document.querySelectorAll(".fade-in");
  const triggerBottom = window.innerHeight * 0.85;
  elements.forEach((el) => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) el.classList.add("visible");
    else el.classList.remove("visible");
  });
}
window.addEventListener("scroll", handleScrollAnimation);
window.addEventListener("load", handleScrollAnimation);

// === Navbar height → CSS var (prevents hero overlap) ===
function setNavOffset() {
  const nav = document.querySelector(".navbar");
  if (!nav) return;
  const h = nav.offsetHeight || 80;
  document.documentElement.style.setProperty("--navH", h + "px");
}
window.addEventListener("load", setNavOffset);
window.addEventListener("resize", setNavOffset);

// === Dark mode with persistence ===
const toggleBtn = document.getElementById("darkModeToggle");
const THEME_KEY = "theme";
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  if (toggleBtn) toggleBtn.textContent = isDark ? "☀️" : "🌙";
}
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) applyTheme(saved);
  else
    applyTheme(
      window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
})();
toggleBtn?.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark-mode")
    ? "light"
    : "dark";
  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme);
});

// === Back to Top ===
const backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (backToTopBtn)
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTopBtn?.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// === Footer year ===
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// === Contact form (Formspree-friendly) ===
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return false;
  }
  if (form.action && form.method.toUpperCase() === "POST") {
    const formData = new FormData(form);
    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        const msg = document.getElementById("form-msg");
        if (res.ok) {
          msg?.classList.remove("d-none");
          setTimeout(() => msg?.classList.add("d-none"), 3000);
          form.reset();
          form.classList.remove("was-validated");
        } else {
          alert("Sorry, something went wrong.");
        }
      })
      .catch(() => alert("Network error. Please try again later."));
  } else {
    document.getElementById("form-msg")?.classList.remove("d-none");
    setTimeout(
      () => document.getElementById("form-msg")?.classList.add("d-none"),
      3000
    );
    form.reset();
    form.classList.remove("was-validated");
  }
  return false;
}

// === Navbar scroll effect ===
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  if (window.scrollY > 50) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});

// === Collapse navbar on link click (mobile) ===
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      new bootstrap.Collapse(navbarCollapse).toggle();
    }
  });
});

// === ScrollSpy ===
document.addEventListener("DOMContentLoaded", () => {
  new bootstrap.ScrollSpy(document.body, {
    target: "#navbarNav",
    offset: 100,
  });
});

// === Lightbox with navigation ===
const lightboxModal = document.getElementById("lightboxModal");
(function initLightbox() {
  if (!lightboxModal) return;
  const imgEl = document.getElementById("lightboxImg");
  const triggers = Array.from(
    document.querySelectorAll(
      '#certificates [data-bs-target="#lightboxModal"][data-img]'
    )
  );
  let currentIndex = -1;

  function showAt(index) {
    if (!imgEl || triggers.length === 0) return;
    currentIndex = (index + triggers.length) % triggers.length;
    imgEl.src = triggers[currentIndex].getAttribute("data-img") || "";
  }
  lightboxModal.addEventListener("show.bs.modal", (event) => {
    const idx = triggers.indexOf(event.relatedTarget);
    showAt(idx >= 0 ? idx : 0);
  });
  lightboxModal.addEventListener("hidden.bs.modal", () => {
    if (imgEl) imgEl.src = "";
    currentIndex = -1;
  });
  lightboxModal
    .querySelector('[data-lightbox="prev"]')
    ?.addEventListener("click", () => showAt(currentIndex - 1));
  lightboxModal
    .querySelector('[data-lightbox="next"]')
    ?.addEventListener("click", () => showAt(currentIndex + 1));
  imgEl?.addEventListener("click", () =>
    bootstrap.Modal.getInstance(lightboxModal)?.hide()
  );
  lightboxModal.addEventListener("shown.bs.modal", () => {
    function onKey(e) {
      if (e.key === "ArrowRight") showAt(currentIndex + 1);
      if (e.key === "ArrowLeft") showAt(currentIndex - 1);
      if (e.key === "Escape")
        bootstrap.Modal.getInstance(lightboxModal)?.hide();
    }
    document.addEventListener("keydown", onKey);
    lightboxModal.addEventListener(
      "hidden.bs.modal",
      () => document.removeEventListener("keydown", onKey),
      { once: true }
    );
  });
})();

// === Project filters ===
(function initProjectFilters() {
  const grid = document.getElementById("project-grid");
  const controls = document.getElementById("project-filters");
  if (!grid || !controls) return;
  const items = Array.from(grid.querySelectorAll(".project-item"));
  controls.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    controls
      .querySelectorAll(".chip")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");
    items.forEach((item) => {
      const tags = (item.getAttribute("data-tags") || "").toLowerCase();
      item.style.display =
        filter === "all" || tags.includes(filter) ? "" : "none";
    });
  });
})();

// === Projects: Show more / Show less ===
(function () {
  const grid = document.getElementById("project-grid");
  const toggle = document.getElementById("projectsToggle");
  if (!grid || !toggle) return;
  const items = Array.from(grid.querySelectorAll(".project-item"));
  const INITIAL_VISIBLE = 3;
  let expanded = false;

  function apply() {
    items.forEach(
      (item, i) =>
        (item.style.display = expanded || i < INITIAL_VISIBLE ? "" : "none")
    );
    toggle.textContent = expanded ? "Show less" : "Show more";
  }
  toggle.addEventListener("click", () => {
    expanded = !expanded;
    apply();
  });
  apply();
})();

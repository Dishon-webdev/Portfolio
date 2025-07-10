// === Preloader ===
// Hides the preloader after page fully loads
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  preloader.style.opacity = '0';
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
});

// === Scroll Animation ===
// Adds 'visible' class to elements with 'fade-in' when they enter viewport
function handleScrollAnimation() {
  const elements = document.querySelectorAll('.fade-in');
  const triggerBottom = window.innerHeight * 0.85;

  elements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });
}
window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation); // run on load too

// === Dark/Light Mode Toggle ===
// Switches between dark and light theme and updates button icon
const toggleBtn = document.getElementById('darkModeToggle');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  });
}

// === Back to Top Button ===
// Shows button after scrolling down 300px, scrolls up on click
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === Auto Footer Year ===
// Automatically updates the footer year
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// === Contact Form Validation & Submission ===
// Validates form before showing success message
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return false; // Prevent submission if invalid
  }

  const msg = document.getElementById('form-msg');
  msg.classList.remove('d-none');
  setTimeout(() => {
    msg.classList.add('d-none');
  }, 3000);

  form.reset();
  form.classList.remove('was-validated');
  return false;
}

// === Navbar Scroll Effect ===
// Adds shadow/background to navbar on scroll for better visibility
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// === Close navbar on link click (for mobile) ===
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse.classList.contains('show')) {
      new bootstrap.Collapse(navbarCollapse).toggle();
    }
  });
});

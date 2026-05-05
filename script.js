const html = document.documentElement;
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const siteSearchForms = document.querySelectorAll('.site-search');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const header = document.querySelector('.site-header');
const revealElements = document.querySelectorAll('.reveal');
const abstractButtons = document.querySelectorAll('.abstract-toggle');
const contactForm = document.getElementById('contactForm');

html.setAttribute('data-theme', 'light');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }
  if (header) {
    header.classList.toggle('scrolled', scrollTop > 24);
  }
  if (backToTop) {
    backToTop.classList.toggle('show', scrollTop > 300);
  }
}

function setupRevealObserver() {
  if (!revealElements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
  });
  revealElements.forEach((el) => observer.observe(el));
}

function setupNavToggle() {
  if (!navToggle || !siteNav) return;
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.classList.toggle('open');
    siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', expanded);
  });
  siteNav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function setupAbstractToggle() {
  abstractButtons.forEach((button) => {
    const targetId = button.dataset.target;
    const panel = document.getElementById(targetId);
    if (!panel) return;
    button.addEventListener('click', () => {
      const collapsed = panel.classList.toggle('collapsed');
      button.setAttribute('aria-expanded', !collapsed);
      button.textContent = collapsed ? 'Abstract' : 'Hide Abstract';
    });
  });
}

function setupSiteSearch() {
  if (!siteSearchForms.length) return;

  const routes = [
    { page: 'research.html', terms: ['research', 'paper', 'publication', 'abstract', 'journal', 'ssrn', 'education', 'economics'] },
    { page: 'teaching.html', terms: ['teaching', 'course', 'assistant', 'microeconomics', 'econometrics', 'game theory'] },
    { page: 'contact.html', terms: ['contact', 'email', 'linkedin', 'message', 'collaboration'] },
    { page: 'cv.pdf', terms: ['cv', 'resume', 'download'] },
    { page: 'index.html', terms: ['home', 'about', 'profile', 'japneet'] },
  ];

  siteSearchForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = new FormData(form).get('q')?.toString().trim().toLowerCase();
      if (!query) return;

      const match = routes.find(({ terms }) => terms.some((term) => query.includes(term)));
      window.location.href = match ? match.page : `research.html?q=${encodeURIComponent(query)}`;
    });
  });
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setupContactForm() {
  if (!contactForm) return;
  const fields = [
    { id: 'name', validator: (v) => v.trim() !== '' },
    { id: 'email', validator: validateEmail },
    { id: 'subject', validator: (v) => v.trim() !== '' },
    { id: 'message', validator: (v) => v.trim() !== '' },
  ];
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;
    fields.forEach(({ id, validator }) => {
      const input = document.getElementById(id);
      const group = input.closest('.form-group');
      if (!validator(input.value)) {
        valid = false;
        group.classList.add('error');
      } else {
        group.classList.remove('error');
      }
    });
    const successMessage = document.getElementById('formSuccess');
    if (valid) {
      successMessage.textContent = "Thanks! I'll be in touch.";
      contactForm.reset();
      contactForm.querySelectorAll('.form-group').forEach((group) => group.classList.remove('error'));
      setTimeout(() => {
        successMessage.textContent = '';
      }, 5000);
    } else {
      successMessage.textContent = '';
    }
  });
  contactForm.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group.classList.contains('error')) {
        group.classList.remove('error');
      }
    });
  });
}

function setupBackToTop() {
  if (!backToTop) return;
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupRevealObserver();
  setupNavToggle();
  setupSiteSearch();
  setupAbstractToggle();
  setupContactForm();
  setupBackToTop();
  updateScrollProgress();
});

window.addEventListener('scroll', updateScrollProgress);

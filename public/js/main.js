const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('nav-open');
  menuToggle.textContent = isOpen ? '×' : '☰';
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('nav-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.textContent = '☰';
  });
});

const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card');
const projectCount = document.getElementById('projectCount');

function applyProjectFilter(filter) {
  let visible = 0;
  projectCards.forEach(card => {
    const tags = (card.dataset.stack || '').split(',').map(tag => tag.trim());
    const show = filter === 'All'
      || tags.includes(filter)
      || (filter === 'Python' && tags.some(tag => ['Python', 'AI', 'Data'].includes(tag)));
    card.hidden = !show;
    if (show) visible += 1;
  });
  if (projectCount) projectCount.textContent = '(' + String(visible).padStart(2, '0') + ')';
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    applyProjectFilter(button.dataset.filter || 'All');
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const button = contactForm.querySelector('button[type="submit"]');
  const status = document.getElementById('formStatus');
  if (!button || !status) return;

  button.disabled = true;
  status.textContent = 'Sending your message...';
  try {
    // Express urlencoded middleware parses URLSearchParams (unlike multipart FormData).
    const payload = new URLSearchParams(new FormData(contactForm));
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: payload.toString()
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to send message.');
    status.textContent = 'Thank you! Your message has been received.';
    contactForm.reset();
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
  } finally {
    button.disabled = false;
  }
});
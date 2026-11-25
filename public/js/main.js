const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('nav-open');
  menuToggle.textContent = navLinks.classList.contains('nav-open') ? '×' : '☰';
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('nav-open')));

const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card');
const projectCount = document.getElementById('projectCount');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  let visible = 0;
  projectCards.forEach(card => {
    const tags = (card.dataset.stack || '').split(',');
    const show = filter === 'All' || tags.includes(filter) || (filter === 'JavaScript' && tags.includes('JavaScript')) || (filter === 'Python' && tags.some(tag => ['Python','AI','Data'].includes(tag)));
    card.hidden = !show;
    if (show) visible++;
  });
  projectCount.textContent = '(' + String(visible).padStart(2, '0') + ')';
}));

document.getElementById('year').textContent = new Date().getFullYear();
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const button = contactForm.querySelector('button[type="submit"]');
  const status = document.getElementById('formStatus');
  button.disabled = true;
  status.textContent = 'Sending your message...';
  try {
    const response = await fetch('/api/contact', { method: 'POST', body: new FormData(contactForm) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to send message.');
    status.textContent = 'Thank you! Your message has been received.';
    contactForm.reset();
  } catch (error) {
    status.textContent = error.message || 'Something went wrong. Please try again.';
  } finally { button.disabled = false; }
});
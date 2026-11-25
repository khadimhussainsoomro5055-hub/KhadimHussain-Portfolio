const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('nav-open');
  menuToggle.textContent = navLinks.classList.contains('nav-open') ? '×' : '☰';
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('nav-open')));
const filters = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('.project');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  projects.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));
document.getElementById('year').textContent = new Date().getFullYear();
const form = document.getElementById('contactForm');
form?.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button');
  const status = document.getElementById('formStatus');
  button.disabled = true; status.textContent = 'Sending...';
  try {
    const response = await fetch('/api/contact', { method: 'POST', body: new FormData(form) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to send message.');
    status.textContent = 'Thank you! Your message has been received.'; form.reset();
  } catch (error) { status.textContent = error.message; }
  finally { button.disabled = false; }
});
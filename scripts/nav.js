const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const backdrop = document.querySelector('.menu-backdrop');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('nav-active');
  backdrop.classList.toggle('display');
  burger.classList.toggle('toggle');
  document.body.classList.toggle('fixed-position');
});

backdrop.addEventListener('click', () => {
  navLinks.classList.remove('nav-active');
  backdrop.classList.remove('display');
  burger.classList.remove('toggle');
  document.body.classList.remove('fixed-position');
});

navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('nav-active');
    backdrop.classList.remove('display');
    burger.classList.remove('toggle');
    document.body.classList.remove('fixed-position');
  }
});
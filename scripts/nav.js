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


var navPages = document.querySelectorAll(".nav-links a")
navPages.forEach((elem) => {
    elem.addEventListener('click', () => {
        navPages.forEach((element) => {
            element.classList.remove("active");
        })
        elem.classList.add('active');
    })
})





gsap.from('.main nav',{
  duration: 1,
  y: -100,
})
gsap.from('.logo img',{
  duration: 1,
  scale: 8,
  opacity:0,
})
gsap.from('.nav-links li',{
  duration: 1,
  y: -100,
  stagger: 0.2,
})
// Achievements Orbital - GSAP entrance animations
document.addEventListener('DOMContentLoaded', () => {
  const orbital = document.querySelector('.achievements-orbital');
  if (!orbital) return;

  // Animate rings on scroll
  gsap.from('.orbital-ring', {
    duration: 1.5,
    scale: 0,
    opacity: 0,
    stagger: 0.25,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: orbital,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });

  // Animate center trophy
  gsap.from('.orbital-center', {
    duration: 1,
    scale: 0.5,
    opacity: 0,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: orbital,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });

  // Animate floating badges with stagger
  gsap.from('.floating-badge', {
    duration: 0.8,
    opacity: 0,
    y: 30,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: orbital,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
});

// Ensure GSAP and ScrollTrigger are loaded
gsap.registerPlugin(ScrollTrigger);

// Animation for section title
gsap.from('.hero3 .section-title', {
  opacity: 0,
  y: -50,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.hero3',
    start: 'top center+=100',
    toggleActions: 'play none none reverse'
  }
});

// Animation for project cards
gsap.utils.toArray('.hero3 .project').forEach((project, index) => {
  gsap.from(project, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: project,
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse'
    },
    delay: index * 0.2
  });
});

// Slow down background video if it exists
const bgVideo = document.querySelector('.hero3 .bg-video');
if (bgVideo) {
  bgVideo.playbackRate = 0.5;
}

// Optional: Add filtering functionality
const filterButtons = document.querySelectorAll('.hero3 .filter-btn');
const projects = document.querySelectorAll('.hero3 .project');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    
    projects.forEach(project => {
      if (filter === 'all' || project.classList.contains(filter)) {
        project.style.display = 'flex';
      } else {
        project.style.display = 'none';
      }
    });

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});
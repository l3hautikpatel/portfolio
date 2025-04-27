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

// Project Carousel Functionality
function initCarousels() {
  const carousels = document.querySelectorAll('.hero3 .carousel');
  
  carousels.forEach(carousel => {
    const images = carousel.querySelectorAll('img');
    
    if (images.length === 0) return;
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    
    let dots = [];
    for (let i = 0; i < images.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot';
      if (i === 0) dot.classList.add('active');
      dot.dataset.index = i;
      dotsContainer.appendChild(dot);
      dots.push(dot);
      
      // Add click event to navigate to specific slide
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
    }
    
    carousel.appendChild(dotsContainer);
    
    // Initialize with first image active
    let currentIndex = 0;
    images[0].classList.add('active');
    
    // Function to update active image
    function updateCarousel() {
      // Remove active class from all images
      images.forEach(img => img.classList.remove('active'));
      
      // Update dots
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
      
      // Show current image
      images[currentIndex].classList.add('active');
    }
    
    // Automatic image rotation
    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      updateCarousel();
    }, 3000); // Change image every 3 seconds
  });
}

// Initialize carousels when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initCarousels);

// Also initialize immediately in case DOM is already loaded
// This ensures it works regardless of when the script is loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initCarousels, 100); // Short delay to ensure everything is ready
}
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

// Fullscreen Preview Functionality
class FullscreenPreview {
  constructor() {
    // Don't initialize on mobile devices
    this.isMobile = window.innerWidth <= 768;
    
    if (this.isMobile) {
      return; // Skip initialization on mobile
    }
    
    this.modal = document.querySelector('.fullscreen-preview');
    this.modalContent = document.querySelector('.fullscreen-preview-content');
    this.closeBtn = document.querySelector('.fullscreen-close');
    this.prevBtn = document.querySelector('.fullscreen-arrow.prev');
    this.nextBtn = document.querySelector('.fullscreen-arrow.next');
    this.navContainer = document.querySelector('.fullscreen-nav');
    
    this.currentProject = null;
    this.currentIndex = 0;
    this.mediaElements = [];
    this.autoSlideInterval = null;
    
    this.init();
    
    // Handle window resize
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }
  
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    // If changed from desktop to mobile and preview is open, close it
    if (!wasMobile && this.isMobile && this.modal && this.modal.classList.contains('active')) {
      this.close();
    }
    
    // If changed from mobile to desktop, initialize if needed
    if (wasMobile && !this.isMobile && !this.modal) {
      this.initializeElements();
      this.init();
    }
  }
  
  initializeElements() {
    this.modal = document.querySelector('.fullscreen-preview');
    this.modalContent = document.querySelector('.fullscreen-preview-content');
    this.closeBtn = document.querySelector('.fullscreen-close');
    this.prevBtn = document.querySelector('.fullscreen-arrow.prev');
    this.nextBtn = document.querySelector('.fullscreen-arrow.next');
    this.navContainer = document.querySelector('.fullscreen-nav');
  }
  
  init() {
    // If mobile, don't add any event listeners
    if (this.isMobile) return;
    
    // Setup click event for all project media sections
    document.querySelectorAll('.hero3 .project-media').forEach(media => {
      // Remove any existing event listeners first
      const newMedia = media.cloneNode(true);
      media.parentNode.replaceChild(newMedia, media);
      
      // Add click event only on desktop
      newMedia.addEventListener('click', () => {
        if (!this.isMobile) {
          this.open(newMedia);
        }
      });
    });
    
    // Setup close button
    this.closeBtn.addEventListener('click', () => this.close());
    
    // Setup keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!this.modal?.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowLeft') {
        this.navigate(-1);
      } else if (e.key === 'ArrowRight') {
        this.navigate(1);
      }
    });
    
    // Setup arrow navigation
    this.prevBtn.addEventListener('click', () => this.navigate(-1));
    this.nextBtn.addEventListener('click', () => this.navigate(1));
    
    // Close when clicking outside content area
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Touch swipe functionality for desktop tablets
    this.setupTouchSwipe();
  }
  
  setupTouchSwipe() {
    if (this.isMobile || !this.modal) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    this.modal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }
  
  handleSwipe(startX, endX) {
    if (!this.modal.classList.contains('active')) return;
    
    const swipeThreshold = 75; // Minimum distance for a swipe
    const diff = startX - endX;
    
    if (Math.abs(diff) < swipeThreshold) return; // Not a significant swipe
    
    if (diff > 0) {
      // Swiped left, go to next
      this.navigate(1);
    } else {
      // Swiped right, go to previous
      this.navigate(-1);
    }
  }
  
  open(mediaContainer) {
    // Clear previous auto-slide interval if exists
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
    
    this.currentProject = mediaContainer;
    this.currentIndex = 0;
    this.mediaElements = [];
    
    // Clear previous content
    this.modalContent.innerHTML = '';
    this.navContainer.innerHTML = '';
    
    // Check if it's a carousel or a single video/image
    const carousel = mediaContainer.querySelector('.carousel');
    
    if (carousel) {
      this.handleCarousel(carousel);
    } else {
      this.handleSingleMedia(mediaContainer);
    }
    
    // Show the modal
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Toggle arrows visibility based on media count
    this.toggleArrows();
  }
  
  handleCarousel(carousel) {
    // Create fullscreen carousel
    const fullscreenCarousel = document.createElement('div');
    fullscreenCarousel.className = 'carousel-fullscreen';
    
    // Add loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'fullscreen-spinner';
    fullscreenCarousel.appendChild(spinner);
    
    // Get all images from the original carousel
    const images = carousel.querySelectorAll('img');
    this.mediaElements = Array.from(images);
    
    // Clone images to the fullscreen carousel
    let imagesLoaded = 0;
    const totalImages = images.length;
    
    images.forEach((img, index) => {
      const clone = document.createElement('img');
      clone.src = img.src;
      clone.alt = img.alt || '';
      clone.className = index === 0 ? 'active' : '';
      
      // Track when images are loaded
      clone.onload = () => {
        imagesLoaded++;
        
        // Remove spinner when all images are loaded
        if (imagesLoaded === totalImages) {
          const spinnerElement = fullscreenCarousel.querySelector('.fullscreen-spinner');
          if (spinnerElement) {
            spinnerElement.remove();
          }
        }
      };
      
      fullscreenCarousel.appendChild(clone);
      
      // Create navigation dot
      const dot = document.createElement('div');
      dot.className = 'fullscreen-dot';
      if (index === 0) dot.classList.add('active');
      dot.dataset.index = index;
      
      dot.addEventListener('click', () => {
        this.goToSlide(index);
      });
      
      this.navContainer.appendChild(dot);
    });
    
    this.modalContent.appendChild(fullscreenCarousel);
    
    // Start auto-slide for carousel if it has multiple images
    if (images.length > 1) {
      this.startAutoSlide();
    }
  }
  
  handleSingleMedia(mediaContainer) {
    // Add loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'fullscreen-spinner';
    this.modalContent.appendChild(spinner);
    
    // Check if it's a video or an image
    const video = mediaContainer.querySelector('video');
    const image = mediaContainer.querySelector('img');
    
    if (video) {
      const clone = video.cloneNode(true);
      clone.controls = true; // Enable video controls in fullscreen
      clone.autoplay = true; // Autoplay in fullscreen
      
      // Remove spinner when video can play
      clone.oncanplay = () => {
        const spinnerElement = this.modalContent.querySelector('.fullscreen-spinner');
        if (spinnerElement) {
          spinnerElement.remove();
        }
      };
      
      this.modalContent.appendChild(clone);
      this.mediaElements = [clone];
      
      // Hide navigation for single media
      this.navContainer.style.display = 'none';
    } else if (image) {
      const clone = document.createElement('img');
      clone.src = image.src;
      clone.alt = image.alt || '';
      
      // Remove spinner when image is loaded
      clone.onload = () => {
        const spinnerElement = this.modalContent.querySelector('.fullscreen-spinner');
        if (spinnerElement) {
          spinnerElement.remove();
        }
      };
      
      this.modalContent.appendChild(clone);
      this.mediaElements = [clone];
      
      // Hide navigation for single media
      this.navContainer.style.display = 'none';
    } else {
      // If no media found, remove the spinner
      spinner.remove();
    }
  }
  
  startAutoSlide() {
    // Clear any existing interval
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    
    // Auto-slide every 5 seconds
    this.autoSlideInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && this.modal.classList.contains('active')) {
        this.navigate(1);
      }
    }, 5000);
  }
  
  navigate(direction) {
    if (this.mediaElements.length <= 1) return;
    
    // Clear auto-slide interval when user navigates manually
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
    
    // Update current index
    this.currentIndex = (this.currentIndex + direction + this.mediaElements.length) % this.mediaElements.length;
    this.goToSlide(this.currentIndex);
    
    // Restart auto-slide
    this.startAutoSlide();
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    
    // Update carousel images (if it's a carousel)
    const images = this.modalContent.querySelectorAll('.carousel-fullscreen img');
    
    if (images.length > 0) {
      // Force a reflow to ensure transitions work properly
      setTimeout(() => {
        images.forEach(img => img.classList.remove('active'));
        
        // Force browser to recognize the style change
        void images[index].offsetWidth;
        
        images[index].classList.add('active');
        
        // Update navigation dots
        const dots = this.navContainer.querySelectorAll('.fullscreen-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
      }, 50);
    }
  }
  
  toggleArrows() {
    // Show/hide arrows based on media count
    if (this.mediaElements.length <= 1) {
      this.prevBtn.style.display = 'none';
      this.nextBtn.style.display = 'none';
    } else {
      this.prevBtn.style.display = 'flex';
      this.nextBtn.style.display = 'flex';
    }
  }
  
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Pause videos when closing (if any)
    const videos = this.modalContent.querySelectorAll('video');
    videos.forEach(video => {
      video.pause();
    });
    
    // Show navigation for future uses
    this.navContainer.style.display = 'flex';
    
    // Clear auto-slide interval
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}

// Initialize Fullscreen Preview conditionally
document.addEventListener('DOMContentLoaded', () => {
  window.fullscreenPreviewInstance = new FullscreenPreview();
});

// Also handle the case when DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    if (!window.fullscreenPreviewInstance) {
      window.fullscreenPreviewInstance = new FullscreenPreview();
    }
  }, 200);
}
gsap.registerPlugin(ScrollTrigger);

// Create a single ScrollTrigger for the entire hero4 section
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero4",
    start: "top center+=100",
    end: "bottom center",
    toggleActions: "play none none reverse",
  }
});

// Add animations to the timeline
timeline
  .from(".hero4 .section-title", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out"
  })
  .from(".hero4 .timeline-item", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out"
  }, "-=0.4")
  .from(".hero4 .timeline-line", {
    scaleY: 0,
    transformOrigin: "top",
    duration: 1,
    ease: "power3.inOut"
  }, "-=1")
  .from(".hero4 .timeline-dot", {
    // scale: 0,
    duration: 0.4,
    stagger: 0.2,
    ease: "back.out(1.7)"
  }, "-=0.8");

// Ensure proper scroll behavior
ScrollTrigger.refresh();
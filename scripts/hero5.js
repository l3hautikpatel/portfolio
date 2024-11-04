gsap.registerPlugin(ScrollTrigger);

// Create main timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero5",
    start: "top center",
    end: "bottom bottom",
    toggleActions: "play none none reverse"
  }
});

// Add animations
tl.from(".hero5 .contact-left", {
  x: -100,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
})
.from(".hero5 .contact-form", {
  x: 100,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
}, "-=0.7")
.from(".hero5 .social-link", {
  y: 30,
  opacity: 1,
  duration: 0.5,
  stagger: 0.1,
  ease: "back.out(1.7)"
}, "-=0.5")
.from(".hero5 .form-group", {
  y: 20,
  opacity: 1,
  duration: 0.4,
  stagger: 0.1,
  ease: "power2.out"
}, "-=0.3")
.from(".hero5 .footer", {
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, "-=0.2");

// Add hover animations for social links
gsap.utils.toArray(".hero5 .social-link").forEach(link => {
  link.addEventListener("mouseenter", () => {
    gsap.to(link, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
  });
  
  link.addEventListener("mouseleave", () => {
    gsap.to(link, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  });
});
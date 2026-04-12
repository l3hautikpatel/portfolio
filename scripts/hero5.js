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



// ─── Contact Form Handler ────────────────────────────────────────────────────
// Sends form data to the secure Vercel backend (/api/contact).
// The backend holds the Telegram bot token — it is never exposed here.
const BACKEND_URL = 'https://portfolio-backend-neon-alpha.vercel.app';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const message = form.querySelector('textarea').value.trim();

    // Basic client-side guard (backend also validates)
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Message sent successfully!');
        form.reset();
      } else {
        alert(data.error || 'Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('[contact] Error:', error);
      alert('Error sending message. Please try again.');
    }
  });
});

// ─── (Removed) ────────────────────────────────────────────────────────────────
// The old CORS proxy stub has been replaced by the real Vercel backend above.








// ─── (Removed) ────────────────────────────────────────────────────────────────
// getVisitorIP() is no longer needed — the Vercel backend reads the visitor IP
// directly from the x-forwarded-for request header, which is more accurate.

// ─── (Removed) ────────────────────────────────────────────────────────────────
// getGeolocation() is no longer needed — the Vercel backend calls ipgeolocation.io
// with a secret API key stored in Vercel Environment Variables.

// Function to get basic browser information
function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

// ─── Visitor Tracking ─────────────────────────────────────────────────────────
// Sends browser/page info to the secure Vercel backend (/api/notify).
// The backend resolves geolocation and sends the Telegram notification.
// No API keys are ever exposed to the browser.
async function notifyVisitor() {
  try {
    // Skip notification when testing locally
    const isLocalhost = window.location.hostname === 'localhost'
      || window.location.hostname === '127.0.0.1';
    // if (isLocalhost) return;

    const browserInfo = getBrowserInfo();

    await fetch(`${BACKEND_URL}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: window.location.href,
        referrer: document.referrer || '',
        screenResolution: browserInfo.screenResolution,
        language: browserInfo.language,
        timezone: browserInfo.timeZone,
        userAgent: browserInfo.userAgent,
      }),
    });
  } catch (error) {
    // Silent fail — visitor tracking should never break the page
    console.error('[notify] Error:', error);
  }
}







// Call the function when the page loads
document.addEventListener('DOMContentLoaded', notifyVisitor);
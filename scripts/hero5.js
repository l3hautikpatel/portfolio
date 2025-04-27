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



// Add this JavaScript to your website
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form');

  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;

    // Format message for Telegram
    const formattedMessage = `
Name: ${name}
Email: ${email}
Message: ${message}
    `.trim();

    // URL encode the message
    const encodedMessage = encodeURIComponent(formattedMessage);

    // Construct Telegram API URL
    const telegramUrl = `https://api.telegram.org/bot7899217208:AAGmCrx0MXiN_oQtUzSdoRw571TV1cA2AEE/sendMessage?chat_id=700678109&text=${encodedMessage}&parse_mode=HTML`;

    try {
      // Send the message
      const response = await fetch(telegramUrl);
      const data = await response.json();

      if (data.ok) {
        alert('Message sent successfully!');
        form.reset(); // Clear the form
      } else {
        alert('Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending message. Please try again.');
    }
  });
});

// If you need CORS workaround, use this alternative version with proxy
function sendViaCorsProxy() {
  const form = document.querySelector('.contact-form');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;

    const formattedMessage = `
Name: ${name}
Email: ${email}
Message: ${message}
    `.trim();

    try {
      const response = await fetch('YOUR_BACKEND_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message: formattedMessage
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Message sent successfully! I will get back to you as soon as possible.');
        form.reset();
      } else {
        alert('Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending message. Please try again.');
    }
  });
}








async function getVisitorIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'Unable to get IP';
  }
}

// Function to get geolocation information
async function getGeolocation(ip) {
  try {
    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=4f0efc5c4b62480f830f8b7c17d2e309&ip=${ip}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return null;
  }
}

// Function to get basic browser information
function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

// Function to send visitor notification to Telegram
async function notifyVisitor() {
  try {
    const visitorIP = await getVisitorIP();
    const geolocation = await getGeolocation(visitorIP);
    const browserInfo = getBrowserInfo();
    const currentTime = new Date().toLocaleString();
    
    // Prepare location information
    const location = geolocation 
      ? `${geolocation.city}, ${geolocation.state_prov}, ${geolocation.country_name}`
      : 'Location Unknown';
    
    // Format the message
    const message = `
🌐 New Website Visitor!

📅 Time: ${currentTime}
🔍 IP Address: ${visitorIP}
📍 Location: ${location}
🌍 Language: ${browserInfo.language}
📱 Screen: ${browserInfo.screenResolution}
⏰ Timezone: ${browserInfo.timeZone}
🌐 Page: ${window.location.href}

${geolocation ? `🚩 Country Flag: ${geolocation.country_flag}` : ''}
🌍 ISP: ${geolocation?.isp || 'Unknown'}

User Agent: ${browserInfo.userAgent}
`.trim();

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Send to Telegram
    // const telegramUrl = `https://api.telegram.org/bot7596754424:AAEs3TWLmjCJauExOoRhfqe5FvQJauaBeFk/sendMessage?chat_id=700678109&text=${encodedMessage}&parse_mode=HTML`;
    
    // Using fetch to send the notification
    await fetch(telegramUrl);
    
  } catch (error) {
    console.error('Error sending visitor notification:', error);
  }
}







// Call the function when the page loads
document.addEventListener('DOMContentLoaded', notifyVisitor);
var element = document.querySelectorAll('.h1s');
element.forEach((elem) => {
  var h1s = elem.querySelectorAll('h1');
  var index = 0;
  var animating = false;

  setInterval(() => {
    if (!animating) {
      animating = true;
      gsap.to(h1s[index], {
        top: '-=100%',
        duration: 1,
        ease: Expo.easeInOut,
        onComplete: function () {
          gsap.set(this._targets[0], {
            top: '100%',
          });
          animating = false;
        },
      });

      index === h1s.length - 1 ? index = 0 : index++;

      gsap.to(h1s[index], {
        top: '-=100%',
        duration: 1,
        ease: Expo.easeInOut,
      });
    }
  }, 3000); // 1000ms = 1 second
});



const scrollText = document.querySelector('.scroll-Text');

gsap.to(scrollText, {
  y: -20,
  duration: 1,
  ease: 'power2.inOut',
  repeat: -1,
  yoyo: true
});


const scrollerIns = document.querySelectorAll('.scroller-in');

scrollerIns.forEach((scrollerIn) => {
  const text = scrollerIn.textContent;
  const words = text.split(' ');
  scrollerIn.innerHTML = '';

  words.forEach((word) => {
    const h4 = document.createElement('h4');
    h4.textContent = word + " ";
    scrollerIn.appendChild(h4);
  });
});

// Add responsive handling for the scroller text size
function adjustScrollerSize() {
  const viewportWidth = window.innerWidth;
  const scrollerH4Elements = document.querySelectorAll('.scroller-in h4');
  
  if (viewportWidth <= 480) {
    scrollerH4Elements.forEach(h4 => {
      h4.style.fontSize = '140px';
    });
  } else if (viewportWidth <= 768) {
    scrollerH4Elements.forEach(h4 => {
      h4.style.fontSize = '200px';
    });
  } else {
    scrollerH4Elements.forEach(h4 => {
      h4.style.fontSize = '280px';
    });
  }
}

// Run on load and when window is resized
window.addEventListener('load', adjustScrollerSize);
window.addEventListener('resize', adjustScrollerSize);
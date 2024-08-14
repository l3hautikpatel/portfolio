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
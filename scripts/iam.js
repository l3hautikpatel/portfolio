document.addEventListener('DOMContentLoaded', () => {
    // Initial animations
    gsap.to('.section-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.to('.content-wrapper', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Animate stats
    const stats = document.querySelectorAll('.number');
    stats.forEach(stat => {
        let targetNumber = parseFloat(stat.textContent);
        gsap.from(stat, {
            textContent: 0,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 0.1 },
            stagger: {
                each: 0.2,
                onUpdate: function() {
                    // Format based on whether it's a whole number or decimal
                    this.targets()[0].innerHTML = Number.isInteger(targetNumber) ? 
                        Math.ceil(this.targets()[0].textContent) : 
                        parseFloat(this.targets()[0].textContent).toFixed(2);
                },
            }
        });
    });

    // Stagger animation for tech tags
    gsap.from('.tech-tags span', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.5
    });

    // Hover animations for items
    document.querySelectorAll('.stat-item, .tech-tags span').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                y: -5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
});
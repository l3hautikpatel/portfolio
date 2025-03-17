function generateHexagons() {
    const container = document.querySelector('.bgMain');
    const numHexagons = Math.floor(window.innerWidth / 50) * Math.floor(window.innerHeight / 50);
    const numRows = Math.floor(window.innerHeight / 50);

    for (let i = 0; i < numRows; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        container.appendChild(row);

        for (let j = 0; j < Math.floor(window.innerWidth / 50); j++) {
            const hexagon = document.createElement('div');
            hexagon.classList.add('hexagon');
            row.appendChild(hexagon);
        }
    }
}

generateHexagons();

window.addEventListener('resize', () => {
    const container = document.querySelector('.bgMain');
    container.innerHTML = '';
    generateHexagons();
});

let cursor = document.querySelector('.curser-blur');






document.addEventListener('mousemove', (e) => {
    let x = e.pageX;
    let y = e.pageY;
    cursor.style.left = (x - 150) + "px";
    cursor.style.top = (y - 150) + "px";
    cursor.style.opacity = "0.5";
});









const heroSection = document.querySelector('.pointBg');
const particleCount = 65;

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position, size and animation delay
    const size = Math.random() * 5 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
    
    heroSection.appendChild(particle);
}

// Add particle style
const particleStyle = document.createElement('style');
particleStyle.innerHTML = `
    .particle {
        position: absolute;
        background-color: #d27530;
        border-radius: 50%;
        opacity: 0.1;
        animation: float 15s infinite linear;
        z-index:990;
    }
    
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.3;
        }
        25% {
            transform: translateY(-100px) translateX(100px) rotate(90deg);
            opacity: 0.5;
        }
        50% {
            transform: translateY(-200px) translateX(0) rotate(180deg);
            opacity: 0.3;
        }
        75% {
            transform: translateY(-100px) translateX(-100px) rotate(270deg);
            opacity: 0.5;
        }
        100% {
            transform: translateY(0) translateX(0) rotate(360deg);
            opacity: 0.3;
        }
    }
`;
document.head.appendChild(particleStyle);




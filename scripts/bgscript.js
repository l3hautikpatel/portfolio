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


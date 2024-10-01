const projects = document.querySelectorAll('.project');
const navContainer = document.querySelector('.navigation');
const background = document.querySelector('.project-background');
let currentIndex = 0;
let timeoutId = null;
let intervalId = null;

// Create navigation dots
projects.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('nav-dot');
    dot.addEventListener('click', () => goToProject(index, true));
    navContainer.appendChild(dot);
});

const navDots = document.querySelectorAll('.nav-dot');

function goToProject(index, manual = false) {
    // Clear any existing timers
    clearTimeout(timeoutId);
    clearInterval(intervalId);

    // Update classes and background
    projects[currentIndex].classList.remove('active');
    navDots[currentIndex].classList.remove('active');
    currentIndex = index;
    projects[currentIndex].classList.add('active');
    navDots[currentIndex].classList.add('active');
    updateBackground();

    // Set up next automatic transition
    if (manual) {
        timeoutId = setTimeout(() => {
            intervalId = setInterval(nextProject, 5000);
        }, 10000);
    } else {
        intervalId = setInterval(nextProject, 5000);
    }
}

function nextProject() {
    goToProject((currentIndex + 1) % projects.length);
}

function updateBackground() {
    const newBackgroundImage = window.getComputedStyle(projects[currentIndex].querySelector('.project-image')).backgroundImage;
    background.style.backgroundImage = newBackgroundImage;
}

// Initial setup
navDots[0].classList.add('active');
updateBackground();
intervalId = setInterval(nextProject, 5000);

// Add hover pause functionality
projects.forEach(project => {
    project.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
    });
    project.addEventListener('mouseleave', () => {
        intervalId = setInterval(nextProject, 5000);
    });
});
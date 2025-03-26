// carousel.js
export function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const cards = track.children;
    const cardWidth = cards[0].offsetWidth + 16; // Including gap-[1rem] which is 16px
    let position = 0;
    const speed = 0.7;
    let animationFrame;

    // Clone cards for seamless looping
    const originalLength = cards.length;
    for (let i = 0; i < originalLength; i++) {
        track.appendChild(cards[i].cloneNode(true));
    }

    function animate() {
        position -= speed;
        
        if (Math.abs(position) >= cardWidth * originalLength) {
            position = 0;
        }
        
        track.style.transform = `translateX(${position}px)`;
        animationFrame = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Pause on hover
    track.addEventListener('mouseenter', () => {
        cancelAnimationFrame(animationFrame);
    });

    track.addEventListener('mouseleave', () => {
        animate();
    });
}
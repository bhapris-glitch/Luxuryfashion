document.addEventListener('DOMContentLoaded', () => {
    // GSAP Fade in effects
    gsap.to(".fade-in", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Stitching animation for lines
    gsap.from(".stitch-line", {
        drawSVG: "0%",
        duration: 2,
        ease: "power1.inOut"
    });
});

function closeSplash() {
    gsap.to("#splash-overlay", {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            document.getElementById('splash-overlay').style.display = 'none';
        }
    });
}

gsap.registerPlugin(ScrollTrigger); // Required for plugins to work properly

const isHomepage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');

// Exclude homepage from page-load fade-in animation
if (isHomepage) {
    document.body.style.animation = 'none';
}

// Set video playback speed to 0.5x
const video = document.querySelector('.sense-video-container video');
if (video) {
    video.playbackRate = 0.5;
}



// --- Hero Page Hover Animation -------------------------------------------------------------------------

const initHeroEngine = () => {
    const heroTitle = document.querySelector('.sense-type-hero h1');
    // Safety check: if the element isn't on this page, stop immediately
    if (!heroTitle || typeof gsap === 'undefined') return;

    // 1. Text
    const text = heroTitle.textContent.trim();
    heroTitle.innerHTML = '';
    heroTitle.style.perspective = "1000px";
    heroTitle.style.cursor = "pointer"; // Show user they can click

    const letters = text.split('').map(char => {
        const span = document.createElement('span');
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = 'inline-block';
        span.style.position = 'relative';
        span.style.willChange = 'transform, color';
        heroTitle.appendChild(span);
        return span;
    });

    let mouse = { x: -1000, y: -1000 };
    let isExploding = false; // Flag to stop proximity 

    // 2. Interaction Listeners
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // --- Click Explosion Animation ---
    heroTitle.addEventListener('click', () => {
        if (isExploding) return; // Prevent double-clicks
        isExploding = true;

        gsap.to(letters, {
            duration: 0.8,
            x: () => (Math.random() - 0.5) * 800,
            y: () => (Math.random() - 0.5) * 800,
            z: () => Math.random() * 500 + 200,
            rotation: () => Math.random() * 720 - 360,
            rotationX: () => Math.random() * 360,
            rotationY: () => Math.random() * 360,
            opacity: 0,
            ease: "expo.out",
            stagger: 0.02,
            onComplete: () => {
                // Return to original state
                gsap.to(letters, {
                    duration: 1.5,
                    x: 0, y: 0, z: 0,
                    rotation: 0, rotationX: 0, rotationY: 0,
                    opacity: 1,
                    ease: "elastic.out(1, 0.3)",
                    stagger: 0.02,
                    onComplete: () => { isExploding = false; }
                });
            }
        });
    });

    // 3. Proximity Loop (GSAP Ticker)
    gsap.ticker.add(() => {
        if (isExploding) return; 

        letters.forEach((letter) => {
            const rect = letter.getBoundingClientRect();
            const letterX = rect.left + rect.width / 2;
            const letterY = rect.top + rect.height / 2;

            const dx = mouse.x - letterX;
            const dy = mouse.y - letterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 250;

            if (distance < maxDist) {
                const relDist = (maxDist - distance) / maxDist;
                gsap.to(letter, {
                    x: dx * 0.3 * relDist,
                    y: dy * 0.3 * relDist,
                    z: 120 * relDist,
                    rotationY: dx * 0.5 * relDist,
                    rotationX: -dy * 0.5 * relDist,
                    color: '#2F00FF',
                    textShadow: `0 ${10 * relDist}px ${20 * relDist}px rgba(47, 0, 255, 0.4)`,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            } else {
                gsap.to(letter, {
                    x: 0, y: 0, z: 0,
                    rotationY: 0, rotationX: 0,
                    color: '#FFFFFF',
                    textShadow: "0 0 0px rgba(0,0,0,0)",
                    duration: 0.8,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        });
    });
};

// Start the engine
window.addEventListener('DOMContentLoaded', initHeroEngine);



// --- Video Invert on Title Click -------------------------------------------------------------------------

if (isHomepage) {
    const heroTitleForInvert = document.querySelector('.sense-type-hero h1');
    const videoForInvert = document.querySelector('.sense-video-container video');

    if (heroTitleForInvert && videoForInvert) {
        let isInverted = false;

        heroTitleForInvert.addEventListener('click', () => {
            isInverted = !isInverted;

            gsap.to(videoForInvert, {
                filter: isInverted ? 'grayscale(100%) invert(1)' : 'grayscale(100%)',
                duration: 0.8,
                ease: 'power2.inOut'
            });
        });
    }
}



// Hero Title Animation -------------------------------------------------------------------------
const heroTitle = document.querySelector('.sense-type-hero h1');

if (isHomepage && heroTitle) {
    const text = heroTitle.textContent.trim();
    heroTitle.innerHTML = '';
    
    // Wrap characters in spans with perspective containers
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === " " ? "\u00A0" : char; // Handle spaces
        span.style.display = 'inline-block';
        span.style.perspective = "1000px"; // Give each letter its own 3D space
        heroTitle.appendChild(span);
    });

    const letters = heroTitle.children;

    // 1. Initial 3D Entrance
    gsap.from(letters, {
        duration: 2,
        opacity: 0,
        scale: 0,
        y: 80,
        rotationX: -90,
        z: -500,
        stagger: {
            each: 0.05,
            from: "center"
        },
        ease: "expo.out"
    });

    // 2. Subtle Idle Float Loop
    gsap.to(letters, {
        y: "10px",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            each: 0.1,
            from: "edges"
        }
    });

    // 3. Magnetic Mouse Follow
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth) - 0.5;
        const yPos = (clientY / window.innerHeight) - 0.5;

        gsap.to(letters, {
            duration: 0.7,
            rotationY: xPos * 40, // Tilt left/right
            rotationX: -yPos * 40, // Tilt up/down
            x: xPos * 20,
            y: yPos * 20,
            stagger: 0.02,
            ease: "power2.out"
        });
    });
}



// Scroll Animations -------------------------------------------------------------------------

gsap.utils.toArray("section:not(#sight):not(#sound):not(#smell):not(#taste):not(#touch):not(#statement-journey-wrapper):not(#artists)").forEach((section) => {
    const elements = section.querySelectorAll("h1, h2, h3, p, .sight-album-container, .artist-container");

    if (elements.length > 0) {
        gsap.from(elements, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%", // Animation starts when the top of the section hits 80% of the viewport height
                toggleActions: "play none none none" // Plays on enter, stays visible
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
        });
    }
});



// Header Nav Hover Animations -------------------------------------------------------------------------

const navSummaries = document.querySelectorAll('header nav summary');

navSummaries.forEach(summary => {
    summary.addEventListener('mouseenter', () => {
        gsap.to(summary, {
            scale: 1.1,
            duration: 0.3,
            ease: "power1.out"
        });
    });

    summary.addEventListener('mouseleave', () => {
        gsap.to(summary, {
            scale: 1,
            duration: 0.3,
            ease: "power1.out"
        });
    });
});

const dropdownLinks = document.querySelectorAll('header .dropdown-content a');

dropdownLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            x: 5,
            duration: 0.2,
            ease: "power1.out"
        });
    });

    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            backgroundColor: 'transparent',
            x: 0,
            duration: 0.2,
            ease: "power1.out"
        });
    });
});



// --- Header Dropdown Animation -------------------------------------------------------------------------

function initDropdownAnimations() {
    const detailsElements = gsap.utils.toArray('header details');

    if (detailsElements.length === 0) return;

    // Set initial state for all dropdowns to be invisible 
    detailsElements.forEach(detail => {
        const content = detail.querySelector('.dropdown-content');
        gsap.set(content, { autoAlpha: 0, y: -15, transformOrigin: 'top center' });
    });

    detailsElements.forEach(detail => {
        const summary = detail.querySelector('summary');
        const content = detail.querySelector('.dropdown-content');

        summary.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the default <details> toggle

            // If this one is already open, close it
            if (detail.hasAttribute('open')) {
                gsap.to(content, {
                    autoAlpha: 0,
                    y: -15,
                    duration: 0.3,
                    ease: 'power2.inOut',
                    onComplete: () => detail.removeAttribute('open')
                });
            } else {
                // Close any other open dropdowns first
                detailsElements.forEach(otherDetail => {
                    if (otherDetail.hasAttribute('open')) {
                        const otherContent = otherDetail.querySelector('.dropdown-content');
                        gsap.to(otherContent, {
                            autoAlpha: 0,
                            y: -15,
                            duration: 0.3,
                            ease: 'power2.inOut',
                            onComplete: () => otherDetail.removeAttribute('open')
                        });
                    }
                });

                // Then, open the clicked one
                detail.setAttribute('open', '');
                gsap.to(content, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' });
            }
        });
    });

    // Global click listener to close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        // Prevent closing if mobile menu is active
        const header = document.querySelector('header');
        if (header && header.classList.contains('mobile-nav-active')) return;

        detailsElements.forEach(detail => {
            if (detail.hasAttribute('open') && !detail.contains(e.target)) {
                const content = detail.querySelector('.dropdown-content');
                gsap.to(content, { autoAlpha: 0, y: -15, duration: 0.3, ease: 'power2.inOut', onComplete: () => detail.removeAttribute('open') });
            }
        });
    });
}

// --- Word Drop Animation on Homepage ----------------------------------------------------------------------------

const videoContainer = document.querySelector('.sense-video-container');
const scalingContainer = document.querySelector('.scaling-container');

if (videoContainer && scalingContainer) {
    // Create canvas
    let canvas = document.getElementById('particle-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas'; 
        videoContainer.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');

    let width, height;
    let words = [];
    let waves = [];
    const senseTranslations = ["sense","حس", "חוש", "حس", "حس", "इंद्रिय", "ইন্দ্রিয়", "உணர்வு", "ఇంద్రియము", "ಇಂದ್ರಿಯ", "ഇന്ദ്രിയം", "ประสาทสัมผัส", "ປະສາດສຳຜັດ", "អារម្មណ៍", "အာရုံ", "感觉", "感覺", "感覚", "감각", "мэдрэхүй", "чувство", "відчуття", "усещане", "осећај", "αίσθηση", "զգացում", "გრძნობა", "ስሜት"]


    function resize() {
        width = videoContainer.offsetWidth;
        height = videoContainer.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Waves
        for (let i = waves.length - 1; i >= 0; i--) {
            const wave = waves[i];
            wave.radius += 2;
            wave.opacity -= 0.01;

            if (wave.opacity <= 0) {
                waves.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(47, 0, 255, ${wave.opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        for (let i = words.length - 1; i >= 0; i--) {
            const word = words[i];

            // Position and opacity
            word.y += word.vy;

            // Check if hit bottom
            if (word.y > height - 15) {
                // Create sound wave
                waves.push({
                    x: word.x,
                    y: height,
                    radius: 0,
                    opacity: 1
                });

                words.splice(i, 1);
                continue;
            }

            // Draw the word
            ctx.globalAlpha = word.opacity;
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `${word.size}px 'nunito sans'`;
            ctx.fillText(word.text, word.x, word.y);
        }
        ctx.globalAlpha = 1; // Reset alpha
    }

    // Start Animation Loop via GSAP Ticker
    gsap.ticker.add(draw);



    // Hover Interactions -------------------------------------------------------------------------

    const isMobileOrTablet = window.matchMedia("(max-width: 999px)").matches;

    if (isMobileOrTablet) {
        // Mobile & Tablet: Auto Rain
        gsap.set(canvas, { opacity: 1 });

        setInterval(() => {
            if (document.hidden) return;

            words.push({
                x: Math.random() * width,
                y: -30,
                vy: Math.random() * 2 + 2,
                text: senseTranslations[Math.floor(Math.random() * senseTranslations.length)],
                opacity: 1,
                size: Math.random() * 20 + 10
            });

            if (words.length > 50) words.shift();
        }, 300);
    } else {
        // Desktop: Mouse Interaction
        // Attach to scalingContainer to ensure it works even when video is scaled down
        scalingContainer.addEventListener('mouseenter', () => {
            gsap.to(canvas, { opacity: 1, duration: 0.5, ease: "power2.out" });
        });

        scalingContainer.addEventListener('mouseleave', () => {
            gsap.to(canvas, { opacity: 0, duration: 0.5, ease: "power2.out" });
        });

        let lastTime = 0;
        const throttleInterval = 100; // ms

        scalingContainer.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTime < throttleInterval) return; // Throttle event
            lastTime = now;

            const rect = videoContainer.getBoundingClientRect();
            // Calculate x/y relative to the video container (canvas)
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Only spawn if inside the video area
            if (x >= 0 && x <= width && y >= 0 && y <= height) {
                words.push({
                    x: x,
                    y: y,
                    vy: Math.random() * 2 + 1, // random fall speed
                    text: senseTranslations[Math.floor(Math.random() * senseTranslations.length)],
                    opacity: 1,
                    size: Math.random() * 20 + 10 // font size between 10 and 30
                });
            }
            
            // Limit total words to prevent performance issues
            if (words.length > 200) {
                words.shift();
            }
        });
    }
}

// Initialize Dropdown Animations
if (document.readyState === 'complete') {
    initDropdownAnimations();
} else {
    window.addEventListener('load', initDropdownAnimations);
}



// --- Page Transition -------------------------------------------------------------------------

window.addEventListener('pageshow', (event) => {
    // Instantly restore opacity if the page is loaded from cache (e.g., back button)
    if (event.persisted) {
        gsap.set(document.body, { opacity: 1 });
        document.body.classList.remove('fade-out');
    }
});

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        const target = link.getAttribute('target');
        const isLinkToHomepage = href === 'index.html' || href === '/';

        // Only apply transition if not navigating to or from the homepage
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && target !== '_blank' && !isHomepage && !isLinkToHomepage) {
            e.preventDefault();
            gsap.to(document.body, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => window.location.href = href
            });
        }
    });
});



// --- Sight Page Title Animation -------------------------------------------------------------------------

const sightTitle = document.querySelector('.sight-section h1');
if (sightTitle) {
    // Setup for 3D rotation
    gsap.set(sightTitle, { 
        transformPerspective: 1000, 
        transformStyle: "preserve-3d",
        transformOrigin: "center center"
    });

    // 1. Blinking Animation 
    function blink() {
        gsap.to(sightTitle, {
            scaleY: 0.1,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
            onComplete: () => gsap.delayedCall(Math.random() * 3 + 2, blink)
        });
    }
    blink();

    // 2. Look-at-Cursor Animation
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // Range: -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2; // Range: -1 to 1

        gsap.to(sightTitle, {
            rotationY: x * 40,
            rotationX: -y * 40,
            duration: 0.8,
            ease: "power2.out"
        });
    });
}



// --- Sight Page Carousel Animation -------------------------------------------------------------------------

(function() {
    "use strict";

    const initEyeballCarousel = () => {
        const sightSection = document.querySelector('#sight');
        const albums = gsap.utils.toArray('.sight-album-container');
        
        if (!sightSection || albums.length === 0 || typeof gsap === 'undefined') return;

        // 1. Force Section Styles
        gsap.set(sightSection, { 
            position: 'relative',
            height: '150vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            perspective: '1200px', 
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
            paddingBottom: '0'
        });

        // 2. Setup the Orbiter
        let orbiter = document.getElementById('eyeball-orbiter');
        if (!orbiter) {
            orbiter = document.createElement('div');
            orbiter.id = 'eyeball-orbiter';
            albums.forEach(album => orbiter.appendChild(album));
            sightSection.appendChild(orbiter);
        }

        gsap.set(orbiter, {
            position: 'relative',
            width: '100%',
            height: '60%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformStyle: 'preserve-3d',
            y: '10rem'
        });

        // 3. RESPONSIVE CALCULATION ENGINE
        const updateLayout = () => {
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

            // Dynamic Radius: Smaller on mobile so albums don't fly off-screen
            const radius = isMobile ? window.innerWidth * 0.3 : 
                           isTablet ? window.innerWidth * 0.25 : 320;

            // Dynamic Item Size: Scales with screen width
            const itemSize = isMobile ? window.innerWidth * 0.4 : 
                             isTablet ? 220 : 280;

            const total = albums.length;
            const angleStep = 360 / total;

            albums.forEach((album, i) => {
                gsap.set(album, {
                    position: 'absolute',
                    width: `${itemSize}px`,
                    height: `${itemSize}px`,
                    zIndex: 1,
                    backfaceVisibility: 'visible',
                    rotationY: i * angleStep,
                    // Recalculates the 3D depth on resize
                    transformOrigin: `50% 50% -${radius}px`, 
                    force3D: true
                });

                const img = album.querySelector('img');
                if (img) gsap.set(img, { width: '100%', height: '100%', objectFit: 'cover' });
            });
        };

        // Initialize and listen for resize
        updateLayout();
        window.addEventListener('resize', updateLayout);

        // 4. Constant Rotation
        const mainRotation = gsap.to(orbiter, {
            rotationY: 360,
            duration: 30,
            repeat: -1,
            ease: "none"
        });

        // 5. MOUSE & TOUCH INTERACTION
        const handleMove = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const xPercent = (clientX / window.innerWidth) - 0.5;
            const yPercent = (clientY / window.innerHeight) - 0.5;

            gsap.to(orbiter, {
                rotationX: -yPercent * 25, 
                rotationZ: xPercent * 8,   
                duration: 1,
                ease: "power2.out"
            });
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: true });

        // 6. Interaction Logic
        albums.forEach((album) => {
            const onEnter = () => {
                gsap.to(mainRotation, { timeScale: 0.1, duration: 0.5 });
                gsap.to(album, { scale: 1.1, z: 50, duration: 0.4 });
            };
            const onLeave = () => {
                gsap.to(mainRotation, { timeScale: 1, duration: 0.5 });
                gsap.to(album, { scale: 1, z: 0, duration: 0.4 });
            };

            album.addEventListener('mouseenter', onEnter);
            album.addEventListener('mouseleave', onLeave);
            // Touch support for "hover" focus
            album.addEventListener('touchstart', onEnter, { passive: true });
            album.addEventListener('touchend', onLeave, { passive: true });
        });
    };

    window.addEventListener('load', initEyeballCarousel);
})();




// --- Sound Page EQ Animation -------------------------------------------------------------------------

const soundSection = document.querySelector('#sound');
if (soundSection) {
    const soundTitle = soundSection.querySelector('.sound-section h1');
    if (soundTitle) {
        const text = soundTitle.textContent.trim();
        soundTitle.innerHTML = '';
        
        // Split text into spans
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.position = 'relative';
            soundTitle.appendChild(span);
        });

        const letters = soundTitle.children;

        // Animate the letters sound wave
        gsap.to(letters, {
            y: "random(-20, 20)",
            scaleY: "random(0.8, 1.2)",
            duration: 0.4,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
            stagger: {
                each: 0.1,
                from: "center"
            }
        });
    }

    // Scroll animation for albums in the sound section
    const soundAlbums = soundSection.querySelectorAll('.sound-section-img .sight-album-container');
    if (soundAlbums.length > 0) {
        gsap.from(soundAlbums, {
            scrollTrigger: {
                trigger: soundSection.querySelector('.sound-section-img'),
                start: "top 80%",
                toggleActions: "play none none none"
            },
            autoAlpha: 0,
            y: 100,
            rotationX: -80,
            transformOrigin: "center bottom",
            duration: 1.2,
            stagger: 0.2,
            ease: "expo.out"
        });
    }

    // Add back a generic scroll animation for the text elements
    const soundText = soundSection.querySelectorAll('.sound-section h2, .sound-section h3');
    if (soundText.length > 0) {
        gsap.from(soundText, {
            scrollTrigger: {
                trigger: soundSection.querySelector('.sound-section'),
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
        });
    }
}



// --- Sound wave Animation -------------------------------------------------------------------------

(function() {
    const initLongWave = () => {
        const soundSection = document.querySelector('#sound');
        if (!soundSection) return;

        // 1. Setup the EQ Track (Full Width)
        const eqContainer = document.createElement('div');
        eqContainer.id = 'long-magnetic-eq';
        soundSection.appendChild(eqContainer);

        gsap.set(eqContainer, {
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '4px', // Tighter gap for a longer look
            height: '300px',
            width: '100%',
            position: 'relative',
            marginTop: '4rem',
            cursor: 'none'
        });

        // 2. Bar Count
        const barCount = 65; 
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'long-mag-bar';
            eqContainer.appendChild(bar);
            
            gsap.set(bar, {
                width: '1.2vw',
                height: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '2px',
                transformOrigin: 'bottom',
                opacity: 0.2,
                willChange: 'transform, opacity'
            });
        }

        const bars = document.querySelectorAll('.long-mag-bar');

        // 3. Expanded Mouse Tracking
        window.addEventListener('mousemove', (e) => {
            const rect = soundSection.getBoundingClientRect();
            
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                bars.forEach((bar) => {
                    const barRect = bar.getBoundingClientRect();
                    const barCenterX = barRect.left + barRect.width / 2;
                    
                    const dist = Math.abs(e.clientX - barCenterX);
                    
                    // Radius of influence for the wave effect
                    const maxDist = 600; 
                    const proximity = Math.max(0, maxDist - dist);
                    
                    // Math for a taller, longer wave
                    const scaleFactor = 1 + (proximity / 60); 
                    const opacityFactor = 0.2 + (proximity / maxDist);
                    
                    // Color transitions from White to Deep Blue
                    const blueIntensity = (proximity / maxDist);

                    gsap.to(bar, {
                        scaleY: scaleFactor,
                        opacity: opacityFactor,
                        backgroundColor: proximity > 0 ? `rgb(${255 * (1 - blueIntensity)}, ${255 * (1 - blueIntensity)}, 255)` : '#ffffff',
                        duration: 0.3,
                        ease: "power1.out"
                    });
                });
            }
        });

        // 4. Reset to subtle ambient state
        soundSection.addEventListener('mouseleave', () => {
            gsap.to(bars, { 
                scaleY: 1, 
                backgroundColor: '#ffffff', 
                opacity: 0.2, 
                duration: 1.5,
                stagger: {
                    amount: 0.5,
                    from: "center"
                }
            });
        });
    };

    window.addEventListener('load', initLongWave);
})();



// --- Smell Section Animation -------------------------------------------------------------------------

(function() {
    "use strict";

    const initSmellSection = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const section = document.querySelector('#smell');
        if (!section) return;

        // 1. Protection: Ensure albums are visible before animation starts
        const albums = section.querySelectorAll('.sight-album-container');
        gsap.set(albums, { autoAlpha: 1, visibility: "visible" });

        // 2. Smoky Text Animation
        const title = section.querySelector('.smell-section h1');
        if (title && !title.dataset.splitDone) {
            const rawText = title.textContent.trim();
            title.innerHTML = '';
            title.dataset.splitDone = "true";

            const chars = rawText.split('').map(char => {
                const span = document.createElement('span');
                span.textContent = char === " " ? "\u00A0" : char;
                span.style.display = 'inline-block';
                title.appendChild(span);
                return span;
            });

            // Entrance + Continuous Loop
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    toggleActions: "play none none none"
                }
            });

            tl.from(chars, {
                filter: "blur(20px)",
                opacity: 0,
                y: 30,
                scale: 1.2,
                duration: 1.5,
                stagger: { amount: 0.8, from: "random" },
                ease: "power2.out"
            })
            .to(chars, {
                y: -10,
                filter: "blur(4px)",
                opacity: 0.7,
                scale: 1.1,
                duration: 2,
                ease: "sine.inOut",
                stagger: {
                    amount: 1,
                    from: "random",
                    yoyo: true,
                    repeat: -1
                }
            });
        }

        // 3. Album Scroll Reveal + Loop
        const albumContainer = section.querySelector('.smell-section-img');
        if (albums.length > 0) {
            const tlAlbums = gsap.timeline({
                scrollTrigger: {
                    trigger: albumContainer || section,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });

            tlAlbums.from(albums, {
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out"
            });

            // 4. Hover Effect: "Diffusion"
            albums.forEach((container) => {
                const img = container.querySelector('img');
                let waftTween;

                // Ensure GSAP has full control over the image
                gsap.set(img, { transition: "none" });

                container.addEventListener('mouseenter', () => {
                    // Diffuse (Blur + Scale + Opacity)
                    gsap.to(img, {
                        scale: 1.15,
                        filter: "blur(6px)",
                        opacity: 0.8,
                        duration: 0.8,
                        ease: "power2.out"
                    });

                    // Waft (Gentle floating motion)
                    waftTween = gsap.to(img, {
                        x: "random(-10, 10)",
                        y: "random(-10, 10)",
                        rotation: "random(-3, 3)",
                        duration: 2.5,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });
                });

                container.addEventListener('mouseleave', () => {
                    if (waftTween) waftTween.kill();
                    
                    gsap.to(img, {
                        scale: 1,
                        filter: "blur(0px)",
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotation: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                });
            });
        }
    };

    if (document.readyState === 'complete') {
        initSmellSection();
    } else {
        window.addEventListener('load', initSmellSection);
    }
})();



// --- Taste Section Animation -------------------------------------------------------------------------

(function() {
    "use strict";

    const initTasteSection = () => {
        const section = document.querySelector('#taste');
        if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const title = section.querySelector('.taste-section h1');
        const albums = section.querySelectorAll('.sight-album-container');

        // 1. Liquify Title Reveal
        if (title && !title.dataset.tasteAnimated) {
            title.dataset.tasteAnimated = 'true';
            const text = title.textContent.trim();
            title.innerHTML = '';

            const letters = text.split('').map(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                Object.assign(span.style, {
                    display: 'inline-block',
                    transformOrigin: '50% 100%',
                });
                title.appendChild(span);
                return span;
            });

            gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                }
            })
            .from(letters, {
                opacity: 0,
                y: -100,
                scaleY: 3.5,
                scaleX: 0.5,
                filter: 'blur(15px)',
                duration: 1.2,
                stagger: { each: 0.06, from: 'center' },
                ease: "elastic.out(1, 0.5)"
            })
            .to(letters, {
                scaleY: 1.05,
                scaleX: 0.98,
                skewX: "random(-5, 5)",
                duration: "random(2, 3)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: { each: 0.1, from: "random" }
            }, "-=0.2");
        }

        // 2. Global Mouse Tracking Logic
        if (albums.length > 0) {
            gsap.set(albums, { autoAlpha: 1, visibility: "visible", position: "relative", zIndex: 1 });

            // Entrance Animation
            gsap.from(albums, {
                scrollTrigger: { trigger: '.taste-section-img', start: "top 85%" },
                y: 60,
                opacity: 0,
                scale: 0.8,
                duration: 1,
                stagger: 0.15,
                ease: "back.out(1.4)"
            });

            // Flavor Burst Particle Function
            const createFlavorBurst = (x, y) => {
                for (let i = 0; i < 6; i++) {
                    const dot = document.createElement('div');
                    Object.assign(dot.style, {
                        position: 'fixed',
                        width: '8px',
                        height: '8px',
                        backgroundColor: i % 2 === 0 ? '#ff4d8d' : '#2F00FF',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        zIndex: '9999',
                        left: `${x}px`,
                        top: `${y}px`
                    });
                    document.body.appendChild(dot);

                    const angle = (i / 6) * Math.PI * 2;
                    const velocity = 40 + Math.random() * 40;

                    gsap.to(dot, {
                        x: Math.cos(angle) * velocity,
                        y: Math.sin(angle) * velocity,
                        opacity: 0,
                        scale: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        onComplete: () => dot.remove()
                    });
                }
            };

            // GLOBAL LISTENER: Tracks mouse everywhere on the page
            window.addEventListener('mousemove', (e) => {
                albums.forEach(album => {
                    const rect = album.getBoundingClientRect();
                    const img = album.querySelector('img');
                    
                    // Check if mouse is inside the album boundaries
                    const isInside = (
                        e.clientX >= rect.left && 
                        e.clientX <= rect.right && 
                        e.clientY >= rect.top && 
                        e.clientY <= rect.bottom
                    );

                    if (isInside) {
                        if (album.dataset.isHovered !== "true") {
                            album.dataset.isHovered = "true";
                            gsap.set(album, { zIndex: 10 });
                            gsap.killTweensOf(img);
                            
                            // Squish and Bounce
                            gsap.to(img, {
                                scaleX: 1.15, scaleY: 0.95, duration: 0.15,
                                onComplete: () => {
                                    gsap.to(img, { scale: 1.1, duration: 0.6, ease: "elastic.out(1, 0.3)" });
                                }
                            });
                            createFlavorBurst(e.clientX, e.clientY);
                        }
                    } else {
                        if (album.dataset.isHovered === "true") {
                            album.dataset.isHovered = "false";
                            gsap.killTweensOf(img);
                            gsap.to(img, {
                                scale: 1, duration: 0.4, ease: "power3.out",
                                onComplete: () => gsap.set(album, { zIndex: 1 })
                            });
                        }
                    }
                });
            });
        }
    };

    window.addEventListener('load', initTasteSection);
})();



// --- Artists Section Animation -------------------------------------------------------------------------

(function() {
    "use strict";

    const initArtistsAnimation = () => {
        const section = document.querySelector('#artists');
        if (!section) return;

        const title = section.querySelector('h1');
        const grid = section.querySelector('.artists-grid');
        const artists = section.querySelectorAll('.artist-container');

        // 1. Title Reveal
        if (title) {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                },
                y: -50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            });
        }

        // 2. Grid Staggered Entrance
        if (artists.length > 0) {
            gsap.from(artists, {
                scrollTrigger: {
                    trigger: grid || section,
                    start: "top 75%",
                },
                y: 60,
                opacity: 0,
                scale: 0.5,
                rotation: "random(-10, 10)",
                duration: 1,
                stagger: {
                    amount: 0.8,
                    grid: "auto",
                    from: "center"
                },
                ease: "elastic.out(1, 0.5)"
            });

            // 3. Continuous Floating Motion
            artists.forEach((artist) => {
                const img = artist.querySelector('img');
                if (img) {
                    gsap.to(img, {
                        y: -8,
                        rotation: "random(-2, 2)",
                        duration: "random(2, 4)",
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                        delay: "random(0, 2)"
                    });
                }
            });
        }
    };

    window.addEventListener('load', initArtistsAnimation);
})();



// --- Mobile Menu Injection -------------------------------------------------------------------------

(function() {
    const header = document.querySelector('header');
    if (!header) return;

    // Create Hamburger
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger-menu';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(hamburger);

    // Toggle Logic
    hamburger.addEventListener('click', () => {
        header.classList.toggle('mobile-nav-active');
        const isActive = header.classList.contains('mobile-nav-active');
        document.body.style.overflow = isActive ? 'hidden' : '';

        // Force open details on mobile to ensure content is visible
        const details = document.querySelectorAll('header details');
        details.forEach(d => {
            if (isActive) {
                d.setAttribute('open', '');
            } else {
                d.removeAttribute('open');
            }
        });
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('mobile-nav-active');
            document.body.style.overflow = '';
        });
    });
})();



// --- Touch Section Animation -------------------------------------------------------------------------

(function() {
    "use strict";

    const initTouchSection = () => {
        const section = document.querySelector('#touch');
        if (!section) return;

        const grid = section.querySelector('.touch-section-img');
        const albums = section.querySelectorAll('.touch-section-img .sight-album-container');

        if (!grid || albums.length === 0) return;

        // 0. Title Animation (Tactile Squish Effect)
        const title = section.querySelector('.touch-section h1');
        if (title) {
            const text = title.textContent.trim();
            title.innerHTML = '';
            
            const chars = text.split('').map(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.display = 'inline-block';
                span.style.transformOrigin = 'center bottom'; // Anchor for squish effect
                title.appendChild(span);
                return span;
            });

            // Entrance
            gsap.from(chars, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                },
                y: -40,
                opacity: 0,
                scaleY: 1.5,
                duration: 1.2,
                stagger: 0.05,
                ease: "elastic.out(1, 0.5)"
            });

            // Looping "Touching" Animation
            // Letters gently squeeze inwards to "touch" each other
            const centerIndex = (chars.length - 1) / 2;
            gsap.to(chars, {
                x: (i) => (centerIndex - i) * 6, // Move towards center
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 1.2
            });

            // Interactive Squish
            title.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX;
                const mouseY = e.clientY;

                chars.forEach(char => {
                    const charRect = char.getBoundingClientRect();
                    const charCenterX = charRect.left + charRect.width / 2;
                    const charCenterY = charRect.top + charRect.height / 2;
                    const dist = Math.hypot(mouseX - charCenterX, mouseY - charCenterY);
                    const maxDist = 120;

                    if (dist < maxDist) {
                        const strength = (maxDist - dist) / maxDist;
                        gsap.to(char, {
                            scaleY: 1 - (strength * 0.5), // Squish down
                            scaleX: 1 + (strength * 0.2), // Bulge out
                            y: strength * 5,
                            color: '#ff4d8d', // React color
                            duration: 0.1,
                            ease: "power1.out",
                            overwrite: "auto"
                        });
                    } else {
                        gsap.to(char, { scaleY: 1, scaleX: 1, y: 0, color: '#2F00FF', duration: 0.5, ease: "elastic.out(1, 0.3)", overwrite: "auto" });
                    }
                });
            });

            title.addEventListener('mouseleave', () => {
                gsap.to(chars, { scaleY: 1, scaleX: 1, y: 0, color: '#2F00FF', duration: 0.6, ease: "elastic.out(1, 0.5)" });
            });
        }

        // 1. Assembly Animation
        // Albums start scattered and come together to form the grid
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: grid,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(albums, {
            x: (i) => (i % 2 === 0 ? -100 : 100), // Left column go left, right column go right
            y: (i) => (i < 2 ? -100 : 100),       // Top rows go up, bottom rows go down
            rotation: () => Math.random() * 30 - 15,
            scale: 0.8,
            autoAlpha: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: "elastic.out(1, 0.5)"
        });

        // 2. Interactive "Touch" Effect
        // When hovering, the grid pieces react slightly to the mouse (repel effect)
        grid.addEventListener('mousemove', (e) => {
            const rect = grid.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            albums.forEach(album => {
                const albumRect = album.getBoundingClientRect();
                // Calculate center of album relative to grid container
                const albumCenterX = (albumRect.left - rect.left) + albumRect.width / 2;
                const albumCenterY = (albumRect.top - rect.top) + albumRect.height / 2;

                const dist = Math.hypot(mouseX - albumCenterX, mouseY - albumCenterY);
                const maxDist = 250;

                if (dist < maxDist) {
                    const power = (maxDist - dist) / maxDist;
                    const moveX = (mouseX - albumCenterX) * -0.15 * power;
                    const moveY = (mouseY - albumCenterY) * -0.15 * power;

                    gsap.to(album, { x: moveX, y: moveY, duration: 0.4, ease: "power2.out" });
                } else {
                    gsap.to(album, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
                }
            });
        });

        grid.addEventListener('mouseleave', () => {
            gsap.to(albums, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
        });
    };

    window.addEventListener('load', initTouchSection);
})();



// --- Statement Section Animation -------------------------------------------------------------------------

(function() {
    "use strict";

    const initStatementJourney = () => {
        const wrapper = document.querySelector('#statement-journey-wrapper');
        if (!wrapper) return;

        const senseWord = wrapper.querySelector('.sense-word');
        const worlds = gsap.utils.toArray('.world-layer');
        const content = wrapper.querySelector('.statement-final-content');
        const contentText = content ? content.querySelectorAll('h1, p') : [];
        const albumGrid = content ? content.querySelector('.statement-albums-grid') : null;

        // Initial States
        gsap.set(worlds, { scale: 1, opacity: 0 });
        gsap.set(worlds[0], { opacity: 1, scale: 1 }); // Starts visible
        gsap.set(content, { opacity: 0 });
        gsap.set(contentText, { opacity: 0, y: 50 });
        if (albumGrid) gsap.set(albumGrid, { opacity: 0, y: 30 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                start: "top top",
                end: "+=7500", // Scroll duration
                pin: true,
                scrub: 1,
                anticipatePin: 1
            }
        });

        // Phase 1: Sight -> Sound
        tl.to(worlds[0], { scale: 2, opacity: 0, rotation: 45, duration: 1.5, ease: "power2.in" })
          .to(senseWord, { scale: 0.8, rotation: 90, duration: 1.5 }, "<")
          .fromTo(worlds[1], { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1.5 }, "<0.5");

        // Phase 2: Sound -> Smell
        tl.to(worlds[1], { scaleX: 3, scaleY: 0.1, opacity: 0, duration: 1.5, ease: "power2.in" }) // Squish effect for sound
          .to(senseWord, { scale: 1.2, rotation: 180, duration: 1.5 }, "<") // Flip upside down
          .fromTo(worlds[2], { opacity: 0, scale: 1.5, filter: "blur(80px)" }, { opacity: 1, scale: 1, filter: "blur(40px)", duration: 1.5 }, "<0.5");

        // Phase 3: Smell -> Taste
        tl.to(worlds[2], { scale: 0.2, opacity: 0, duration: 1.5, ease: "power2.in" })
          .to(senseWord, { rotation: 360, duration: 1.5 }, "<") // Flip back to normal axis (360 = 0)
          .fromTo(worlds[3], { opacity: 0, scale: 0.5, rotation: -45 }, { opacity: 1, scale: 1, rotation: 0, duration: 1.5 }, "<0.5");

        // Phase 4: Taste -> Touch
        tl.to(worlds[3], { scale: 3, opacity: 0, duration: 1.5, ease: "power2.in" })
          .to(senseWord, { scale: 0.5, duration: 1.5 }, "<")
          .fromTo(worlds[4], { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 1.5 }, "<0.5");

        // Phase 5: Touch -> Statement (Fly through)
        tl.to(worlds[4], { scale: 5, opacity: 0, duration: 1.5, ease: "expo.in" })
          .to(senseWord, { scale: 50, opacity: 0, duration: 1.5, ease: "expo.in" }, "<") // Fly through the word
          .to(content, { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.5")
          .to(contentText, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power2.out" }, "<0.2")
          .to(albumGrid, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "<0.5");
    };

    window.addEventListener('load', initStatementJourney);
})();
/* ============================================
   QUANTUMCASH - Main JavaScript
   Particles, Animations, Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Init critical UI immediately
    initNavbar();
    initScrollAnimations();
    initCounterAnimations();
    initSmoothScroll();

    // Delay heavy animations until page is painted
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            initParticles();
            initTypingEffect();
            pauseSVGAnimationsOnMobile();
        });
    });
});

/* ============================================
   PARTICLE SYSTEM
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId;

    // Mobile detection
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const maxParticles = isSmallMobile ? 12 : isMobile ? 20 : 100;
    const connectDist = isMobile ? 80 : 150;
    const particleDensity = isMobile ? 30000 : 12000;
    const skipConnections = isMobile;
    let frameCount = 0;

    // Debounced resize
    let resizeTimeout;
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function debouncedResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            // Rebuild particles for new screen size
            const newCount = Math.min(Math.floor((canvas.width * canvas.height) / particleDensity), maxParticles);
            if (Math.abs(newCount - particles.length) > 5) {
                particles = [];
                for (let i = 0; i < newCount; i++) {
                    particles.push(new Particle());
                }
            }
        }, 250);
    }

    resize();
    window.addEventListener('resize', debouncedResize, { passive: true });

    // Only track mouse on non-touch devices
    if (!isTouch) {
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * (isMobile ? 1.2 : 1.5) + 0.5;
            this.speedX = (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4);
            this.speedY = (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4);
            this.opacity = Math.random() * 0.4 + 0.1;

            const colors = [
                [129, 140, 248],
                [167, 139, 250],
                [244, 114, 182],
                [196, 181, 253],
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction (desktop only)
            if (!isTouch && mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.x -= (dx / dist) * force * 0.5;
                    this.y -= (dy / dist) * force * 0.5;
                }
            }

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Adjust particle count based on screen and device
    const count = Math.min(Math.floor((canvas.width * canvas.height) / particleDensity), maxParticles);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectDist) {
                    const opacity = (1 - dist / connectDist) * 0.12;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(167, 139, 250, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frameCount++;

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Skip connections on small mobile, throttle on tablet
        if (!skipConnections) {
            if (!isMobile || frameCount % 2 === 0) {
                connectParticles();
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    // Check for reduced motion preference
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animate();
    } else {
        particles.forEach(p => p.draw());
        connectParticles();
    }
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');

    // Scroll effect (passive for better performance)
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile toggle
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const isMobile = window.innerWidth <= 768;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = isMobile ? index * 50 : index * 80;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ============================================
   COUNTER ANIMATIONS
   ============================================ */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const hasDecimal = element.dataset.targetDecimal;
    const finalValue = hasDecimal ? parseFloat(hasDecimal) : target;
    const duration = 2000;
    const startTime = performance.now();

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = easedProgress * finalValue;

        if (hasDecimal) {
            element.textContent = current.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(current).toLocaleString('en-US') + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (hasDecimal) {
                element.textContent = finalValue.toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(finalValue).toLocaleString('en-US') + suffix;
            }
        }
    }

    requestAnimationFrame(update);
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const element = document.getElementById('typing-text');
    if (!element) return;

    const phrases = [
        'mundo crypto',
        'intercambio P2P',
        'ecosistema digital',
        'universo blockchain',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2500; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start after a short delay
    setTimeout(type, 600);
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // navbar height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   PAUSE SVG ANIMATIONS ON MOBILE
   ============================================ */
function pauseSVGAnimationsOnMobile() {
    if (window.innerWidth > 768) return;

    // Only pause SMIL animations on background/decorative SVGs, NOT illustration SVGs
    const backgroundSVGs = document.querySelectorAll(
        '.vector-art svg, .vector-about-helix, .vector-about-ring, ' +
        '.vector-grid, .vector-nodes, .vector-wave, ' +
        '.vector-why-circuit, .vector-why-mesh, .vector-contact-orbits, ' +
        '.vector-footer-line'
    );
    backgroundSVGs.forEach(svg => {
        if (typeof svg.pauseAnimations === 'function') {
            try { svg.pauseAnimations(); } catch(e) {}
        }
    });
}

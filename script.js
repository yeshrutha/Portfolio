/* ==========================================================================
   AURA SPACE - INTERACTIVE FUNCTIONS & COSMIC CANVAS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. SCROLL PROGRESS & NAVBAR SCROLL STATE
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.querySelector('.navbar-capsule');

    window.addEventListener('scroll', () => {
        // Calculate scroll percentage
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = `${scrolled}%`;
        }

        // Add class to navbar when page is scrolled
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 2. MOBILE NAVIGATION DRAWERS
    const mobileToggle = document.getElementById('mobile-toggle-btn');
    const mobileMenu = document.getElementById('mobile-menu-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            
            // Switch icon names based on state
            if (mobileMenu.classList.contains('open')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });

        // Close menu drawer when links are clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
    }



    // 4. GLOW CARD CURSOR TRACKING (Spotlight Effect)
    const glassPanels = document.querySelectorAll('.glass-panel');
    
    glassPanels.forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            panel.style.setProperty('--mouse-x', `${x}px`);
            panel.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 5. INTERACTIVE TYPEWRITER EFFECT
    const typewriterElement = document.getElementById('typewriter');
    const words = [
        "AI/ML Engineering.",
        "Computer Vision.",
        "Predictive Modeling.",
        "Secure Cryptography.",
        "CI/CD Orchestration."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 120;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            delay = 60; // Faster deleting
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            delay = 120; // Default typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            delay = 1800; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, delay);
    }
    
    if (typewriterElement) {
        typeEffect();
    }

    // 6. GLOBAL SPACE & STARFIELD BACKGROUND CANVAS
    const canvas = document.getElementById('galaxy-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const accretionParticleCount = 0;
    const ambientParticleCount = 100;
    
    const colors = {
        purple: 'rgba(112, 66, 248, 0.82)',
        cyan: 'rgba(0, 242, 254, 0.85)',
        magenta: 'rgba(217, 70, 239, 0.75)',
        blue: 'rgba(59, 130, 246, 0.7)',
        white: 'rgba(255, 255, 255, 0.95)'
    };
    
    let mouse = { x: null, y: null, targetX: null, targetY: null, active: false };
    let scrollY = 0;
    
    // Scale canvas
    function resizeCanvas() {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initGalaxy();
        }
    }
    
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.targetX = null;
        mouse.targetY = null;
        mouse.active = false;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    let constellationCycle = 0;
    let activeSeed = null;

    // Particle Classes
    class AccretionParticle {
        constructor() {
            this.reset();
            this.angle = Math.random() * Math.PI * 2;
        }

        reset() {
            this.r = Math.random() * 340 + 45; 
            this.angle = 0;
            
            // Keplerian velocity
            this.speed = (1.8 / Math.pow(this.r, 0.6)) * 0.07; 
            
            this.spreadX = (Math.random() - 0.5) * 12;
            this.spreadY = (Math.random() - 0.5) * 12;
            this.size = Math.random() * 2.0 + 0.4;
            
            // Cosmic colors mapping based on distance from core
            if (this.r < 90) {
                this.color = Math.random() > 0.4 ? colors.cyan : colors.white;
            } else if (this.r < 200) {
                this.color = Math.random() > 0.5 ? colors.purple : colors.cyan;
            } else {
                this.color = Math.random() > 0.45 ? colors.magenta : colors.blue;
            }
        }

        update(centerX, centerY) {
            this.angle += this.speed;
            
            const spiralTightness = 1.35;
            const targetX = centerX + this.r * Math.cos(this.angle + spiralTightness * Math.log(this.r)) + this.spreadX;
            const targetY = centerY + this.r * Math.sin(this.angle + spiralTightness * Math.log(this.r)) + this.spreadY;
            
            // Gravitational lensing offset on mouse approach
            let mouseOffset = { x: 0, y: 0 };
            if (mouse.active && mouse.x !== null) {
                const dx = mouse.x - targetX;
                const dy = mouse.y - targetY;
                const dist = Math.hypot(dx, dy);
                if (dist < 200) {
                    const pull = (200 - dist) * 0.07;
                    mouseOffset.x = (dx / dist) * pull;
                    mouseOffset.y = (dy / dist) * pull;
                }
            }

            this.x = targetX + mouseOffset.x;
            this.y = targetY + mouseOffset.y;
            
            this.r -= 0.1;
            if (this.r <= 35) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    class AmbientStar {
    constructor() {
        this.size = Math.random() * 1.4 + 0.3;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Random slow velocities
        this.vx = (Math.random() - 0.5) * 0.32;
        this.vy = (Math.random() - 0.5) * 0.32;
        this.parallax = Math.random() * 0.035 + 0.01;
        this.glow = 0;
        this.currentX = this.x;
        this.currentY = this.y;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Apply mouse-parallax shifting
        let mouseShiftX = 0;
        let mouseShiftY = 0;
        if (mouse.active && mouse.x !== null) {
            mouseShiftX = (mouse.x - canvas.width / 2) * this.parallax;
            mouseShiftY = (mouse.y - canvas.height / 2) * this.parallax;
        }
        this.currentX = this.x + mouseShiftX;
        this.currentY = this.y + mouseShiftY;

        // Decay the shining glow state
        this.glow = Math.max(0, this.glow - 0.012);
    }

    draw() {
        ctx.beginPath();
        const r = this.size + this.glow * 1.6;
        const baseAlpha = 0.15 + (this.size / 1.7) * 0.25;
        const alpha = Math.min(1.0, baseAlpha + this.glow * 0.85);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        
        if (this.glow > 0.05) {
            ctx.shadowBlur = this.glow * 10;
            ctx.shadowColor = 'rgba(0, 242, 254, 0.9)';
        }
        ctx.arc(this.currentX, this.currentY, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow
    }
}

    function initGalaxy() {
        particles = [];
        for (let i = 0; i < accretionParticleCount; i++) {
            particles.push(new AccretionParticle());
        }
        for (let i = 0; i < ambientParticleCount; i++) {
            particles.push(new AmbientStar());
        }
    }

    function animateGalaxy() {
    // Translucent background sweep for motion trail
    ctx.fillStyle = 'rgba(3, 0, 20, 0.13)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (mouse.targetX !== null) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
    }

    // Locate black hole center (Aligns perfectly with the foreground neural canvas center)
    let cx = window.innerWidth * 0.72;
    let cy = window.innerHeight * 0.45;
    const neuralCanvas = document.getElementById('neural-canvas');
    if (neuralCanvas) {
        const rect = neuralCanvas.getBoundingClientRect();
        cx = rect.left + rect.width / 2;
        cy = rect.top + rect.height / 2;
    }

    // 1. Draw glowing accretion halo
    const haloGlow = ctx.createRadialGradient(cx, cy, 35, cx, cy, 130);
    haloGlow.addColorStop(0, 'rgba(112, 66, 248, 0.4)');
    haloGlow.addColorStop(0.3, 'rgba(0, 242, 254, 0.2)');
    haloGlow.addColorStop(0.7, 'rgba(217, 70, 239, 0.04)');
    haloGlow.addColorStop(1, 'rgba(3, 0, 20, 0)');

    ctx.beginPath();
    ctx.arc(cx, cy, 130, 0, Math.PI * 2);
    ctx.fillStyle = haloGlow;
    ctx.fill();

    // 2. Update and draw particles
    particles.forEach(p => {
        if (p instanceof AccretionParticle) {
            p.update(cx, cy);
        } else {
            p.update();
        }
        p.draw();
    });

    // Draw connection lines in the background between ambient stars periodically
    constellationCycle += 16.67;
    const cycleTime = constellationCycle % 20000; // 20-second cycle

    let isStormActive = false;
    let progress = 0;

    // Two distinct storm phases separated by a 5.5-second gap:
    // Event 1 (5s - 7.5s) and Event 2 (13s - 15.5s)
    if (cycleTime > 5000 && cycleTime < 7500) {
        isStormActive = true;
        progress = (cycleTime - 5000) / 2500;
    } else if (cycleTime > 13000 && cycleTime < 15500) {
        isStormActive = true;
        progress = (cycleTime - 13000) / 2500;
    }

    if (isStormActive) {
        const ambientStars = particles.filter(p => p instanceof AmbientStar);

        // Select a single random active seed star for the current storm phase to localize connections
        if (!activeSeed && ambientStars.length > 0) {
            activeSeed = ambientStars[Math.floor(Math.random() * ambientStars.length)];
        }

        if (activeSeed) {
            // Sweeps diagonal wavefront from 1.4 (top-right) down to -1.4 (bottom-left)
            const waveCenter = 1.4 - 2.8 * progress;
            const waveWidth = 0.45;

            // Update star glow states based on wavefront proximity (only for stars near the active seed)
            ambientStars.forEach(star => {
                const dx = star.currentX - activeSeed.currentX;
                const dy = star.currentY - activeSeed.currentY;
                if (Math.hypot(dx, dy) < 130) {
                    const starPos = (star.currentX / canvas.width) - (star.currentY / canvas.height);
                    const distToWave = Math.abs(starPos - waveCenter);
                    if (distToWave < waveWidth) {
                        const intensity = 1.0 - (distToWave / waveWidth);
                        star.glow = Math.max(star.glow, intensity);
                    }
                }
            });

            // Draw connection lines between nearby stars in the active wavefront area near the seed
            for (let i = 0; i < ambientStars.length; i++) {
                const starA = ambientStars[i];
                const dxA = starA.currentX - activeSeed.currentX;
                const dyA = starA.currentY - activeSeed.currentY;
                if (Math.hypot(dxA, dyA) >= 130) continue;

                for (let j = i + 1; j < ambientStars.length; j++) {
                    const starB = ambientStars[j];
                    const dxB = starB.currentX - activeSeed.currentX;
                    const dyB = starB.currentY - activeSeed.currentY;
                    if (Math.hypot(dxB, dyB) >= 130) continue;

                    const dx = starA.currentX - starB.currentX;
                    const dy = starA.currentY - starB.currentY;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 95) {
                        // Modulate connection opacity based on both stars being inside the active wavefront
                        const lineOpacity = Math.min(starA.glow, starB.glow) * 0.16;
                        if (lineOpacity > 0.01) {
                            ctx.beginPath();
                            ctx.moveTo(starA.currentX, starA.currentY);
                            ctx.lineTo(starB.currentX, starB.currentY);
                            ctx.strokeStyle = `rgba(0, 242, 254, ${lineOpacity * (1 - dist / 95)})`;
                            ctx.lineWidth = 0.55;
                            ctx.stroke();
                        }
                    }
                }
            }
        }
    } else {
        // Clear active seed when storm is inactive
        activeSeed = null;
    }

    // 3. Draw black hole singularity core
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#030014';
    ctx.shadowBlur = 35;
    ctx.shadowColor = 'rgba(112, 66, 248, 0.85)';
    ctx.fill();
    ctx.shadowBlur = 0; // reset shadow

    // 4. Draw accretion ring boundary line
    ctx.beginPath();
    ctx.arc(cx, cy, 41, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    requestAnimationFrame(animateGalaxy);
}
    
    if (canvas) {
        resizeCanvas();
        animateGalaxy();
    }

    // 7. INTERACTIVE FOREGROUND NEURAL NETWORK CANVAS (HERO VISUAL)
    const neuralCanvas = document.getElementById('neural-canvas');
    if (neuralCanvas) {
        const nCtx = neuralCanvas.getContext('2d');
        let nodes = [];
        const nodeCount = 38;
        const maxConnectionDist = 85;
        let neuralMouse = { x: null, y: null, active: false };

        function resizeNeuralCanvas() {
            const rect = neuralCanvas.parentElement.getBoundingClientRect();
            neuralCanvas.width = rect.width;
            neuralCanvas.height = rect.height;
            initNeuralNet();
        }

        // Track local coordinates in neural container
        neuralCanvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = neuralCanvas.getBoundingClientRect();
            neuralMouse.x = e.clientX - rect.left;
            neuralMouse.y = e.clientY - rect.top;
            neuralMouse.active = true;
        });

        neuralCanvas.parentElement.addEventListener('mouseleave', () => {
            neuralMouse.x = null;
            neuralMouse.y = null;
            neuralMouse.active = false;
        });

        class NeuralNode {
            constructor(w, h) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.baseRadius = Math.random() * 2.5 + 1.5;
                this.pulseTime = Math.random() * Math.PI;
                this.pulseSpeed = Math.random() * 0.03 + 0.01;
            }

            update(w, h) {
                // Bounce off boundaries
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;

                // Clamp within bounds
                this.x = Math.max(0, Math.min(this.x, w));
                this.y = Math.max(0, Math.min(this.y, h));

                // Repel from black hole core at the center of the neural canvas
                const centerX = w / 2;
                const centerY = h / 2;
                const dx = this.x - centerX;
                const dy = this.y - centerY;
                const dist = Math.hypot(dx, dy);
                const minDistance = 55; // Core radius (40px) + buffer to keep it empty

                if (dist < minDistance) {
                    const force = (minDistance - dist) * 0.08;
                    this.x += (dx / dist) * force;
                    this.y += (dy / dist) * force;
                    this.vx += (dx / dist) * 0.01;
                    this.vy += (dy / dist) * 0.01;
                }

                // Pulsate dot size
                this.pulseTime += this.pulseSpeed;
                this.radius = this.baseRadius + Math.sin(this.pulseTime) * 0.8;
            }

            draw() {
                nCtx.beginPath();
                nCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                
                // Color nodes purple/cyan
                const alpha = 0.5 + Math.sin(this.pulseTime) * 0.3;
                nCtx.fillStyle = `rgba(0, 242, 254, ${alpha})`;
                nCtx.shadowBlur = 6;
                nCtx.shadowColor = 'rgba(0, 242, 254, 0.7)';
                nCtx.fill();
                nCtx.shadowBlur = 0; // reset
            }
        }

        // Active traveling packet/pulse along connections
        class DataPacket {
            constructor() {
                this.reset();
            }

            reset() {
                if (nodes.length < 2) return;
                this.startIdx = Math.floor(Math.random() * nodes.length);
                this.endIdx = this.findConnectedNeighbor(this.startIdx);
                this.progress = 0;
                this.speed = Math.random() * 0.015 + 0.005;
            }

            findConnectedNeighbor(nodeIdx) {
                const node = nodes[nodeIdx];
                let potentialNeighbors = [];
                for (let i = 0; i < nodes.length; i++) {
                    if (i === nodeIdx) continue;
                    const dist = Math.hypot(node.x - nodes[i].x, node.y - nodes[i].y);
                    if (dist < maxConnectionDist) {
                        potentialNeighbors.push(i);
                    }
                }
                if (potentialNeighbors.length > 0) {
                    return potentialNeighbors[Math.floor(Math.random() * potentialNeighbors.length)];
                }
                // Fallback to random node
                return (nodeIdx + 1) % nodes.length;
            }

            update() {
                this.progress += this.speed;
                if (this.progress >= 1) {
                    this.reset();
                }
            }

            draw() {
                if (nodes.length < 2 || this.startIdx >= nodes.length || this.endIdx >= nodes.length) return;
                const start = nodes[this.startIdx];
                const end = nodes[this.endIdx];

                const currentX = start.x + (end.x - start.x) * this.progress;
                const currentY = start.y + (end.y - start.y) * this.progress;

                nCtx.beginPath();
                nCtx.arc(currentX, currentY, 3, 0, Math.PI * 2);
                nCtx.fillStyle = 'rgba(217, 70, 239, 0.9)'; // hot magenta data packets
                nCtx.shadowBlur = 8;
                nCtx.shadowColor = 'rgba(217, 70, 239, 1)';
                nCtx.fill();
                nCtx.shadowBlur = 0;
            }
        }

        let packets = [];
        const packetCount = 6;

        function initNeuralNet() {
            nodes = [];
            for (let i = 0; i < nodeCount; i++) {
                nodes.push(new NeuralNode(neuralCanvas.width, neuralCanvas.height));
            }
            packets = [];
            for (let i = 0; i < packetCount; i++) {
                packets.push(new DataPacket());
            }
        }

        function animateNeuralNet() {
            nCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
            const w = neuralCanvas.width;
            const h = neuralCanvas.height;

            // 1. Draw connections/edges
            const centerX = w / 2;
            const centerY = h / 2;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < maxConnectionDist) {
                        // Prevent lines drawing directly through the solid black hole core
                        const midX = (nodes[i].x + nodes[j].x) / 2;
                        const midY = (nodes[i].y + nodes[j].y) / 2;
                        const midDist = Math.hypot(midX - centerX, midY - centerY);
                        if (midDist < 45) continue;

                        const alpha = (1 - dist / maxConnectionDist) * 0.25;
                        nCtx.beginPath();
                        nCtx.moveTo(nodes[i].x, nodes[i].y);
                        nCtx.lineTo(nodes[j].x, nodes[j].y);
                        
                        // Purple to Cyan gradient connections
                        const grad = nCtx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                        grad.addColorStop(0, `rgba(112, 66, 248, ${alpha})`);
                        grad.addColorStop(1, `rgba(0, 242, 254, ${alpha})`);
                        
                        nCtx.strokeStyle = grad;
                        nCtx.lineWidth = 1;
                        nCtx.stroke();
                    }
                }
            }

            // 2. Draw connections to mouse cursor
            if (neuralMouse.active && neuralMouse.x !== null) {
                for (let i = 0; i < nodes.length; i++) {
                    const dx = nodes[i].x - neuralMouse.x;
                    const dy = nodes[i].y - neuralMouse.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 110) {
                        const alpha = (1 - dist / 110) * 0.45;
                        nCtx.beginPath();
                        nCtx.moveTo(nodes[i].x, nodes[i].y);
                        nCtx.lineTo(neuralMouse.x, neuralMouse.y);
                        nCtx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                        nCtx.lineWidth = 1.2;
                        nCtx.stroke();
                        
                        // Push node slightly away from mouse
                        const push = (110 - dist) * 0.025;
                        nodes[i].x += (dx / dist) * push;
                        nodes[i].y += (dy / dist) * push;
                    }
                }
            }

            // 3. Update and draw nodes
            nodes.forEach(n => {
                n.update(w, h);
                n.draw();
            });

            // 4. Update and draw data packets
            packets.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateNeuralNet);
        }

        window.addEventListener('resize', resizeNeuralCanvas);
        // Delay init to allow container size layout calculation
        setTimeout(() => {
            resizeNeuralCanvas();
            animateNeuralNet();
        }, 150);
    }

    // 8. INTERSECTION OBSERVER FOR SCROLL REVEALS
    const revealElements = document.querySelectorAll('.reveal, .scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                if (entry.target.classList.contains('scroll-reveal')) {
                    entry.target.classList.remove('revealed');
                }
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 9. ACTIVE NAV LINK SPY ON SCROLL
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function spyScroll() {
        const fromTop = window.scrollY + 120;
        
        sections.forEach(sec => {
            const id = sec.getAttribute('id');
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            
            if (fromTop >= top && fromTop < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', spyScroll);
    
    // Trigger reveals for elements already visible on load
    setTimeout(() => {
        const firstElements = document.querySelectorAll('.hero-content .reveal, .hero-visual .reveal');
        firstElements.forEach(el => el.classList.add('revealed'));
    }, 100);

    // 9.5 PROJECTS SHOWCASE DOMAIN FILTERING
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-cosmic-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const isMatch = filterValue === 'all' || card.getAttribute('data-domain') === filterValue;
                    if (isMatch) {
                        card.classList.remove('filtered-out');
                        // Fade/slide in smoothly
                        card.classList.add('revealed');
                    } else {
                        card.classList.add('filtered-out');
                        card.classList.remove('revealed');
                    }
                });
            });
        });
    }

    // 10. INTERACTIVE 3D SPACE CONSTELLATION ANIMATION (SKILLS SECTION)
    const skillsCanvas = document.getElementById('skills-canvas');
    if (skillsCanvas) {
        const sCtx = skillsCanvas.getContext('2d');
        let particles = [];
        const particleCount = 550; // Capped at 550 for rich, high-density stellar arms
        let baseAngleX = 1.05; // Baseline galaxy tilt (approx 60 degrees)
        let galaxySpinY = 0.0;
        let mouseOffsetX = 0.0;
        let mouseOffsetY = 0.0;
        let targetMouseOffsetX = 0.0;
        let targetMouseOffsetY = 0.0;
        let galaxyRadius = 350; // Dynamically computed on resize
        const rollAngle = 0.0; // Perfectly horizontal alignment (0 / 180 degrees)
        
        function resizeSkillsCanvas() {
            const rect = skillsCanvas.parentElement.getBoundingClientRect();
            // Size canvas dynamically to cover full viewport width and 950px height to prevent any clipping/boxing
            skillsCanvas.width = window.innerWidth;
            skillsCanvas.height = 950;
            skillsCanvas.style.width = window.innerWidth + 'px';
            skillsCanvas.style.height = '950px';
            
            // Responsive galaxy radius: scales up with screen dimensions to cover a large area
            galaxyRadius = Math.max(skillsCanvas.width, skillsCanvas.height) * 0.37; // Reduced from 0.44 to 0.37
            if (galaxyRadius < 360) galaxyRadius = 360; // Minimum size clamp (previously 420)
            if (galaxyRadius > 800) galaxyRadius = 800; // Maximum size clamp (previously 950)
            initGalaxy();
        }
        
        class GalaxyStar3D {
            constructor() {
                // Distribute stars in concentric rings/orbits
                const ringIndex = Math.floor(Math.random() * 5); // 5 rings for richer distribution
                
                // Normalized radius between 0.15 and 1.0
                this.rPct = 0.15 + (ringIndex / 4) * 0.85;
                this.rPct += (Math.random() - 0.5) * 0.08;
                
                this.angle = Math.random() * Math.PI * 2;
                
                // Orbital speed (closer stars orbit faster, with some random variation)
                // Kept very slow for a majestic, calm drifting movement
                const speedMult = 0.04 + Math.random() * 0.03;
                this.speed = (0.15 / Math.sqrt(this.rPct * 350)) * speedMult;
                
                // Vertical thickness spread of the galaxy disc
                this.yOffset = (Math.random() - 0.5) * 12;
                
                // Size distribution matching the reference image:
                // - 80% small background stars
                // - 15% medium-sized bright stars
                // - 5% large supergiant stars for depth of field
                const sizeRand = Math.random();
                if (sizeRand < 0.8) {
                    this.size = Math.random() * 1.1 + 0.4;
                } else if (sizeRand < 0.95) {
                    this.size = Math.random() * 2.0 + 1.2;
                } else {
                    this.size = Math.random() * 3.5 + 2.5;
                }
                
                // Set color theme matching the reference image (heavy on white and bright colors)
                const rand = Math.random();
                if (rand < 0.52) {
                    this.color = 'rgba(255, 255, 255, '; // Bright White core/starfield
                } else if (rand < 0.72) {
                    this.color = 'rgba(0, 242, 254, '; // Cyber Cyan
                } else if (rand < 0.85) {
                    this.color = 'rgba(112, 66, 248, '; // Nebula Purple
                } else if (rand < 0.94) {
                    this.color = 'rgba(59, 130, 246, '; // Electric Blue
                } else {
                    this.color = 'rgba(254, 240, 138, '; // Bright Pale Yellow/Gold (core stars)
                }
            }
            
            update() {
                this.angle += this.speed;
            }
            
            project(width, height, rotX, rotY) {
                const centerX = width / 2;
                const centerY = height / 2;
                
                const r = this.rPct * galaxyRadius;
                let lx = r * Math.cos(this.angle);
                let ly = this.yOffset;
                let lz = r * 0.4 * Math.sin(this.angle); // Elliptical base (ratio 2.5:1)
                
                // Rotate around X axis (tilt)
                let cosX = Math.cos(rotX);
                let sinX = Math.sin(rotX);
                let y1 = ly * cosX - lz * sinX;
                let z1 = lz * cosX + ly * sinX;
                
                // Rotate around Y axis (spin)
                let cosY = Math.cos(rotY);
                let sinY = Math.sin(rotY);
                let x2 = lx * cosY - z1 * sinY;
                let z2 = z1 * cosY + lx * sinY;
                
                const distance = 500;
                const scale = 400;
                const projScale = scale / (z2 + distance);
                
                let sx = x2 * projScale;
                let sy = y1 * projScale;
                
                // Apply Z-roll (diagonal rotation -30 degrees)
                let cosR = Math.cos(rollAngle);
                let sinR = Math.sin(rollAngle);
                let rx = sx * cosR - sy * sinR;
                let ry = sy * cosR + sx * sinR;
                
                this.screenX = centerX + rx;
                this.screenY = centerY + ry;
                
                this.sizeScaled = this.size * Math.max(0.5, (z2 + 250) / 500 * 1.8 + 0.4);
                this.alpha = Math.min(0.48, Math.max(0.12, (z2 + 250) / 500 * 0.3 + 0.12)); // Faded transparency for text readability
            }
        }
        
        function initGalaxy() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new GalaxyStar3D());
            }
        }
        
        skillsCanvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = skillsCanvas.getBoundingClientRect();
            const mx = e.clientX - rect.left - rect.width / 2;
            const my = e.clientY - rect.top - rect.height / 2;
            
            // Mouse movement skews the tilt axis slightly with inertia
            targetMouseOffsetX = mx * 0.001;
            targetMouseOffsetY = my * 0.001;
        });
        
        skillsCanvas.parentElement.addEventListener('mouseleave', () => {
            targetMouseOffsetX = 0.0;
            targetMouseOffsetY = 0.0;
        });
        
        function animateSkillsGalaxy() {
            sCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);
            const w = skillsCanvas.width;
            const h = skillsCanvas.height;
            const cx = w / 2;
            const cy = h / 2;
            
            // Very slow continuous rotation of the whole galaxy frame
            galaxySpinY += 0.00015; 
            
            // Smooth interpolation for mouse movements
            mouseOffsetX += (targetMouseOffsetX - mouseOffsetX) * 0.05;
            mouseOffsetY += (targetMouseOffsetY - mouseOffsetY) * 0.05;
            
            const currentRotX = baseAngleX + mouseOffsetY;
            const currentRotY = galaxySpinY + mouseOffsetX;
            
            // 1. Draw glowing Milky Way center (Galaxy core) - Faded
            const coreGlow = sCtx.createRadialGradient(cx, cy, 5, cx, cy, galaxyRadius * 0.35);
            coreGlow.addColorStop(0, 'rgba(255, 250, 230, 0.18)'); // Faded center
            coreGlow.addColorStop(0.2, 'rgba(0, 242, 254, 0.08)'); // Faded cyan glow
            coreGlow.addColorStop(0.5, 'rgba(112, 66, 248, 0.04)'); // Faded purple outer glow
            coreGlow.addColorStop(1, 'rgba(3, 0, 20, 0)');
            
            sCtx.beginPath();
            sCtx.arc(cx, cy, galaxyRadius * 0.35, 0, Math.PI * 2);
            sCtx.fillStyle = coreGlow;
            sCtx.fill();
            
            // 2. Draw outer orbital boundary tracks/rings (elliptical & diagonal in 3D space)
            sCtx.strokeStyle = 'rgba(112, 66, 248, 0.035)';
            sCtx.lineWidth = 1.0;
            
            const cosR = Math.cos(rollAngle);
            const sinR = Math.sin(rollAngle);
            
            [0.25, 0.45, 0.65, 0.85, 1.05].forEach(rPct => {
                const r = rPct * galaxyRadius;
                sCtx.beginPath();
                const steps = 90;
                for (let i = 0; i <= steps; i++) {
                    const stepAngle = (i / steps) * Math.PI * 2;
                    let lx = r * Math.cos(stepAngle);
                    let lz = r * 0.4 * Math.sin(stepAngle); // Elliptical base
                    
                    let y1 = -lz * Math.sin(currentRotX);
                    let z1 = lz * Math.cos(currentRotX);
                    let x2 = lx * Math.cos(currentRotY) - z1 * Math.sin(currentRotY);
                    let z2 = z1 * Math.cos(currentRotY) + lx * Math.sin(currentRotY);
                    
                    const proj = 400 / (z2 + 500);
                    let sx = x2 * proj;
                    let sy = y1 * proj;
                    
                    // Apply Z-roll for diagonal layout
                    let rx = sx * cosR - sy * sinR;
                    let ry = sy * cosR + sx * sinR;
                    
                    const sxFinal = cx + rx;
                    const syFinal = cy + ry;
                    
                    if (i === 0) sCtx.moveTo(sxFinal, syFinal);
                    else sCtx.lineTo(sxFinal, syFinal);
                }
                sCtx.stroke();
            });
            
            // 3. Update, project, and draw stars in the rings
            particles.forEach(p => {
                p.update();
                p.project(w, h, currentRotX, currentRotY);
                
                sCtx.beginPath();
                sCtx.arc(p.screenX, p.screenY, p.sizeScaled, 0, Math.PI * 2);
                sCtx.fillStyle = `${p.color}${p.alpha})`;
                
                if (p.sizeScaled > 1.5) {
                    sCtx.shadowBlur = 6;
                    sCtx.shadowColor = p.color.includes('255, 255, 255') ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 242, 254, 0.5)';
                }
                sCtx.fill();
                sCtx.shadowBlur = 0;
            });
            
            requestAnimationFrame(animateSkillsGalaxy);
        }
        
        window.addEventListener('resize', resizeSkillsCanvas);
        resizeSkillsCanvas();
        animateSkillsGalaxy();
    }

    // ==========================================================================
    // 13. CERTIFICATIONS & ACHIEVEMENTS CAROUSEL & FILTERING
    // ==========================================================================
    const certFilterButtons = document.querySelectorAll('.cert-filter-btn');
    const certCards = document.querySelectorAll('.cert-card');
    const certTrack = document.getElementById('certs-track');
    const certPrevBtn = document.querySelector('#certs .prev-btn');
    const certNextBtn = document.querySelector('#certs .next-btn');
    const certDotsContainer = document.getElementById('carousel-dots-container');

    if (certTrack && certCards.length > 0) {
        let currentIndex = 0;
        let visibleCards = [];

        function updateVisibleCards() {
            visibleCards = Array.from(certCards).filter(card => !card.classList.contains('filtered-out'));
        }

        function getItemsPerPage() {
            return window.innerWidth > 768 ? 2 : 1;
        }

        function getMaxIndex() {
            const itemsPerPage = getItemsPerPage();
            return Math.max(0, visibleCards.length - itemsPerPage);
        }

        function updateCarousel() {
            updateVisibleCards();
            const maxIndex = getMaxIndex();
            
            // Bounds check
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            if (currentIndex < 0) {
                currentIndex = 0;
            }

            // Calculate slide width and translate
            if (visibleCards.length > 0) {
                const cardWidth = visibleCards[0].getBoundingClientRect().width;
                const gap = parseFloat(window.getComputedStyle(certTrack).gap) || 0;
                const slideWidth = cardWidth + gap;
                certTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            } else {
                certTrack.style.transform = `translateX(0)`;
            }

            // Update disabled status on arrows
            if (certPrevBtn) certPrevBtn.disabled = currentIndex === 0;
            if (certNextBtn) certNextBtn.disabled = currentIndex >= maxIndex || visibleCards.length <= getItemsPerPage();

            // Rebuild/update dot indicators
            updateDots();
        }

        function updateDots() {
            if (!certDotsContainer) return;
            certDotsContainer.innerHTML = '';
            
            const itemsPerPage = getItemsPerPage();
            const totalDots = Math.max(1, visibleCards.length - itemsPerPage + 1);
            
            // If all items fit, we don't need dot indicators
            if (visibleCards.length <= itemsPerPage) return;

            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('carousel-dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                certDotsContainer.appendChild(dot);
            }
        }

        // Filter button click event listeners
        if (certFilterButtons.length > 0) {
            certFilterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    certFilterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filterValue = btn.getAttribute('data-filter');

                    // Filter cards
                    certCards.forEach(card => {
                        const cardType = card.getAttribute('data-type');
                        const isMatch = filterValue === 'all' || cardType === filterValue;

                        if (isMatch) {
                            card.classList.remove('filtered-out');
                        } else {
                            card.classList.add('filtered-out');
                        }
                    });

                    // Reset to first slide and update
                    currentIndex = 0;
                    certTrack.style.transform = 'translateX(0)';
                    
                    // Small delay to let browser reflow layout
                    setTimeout(() => {
                        updateCarousel();
                    }, 50);
                });
            });
        }

        // Navigation arrow listeners
        if (certPrevBtn) {
            certPrevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
        }

        if (certNextBtn) {
            certNextBtn.addEventListener('click', () => {
                const maxIndex = getMaxIndex();
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }

        // Window resize listener
        window.addEventListener('resize', () => {
            updateCarousel();
        });

        // Initialize carousel on load
        window.addEventListener('load', () => {
            updateCarousel();
        });
        
        // Also run immediately
        updateCarousel();
    }

});

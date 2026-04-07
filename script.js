document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initial check for navbar scroll position
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Scroll Animation (Intersection Observer)
    const fadeElements = document.querySelectorAll('.service-card, .about-content, .contact-wrapper, .section-header, .partner-logo, .hero-content, .footer-grid, .footer-bottom');

    // Add initial class
    fadeElements.forEach(el => {
        el.classList.add('fade-up');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Form submission via AJAX
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.7';

            const formData = new FormData(contactForm);

            fetch('https://formsubmit.co/ajax/dcom99x@gmail.com', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                    btn.style.backgroundColor = '#28a745';
                    btn.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
                    btn.style.opacity = '1';
                    contactForm.reset();

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.boxShadow = '';
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    btn.innerHTML = 'Error! Try Again';
                    btn.style.backgroundColor = '#dc3545';
                    btn.style.opacity = '1';

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = '';
                    }, 3000);
                });
        });
    }

    // About Us Slideshow
    const aboutImages = document.querySelectorAll('.about-image');
    const aboutDots = document.querySelectorAll('.about-dot');

    if (aboutImages.length > 0) {
        let currentImageIndex = 0;
        let slideshowInterval;

        function showImage(index) {
            aboutImages[currentImageIndex].classList.remove('active');
            aboutDots[currentImageIndex].classList.remove('active');
            currentImageIndex = index;
            aboutImages[currentImageIndex].classList.add('active');
            aboutDots[currentImageIndex].classList.add('active');
        }

        function nextImage() {
            let nextIndex = (currentImageIndex + 1) % aboutImages.length;
            showImage(nextIndex);
        }

        function startSlideshow() {
            slideshowInterval = setInterval(nextImage, 4000);
        }

        function resetSlideshow() {
            clearInterval(slideshowInterval);
            startSlideshow();
        }

        aboutDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showImage(index);
                resetSlideshow();
            });
        });

        const aboutSlideshow = document.querySelector('.about-slideshow');
        if (aboutSlideshow) {
            aboutSlideshow.style.cursor = 'pointer';
            aboutSlideshow.addEventListener('click', (e) => {
                // Only trigger if clicking the image, not the dots
                if (!e.target.classList.contains('about-dot')) {
                    nextImage();
                    resetSlideshow();
                }
            });
        }

        startSlideshow();
    }

    // Hero Section Auto-Play
    window.currentHeroIndex = 0;
    let heroSlideshowTimer;

    function startHeroAutoPlay() {
        heroSlideshowTimer = setInterval(() => {
            window.currentHeroIndex = (window.currentHeroIndex + 1) % 3;
            window.switchHero(window.currentHeroIndex, false);
        }, 6500);
    }

    function resetHeroAutoPlay() {
        clearInterval(heroSlideshowTimer);
        startHeroAutoPlay();
    }

    window.manualHeroReset = resetHeroAutoPlay;
    startHeroAutoPlay();

    // Scroll to Top Button Logic
    const scrollTopBtn = document.getElementById('scroll-to-top');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});


// Toggle Hero Content with smooth fade and layout stability
window.toggleHeroContent = function () {
    window.currentHeroIndex = (window.currentHeroIndex + 1) % 3;
    window.switchHero(window.currentHeroIndex);
};

// Switch Hero Content by Index (0 = Main, 1 = Secondary)
window.switchHero = function (index, isManual = true) {
    const mainContent = document.getElementById('main-hero-text');
    const secondaryContent = document.getElementById('secondary-hero-content');
    const ternaryContent = document.getElementById('ternary-hero-content');
    const dots = [
        document.getElementById('hero-dot-0'),
        document.getElementById('hero-dot-1'),
        document.getElementById('hero-dot-2')
    ];

    if (!mainContent || !secondaryContent || !ternaryContent) return;

    if (isManual && window.manualHeroReset) {
        window.manualHeroReset();
        window.currentHeroIndex = index;
    }

    // Hide all first
    const contents = [mainContent, secondaryContent, ternaryContent];
    contents.forEach((content, i) => {
        if (i === index) {
            content.style.opacity = '1';
            content.style.visibility = 'visible';
            content.style.pointerEvents = 'auto';
        } else {
            content.style.opacity = '0';
            content.style.visibility = 'hidden';
            content.style.pointerEvents = 'none';
        }
    });

    // Update Dots
    dots.forEach((dot, i) => {
        if (dot) {
            if (i === index) dot.classList.add('active');
            else dot.classList.remove('active');
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    // Canvas Background Animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Configuration
        const particleCount = 60;
        const connectionDistance = 150;
        const particleSpeed = 0.5;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.querySelector('.hero').offsetHeight;
        }

        window.addEventListener('resize', resize);

        // Pointer events
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY - canvas.getBoundingClientRect().top;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('touchstart', (e) => {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mouse.x = null;
            mouse.y = null;
        });

        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * particleSpeed;
                this.vy = (Math.random() - 0.5) * particleSpeed;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                // Interaction
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= dx * force * 0.05;
                        this.y -= dy * force * 0.05;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 26, 26, 0.5)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = 1 - (distance / connectionDistance);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 26, 26, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawLines();
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }

    // Partner Logo Mobile Slider
    const partnerContainer = document.getElementById('partner-slider');
    const partnerDotsContainer = document.getElementById('partner-dots');

    if (partnerContainer && partnerDotsContainer) {
        const logos = Array.from(partnerContainer.querySelectorAll('.partner-logo'));
        let currentGroup = 0;
        let sliderInterval;
        const itemsPerGroup = 3;
        const groupCount = Math.ceil(logos.length / itemsPerGroup);

        function setupSlider() {
            if (window.innerWidth <= 768) {
                // Generate dots
                partnerDotsContainer.innerHTML = '';
                for (let i = 0; i < groupCount; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('partner-dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showGroup(i);
                        startAutoSlider();
                    });
                    partnerDotsContainer.appendChild(dot);
                }
                showGroup(0);
                startAutoSlider();
            } else {
                // Reset for desktop
                logos.forEach(logo => {
                    logo.style.display = 'flex';
                    logo.style.opacity = '1';
                });
                partnerDotsContainer.innerHTML = '';
                clearInterval(sliderInterval);
            }
        }

        function showGroup(index) {
            if (window.innerWidth > 768) return;

            currentGroup = index;
            const start = index * itemsPerGroup;
            const end = start + itemsPerGroup;

            logos.forEach((logo, i) => {
                if (i >= start && i < end) {
                    logo.style.display = 'flex';
                    logo.style.opacity = '0';
                    setTimeout(() => {
                        logo.style.opacity = '1';
                    }, 50);
                } else {
                    logo.style.display = 'none';
                }
            });

            // Update dots
            const dots = partnerDotsContainer.querySelectorAll('.partner-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function nextGroup() {
            showGroup((currentGroup + 1) % groupCount);
        }

        function startAutoSlider() {
            clearInterval(sliderInterval);
            sliderInterval = setInterval(nextGroup, 4000);
        }

        // Tap to next logic
        partnerContainer.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                nextGroup();
                startAutoSlider(); // Reset timer
            }
        });

        window.addEventListener('resize', setupSlider);
        setupSlider();
    }

    // Smooth Fade-out/Fade-in Loop Transition
    const heroVid = document.getElementById('hero-vid');
    if (heroVid) {
        heroVid.loop = true; // Re-enable perfect native looping
        heroVid.style.transition = "opacity 0.6s ease-in-out, transform 0.4s ease, filter 0.4s ease"; // Keep hover transitions, add opacity

        let fadingOut = false;
        heroVid.addEventListener('timeupdate', () => {
            // Check if we are close to the end of the video
            const timeLeft = heroVid.duration - heroVid.currentTime;

            if (timeLeft <= 0.6 && !fadingOut) {
                fadingOut = true;
                heroVid.style.opacity = '0'; // Fade out before cut
            } else if (heroVid.currentTime <= 0.5 && fadingOut) {
                fadingOut = false;
                heroVid.style.opacity = '1'; // Fade back in gracefully
            }
        });
    }
});

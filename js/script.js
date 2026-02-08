// ============================================
// OPTIFORM - Main JavaScript
// Enhanced Animations & Performance
// ============================================

(function() {
    'use strict';

    // ============================================
    // PERFORMANCE & ACCESSIBILITY
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    // ============================================
    // ENHANCED SCROLL ANIMATIONS - FIXED
    // ============================================
    function initScrollAnimations() {
        if (prefersReducedMotion) {
            document.querySelectorAll('.fade-in-up, .scroll-reveal').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Smetti di osservare dopo l'animazione per performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.fade-in-up, .scroll-reveal').forEach(el => {
            observer.observe(el);
        });

        console.log(`🎬 Observing ${document.querySelectorAll('.fade-in-up, .scroll-reveal').length} elements for animation`);
    }

    // ============================================
    // INITIAL VISIBILITY - Show elements already in viewport
    // ============================================
    function initInitialVisibility() {
        if (prefersReducedMotion) return;
        
        // Forza visibilità immediata per primi 800px della pagina
        document.querySelectorAll('.fade-in-up, .scroll-reveal').forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // Se l'elemento è nei primi 800px o già visibile
            if (rect.top < 800 || (rect.top < windowHeight * 0.85 && rect.bottom > 0)) {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 100); // Delay progressivo
            }
        });
        
        console.log('✅ Initial visibility checked');
    }

    // ============================================
    // NAVBAR SCROLL EFFECT - SOLO MOBILE
    // ============================================
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScrollY = window.pageYOffset;

        function updateNavbar() {
            const scrollY = window.pageYOffset;
            
            // Add scrolled class for style changes
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar SOLO su mobile (max-width: 768px)
            if (window.innerWidth <= 768) {
                if (scrollY > lastScrollY && scrollY > 300) {
                    navbar.style.transform = 'translateY(-100%)';
                } else if (scrollY < lastScrollY) {
                    navbar.style.transform = 'translateY(0)';
                }
            } else {
                // Reset transform on desktop
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        // Add transition
        navbar.style.transition = 'transform 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease';

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }, { passive: true });

        // Reset on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navbar.style.transform = 'translateY(0)';
            }
        });
    }

    // ============================================
    // MOBILE MENU - Enhanced
    // ============================================
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        
        if (!hamburger || !navLinks) return;

        function closeMenu() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }

        function toggleMenu() {
            const isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        }

        hamburger.addEventListener('click', toggleMenu);

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });

        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // ============================================
    // ANIMATED COUNTERS
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        
        function easeOutQuad(t) {
            return t * (2 - t);
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuad(progress);
            
            const current = Math.floor(easedProgress * target);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function initCounters() {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach((counter, index) => {
                        setTimeout(() => {
                            animateCounter(counter);
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.5 });

        const statsBar = document.querySelector('.stats-bar');
        if (statsBar) {
            statsBar.querySelectorAll('.stat-number').forEach(counter => {
                counter.textContent = '0';
            });
            statsObserver.observe(statsBar);
        }
    }

    // ============================================
    // SCROLL TO TOP BUTTON
    // ============================================
    function initScrollToTop() {
        const scrollTopBtn = document.getElementById('scroll-to-top');
        if (!scrollTopBtn) return;

        let scrollTicking = false;

        function updateScrollButton() {
            if (window.pageYOffset > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
            scrollTicking = false;
        }

        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(updateScrollButton);
                scrollTicking = true;
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // PREVENT FLASH OF UNSTYLED CONTENT
    // ============================================
    function removeNoJS() {
        document.documentElement.classList.remove('no-js');
        document.documentElement.classList.add('js');
    }

    // ============================================
    // INITIALIZE ALL
    // ============================================
    function init() {
        try {
            removeNoJS();
            initScrollAnimations();
            
            // Mostra subito gli elementi già nel viewport
            setTimeout(() => {
                initInitialVisibility();
            }, 100);
            
            initNavbarScroll();
            initMobileMenu();
            initCounters();
            initScrollToTop();
            initSmoothScroll();

            console.log('✅ Optiform JS initialized');
        } catch (error) {
            console.error('❌ Initialization error:', error);
        }
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
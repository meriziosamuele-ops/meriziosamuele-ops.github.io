// ============================================
// OPTIFORM - Main JavaScript
// ============================================

(function() {
    'use strict';

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ============================================
    // MOBILE MENU
    // ============================================
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        
        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // ANIMATED COUNTERS
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    function initCounters() {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        if (counter.textContent === '0') {
                            animateCounter(counter);
                        }
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsBar = document.querySelector('.stats-bar');
        if (statsBar) {
            statsObserver.observe(statsBar);
        }
    }
    

    
    // ============================================
    // SCROLL TO TOP BUTTON
    // ============================================
    function initScrollToTop() {
        const scrollTopBtn = document.getElementById('scroll-to-top');
        if (!scrollTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

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
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ============================================
    // INITIAL VISIBILITY FOR ELEMENTS IN VIEWPORT
    // ============================================
    function initInitialVisibility() {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }

    // ============================================
    // FORM VALIDATION (for contact forms)
    // ============================================
    function initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get all required fields
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                if (isValid) {
                    // Form is valid, can submit
                    console.log('Form is valid and ready to submit');
                    // Here you would typically send the form data
                } else {
                    alert('Per favore, compila tutti i campi obbligatori.');
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
        removeNoJS();
        initScrollAnimations();
        initNavbarScroll();
        initMobileMenu();
        initCounters();
        initScrollToTop();
        initSmoothScroll();
        initFormValidation();
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Run initial visibility after full load
    window.addEventListener('load', initInitialVisibility);

})();
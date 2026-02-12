// ============================================
// OPTIFORM HERO - JavaScript Completo
// Context switch corretto per salti non sequenziali
// ============================================

(function() {
    // ========== FADE-IN-UP ANIMATIONS ON SCROLL ==========
    function initFadeInAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in-up');
        
        if (fadeElements.length === 0) {
            console.log('⚠️ No fade-in-up elements found');
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
                }
            });
        }, observerOptions);
        
        fadeElements.forEach(element => {
            observer.observe(element);
        });
        
        console.log('✨ Fade-in animations initialized:', fadeElements.length, 'elements');
    }


// ========== HAMBURGER MENU ========== 
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Chiudi quando clicchi su un link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Chiudi quando clicchi fuori
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}


    // ========== SCROLL TO TOP ==========
    function initScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top');
        if (!scrollBtn) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        console.log('⬆️ Scroll to top initialized');
    }

    // ========== NAV SCROLL EFFECT ==========
    function initNavScroll() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        console.log('📜 Nav scroll effect initialized');
    }

    // ========== INITIALIZE ALL ==========
    function init() {
        try {
            initHamburgerMenu();  
            initScrollToTop();
            initNavScroll();
            initFadeInAnimations(); 
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
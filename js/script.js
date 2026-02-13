// ============================================
// OPTIFORM - JavaScript Completo
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
        
        console.log('🍔 Hamburger menu initialized');
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

    // ========================================
    // LANGUAGE SWITCHER
    // ========================================
    function initLanguageSwitcher() {
        const langSwitcher = document.querySelector('.lang-switcher');
        const langBtn = document.querySelector('.lang-btn');
        
        if (!langSwitcher || !langBtn) {
            console.log('⚠️ Language switcher not found');
            return;
        }
        
        // Toggle dropdown su mobile
        langBtn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                langSwitcher.classList.toggle('open');
            }
        });

        // Chiudi dropdown quando si clicca fuori
        document.addEventListener('click', function(e) {
            if (!langSwitcher.contains(e.target)) {
                langSwitcher.classList.remove('open');
            }
        });

        // Salva preferenza lingua quando l'utente cambia
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', function() {
                const href = this.getAttribute('href');
                let lang = 'it'; // default
                
                if (href.includes('/de/')) lang = 'de';
                else if (href.includes('/en/')) lang = 'en';
                
                // Salva preferenza
                localStorage.setItem('preferredLang', lang);
            });
        });

        // Auto-redirect basato su preferenza salvata (OPZIONALE - decommentare se vuoi)
        /*
        const savedLang = localStorage.getItem('preferredLang');
        const currentLang = document.documentElement.lang || 'it';
        
        if (savedLang && savedLang !== currentLang) {
            const currentPath = window.location.pathname;
            // Redirect solo dalla home
            if (currentPath === '/' || currentPath === '/index.html') {
                window.location.href = `/${savedLang}/`;
            }
        }
        */
        
        console.log('🌐 Language switcher initialized');
    }

    // ========== INITIALIZE ALL ==========
    function init() {
        console.log('🚀 Optiform JS initialization started');
        
        try {
            initHamburgerMenu();  
            initScrollToTop();
            initNavScroll();
            initFadeInAnimations(); 
            initLanguageSwitcher();
            
            console.log('✅ All features initialized successfully');
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
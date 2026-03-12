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
        
        console.log('🌐 Language switcher initialized');
    }

    // ============================================
// COOKIE CONSENT & GOOGLE MAPS IFRAME LOADER
// ============================================
function initCookieConsent() {
    const COOKIE_NAME = 'optiform_maps_consent';
    const COOKIE_DURATION = 365; // giorni

    // ========== COOKIE UTILITIES ==========
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for(let i = 0; i < cookies.length; i++) {
            let c = cookies[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // ========== DETECT LANGUAGE ==========
    function detectLanguage() {
        const path = window.location.pathname;
        if (path.includes('/de/')) return 'de';
        if (path.includes('/en/')) return 'en';
        return 'it'; // default
    }

    // ========== TRANSLATIONS ==========
    const translations = {
        it: {
            title: 'Mappa non disponibile',
            description: 'Hai rifiutato il consenso per caricare Google Maps. Puoi modificare la tua scelta in qualsiasi momento.',
            button: 'Accetta e Mostra Mappa'
        },
        en: {
            title: 'Map not available',
            description: 'You have declined consent to load Google Maps. You can change your choice at any time.',
            button: 'Accept and Show Map'
        },
        de: {
            title: 'Karte nicht verfügbar',
            description: 'Sie haben die Zustimmung zum Laden von Google Maps abgelehnt. Sie können Ihre Wahl jederzeit ändern.',
            button: 'Akzeptieren und Karte anzeigen'
        }
    };

    // ========== SHOW/HIDE BANNER ==========
    function showCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            setTimeout(() => {
                banner.classList.add('show');
            }, 500);
        }
    }

    function hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 400);
        }
    }

    // ========== LOAD MAP IFRAME ==========
    function loadMapIframe() {
        const mapWrapper = document.querySelector('.map-wrapper');
        if (!mapWrapper) return;

        // Se c'è già un placeholder, rimuovilo
        const placeholder = mapWrapper.querySelector('.map-placeholder');
        if (placeholder) {
            mapWrapper.classList.remove('map-blocked');
            mapWrapper.innerHTML = '';
        }

        // Ricrea l'iframe con src (non data-src)
        mapWrapper.innerHTML = `
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3198.8199138313566!2d9.593304209293361!3d45.50926041039414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4781482f6b70fc15%3A0xb8d77e75ed8b5489!2sFloki%20s.r.l.!5e0!3m2!1sit!2sit!4v1773314944689!5m2!1sit!2sit" 
                width="100%" 
                height="450" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        `;
        console.log('🗺️ Google Maps iframe loaded');
    }

    // ========== SHOW MAP PLACEHOLDER ==========
    function showMapPlaceholder() {
        const mapWrapper = document.querySelector('.map-wrapper');
        if (!mapWrapper) return;

        // Rileva lingua
        const lang = detectLanguage();
        const t = translations[lang];

        // Rimuovi iframe se presente
        const iframe = mapWrapper.querySelector('iframe');
        if (iframe) {
            iframe.remove();
        }

        // AGGIUNGI CLASSE per lo sfondo scuro
        mapWrapper.classList.add('map-blocked');

        // Inserisci placeholder
        mapWrapper.innerHTML = `
            <div class="map-placeholder">
                <div class="map-placeholder-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                </div>
                <h4>${t.title}</h4>
                <p>${t.description}</p>
                <button class="map-placeholder-btn" id="accept-from-placeholder">
                    ${t.button}
                </button>
            </div>
        `;

        // Aggiungi event listener al nuovo bottone
        const acceptFromPlaceholder = document.getElementById('accept-from-placeholder');
        if (acceptFromPlaceholder) {
            acceptFromPlaceholder.addEventListener('click', function() {
                console.log('🔘 Accept from placeholder clicked');
                setCookie(COOKIE_NAME, 'accepted', COOKIE_DURATION);
                loadMapIframe();
                console.log('✅ Maps consent accepted from placeholder');
            });
        }

        console.log('🚫 Map iframe blocked');
    }

    // ========== HANDLE CONSENT ==========
    function handleAccept() {
        console.log('🔘 Accept button clicked');
        setCookie(COOKIE_NAME, 'accepted', COOKIE_DURATION);
        hideCookieBanner();
        
        // Se c'è la mappa, caricala
        const mapWrapper = document.querySelector('.map-wrapper');
        if (mapWrapper) {
            loadMapIframe();
        }
        
        console.log('✅ Maps consent accepted');
    }

    function handleReject() {
        console.log('🔘 Reject button clicked');
        setCookie(COOKIE_NAME, 'rejected', COOKIE_DURATION);
        hideCookieBanner();
        console.log('❌ Maps consent rejected');
    }

    // ========== ATTACH EVENT LISTENERS ==========
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', handleAccept);
        console.log('✅ Accept button listener attached');
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', handleReject);
        console.log('✅ Reject button listener attached');
    }

    // ========== INIT COOKIE CONSENT ==========
    const consent = getCookie(COOKIE_NAME);
    const mapWrapper = document.querySelector('.map-wrapper');

    // SE NON C'È CONSENSO -> MOSTRA BANNER IN TUTTE LE PAGINE
    if (!consent) {
        showCookieBanner();
        console.log('⚠️ No consent found - showing banner');
        
        // Se c'è anche la mappa, mostra placeholder
        if (mapWrapper) {
            showMapPlaceholder();
        }
    } 
    // SE C'È CONSENSO ACCETTATO
    else if (consent === 'accepted') {
        // Se c'è la mappa, caricala
        if (mapWrapper) {
            loadMapIframe();
            console.log('✅ Consent accepted - loading map');
        }
    } 
    // SE C'È CONSENSO RIFIUTATO
    else {
        // Se c'è la mappa, mostra placeholder
        if (mapWrapper) {
            showMapPlaceholder();
            console.log('❌ Consent rejected - showing placeholder');
        }
    }

    console.log('🍪 Cookie consent initialized');
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
            initCookieConsent();
            
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
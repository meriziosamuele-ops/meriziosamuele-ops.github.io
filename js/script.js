// ============================================
// SAMUELE MERIZIO - PORTFOLIO WEBSITE
// JavaScript Main File - Complete Version
// ============================================

'use strict';

// ============================================
// 1. MOBILE MENU HAMBURGER
// ============================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navUl = document.querySelector('nav ul');
    const nav = document.querySelector('nav');
    const body = document.body;
    
    if (menuToggle && navUl) {
        
        // Toggle menu on hamburger click
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = nav.contains(event.target);
            
            if (!isClickInsideNav && navUl.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navUl.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        // Close menu on window resize to desktop
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 968 && navUl.classList.contains('active')) {
                    closeMenu();
                }
            }, 250);
        });
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navUl.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Toggle menu function
        function toggleMenu() {
            const isActive = menuToggle.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        // Open menu function
        function openMenu() {
            menuToggle.classList.add('active');
            navUl.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            body.style.overflow = 'hidden';
        }
        
        // Close menu function
        function closeMenu() {
            menuToggle.classList.remove('active');
            navUl.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }
    }
}

// ============================================
// 2. NAVBAR SCROLL EFFECT
// ============================================

function initNavScrollEffect() {
    const nav = document.querySelector('nav');
    
    if (nav) {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            });
        });
    }
}

// ============================================
// 3. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore empty hash or just "#"
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 0;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll indicator nel hero (se presente)
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const navHeight = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 0;
                window.scrollTo({
                    top: aboutSection.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
        
        // Nascondi scroll indicator dopo scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'all';
            }
        });
    }
}

// ============================================
// 4. SCROLL REVEAL ANIMATION
// ============================================

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    if (reveals.length === 0) return;
    
    const checkReveal = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 120;
        
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };
    
    // Initial check on page load
    checkReveal();
    
    // Check on scroll with throttle for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
            checkReveal();
        });
    });
}

// ============================================
// 5. FORM VALIDATION HELPERS
// ============================================

function showFieldError(field, message) {
    // Rimuovi eventuali errori precedenti
    removeFieldError(field);
    
    // Aggiungi classe errore al campo
    field.classList.add('error-field');
    
    // Crea elemento errore
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error-message';
    errorDiv.textContent = message;
    errorDiv.setAttribute('data-field-id', field.id);
    
    // Inserisci dopo il campo
    field.parentElement.appendChild(errorDiv);
    
    // Animazione di entrata
    setTimeout(() => {
        errorDiv.classList.add('show');
    }, 10);
    
    // Auto-rimozione dopo 5 secondi
    setTimeout(() => {
        if (errorDiv && errorDiv.parentElement) {
            errorDiv.classList.remove('show');
            setTimeout(() => {
                if (errorDiv.parentElement) {
                    errorDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

function removeFieldError(field) {
    field.classList.remove('error-field');
    const errorMsg = field.parentElement.querySelector(`[data-field-id="${field.id}"]`);
    if (errorMsg) {
        errorMsg.classList.remove('show');
        setTimeout(() => {
            if (errorMsg.parentElement) {
                errorMsg.remove();
            }
        }, 300);
    }
}

// ============================================
// 6. MODAL SYSTEM
// ============================================

function showModal(type, title, message) {
    // Crea modal se non esiste
    let modal = document.getElementById('responseModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'responseModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon ${type}">
                    ${type === 'success' ? '✓' : '✕'}
                </div>
                <h3 class="modal-title">${title}</h3>
                <p class="modal-message">${message}</p>
                <button class="modal-close-btn" onclick="closeModal()">Chiudi</button>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        // Aggiorna contenuto modal esistente
        modal.querySelector('.modal-icon').className = `modal-icon ${type}`;
        modal.querySelector('.modal-icon').textContent = type === 'success' ? '✓' : '✕';
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-message').textContent = message;
    }
    
    // Mostra modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Previeni scroll del body
    document.body.style.overflow = 'hidden';
    
    // Chiudi con ESC
    document.addEventListener('keydown', handleEscKey);
    
    // Chiudi cliccando fuori
    modal.addEventListener('click', handleOutsideClick);
}

function closeModal() {
    const modal = document.getElementById('responseModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Rimuovi event listeners
        document.removeEventListener('keydown', handleEscKey);
        modal.removeEventListener('click', handleOutsideClick);
    }
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

function handleOutsideClick(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
}

// Rendi closeModal globale per onclick nel modal
window.closeModal = closeModal;

// ============================================
// 7. FORM HANDLING WITH VALIDATION
// ============================================

function initFormHandling() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    
    // ========== VALIDAZIONE NOME (Real-time) ==========
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            removeFieldError(this);
        });
        
        nameInput.addEventListener('blur', function() {
            const value = this.value.trim();
            const words = value.split(/\s+/).filter(word => word.length > 0);
            
            if (value === '') {
                removeFieldError(this);
            } else if (words.length < 2) {
                showFieldError(this, 'Inserisci sia nome che cognome');
            } else if (words.some(word => word.length < 2)) {
                showFieldError(this, 'Nome e cognome devono contenere almeno 2 caratteri ciascuno');
            } else {
                removeFieldError(this);
            }
        });
        
        nameInput.addEventListener('invalid', function(e) {
            e.preventDefault();
        });
    }
    
    // ========== VALIDAZIONE EMAIL (Real-time) ==========
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            removeFieldError(this);
        });
        
        emailInput.addEventListener('blur', function() {
            const value = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (value === '') {
                removeFieldError(this);
            } else if (!emailRegex.test(value)) {
                showFieldError(this, 'Inserisci un indirizzo email valido (es. nome@esempio.com)');
            } else {
                removeFieldError(this);
            }
        });
        
        emailInput.addEventListener('invalid', function(e) {
            e.preventDefault();
        });
    }
    
    // ========== VALIDAZIONE MESSAGGIO (Real-time) ==========
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            removeFieldError(this);
        });
        
        messageInput.addEventListener('blur', function() {
            const value = this.value.trim();
            
            if (value === '') {
                removeFieldError(this);
            } else if (value.length < 10) {
                showFieldError(this, 'Il messaggio deve contenere almeno 10 caratteri');
            } else {
                removeFieldError(this);
            }
        });
        
        messageInput.addEventListener('invalid', function(e) {
            e.preventDefault();
        });
    }
    
    // ========== FORM SUBMIT ==========
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        
        // Rimuovi tutti gli errori visivi precedenti
        document.querySelectorAll('.field-error-message').forEach(el => el.remove());
        document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
        
        // Get form data
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };
        
        // ========== VALIDAZIONE COMPLETA ==========
        let isValid = true;
        let firstInvalidField = null;
        
        // 1. Validazione NOME
        if (!formData.name) {
            showFieldError(nameInput, 'Per favore inserisci il tuo nome completo');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = nameInput;
        } else {
            const nameWords = formData.name.split(/\s+/).filter(word => word.length > 0);
            if (nameWords.length < 2) {
                showFieldError(nameInput, 'Inserisci sia nome che cognome');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = nameInput;
            } else if (nameWords.some(word => word.length < 2)) {
                showFieldError(nameInput, 'Nome e cognome devono contenere almeno 2 caratteri ciascuno');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = nameInput;
            }
        }
        
        // 2. Validazione EMAIL
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            showFieldError(emailInput, 'Per favore inserisci la tua email');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = emailInput;
        } else if (!emailRegex.test(formData.email)) {
            showFieldError(emailInput, 'Inserisci un indirizzo email valido (es. nome@esempio.com)');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = emailInput;
        }
        
        // 3. Validazione MESSAGGIO
        if (!formData.message) {
            showFieldError(messageInput, 'Per favore scrivi un messaggio');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = messageInput;
        } else if (formData.message.length < 10) {
            showFieldError(messageInput, 'Il messaggio deve contenere almeno 10 caratteri');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = messageInput;
        }
        
        // Se ci sono errori, mostra modal e scrolla al primo campo
        if (!isValid) {
            showModal('error', 'Compila Tutti i Campi', 'Per favore, completa correttamente tutti i campi obbligatori prima di inviare.');
            
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    firstInvalidField.focus();
                }, 500);
            }
            return;
        }
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Invio in corso...</span>';
        submitBtn.disabled = true;
        
        try {
            // ⚠️ IMPORTANTE: Sostituisci con il tuo servizio
            // Opzioni:
            // 1. Formspree: https://formspree.io
            // 2. EmailJS: https://www.emailjs.com
            // 3. Netlify Forms (se hosted su Netlify)
            
            // Esempio con Formspree:
            // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
            
            // SIMULAZIONE per demo (rimuovi in produzione)
            await new Promise(resolve => setTimeout(resolve, 1500));
            const response = { ok: true };
            
            if (response.ok) {
                showModal('success', 'Messaggio Inviato!', 'Grazie per avermi contattato. Ti risponderò al più presto.');
                form.reset();
                
                // Rimuovi tutti gli errori
                document.querySelectorAll('.field-error-message').forEach(el => el.remove());
                document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
            } else {
                throw new Error('Invio fallito');
            }
            
        } catch (error) {
            console.error('Form error:', error);
            showModal('error', 'Errore di Invio', 'Si è verificato un errore. Riprova più tardi o scrivimi direttamente a meriziosamuele@gmail.com');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// 8. UPDATE FOOTER YEAR
// ============================================

function updateFooterYear() {
    const footerYear = document.querySelector('.footer-bottom strong');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.parentElement.innerHTML = footerYear.parentElement.innerHTML.replace(
            /&copy; \d{4}/,
            `&copy; ${currentYear}`
        );
    }
}

// ============================================
// 9. PARALLAX EFFECT (Optional)
// ============================================

function initParallax() {
    const hero = document.querySelector('#hero');
    if (!hero) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                if (scrolled < window.innerHeight) {
                    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// 10. ANIMATION ON SCROLL (Optional)
// ============================================

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.card, .stat-item, .process-card, .service-premium-card');
    
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// 11. INITIALIZE ALL FUNCTIONS
// ============================================

function init() {
    // Core functionality
    initMobileMenu();
    initNavScrollEffect();
    initSmoothScroll();
    initScrollReveal();
    initFormHandling();
    updateFooterYear();
    
    // Optional enhancements (uncomment if needed)
    // initParallax();
    // initIntersectionObserver();
    
    console.log('✅ JavaScript loaded successfully');
    console.log('🎨 Samuele Merizio Portfolio');
}

// ============================================
// 12. START WHEN DOM IS READY
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// 13. ERROR HANDLING
// ============================================

window.addEventListener('error', (e) => {
    console.error('Runtime error:', e.error);
});

// ============================================
// 14. BROWSER DETECTION
// ============================================

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) {
    document.body.classList.add('ios-device');
}

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
if (isSafari) {
    document.body.classList.add('safari-browser');
}
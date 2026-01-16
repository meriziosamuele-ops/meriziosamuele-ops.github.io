// ==================== FIELD ERROR DISPLAY ====================

function showFieldError(field, message) {
    // Rimuovi eventuali errori precedenti
    removeFieldError(field);
    
    // Crea elemento errore
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error-message';
    errorDiv.textContent = message;
    errorDiv.setAttribute('data-field-id', field.id);
    
    // Inserisci dopo il campo (o dopo il label per checkbox)
    if (field.type === 'checkbox') {
        field.parentElement.appendChild(errorDiv);
    } else {
        field.parentElement.appendChild(errorDiv);
    }
    
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
            }, 300); // Attendi la fine dell'animazione
        }
    }, 5000);
}

function removeFieldError(field) {
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

// ==================== SCROLL ANIMATIONS ====================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// ==================== DOM READY ====================

document.addEventListener('DOMContentLoaded', () => {
    
    // Osserva tutti gli elementi con classi di animazione
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .section-title');
    animatedElements.forEach(el => observer.observe(el));
    
    // Animazione Hero immediata
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
    
    // Animazione info-items con delay progressivo
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('header');
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll per i link di navigazione
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ==================== MESSAGGI ERRORE PERSONALIZZATI ====================
    
    const emailInput = document.getElementById('email');
    const privacyCheckbox = document.getElementById('privacy');
    const nomeInput = document.getElementById('nome');
    const materiaSelect = document.getElementById('materia');
    const messaggioTextarea = document.getElementById('messaggio');
    const telefonoInput = document.getElementById('telefono');
    
    // Validazione email - Controllo base del browser
    if (emailInput) {
        emailInput.addEventListener('invalid', function(e) {
            e.preventDefault(); // Previeni messaggio del browser
            if (this.validity.valueMissing) {
                showFieldError(this, 'Per favore inserisci la tua email');
            } else if (this.validity.typeMismatch) {
                showFieldError(this, 'Inserisci un indirizzo email valido');
            }
        });
        
        emailInput.addEventListener('input', function() {
            removeFieldError(this);
            
            // Rimuovi colore se campo vuoto
            if (this.value.trim() === '') {
                this.classList.remove('touched');
            }
        });
    }
    
    // Validazione telefono (opzionale ma se compilato deve essere valido)
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function() {
            const value = this.value.trim();
            
            removeFieldError(this);
            
            if (value === '') {
                // Campo vuoto = valido (è opzionale)
                this.classList.remove('touched');
            } else {
                // Se compilato, deve avere almeno 8 caratteri
                const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
                
                if (!phoneRegex.test(value)) {
                    if (this.classList.contains('touched')) {
                        showFieldError(this, 'Inserisci un numero di telefono valido (minimo 8 cifre)');
                    }
                }
            }
        });
        
        telefonoInput.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value !== '') {
                this.classList.add('touched');
                const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
                if (!phoneRegex.test(value)) {
                    showFieldError(this, 'Inserisci un numero di telefono valido (minimo 8 cifre)');
                }
            }
        });
    }
    
    // Validazione Nome e Cognome (due parole minimo)
    if (nomeInput) {
        nomeInput.addEventListener('input', function() {
            const value = this.value.trim();
            const words = value.split(/\s+/).filter(word => word.length > 0);
            
            // Rimuovi classi precedenti
            this.classList.remove('js-valid', 'js-invalid');
            removeFieldError(this);
            
            if (value === '') {
                this.classList.remove('touched');
            } else if (this.classList.contains('touched')) {
                if (words.length < 2) {
                    this.classList.add('js-invalid');
                    showFieldError(this, 'Per favore inserisci sia nome che cognome');
                } else if (words.some(word => word.length < 2)) {
                    this.classList.add('js-invalid');
                    showFieldError(this, 'Nome e cognome devono contenere almeno 2 caratteri ciascuno');
                } else {
                    this.classList.add('js-valid');
                }
            }
        });
        
        nomeInput.addEventListener('invalid', function(e) {
            e.preventDefault(); // Previeni messaggio del browser
            const value = this.value.trim();
            const words = value.split(/\s+/).filter(word => word.length > 0);
            
            if (value === '') {
                showFieldError(this, 'Per favore inserisci il tuo nome e cognome');
            } else if (words.length < 2) {
                showFieldError(this, 'Per favore inserisci sia nome che cognome');
            } else if (words.some(word => word.length < 2)) {
                showFieldError(this, 'Nome e cognome devono contenere almeno 2 caratteri ciascuno');
            }
        });
    }
    
    // Validazione privacy
    if (privacyCheckbox) {
        privacyCheckbox.addEventListener('invalid', function(e) {
            e.preventDefault(); // Previeni messaggio del browser
            showFieldError(this, 'Devi accettare il trattamento dei dati per procedere');
        });
        
        privacyCheckbox.addEventListener('change', function() {
            removeFieldError(this);
        });
    }
    
    // Validazione materia
    if (materiaSelect) {
        materiaSelect.addEventListener('invalid', function(e) {
            e.preventDefault(); // Previeni messaggio del browser
            showFieldError(this, 'Per favore seleziona una materia di interesse');
        });
        
        materiaSelect.addEventListener('change', function() {
            removeFieldError(this);
        });
    }
    
    // Validazione messaggio
    if (messaggioTextarea) {
        messaggioTextarea.addEventListener('invalid', function(e) {
            e.preventDefault(); // Previeni messaggio del browser
            showFieldError(this, 'Per favore descrivi la tua richiesta');
        });
        
        messaggioTextarea.addEventListener('input', function() {
            removeFieldError(this);
            
            // Rimuovi colore se campo vuoto
            if (this.value.trim() === '') {
                this.classList.remove('touched');
            }
        });
    }
    
    // Aggiungi classe "touched" quando l'utente esce dal campo
    const allInputs = document.querySelectorAll('input:not([type="checkbox"]), textarea, select');
    allInputs.forEach(input => {
        input.addEventListener('blur', function() {
            // Non aggiungere touched se il campo è vuoto
            if (this.value.trim() !== '') {
                this.classList.add('touched');
            }
            
            // Trigger validazione per nome
            if (this.id === 'nome') {
                const value = this.value.trim();
                const words = value.split(/\s+/).filter(word => word.length > 0);
                
                this.classList.remove('js-valid', 'js-invalid');
                
                if (value !== '') {
                    if (words.length < 2 || words.some(word => word.length < 2)) {
                        this.classList.add('js-invalid');
                        if (words.length < 2) {
                            showFieldError(this, 'Per favore inserisci sia nome che cognome');
                        } else {
                            showFieldError(this, 'Nome e cognome devono contenere almeno 2 caratteri ciascuno');
                        }
                    } else {
                        this.classList.add('js-valid');
                    }
                }
            }
        });
    });

    initCookieBanner();
    initBackToTop();
    initMobileMenu();
    initScrollProgress();
});

// ==================== FORM SUBMISSION ====================

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Verifica manualmente tutti i campi prima di inviare
    let isValid = true;
    let firstInvalidField = null;
    
    // Aggiungi touched a tutti i campi per mostrare errori
    const allInputs = this.querySelectorAll('input:not([type="checkbox"]), textarea, select');
    allInputs.forEach(input => {
        if (input.value.trim() !== '' || input.hasAttribute('required')) {
            input.classList.add('touched');
        }
        
        // Controlla validità
        if (!input.checkValidity()) {
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = input;
            }
            
            // Mostra errore per questo campo
            if (input.validity.valueMissing) {
                if (input.id === 'nome') {
                    showFieldError(input, 'Per favore inserisci il tuo nome e cognome');
                } else if (input.id === 'email') {
                    showFieldError(input, 'Per favore inserisci la tua email');
                } else if (input.id === 'materia') {
                    showFieldError(input, 'Per favore seleziona una materia di interesse');
                } else if (input.id === 'messaggio') {
                    showFieldError(input, 'Per favore descrivi la tua richiesta');
                }
            } else if (input.validity.typeMismatch && input.id === 'email') {
                showFieldError(input, 'Inserisci un indirizzo email valido');
            }
        }
        
        // Validazione speciale per nome
        if (input.id === 'nome') {
            const value = input.value.trim();
            const words = value.split(/\s+/).filter(word => word.length > 0);
            
            if (value === '' || words.length < 2 || words.some(word => word.length < 2)) {
                isValid = false;
                input.classList.add('js-invalid');
                if (!firstInvalidField) {
                    firstInvalidField = input;
                }
                
                if (value === '') {
                    showFieldError(input, 'Per favore inserisci il tuo nome e cognome');
                } else if (words.length < 2) {
                    showFieldError(input, 'Per favore inserisci sia nome che cognome');
                } else {
                    showFieldError(input, 'Nome e cognome devono contenere almeno 2 caratteri ciascuno');
                }
            }
        }
    });
    
    // Controlla checkbox privacy
    const privacyCheckbox = this.querySelector('#privacy');
    if (!privacyCheckbox.checked) {
        isValid = false;
        if (!firstInvalidField) {
            firstInvalidField = privacyCheckbox;
        }
        showFieldError(privacyCheckbox, 'Devi accettare il trattamento dei dati per procedere');
    }
    
    if (!isValid) {
        // Mostra modal di errore invece del tooltip del browser
        showModal('error', 'Compila tutti i campi', 'Per favore, completa tutti i campi obbligatori prima di inviare il form.');
        
        // Scrolla al primo campo con errore
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                firstInvalidField.focus();
            }, 500);
        }
        return;
    }
    
    // Se tutto è valido, mostra modal di successo
    showModal('success', 'Messaggio Inviato!', 'Grazie per averci contattato. Ti risponderemo al più presto.');
    
    // Reset form e rimuovi classi touched
    this.reset();
    document.querySelectorAll('.touched').forEach(el => {
        el.classList.remove('touched', 'js-valid', 'js-invalid');
    });
    
    // Rimuovi tutti i messaggi di errore
    document.querySelectorAll('.field-error-message').forEach(el => {
        el.remove();
    });
});

// ==================== MODAL FUNCTIONS ====================

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
                <button class="modal-close-btn" onclick="closeModal()">CHIUDI</button>
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
        document.body.style.overflow = 'auto';
        
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

// ==================== COOKIE BANNER GDPR ====================

function initCookieBanner() {
    // Controlla se l'utente ha già fatto una scelta
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        // Mostra banner dopo 1 secondo
        setTimeout(() => {
            const banner = document.querySelector('.cookie-banner');
            if (banner) {
                banner.classList.add('show');
            }
        }, 1000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    hideCookieBanner();
    
    // Qui puoi attivare Google Analytics o altri servizi
    console.log('Cookies accettati');
}

function rejectCookies() {
    localStorage.setItem('cookieConsent', 'rejected');
    hideCookieBanner();
    
    console.log('Cookies rifiutati - solo essenziali');
}

function hideCookieBanner() {
    const banner = document.querySelector('.cookie-banner');
    if (banner) {
        banner.classList.remove('show');
    }
}

// ==================== BACK TO TOP BUTTON ====================

function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    // Mostra/nascondi bottone in base allo scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        
        // Nascondi temporaneamente durante lo scroll (optional)
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (scrollPosition > 300) {
                backToTopBtn.classList.add('visible');
            }
        }, 150);
    });
    
    // Click per tornare su
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== MENU HAMBURGER MOBILE ====================

function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('nav a');
    
    if (!navToggle || !nav) return;
    
    // Toggle menu
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Chiudi cliccando sull'overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            closeMenu();
        });
    }
    
    // Chiudi cliccando su un link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Chiudi con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMenu();
        }
    });
    
    function toggleMenu() {
        navToggle.classList.toggle('active');
        nav.classList.toggle('active');
        if (navOverlay) {
            navOverlay.classList.toggle('active');
        }
        
        // Previeni scroll del body quando menu è aperto
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    function closeMenu() {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
        if (navOverlay) {
            navOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
    
    // Chiudi menu quando si ridimensiona la finestra sopra 768px
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

// ==================== SCROLL PROGRESS BAR ====================

function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight);
        
        progressBar.style.transform = `scaleX(${scrolled})`;
    });
}


// Event listeners per i bottoni dei cookie (globali)
window.acceptCookies = acceptCookies;
window.rejectCookies = rejectCookies;


// Fix per Safari Mobile - nasconde la barra degli indirizzi
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 1);
    }, 100);
});

// ==================== COOKIE CONSENT & GOOGLE MAPS - SISTEMA COMPLETO ====================

// Funzione che controlla il consenso al caricamento della pagina
function checkCookieConsent() {
    const consent = getCookieConsent();
    const banner = document.querySelector('.cookie-banner');
    
    if (!consent) {
        // Nessuna scelta salvata, mostra il banner E il placeholder
        if (banner) {
            banner.classList.add('show');
        }
        showMapPlaceholder();
    } else {
        // Scelta già salvata
        if (consent === 'all') {
            loadGoogleMaps();
        } else if (consent === 'essential') {
            showMapPlaceholder();
        }
    }
}

// Legge il consenso salvato
function getCookieConsent() {
    return localStorage.getItem('cookieConsent');
}

// Salva il consenso
function setCookieConsent(value) {
    localStorage.setItem('cookieConsent', value);
}

// Utente accetta tutti i cookie (incluso Google Maps)
function acceptAllCookies() {
    setCookieConsent('all');
    hideBanner();
    loadGoogleMaps();
}

// Utente accetta solo cookie essenziali (NO Google Maps)
function acceptOnlyEssential() {
    setCookieConsent('essential');
    hideBanner();
    showMapPlaceholder();
}

// Nasconde il banner
function hideBanner() {
    const banner = document.querySelector('.cookie-banner');
    if (banner) {
        banner.classList.remove('show');
        banner.classList.add('hide');
    }
}

// Carica Google Maps
function loadGoogleMaps() {
    const mapContainers = document.querySelectorAll('.contatti-mappa-container'); // ✅ CAMBIATO
    
    mapContainers.forEach(container => {
        const iframe = container.querySelector('iframe[data-src]');
        
        if (iframe) {
            // Carica la mappa spostando l'URL da data-src a src
            if (iframe.dataset.src && !iframe.src) {
                iframe.src = iframe.dataset.src;
            }
        }
        
        // Aggiungi classe per mostrare iframe e nascondere placeholder
        container.classList.add('map-loaded');
    });
}

// Mostra placeholder al posto della mappa
function showMapPlaceholder() {
    const mapContainers = document.querySelectorAll('.contatti-mappa-container'); // ✅ CAMBIATO
    
    mapContainers.forEach(container => {
        // Rimuovi classe se presente (per tornare a mostrare placeholder)
        container.classList.remove('map-loaded');
    });
}

// Funzione chiamata quando l'utente clicca "Carica la mappa" nel placeholder
function enableGoogleMaps() {
    setCookieConsent('all');
    loadGoogleMaps();
}

// Esegui al caricamento della pagina
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkCookieConsent);
} else {
    // DOM già caricato
    checkCookieConsent();
}

// BACKWARD COMPATIBILITY: mantieni la vecchia funzione acceptCookies se usata altrove
function acceptCookies() {
    acceptAllCookies();
}

function rejectCookies() {
    acceptOnlyEssential();
}
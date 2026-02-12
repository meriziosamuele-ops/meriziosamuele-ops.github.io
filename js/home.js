// ============================================
// OPTIFORM HERO - JavaScript Completo
// Con Progress Bar Navigation + Click su Marker
// Animazione circolare CORRETTA
// TOUCH SWIPE DISABILITATO (solo frecce tastiera)
// ============================================

(function() {
    'use strict';

    // ========== CONFIGURAZIONE MODELLI ==========
    const MODELS_CONFIG = {
        k75s: {
            world: 'cyber',
            badge: 'Automatica • PLC Programmabile',
            title: 'K75S',
            subtitle: 'Automazione completa per produzioni ad alto volume',
            description: 'Termoformatrice con PLC programmabile per automazione completa del ciclo. Sistema diagnostico dedicato per monitoraggio resistenze in tempo reale. Ottimizzata per produzioni continuative ad alto volume con cicli ripetitivi.',
            image: 'img/k-75S-removebg-preview.png',
            alt: 'Termoformatrice K75S Automatica'
        },
        k75: {
            world: 'industrial',
            badge: 'Manuale • Massima Flessibilità',
            title: 'K75',
            subtitle: 'Controllo manuale per produzioni variabili',
            description: 'Termoformatrice con controllo manuale ideale per produzioni variabili e cambio formato frequente. Sistema diagnostico dedicato per manutenzione rapida e autonoma. Perfetta per chi necessita di massima flessibilità operativa.',
            image: 'img/k-75-removebg-preview.png',
            alt: 'Termoformatrice K75 Manuale'
        },
        k53: {
            world: 'dark',
            badge: 'Compatta • Dimensioni Ridotte',
            title: 'K53',
            subtitle: 'Controllo manuale, dimensioni compatte per spazi limitati',
            description: 'Termoformatrice con controllo manuale e dimensioni compatte, ideale per produzioni variabili in spazi produttivi limitati. Sistema diagnostico integrato per manutenzione rapida. Cambio formato veloce per piccole serie.',
            image: 'img/k-53-removebg-preview.png',
            alt: 'Termoformatrice K53 Compatta'
        }
    };

    // Ordine completo dei modelli: K75S → K75 → K53
    const MODEL_ORDER = ['k75s', 'k75', 'k53'];
    let currentModelIndex = 0;
    let isAnimating = false;

    // ========== PARTICELLE DINAMICHE ==========
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 30;
        particlesContainer.innerHTML = '';
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
        
        console.log('✨ Particles created:', particleCount);
    }

    // ========== AGGIORNA PROGRESS BAR ==========
    function updateProgressBar(index) {
        const progressFill = document.querySelector('.progress-fill');
        const progressDot = document.querySelector('.progress-dot');
        const progressMarkers = document.querySelectorAll('.progress-marker');
        
        if (!progressFill || !progressDot) return;

        // Calcola percentuale (0% = k75s, 50% = k75, 100% = k53)
        const percentage = (index / (MODEL_ORDER.length - 1)) * 100;
        
        // Aggiorna barra e pallino
        progressFill.style.width = percentage + '%';
        progressDot.style.left = percentage + '%';

        // Aggiorna markers attivi
        progressMarkers.forEach((marker, i) => {
            if (i === index) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });

        console.log('📊 Progress updated:', percentage + '%', MODEL_ORDER[index]);
    }

    // ========== CONTEXT SWITCH LATERALE CON LOGICA CIRCOLARE ==========
    function switchContext(targetIndex) {
        if (isAnimating) return;
        if (targetIndex === currentModelIndex) return;
        
        isAnimating = true;

        const heroContainer = document.querySelector('.hero-container');
        const heroContent = document.querySelector('.hero-content');
        
        if (!heroContainer || !heroContent) {
            isAnimating = false;
            return;
        }

        // ✅ LOGICA CIRCOLARE CORRETTA
        // Calcola la distanza più breve per determinare la direzione dell'animazione
        const totalModels = MODEL_ORDER.length;
        const forwardDistance = (targetIndex - currentModelIndex + totalModels) % totalModels;
        const backwardDistance = (currentModelIndex - targetIndex + totalModels) % totalModels;
        
        // Usa la direzione con distanza minore
        // Esempi:
        // K53 (index 2) → K75S (index 0): forwardDistance=1, backwardDistance=2 → usa 'next'
        // K75S (index 0) → K53 (index 2): forwardDistance=2, backwardDistance=1 → usa 'prev'
        let direction;
        if (forwardDistance <= backwardDistance) {
            direction = 'next';
        } else {
            direction = 'prev';
        }
        
        const newModelKey = MODEL_ORDER[targetIndex];
        const config = MODELS_CONFIG[newModelKey];

        // AGGIUNGI CLASSE PER BACKGROUND ISTANTANEO
        heroContainer.classList.add('switching');

        // Animazione slide laterale
        const slideDirection = direction === 'next' ? '-100%' : '100%';
        
        heroContent.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease';
        heroContent.style.transform = `translateX(${slideDirection})`;
        heroContent.style.opacity = '0';

        setTimeout(() => {
            // Aggiorna contenuto
            updateModelContent(newModelKey);
            
            // Aggiorna world IMMEDIATAMENTE (background cambia subito)
            heroContainer.dataset.world = config.world;
            heroContainer.dataset.model = newModelKey;
            
            // Aggiorna indice corrente
            currentModelIndex = targetIndex;
            
            // Aggiorna bottoni attivi
            updateActiveButton(newModelKey);
            
            // Aggiorna progress bar
            updateProgressBar(targetIndex);
            
            // Riposiziona dall'altro lato
            const enterDirection = direction === 'next' ? '100%' : '-100%';
            heroContent.style.transition = 'none';
            heroContent.style.transform = `translateX(${enterDirection})`;
            
            setTimeout(() => {
                heroContent.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease';
                heroContent.style.transform = 'translateX(0)';
                heroContent.style.opacity = '1';
                
                setTimeout(() => {
                    // RIMUOVI CLASSE DOPO L'ANIMAZIONE
                    heroContainer.classList.remove('switching');
                    isAnimating = false;
                }, 600);
            }, 50);
        }, 300);

        console.log('🔄 Context switched:', MODEL_ORDER[currentModelIndex], '→', newModelKey, `(${direction})`);
    }

    // ========== AGGIORNA CONTENUTO MODELLO ==========
    function updateModelContent(modelKey) {
        const config = MODELS_CONFIG[modelKey];
        if (!config) return;

        // Aggiorna testi
        const badge = document.getElementById('hero-badge');
        const title = document.getElementById('hero-title');
        const subtitle = document.getElementById('hero-subtitle');
        const description = document.getElementById('hero-description');
        const image = document.getElementById('machine-image');

        if (badge) badge.textContent = config.badge;
        if (title) title.textContent = config.title;
        if (subtitle) subtitle.textContent = config.subtitle;
        if (description) {
            description.innerHTML = `<p>${config.description}</p>`;
        }
        
        // Aggiorna immagine
        if (image) {
            image.src = config.image;
            image.alt = config.alt;
        }

        console.log('📦 Model updated:', modelKey);
    }

    // ========== AGGIORNA BOTTONE ATTIVO ==========
    function updateActiveButton(modelKey) {
        const worldBtns = document.querySelectorAll('.world-btn');
        worldBtns.forEach(btn => {
            if (btn.dataset.model === modelKey) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // ========== WORLD SWITCHER CON CONTEXT SWITCH ==========
    function initWorldSwitcher() {
        const heroContainer = document.querySelector('.hero-container');
        const worldBtns = document.querySelectorAll('.world-btn');
        
        if (!heroContainer || worldBtns.length === 0) return;

        worldBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetModel = btn.dataset.model;
                const targetIndex = MODEL_ORDER.indexOf(targetModel);
                
                if (targetIndex === -1) return;
                
                switchContext(targetIndex);
            });
        });

        // Inizializza il primo modello come attivo
        const initialModel = MODEL_ORDER[currentModelIndex];
        updateActiveButton(initialModel);
        updateProgressBar(currentModelIndex);
        
        console.log('🎮 World switcher initialized');
    }

    // ========== KEYBOARD NAVIGATION ==========
    function initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (isAnimating) return;
            
            let newIndex;
            
            // Freccia destra → prossimo modello
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                newIndex = (currentModelIndex + 1) % MODEL_ORDER.length;
                switchContext(newIndex);
            }
            // Freccia sinistra → modello precedente
            else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                newIndex = (currentModelIndex - 1 + MODEL_ORDER.length) % MODEL_ORDER.length;
                switchContext(newIndex);
            }
        });
        
        console.log('⌨️ Keyboard navigation enabled (← →)');
    }


// ========== CLICK SUI MARKER DELLA PROGRESS BAR - FIX MINIMALE ==========
function initProgressBarClick() {
    const progressMarkers = document.querySelectorAll('.progress-marker');
    
    if (progressMarkers.length === 0) {
        console.warn('⚠️ No progress markers found!');
        return;
    }

    progressMarkers.forEach((marker, index) => {
        // Click normale per desktop
        marker.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isAnimating) return;
            
            console.log(`🎯 Marker clicked: ${index} (${MODEL_ORDER[index]})`);
            switchContext(index);
        });

        // Touch per mobile - SEMPLICE
        marker.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isAnimating) return;
            
            console.log(`📱 Marker touched: ${index} (${MODEL_ORDER[index]})`);
            switchContext(index);
        }, { passive: false });

        marker.style.cursor = 'pointer';
    });

    console.log('🎯 Progress bar markers initialized:', progressMarkers.length);
}

    
    // ========== INITIALIZE ALL HERO EFFECTS ==========
    function init() {
        try {
            createParticles();
            initWorldSwitcher();
            initKeyboardNavigation();
            initProgressBarClick();
            
            // Imposta il primo modello
            const initialModel = MODEL_ORDER[currentModelIndex];
            const initialConfig = MODELS_CONFIG[initialModel];
            const heroContainer = document.querySelector('.hero-container');
            
            if (heroContainer && initialConfig) {
                heroContainer.dataset.world = initialConfig.world;
                heroContainer.dataset.model = initialModel;
            }
            
            console.log('🚀 Hero initialized successfully');
            console.log('💡 Desktop: Use arrow keys ← → to navigate');
            console.log('📱 Mobile: Use buttons or click on progress markers');
            console.log('📋 Model order: K75S → K75 → K53 (circular loop)');
        } catch (error) {
            console.error('❌ Hero initialization error:', error);
        }
    }

    // ========== RUN ON DOM READY ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
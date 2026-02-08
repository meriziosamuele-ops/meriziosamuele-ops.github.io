// ============================================
// OPTIFORM HERO - JavaScript Isolato
// Gestisce solo gli effetti della hero
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
            description.style.opacity = '0';
            setTimeout(() => {
                description.innerHTML = `<p>${config.description}</p>`;
                description.style.opacity = '1';
            }, 200);
        }
        
        // Aggiorna immagine con fade
        if (image) {
            image.style.opacity = '0';
            setTimeout(() => {
                image.src = config.image;
                image.alt = config.alt;
                image.style.opacity = '1';
            }, 300);
        }

        console.log('📦 Model updated:', modelKey);
    }

    // ========== WORLD SWITCHER CON MODELLI ==========
    function initWorldSwitcher() {
        const heroContainer = document.querySelector('.hero-container');
        const worldBtns = document.querySelectorAll('.world-btn');
        
        if (!heroContainer || worldBtns.length === 0) return;

        worldBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const world = btn.dataset.world;
                const model = btn.dataset.model;
                
                // Rimuovi active da tutti i bottoni
                worldBtns.forEach(b => b.classList.remove('active'));
                
                // Aggiungi active al bottone cliccato
                btn.classList.add('active');
                
                // Transizione fluida
                heroContainer.style.opacity = '0.7';
                
                setTimeout(() => {
                    heroContainer.dataset.world = world;
                    heroContainer.dataset.model = model;
                    updateModelContent(model);
                    heroContainer.style.opacity = '1';
                }, 200);
                
                console.log('🌍 Switched to:', world, '| Model:', model);
            });
        });
        
        console.log('🎮 World switcher initialized');
    }

    // ========== EFFETTO PARALLAX SULLA MACCHINA ==========
    function initMachineParallax() {
        const machineImage = document.querySelector('.machine-image');
        if (!machineImage) return;
        
        let ticking = false;
        
        function updateParallax(e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            machineImage.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            ticking = false;
        }
        
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => updateParallax(e));
                ticking = true;
            }
        });
        
        console.log('🖱️ Parallax effect initialized');
    }

    // ========== INITIALIZE ALL HERO EFFECTS ==========
    function init() {
        try {
            createParticles();
            initWorldSwitcher();
            // Parallax rimosso per stabilità immagine
            
            console.log('🚀 Hero initialized successfully');
        } catch (error) {
            console.error('❌ Hero initialization error:', error);
        }
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
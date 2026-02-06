/* ==========================================================================
   VANTAGGI-INTERACTIVE.JS - VERSIONE PULITA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initSectorTabs();
});

// ==========================================================================
// SCROLL REVEAL ANIMATIONS
// ==========================================================================

function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => observer.observe(reveal));
}

// ==========================================================================
// SECTOR TABS INTERATTIVI
// ==========================================================================

function initSectorTabs() {
    const tabs = document.querySelectorAll('.sector-tab');
    const contents = document.querySelectorAll('.sector-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const sectorId = this.dataset.sector;
            
            // Rimuovi active da tutti i tab
            tabs.forEach(t => t.classList.remove('active'));
            
            // Aggiungi active al tab cliccato
            this.classList.add('active');
            
            // Mostra il contenuto corretto
            contents.forEach(content => {
                if (content.dataset.content === sectorId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
}
/* ==========================================================================
   VANTAGGI-INTERACTIVE.JS - VERSIONE PULITA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initSectorTabs();
});

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
Sim.SpeciesMenu = {
    contextMenu: null,
    currentSpecie: null,
    init: function() {
        this.contextMenu = document.getElementById('context-menu');

        document.addEventListener('contextmenu', (e) => {
            if(e.target.classList.contains('specie-context-menu')) {
                e.preventDefault();
    
                Sim.SpeciesMenu.currentSpecie = e.target.getAttribute('data-specie');
                // Show the menu at the mouse position
                Sim.SpeciesMenu.contextMenu.style.top = `${e.clientY}px`;
                Sim.SpeciesMenu.contextMenu.style.left = `${e.clientX}px`;
                Sim.SpeciesMenu.contextMenu.style.display = 'block';
                Sim.SpeciesMenu.contextMenu.setAttribute('data-specie', Sim.SpeciesMenu.currentSpecie);
            }
        });

        document.addEventListener('click', () => {
            // Hide the menu when clicking elsewhere
            Sim.SpeciesMenu.contextMenu.style.display = 'none';
        });
    },

    kill: function(amount) {
        Sim.Actions.randomSpecieKill(this.currentSpecie, amount);
    },

    killPercent: function(percentage) {
        let amount = Math.floor(Sim.Cells.species.alive[this.currentSpecie].length * (percentage / 100));
        Sim.Actions.randomSpecieKill(this.currentSpecie, amount);
    }
};
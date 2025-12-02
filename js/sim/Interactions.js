Sim.Interactions = {
    focusOnSpecie: function(specie) {
        if(specie in Sim.Cells.species.alive) {
            if(Sim.Cells.species.alive[specie].length > 0) {
                let random_index = Math.floor(Math.random() * Sim.Cells.species.alive[specie].length);
                let selected_cell = Sim.Cells.species.alive[specie][random_index];

                let cell_object = Sim.Cells.bag[selected_cell];
                Sim.Screen.centerOn(cell_object.coords.x, cell_object.coords.y);
            }
        }
    }
};
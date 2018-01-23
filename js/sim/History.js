Sim.History = {
    data: [],
    log: function() {
        var obj = {
            ticks: Sim.Clock.ticks,
            cellsAlive: Sim.Cells.alive.length,
            species: Sim.Cells.species.list.clone(),
            aliveList: Sim.Cells.species.aliveList.clone(),
            alive: JSON.parse(JSON.stringify(Sim.Cells.species.alive))  // fastest way to clone an object in my shit opinion
        };
        this.data.push(obj);
    }
};
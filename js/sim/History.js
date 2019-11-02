Sim.History = {
    cellsHistory: {
        data: [],
        species: [],
        colors: {}
    },
    aliveCells: null,
    totalCells: null,

    records: {
        current: {
            fastestOnDirt: null,
            fastestOnWater: null,
            oldest: null,
            mostChildren: null
        },
        compare: function (cellId) {
            var cell = Sim.Cells.bag[cellId];

            /* compare speed on land */
            if (!this.current.fastestOnDirt) {
                this.current.fastestOnDirt = cellId;
            } else
            if (cell.speed > Sim.Cells.bag[this.current.fastestOnDirt].speed) {
                this.current.fastestOnDirt = cellId;
            }

            /* compare speed on water */
            if (!this.current.fastestOnWater) {
                this.current.fastestOnWater = cellId;
            } else
            if (cell.speedOnWater > Sim.Cells.bag[this.current.fastestOnWater].speedOnWater) {
                this.current.fastestOnWater = cellId;
            }

            /* there isnt much sense comparing the amount children of age of new born cells */
        },
        reset: function() {
            this.current = {
                fastestOnDirt: null,
                fastestOnWater: null,
                oldest: null,
                mostChildren: null
            };
        }
    },

    init: function () {
        this.aliveCells = document.getElementById('aliveCells');
        this.totalCells = document.getElementById('totalCells');
        this.species.element = document.getElementById('specieList');
    },

    species: {
        data: [],
        elements: [],
        element: null,
        add: function () {
            this.data;
        }
    },

    reset: function () {
        this.cellsHistory = {
            data: [],
            species: [],
            colors: {}
        };
        this.species.data = [];
        for (let i = 0; i < this.species.elements.length; i++) {
            this.species.elements[i].outerHTML = '';
        }
        this.species.elements = [];
        
        this.records.reset();
        Sim.HistoryWindow.reset();
    },

    log: function () {
        var obj = {
            ticks: Sim.Clock.ticks,
            cellsAlive: Sim.Cells.alive.length,
            species: Sim.Cells.species.list.clone(),
            aliveList: Sim.Cells.species.aliveList.clone(),
            alive: JSON.parse(JSON.stringify(Sim.Cells.species.alive)), // fastest way to clone an object in my shit opinion,
            records: {
                current: Object.assign({}, this.records.current)
            }
        };
        
        this.cellsHistory.data.push(obj);
        this.cellsHistory.colors = Object.assign({}, Sim.Cells.species.colors);
        this.cellsHistory.species = Sim.Cells.species.list.clone();
        
        if(Sim.HistoryWindow.isVisible === true) {
            Sim.HistoryWindow.displayInformation();
        }
    },
    updateScreen: function () {
        if (Sim.logging === true) {
            this.aliveCells.textContent = Sim.Cells.alive.length;
            //this.totalCells.textContent = Sim.Cells.bag.length;

            let species = [];
            for (let i = 0; i < Sim.Cells.species.aliveList.length; i++) {
                species.push({
                    specie: Sim.Cells.species.aliveList[i],
                    alive: Sim.Cells.species.alive[Sim.Cells.species.aliveList[i]].length,
                    color: Sim.Cells.bag[Sim.Cells.species.alive[Sim.Cells.species.aliveList[i]][0]].color,
                    percentage: (Sim.Cells.species.alive[Sim.Cells.species.aliveList[i]].length / Sim.Cells.alive.length) * 100
                });
            }

            species.sort(function (a, b) {
                return b.alive - a.alive;
            });

            var html = '';

            for (let i = 0; i < species.length; i++) {
                html += '<div class="specie">\n\
                            <div class="name">' + species[i].specie + '\n\
<span>' + (species[i].alive !== 1 ? species[i].alive + ' cells' : species[i].alive + ' cell') + '</span></div>\n\
                            <div class="bar" style="width: ' + species[i].percentage + '%;background-color: ' + species[i].color + ';">\n\
                            </div>\n\
                        </div>';
            }
            this.species.element.innerHTML = html;
        }
    },

    /* converts data to google charts dataTable and options */
    convertData: function (cellsHistory) {
        /* chart options */
        var options = {
            series: {}
        };
        
        var dataArray = [];

        /* adds header row */
        var headerRow = ['Ticks'];

        for (let i = 0; i < cellsHistory.species.length; i++) {
            headerRow.push(cellsHistory.species[i]);
            
            /* add line color to chart options */
            options.series[i] = {
                color: cellsHistory.colors[cellsHistory.species[i]]
            };
        }
        dataArray.push(headerRow);


        /* adds data */
        for (let i = 0; i < cellsHistory.data.length; i++) {
            let currentRow = [];

            let row = cellsHistory.data[i];

            currentRow.push(row.ticks);

            /* looping on species */
            for (let s = 0; s < cellsHistory.species.length; s++) {
                let aliveCells = null;
                if (cellsHistory.species[s] in row.alive) {
                    aliveCells = row.alive[cellsHistory.species[s]].length > 0 ? row.alive[cellsHistory.species[s]].length : null;
                }
                currentRow.push(aliveCells);
            }
            dataArray.push(currentRow);
        }
        
        

        return {data: dataArray, options: options};
    },

    /* displays history window */
    show: function () {

    }
};
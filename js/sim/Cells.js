Sim.Cells = {
    getNewSpecieId: function() {
        
        /* any default colors left? if so pick one */
        if(Sim.config.defaultSpecies.length > this.species.list.length) {
            /* picks a random item from distinct looking colors */
            var randSpecie = pickOne(Sim.config.defaultSpecies);
            if(this.species.list.indexOf(randSpecie.name) > -1) {
                randSpecie = this.getNewSpecieId();
            }
        } else {
            /* no colors left, proceed to generate a random hex string */
            /* generates random Hex string */
            var specieHex = '#' + randStr(6);
            /* if it already exists ou ot the 16777216 posibilities, damn */
            if(this.species.list.indexOf(specieHex) > -1) {
                randSpecie = this.getNewSpecieId();
            } else {
                randSpecie = {name: specieHex, color: specieHex};
            }
        }

        return randSpecie;
    },
    alive: [],
    bag: [],
    species: {
        // item keys are 'specie'. each item is an array of alive cells
        alive: {},
        // list of species that contain alive cells
        aliveList: [],
        // item keys are 'specie'. each item is an array of members
        members: {},
        // list of species
        list: [],
        colors: {},
        register: function (specieData) {
            this.list.push(specieData.name);
            this.members[specieData.name] = [];
            this.colors[specieData.name] = specieData.color;
            Sim.Cells.addCache(specieData);
        }
    },
    speciesData: {},
    cache: {},
    // context to the cells canvas
    context: null,

    init: function () {
        // adds cells canvas
        Sim.Canvas.add('cells', {
            zIndex: 3
        });
        // sets context
        this.context = Sim.Canvas.layers['cells'].context;
    },

    // adds new cell
    add: function (x, y, o) {
        this.bag.push(new Cell(x, y, o));

        let cellId = this.bag.length - 1;

        let cell = this.bag[cellId];

        this.alive.push(cellId);

        this.species.members[cell.specie].push(cellId);
        if(cell.specie in this.species.alive) {
            this.species.alive[cell.specie].push(cellId);
        } else {
            this.species.aliveList.push(cell.specie);
            this.species.alive[cell.specie] = [];
            this.species.alive[cell.specie].push(cellId);
        }

        // possible function for checking cache shall be added here
        Sim.History.records.compare(cellId);
    },

    addCache: function (specieData) {
        var specie = specieData.name;
        // cells shouldnt be drawn here, but..
        this.cache[specie] = [];

        // angle of changing of each image
        var angleStep = 360 / Sim.config.cells.numberOfAnglesToCache;

        // loops on numberOfAnglesToCache
        for (let i = 0; i < Sim.config.cells.numberOfAnglesToCache; i++) {
            // setting up canvas
            this.cache[specie].push(document.createElement('canvas'));
            this.cache[specie][i].width = Sim.config.cells.width;
            this.cache[specie][i].height = Sim.config.cells.height;

            var tempContext = this.cache[specie][i].getContext('2d');

            // drawing circle on cache
            tempContext.beginPath();

            tempContext.arc(
                    Sim.config.cells.half,
                    Sim.config.cells.half,
                    Sim.config.cells.radius,
                    0,
                    FULL_CIRCLE,
                    false
                    );

            tempContext.closePath();
            // circle drawn

            // fills circle
            tempContext.fillStyle = specieData.color;
            tempContext.fill();

            // draws border
            tempContext.strokeStyle = '#000000';
            tempContext.lineWidth = Sim.config.cells.border;
            tempContext.stroke();

            // draws cell direction line
            let radians = angleStep * i * TO_RADIANS;

            tempContext.moveTo(Sim.config.cells.half, Sim.config.cells.half);
            tempContext.lineTo(
                    Sim.config.cells.half + (Sim.config.cells.radius * Math.cos(radians)),
                    Sim.config.cells.half + (Sim.config.cells.radius * Math.sin(radians))
                    );
            tempContext.stroke();
        }
    },

    resize: function () {
        Sim.Canvas.layers['cells'].canvas.width = Sim.Screen.width;
        Sim.Canvas.layers['cells'].canvas.height = Sim.Screen.height;
    },

    tick: function () {
        for (let i = this.alive.length - 1; i > -1; i--) {
            this.bag[this.alive[i]].live();
        }

        if (Sim.Screen.drawing === true) {
            this.draw();
        }
    },

    // drawing from cache
    draw: function () {
        this.context.clearRect(0, 0, Sim.Screen.width, Sim.Screen.height);

        let startX = Sim.Screen.coords.x;
        let startY = Sim.Screen.coords.y;

        let endX = Sim.Screen.coords.x + Sim.Screen.tiles.x;
        let endY = Sim.Screen.coords.y + Sim.Screen.tiles.y;

        if (startX > 0) {
            startX--;
        }
        if (startY > 0) {
            startY--;
        }

        if (endX < Sim.World.width - 1) {
            endX++;
        }
        if (endY < Sim.World.height - 1) {
            endY++;
        }


        for (let r = startY; r < endY; r++) {
            for (let c = startX; c < endX; c++) {
                if (r + '_' + c in Sim.World.entities) {
                    for (let i = 0; i < Sim.World.entities[r + '_' + c].length; i++) {
                        let cell = this.bag[Sim.World.entities[r + '_' + c][i]];
                        let drawingAngle = Math.floor(cell.angle / Sim.config.cells.angleStep);

                        try {
                            this.context.drawImage(
                                    this.cache[cell.specie][drawingAngle],
                                    cell.drawingCoords.x - Sim.Screen.pixelCoords.x,
                                    cell.drawingCoords.y - Sim.Screen.pixelCoords.y
                                    );
                        } catch (exception) {
                            console.log(exception, cell.specie, drawingAngle);
                        }

                    }
                }
            }
        }
    },
    getLast: function () {
        return this.bag[this.bag.length - 1];
    },
    getOldest: function () {
        return this.bag[this.alive[0]];
    },
    
    /* erase all data */
    reset: function() {
        this.alive = [];
        this.bag = [];
        
        this.species.alive = {};
        this.species.aliveList = [];
        this.species.list = [];
        this.species.members = {};
    }
};
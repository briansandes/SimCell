Sim.Cells = {
    alive: [],
    bag: [],
    species: [],
    cache: {

    },
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

        this.alive.push(this.bag.length - 1);

        // possible function for checking cache shall be added here
    },

    addCache: function (specie) {
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
            tempContext.fillStyle = specie;
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

    registerSpecie: function (specie) {
        this.species.push(specie);
        this.addCache(specie);
    },

    resize: function () {
        Sim.Canvas.layers['cells'].canvas.width = Sim.Screen.width;
        Sim.Canvas.layers['cells'].canvas.height = Sim.Screen.height;
    },

    tick: function () {
        for (let i = this.alive.length - 1; i > -1; i--) {
            this.bag[this.alive[i]].eat();
            this.bag[this.alive[i]].move();
            this.bag[this.alive[i]].live();
            
            if(this.bag[this.alive[i]].energy < 1) {
                Sim.World.removeEntity(this.bag[this.alive[i]].cellId, this.bag[this.alive[i]].coords);
                this.bag[this.alive[i]].energy = 0;
                this.alive.splice(i, 1);
            }
        }
        
        if(Sim.Screen.drawing === true) {
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
        
        if(startX > 0) {
            startX--;
        }
        if(startY > 0) {
            startY--;
        }
        
        if(endX < Sim.config.map.width -1) {
            endX++;
        }
        if(endY < Sim.config.map.height -1) {
            endY++;
        }
        

        for (let r = startY; r < endY; r++) {
            for (let c = startX; c < endX; c++) {
                if (r + '_' + c in Sim.World.entities) {
                    for (let i = 0; i < Sim.World.entities[r + '_' + c].length; i++) {
                        let cell = this.bag[Sim.World.entities[r + '_' + c][i]];
                        let drawingAngle = Math.floor(cell.angle / Sim.config.cells.angleStep);

                        this.context.drawImage(
                            this.cache[cell.specie][drawingAngle],
                            cell.drawingCoords.x - Sim.Screen.pixelCoords.x,
                            cell.drawingCoords.y - Sim.Screen.pixelCoords.y
                        );
                    }
                }
            }
        }
    }
};
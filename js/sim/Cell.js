function Cell(x, y, o) {
    this.width = Sim.config.cells.width;
    this.height = Sim.config.cells.height;
    
    /* tile coords corresponding to the center of the cell */
    this.coords = {
        x: 0,
        y: 0
    };
    
    if(x && y) {
        this.coords.x = x;
        this.coords.y = y;
    } else {
        let tile = pickOne([pickOne(Sim.World.tileTypes.dirt), pickOne(Sim.World.tileTypes.food)]);
        this.coords.x = tile[0];
        this.coords.y = tile[1];
    }

    /* pixel coords corresponding to the center of the cell */
    this.pixelCoords = {
        x: this.coords.x * Sim.config.map.tileSize + Sim.config.cells.half,
        y: this.coords.y * Sim.config.map.tileSize + Sim.config.cells.half
    };

    /* top left coords of object */
    /* remind to change these only when object is on screen */
    this.drawingCoords = {
        x: this.coords.x * Sim.config.map.tileSize,
        y: this.coords.y * Sim.config.map.tileSize
    };
    
    this.birthPlace = {
        x: this.coords.x,
        y: this.coords.y
    };

    this.speed = 1;
    this.vision = Sim.config.cells.visionAngle;

    if(o) {
        if('parent' in o) {
            this.parent = o.parent.cellId;
            this.specie = o.parent.specie;
            this.speed = o.parent.speed + parseFloat((rand(-o.parent.speed * Sim.config.cells.mutationRate, o.parent.speed * Sim.config.cells.mutationRate)).toFixed(2));
            this.vision = o.parent.vision + parseFloat((rand(-o.parent.vision * Sim.config.cells.mutationRate, o.parent.vision * Sim.config.cells.mutationRate)).toFixed(2));
        }
    }

    if(!this.specie) {
        this.specie = '#'+randStr(6);
    }

    this.color = this.specie;
    this.energy = Sim.config.cells.initialEnergy;
    
    this.angle = parseInt(rand(359));

    this.visionVariation = {
        left: this.vision / -2,
        right: this.vision / 2
    };
    
    if(Sim.Cells.species.indexOf(this.specie) === -1) {
        // generates cache
        Sim.Cells.registerSpecie(this.specie);
    }
    
    this.entityId = 'cell_' + Sim.Cells.bag.length;
    this.cellId = Sim.Cells.bag.length;
    Sim.World.indexEntity(this.cellId, this.coords);
}

Cell.prototype.move = function () {
        let currentTile = Sim.Tiles[Sim.World.data[this.coords.y][this.coords.x]];
    
        /* Cell 'deciding' which angle should it move */
        let angleVariation = Math.round(rand(this.visionVariation.left, this.visionVariation.right));
        
        let newAngle = correctAngle(this.angle + angleVariation);
        /* Correcting angle */

        /* Converting angle to radians in order to calc sen and cos */
        let radiansAngle = newAngle * TO_RADIANS;

        /* distance of next point related to angle */
        let pointX = Math.cos(radiansAngle) * this.speed * currentTile.speed;
        let pointY = Math.sin(radiansAngle) * this.speed * currentTile.speed;

        /* new drawing coordinates */
        let centerX = this.pixelCoords.x + pointX;
        let centerY = this.pixelCoords.y + pointY;
        
        let topX = centerX - Sim.config.cells.half;
        let topY = centerY - Sim.config.cells.half;
        
        /* prevents cells from running out of map */
        if (!Sim.World.isIn(topX, topY, Sim.config.cells.width, Sim.config.cells.height, Sim.config.cells.border)) {
            topX = Sim.World.boundMovement('x', topX, Sim.config.cells.width, Sim.config.cells.height, Sim.config.cells.border);
            topY = Sim.World.boundMovement('y', topY, Sim.config.cells.width, Sim.config.cells.height, Sim.config.cells.border);
            
            centerX = topX + Sim.config.cells.half;
            centerY = topY + Sim.config.cells.half;
        }

        /* updating cell info */
        this.angle = newAngle;
        this.pixelCoords.x = centerX;
        this.pixelCoords.y = centerY;

        this.drawingCoords.x = topX;
        this.drawingCoords.y = topY;
        
        let newCoords = {
            x: Math.floor(this.pixelCoords.x / Sim.config.map.tileSize),
            y: Math.floor(this.pixelCoords.y / Sim.config.map.tileSize)
        };
        
        if(newCoords.x !== this.coords.x || newCoords.y !== this.coords.y) {
            Sim.World.indexEntity(this.cellId, newCoords, this.coords);
            
            this.coords.x = newCoords.x;
            this.coords.y = newCoords.y;
            
        }
};

Cell.prototype.live = function() {
    this.energy -= Sim.config.cells.energyPerTick;
    if(this.energy > Sim.config.cells.energyForDividing) {
        Sim.Cells.add(this.coords.x, this.coords.y, {parent: this});
        this.energy = Sim.config.cells.initialEnergy;
    }
};

Cell.prototype.eat = function() {
    if('food' in Sim.World.tiles[this.coords.y][this.coords.x]) {
        if(Sim.World.tiles[this.coords.y][this.coords.x].food > Sim.config.cells.foodPerTick) {
            this.energy += Sim.config.cells.foodPerTick;
            Sim.World.removeFood(this.coords.x, this.coords.y, Sim.config.cells.foodPerTick);
        } else
        if(Sim.World.tiles[this.coords.y][this.coords.x].food > 0) {
            this.energy += Sim.World.tiles[this.coords.y][this.coords.x].food;
            Sim.World.removeFood(this.coords.x, this.coords.y, Sim.World.tiles[this.coords.y][this.coords.x].food);
        }
    }
};
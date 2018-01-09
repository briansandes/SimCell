function Cell(x, y, o) {
    this.width = Sim.config.cells.width;
    this.height = Sim.config.cells.height;
    
    /* tile coords corresponding to the center of the cell */
    this.coords = {
        x: typeof x === 'number' ? x : Math.floor(rand(Sim.config.map.width)),
        y: typeof y === 'number' ? y : Math.floor(rand(Sim.config.map.height))
    };

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

    this.specie = '#dd0000';
    this.color = '#dd0000';
    this.angle = parseInt(rand(359));
    this.speed = 1;
    this.vision = 20;

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
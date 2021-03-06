function Cell(x, y, o) {
    this.width = Sim.config.cells.width;
    this.height = Sim.config.cells.height;
    this.ticks = 0;
    this.nextTack = Sim.config.tack;
    this.ticksOnWater = 0;
    this.experience = 0;
    this.level = 1;
    this.children = 0;

    /* tile coords corresponding to the center of the cell */
    this.coords = {
        x: 0,
        y: 0
    };

    if (!isNaN(x) && !isNaN(y)) {
        this.coords.x = x;
        this.coords.y = y;
    } else {
        //let tile = pickOne([pickOne(Sim.World.tileTypes.dirt), pickOne(Sim.World.tileTypes.food)]);
        let tile = pickOne(Sim.World.tileTypes.food);
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
    
    this.birthDate = Sim.Clock.ticks;

    this.birthPlace = {
        x: this.coords.x,
        y: this.coords.y
    };

    this.speed = 1;
    this.speedOnWater = 1;
    this.vision = Sim.config.cells.visionAngle;
    this.mutationRate = parseFloat(rand(Sim.config.cells.mutationRate.min, Sim.config.cells.mutationRate.max).toFixed(3));

    if (o) {
        if ('parent' in o) {
            this.mutationRate = parseFloat(o.parent.mutationRate.toFixed(3));
            this.parent = o.parent.cellId;
            this.specie = o.parent.specie;
            this.color = o.parent.color;
            this.speed = parseFloat((o.parent.speed + parseFloat((rand(-o.parent.speed * this.mutationRate, o.parent.speed * this.mutationRate)).toFixed(2))).toFixed(3));
            this.speedOnWater = parseFloat((o.parent.speedOnWater + parseFloat(((o.parent.ticksOnWater / o.parent.ticks) * o.parent.speed).toFixed(2))).toFixed(3));
            this.vision = parseFloat((o.parent.vision + parseFloat((rand(-o.parent.vision * this.mutationRate, o.parent.vision * this.mutationRate)).toFixed(2))).toFixed(3));
        }
    }

    if (!this.specie) {
        // now using actual color names for cells species
        var newSpecie = Sim.Cells.getNewSpecieId();
        this.specie = newSpecie.name;
        this.color = newSpecie.color;
    }

    this.energy = Sim.config.cells.initialEnergy;

    this.angle = randInt(359);

    this.visionVariation = {
        left: this.vision * -1,
        right: this.vision * 1
    };

    if (Sim.Cells.species.list.indexOf(this.specie) === -1) {
        // generates cache
        Sim.Cells.species.register({name: this.specie, color: this.color});
    }

    this.entityId = 'cell_' + Sim.Cells.bag.length;
    this.cellId = Sim.Cells.bag.length;
    Sim.World.indexEntity(this.cellId, this.coords);
}

Cell.prototype.changeDirection = function() {
    /* Cell 'deciding' which angle should it move */
    let angleVariation = this.angle + randInt(this.visionVariation.left, this.visionVariation.right);

    let correctedAngle = correctAngle(angleVariation);

    if(correctedAngle < 0) {
        throw this;
        console.log('-1 angle');
        Sim.Clock.stop();
    }
    this.angle = correctedAngle;
};

Cell.prototype.move = function () {
    let currentTile = Sim.Tiles[Sim.World.data[this.coords.y][this.coords.x]];

    if (currentTile.name === 'water') {
        this.ticksOnWater++;
    }

    /* Converting angle to radians in order to calc sen and cos */
    let radiansAngle = this.angle * TO_RADIANS;

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
    this.pixelCoords.x = centerX;
    this.pixelCoords.y = centerY;

    this.drawingCoords.x = topX;
    this.drawingCoords.y = topY;

    let newCoords = {
        x: Math.floor(this.pixelCoords.x / Sim.config.map.tileSize),
        y: Math.floor(this.pixelCoords.y / Sim.config.map.tileSize)
    };

    if (newCoords.x !== this.coords.x || newCoords.y !== this.coords.y) {
        Sim.World.indexEntity(this.cellId, newCoords, this.coords);

        this.coords.x = newCoords.x;
        this.coords.y = newCoords.y;

    }
};

/* called every tack interval as defined in sim.config.tack */
Cell.prototype.tack = function() {
    let energyToDecrease = (Sim.config.cells.energyPerTack + (Sim.config.cells.energyPerTack * this.speed)) / 2;
    
    this.changeDirection();
    
    this.energy -= energyToDecrease;
    this.nextTack = this.ticks + Sim.config.tack;
};

/*  */
Cell.prototype.live = function () {
    this.ticks++;
    
    // tack contains functions to be processed every X seconds
    // defined in Sim.config.tack
    if(this.ticks === this.nextTack) {
        this.tack();
    }
    
    // kills the cell if its energy is below 1
    if(this.energy < 1) {
        this.die();
    }
    
    // gotta make sure the energy is above zero to give the cell a chance to eat
    if(this.energy > 0) {
        let keepMoving = true;
        if(this.isOn('food')) {
            if(Sim.World.tiles[this.coords.y][this.coords.x].food > 0) {
                this.eat();
                keepMoving = true;
            }
        }
        if(keepMoving) {
            this.move();
        }

        if (this.energy > Sim.config.cells.energyForDividing) {
            this.divide();
        }
    }
};

Cell.prototype.eat = function () {
    if ('food' in Sim.World.tiles[this.coords.y][this.coords.x]) {
        if (Sim.World.tiles[this.coords.y][this.coords.x].food > Sim.config.cells.foodPerTick) {
            this.energy += Sim.config.cells.foodPerTick;
            Sim.World.removeFood(this.coords.x, this.coords.y, Sim.config.cells.foodPerTick);
        } else
        if (Sim.World.tiles[this.coords.y][this.coords.x].food > 0) {
            this.energy += Sim.World.tiles[this.coords.y][this.coords.x].food;
            Sim.World.removeFood(this.coords.x, this.coords.y, Sim.World.tiles[this.coords.y][this.coords.x].food);
        }
    }

};

Cell.prototype.divide = function() {
    Sim.Cells.add(this.coords.x, this.coords.y, {parent: this});
    this.energy = Sim.config.cells.initialEnergy;
    this.addXp(Sim.config.cells.xp.divide);
    this.children++;
};

/* serie of instructions to be called whenever a cell dies */
/* this function can also be called to kill a given cell */
Cell.prototype.die = function() {
    Sim.World.removeEntity(this.cellId, this.coords);
    this.energy = 0;
    Sim.Cells.alive.splice(Sim.Cells.alive.indexOf(this.cellId), 1);

    Sim.Cells.species.alive[this.specie].splice(Sim.Cells.species.alive[this.specie].indexOf(this.cellId), 1);
    if(Sim.Cells.species.alive[this.specie].length === 0) {
        delete Sim.Cells.species.alive[this.specie];
        Sim.Cells.species.aliveList.splice(Sim.Cells.species.aliveList.indexOf(this.specie), 1);
    }
};

Cell.prototype.addXp = function(xp) {
    this.experience += xp;
};

Cell.prototype.isOn = function(tileType) {
    return Sim.Tiles[Sim.World.data[this.coords.y][this.coords.x]].name === tileType;
};
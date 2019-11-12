Sim.World = {
    width: 0,
    height: 0,
    pixelWidth: 0,
    pixelHeight: 0,

    data: [],
    tiles: [],
    tileTypes: {
        food: [],
        dirt: [],
        water: []
    },
    entities: {},
    tileChanges: [],

    init: function (o) {
        // adds map canvas to screen and sets context
        this.addCanvas();
        
        if(o) {
            this.importMap(o);
        } else {
            this.importMap(this.newMap());
        }

        // sets map's size acoording to Screen size
        this.resize();
    },

    addCanvas: function() {
        Sim.Canvas.add('map', {
            zIndex: 1
        });

        this.context = Sim.Canvas.layers['map'].context;
    },
    
    /* generates new world with default params of NoiseMap.js */
    newMap: function(params) {
        return NoiseMap.generate(params);
    },

    /* clears all data from current map */
    reset: function() {
        this.data = [];
        this.tiles = [];
        this.tileTypes = {
            food: [],
            dirt: [],
            water: []
        };
        this.entities = {};
        this.tileChanges = [];
    },

    importMap: function (o) {
        if(!o) {
            console.error('Parameter missing for Sim.World.importMap');
            return false;
        }
        this.reset();
        
        this.data = typeof o.data === 'string' ? unpack(o.data) : o.data;
        
        this.height = this.data.length;
        this.width = this.data[0].length;
        
        this.pixelHeight = this.data.length * Sim.config.map.tileSize;
        this.pixelWidth = this.data[0].length * Sim.config.map.tileSize;
        
        for (let r = 0; r < this.data.length; r++) {
            this.tiles.push([]);
            for (let c = 0; c < this.data[r].length; c++) {
                let tile = this.data[r][c];
                if (Sim.Tiles[tile].name === 'food') {
                    this.tileTypes.food.push([c, r]);
                    this.tiles[r].push({
                        food: Sim.config.map.initialFood,
                        tileId: tile,
                        changed: false,
                        lerp: parseFloat((Sim.config.map.initialFood / Sim.config.map.maxFood).toFixed('1'))
                    });
                } else
                if (Sim.Tiles[tile].name === 'dirt') {
                    this.tileTypes.dirt.push([c, r]);
                    this.tiles[r].push({
                        tileId: tile,
                        changed: false
                    });
                } else
                if (Sim.Tiles[tile].name === 'water') {
                    this.tileTypes.water.push([c, r]);
                    this.tiles[r].push({
                        tileId: tile,
                        changed: false
                    });
                } else {
                    this.tiles[r].push({
                        tileId: tile,
                        changed: false
                    });
                }
            }
        }
        Sim.Screen.setSize();
        this.draw();
        
        if(Sim.Minimap.isReady) {
            Sim.Minimap.onChangeMap();
        }
        //Sim.Minimap.import();
    },

    resize: function () {
        Sim.Canvas.setSize('map',
                this.pixelWidth < Sim.Screen.width ? this.pixelWidth : Sim.Screen.width,
                this.pixelHeight < Sim.Screen.height ? this.pixelHeight : Sim.Screen.height
                );
        this.draw();
    },

    isIn: function (x, y, w, h, b) {
        return ((x + w) - b < this.pixelWidth && x + b > 0
                &&
                (y + h) - b < this.pixelHeight && y + b > 0);
    },
    boundMovement: function (axis, coord, w, h, b) {
        var new_coord;
        /* This shit was pretty hard to code */

        if (axis === 'x') {
            /* less than 0 */
            if (coord < 0 - b) {
                new_coord = 0 - b;
            } else
            /* greater than world width */
            if (coord + w > Sim.World.pixelWidth + b) {
                new_coord = Sim.World.pixelWidth - w + b;
            } else {
                /* move on that direction */
                new_coord = coord;
            }

        } else
        if (axis === 'y') {
            /* less than 0 */
            if (coord < 0 - b) {
                new_coord = 0 - b;
            } else
            /* greater than world height */
            if (coord + h > Sim.World.pixelHeight + b) {
                new_coord = Sim.World.pixelHeight - h + b;
            } else {
                /* move on that direction */
                new_coord = coord;
            }
        }

        return new_coord;
    },
    indexEntity: function (id, newCoords, pastCoords) {
        var tileId = newCoords.y + '_' + newCoords.x;
        if (!(tileId in this.entities)) {
            this.entities[tileId] = [];
        }

        this.entities[tileId].push(id);

        if (typeof pastCoords === 'object') {
            let pastTileId = pastCoords.y + '_' + pastCoords.x;
            this.entities[pastTileId].splice(this.entities[pastTileId].indexOf(id), 1);

            // I wonder whether does this actually collect some garbage
            if (this.entities[pastTileId].length === 0) {
                delete this.entities[pastTileId];
            }
        }
    },
    removeEntity: function (id, coords) {
        let pastTileId = coords.y + '_' + coords.x;
        this.entities[pastTileId].splice(this.entities[pastTileId].indexOf(id), 1);

        // I wonder whether does this actually collect some garbage
        if (this.entities[pastTileId].length === 0) {
            delete this.entities[pastTileId];
        }
    },
    draw: function () {
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
                this.drawTile(c, r);
            }
        }
    },
    drawTile: function (x, y, clear) {
        let dx = (x - Sim.Screen.coords.x) * Sim.config.map.tileSize;
        let dy = (y - Sim.Screen.coords.y) * Sim.config.map.tileSize;

        if (clear === true) {
            this.context.clearRect(dx, dy, Sim.config.map.tileSize, Sim.config.map.tileSize);
        }

        if (Sim.Tiles[this.data[y][x]].name === 'food') {
            let color = lerpColor(Sim.Tiles[0].hex, Sim.Tiles[2].hex, this.tiles[y][x].lerp);
            this.context.fillStyle = color;
        } else {
            this.context.fillStyle = 'rgb(' + Sim.Tiles[this.data[y][x]].rgb + ')';
        }
        this.context.fillRect(
                dx,
                dy,
                Sim.config.map.tileSize,
                Sim.config.map.tileSize
                );
    },

    /* loops on this.tileTypes.food (tiles registered as food) and
     * adds food to their objects, up to a limit defined in Sim.config.map.maxFood */
    /* the addFood function triggers some events */
    growFood: function () {
        for (let i = 0; i < this.tileTypes.food.length; i++) {
            let tile = this.tileTypes.food[i];
            this.addFood(tile[0], tile[1], Sim.config.map.foodGrows);
        }
    },
    
    
    addFood: function (x, y, food) {
        var newFood = this.tiles[y][x].food + food;

        if (newFood > Sim.config.map.maxFood) {
            newFood = Sim.config.map.maxFood;
        }

        if (this.tiles[y][x].food !== newFood) {
            this.tiles[y][x].food = newFood;
            let lerp = parseFloat((this.tiles[y][x].food / Sim.config.map.maxFood).toFixed(1));

            if (lerp !== this.tiles[y][x].lerp) {
                this.tiles[y][x].lerp = lerp;
                if (Sim.Screen.drawing === true) {
                    if (Sim.Screen.isInViewPort(x, y) && this.tiles[y][x].changed === false) {
                        this.addChange(x, y);
                    }
                }
            }
        }
    },
    removeFood: function (x, y, food) {
        var newFood = this.tiles[y][x].food - food;

        if (newFood < 0) {
            newFood = 0;
        }

        if (this.tiles[y][x].food !== newFood) {
            this.tiles[y][x].food = newFood;
            let lerp = parseFloat((this.tiles[y][x].food / Sim.config.map.maxFood).toFixed(1));

            if (lerp !== this.tiles[y][x].lerp) {
                this.tiles[y][x].lerp = lerp;
                if (Sim.Screen.drawing === true) {
                    if (Sim.Screen.isInViewPort(x, y) && this.tiles[y][x].changed === false) {
                        this.addChange(x, y);
                    }
                }
            }
        }
    },
    addChange: function (x, y) {
        this.tiles[y][x].changed = true;
        this.tileChanges.push({
            x: x,
            y: y
        });
    },

    tick: function () {
        if (Sim.Clock.ticks % 30 === 0) {
            this.growFood();
        }
    },
    
    drawTick: function() {
        if (Sim.Screen.moved === true) {
            this.draw();
        }
        if (this.tileChanges.length > 0) {
            for (let i = 0; i < this.tileChanges.length; i++) {
                this.drawTile(this.tileChanges[i].x, this.tileChanges[i].y, true);
                this.tiles[this.tileChanges[i].y][this.tileChanges[i].x].changed = false;
            }
        }
        this.tileChanges = [];
    }
};
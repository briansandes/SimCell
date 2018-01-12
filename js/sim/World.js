Sim.World = {
    width: 0,
    height: 0,
    pixelWidth: 0,
    pixelHeight: 0,

    data: [],
    tiles: [],
    tileTypes: {
        food: [],
        dirt: []
    },
    entities: {},

    init: function () {
        // TODO add options to initialize worlds
        this.importMap({data: WorldMap.data});
        this.width = Sim.config.map.width;
        this.height = Sim.config.map.height;

        // adds map canvas to screen
        Sim.Canvas.add('map', {
            zIndex: 1
        });

        this.context = Sim.Canvas.layers['map'].context;

        this.pixelWidth = coordToPixel(this.width);
        this.pixelHeight = coordToPixel(this.height);

        // sets map's size acoording to Screen size
        this.resize();
    },

    importMap: function (o) {
        this.data = unpack(o.data);
        for (let r = 0; r < this.data.length; r++) {
            this.tiles.push([]);
            for (let c = 0; c < this.data[r].length; c++) {
                let tile = this.data[r][c];
                if (Sim.Tiles[tile].name === 'food') {
                    this.tileTypes.food.push([c, r]);
                    this.tiles[r].push({
                        food: Sim.config.map.initialFood,
                        tileId: tile
                    });
                } else
                if(Sim.Tiles[tile].name === 'dirt') {
                    this.tileTypes.dirt.push([c, r]);
                    this.tiles[r].push({});
                } else {
                    this.tiles[r].push({
                        tileId: tile
                    });
                }
            }
        }
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
    removeFood: function(x, y, food) {
        this.tiles[y][x].food -= food;
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

        if (endX < Sim.config.map.width - 1) {
            endX++;
        }
        if (endY < Sim.config.map.height - 1) {
            endY++;
        }


        for (let r = startY; r < endY; r++) {
            for (let c = startX; c < endX; c++) {
                this.context.fillStyle = 'rgb(' + Sim.Tiles[this.data[r][c]].rgb + ')';
                this.context.fillRect(
                        (c - Sim.Screen.coords.x) * Sim.config.map.tileSize,
                        (r - Sim.Screen.coords.y) * Sim.config.map.tileSize,
                        Sim.config.map.tileSize,
                        Sim.config.map.tileSize
                        );
            }
        }
    },
    
    growFood: function() {
        for(let i = 0; i < this.tileTypes.food.length; i++) {
            let tile = this.tileTypes.food[i];
            this.tiles[tile[1]][tile[0]].food += Sim.config.map.foodGrows;
            
            if(this.tiles[tile[1]][tile[0]].food > Sim.config.map.maxFood)  {
                this.tiles[tile[1]][tile[0]].food = Sim.config.map.maxFood;
            }
        }
    },
    
    tick: function () {
        this.growFood();

        if (Sim.Screen.moved === true && Sim.Screen.drawing === true) {
            this.draw();
        }
    }
};
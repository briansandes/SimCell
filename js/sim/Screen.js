Sim.Screen = {
    // available size of screen
    // when changed will affect all canvas eleents related to it
    width: 0,
    height: 0,
    moved: false,
    drawing: true,
    // screen map coords
    coords: {
        x: 0,
        y: 0
    },
    // screen map coords in pixel
    // probably 'Screen.coords * Sim.config.map.tileSize'
    // (but there may also be offset values)
    pixelCoords: {
        x: 0,
        y: 0
    },
    
    // number of tiles to fill screen width and height plus 1
    tiles: {
        x: 0,
        y: 0
    },
    maxCoords: {
        x: 0,
        y: 0
    },
    
    mouse: {
        moved: false,
        coords: {
            x: 0,
            y: 0
        },
        position: {
            x: 0,
            y: 0
        },
        handleMovement: function(e) {
            if(e.pageX < Sim.Screen.width && e.pageY < Sim.Screen.height) {
                Sim.Screen.mouse.position.x = pixelToCoord(e.pageX);
                Sim.Screen.mouse.position.y = pixelToCoord(e.pageY);
                Sim.Screen.mouse.update();
            }
        },
        update: function() {
            let coords = {
                x: Sim.Screen.mouse.position.x + Sim.Screen.coords.x,
                y: Sim.Screen.mouse.position.y + Sim.Screen.coords.y
            };
            
            if(coords.x !== Sim.Screen.mouse.coords.x || coords.y !== Sim.Screen.mouse.coords.y) {
                Sim.Screen.mouse.coords.x = coords.x;
                Sim.Screen.mouse.coords.y = coords.y;
                Sim.Screen.mouse.moved = true;
            }
        }
    },
    log: {
        element: null,
        init: function() {
            this.element = document.getElementById('coords')
        },
        print: function() {
            if(Sim.Screen.mouse.coords.x > -1 && Sim.Screen.mouse.coords.x < Sim.config.map.width
                    &&
            Sim.Screen.mouse.coords.y > -1 && Sim.Screen.mouse.coords.y < Sim.config.map.height) {
                let currentTile = Sim.World.tiles[Sim.Screen.mouse.coords.y][Sim.Screen.mouse.coords.x];
                var food = '';
                if('food' in currentTile) {
                    food = ' ' + currentTile.food;
                }
                    
                this.element.textContent = 'Screen: ' + Sim.Screen.coords.x + 'x' + Sim.Screen.coords.y +
                        ' Mouse: ' + Sim.Screen.mouse.coords.x + 'x' +  Sim.Screen.mouse.coords.y +
                ' Tile: ' + Sim.Tiles[Sim.World.data[Sim.Screen.mouse.coords.y][Sim.Screen.mouse.coords.x]].name + food;
            }
            
        }
    },
    
    init: function () {
        // setting screen sizes
        this.setSize();
        this.log.init();
    },
    
    sidebarWidth: function() {
        return window.innerWidth < 768 ? 0 : 330 ;
    },
    
    /* TODO find a better way to get this value
     * because geez, we arent even considering box shadow */
    topbarHeight: function() {
        return 37 ;
    },
    
    // sets available size of screen
    setSize: function() {
        Sim.Screen.width = window.innerWidth - this.sidebarWidth();
        Sim.Screen.height = window.innerHeight - this.topbarHeight();
            
        Sim.Screen.tiles.x = Math.ceil(Sim.Screen.width / Sim.config.map.tileSize);
        Sim.Screen.tiles.y = Math.ceil(Sim.Screen.height / Sim.config.map.tileSize);
        
        if(Sim.Screen.width > Sim.config.map.pixelWidth) {
            Sim.Screen.maxCoords.x = 0;
        } else {
            Sim.Screen.maxCoords.x = Sim.config.map.width - Sim.Screen.tiles.x;
        }
        
        if(Sim.Screen.height > Sim.config.map.pixelHeight) {
            Sim.Screen.maxCoords.y = 0;
        } else {
            Sim.Screen.maxCoords.y = Sim.config.map.height - Sim.Screen.tiles.y;
        }
    },
    
    setCoords: function(x, y) {
       this.coords.x = x;
       this.pixelCoords.x = x * Sim.config.map.tileSize;
       
       this.coords.y = y; 
       this.pixelCoords.y = y * Sim.config.map.tileSize;
    },
    
    tick: function() {
        if(Input.isGroupPressed('arrows') === true) {
            if(Input.isPressed('left_arrow')) {
                this.coords.x--;
                this.pixelCoords.x -= Sim.config.map.tileSize;
                this.moved = true;
            } else
            if(Input.isPressed('right_arrow')) {
                this.coords.x++;
                this.pixelCoords.x += Sim.config.map.tileSize;
                this.moved = true;
            }
            
            if(Input.isPressed('up_arrow')) {
                this.coords.y--;
                this.pixelCoords.y -= Sim.config.map.tileSize;
                this.moved = true;
            } else
            if(Input.isPressed('down_arrow')) {
                this.coords.y++;
                this.pixelCoords.y += Sim.config.map.tileSize;
                this.moved = true;
            }
        
            if(this.moved === true) {
                if(this.coords.x < 0) {
                    this.coords.x = 0;
                    this.pixelCoords.x = 0;
                } else
                if(this.coords.x > this.maxCoords.x) {
                   this.coords.x = this.maxCoords.x; 
                   this.pixelCoords.x = this.maxCoords.x * Sim.config.map.tileSize;
                }
                
                if(this.coords.y < 0) {
                    this.coords.y = 0;
                    this.pixelCoords.y = 0;
                } else
                if(this.coords.y > this.maxCoords.y) {
                   this.coords.y = this.maxCoords.y; 
                   this.pixelCoords.y = this.maxCoords.y * Sim.config.map.tileSize;
                }
            }
        }
        
        if(Touch.isPressed() === true) {
            if(Touch.direction.x === 'left') {
                this.coords.x--;
                this.pixelCoords.x -= Sim.config.map.tileSize;
                this.moved = true;
            } else
            if(Touch.direction.x === 'right') {
                this.coords.x++;
                this.pixelCoords.x += Sim.config.map.tileSize;
                this.moved = true;
            }
            
            if(Touch.direction.y === 'up') {
                this.coords.y--;
                this.pixelCoords.y -= Sim.config.map.tileSize;
                this.moved = true;
            } else
            if(Touch.direction.y === 'down') {
                this.coords.y++;
                this.pixelCoords.y += Sim.config.map.tileSize;
                this.moved = true;
            }
        
            if(this.moved === true) {
                if(this.coords.x < 0) {
                    this.coords.x = 0;
                    this.pixelCoords.x = 0;
                } else
                if(this.coords.x > this.maxCoords.x) {
                   this.coords.x = this.maxCoords.x; 
                   this.pixelCoords.x = this.maxCoords.x * Sim.config.map.tileSize;
                }
                
                if(this.coords.y < 0) {
                    this.coords.y = 0;
                    this.pixelCoords.y = 0;
                } else
                if(this.coords.y > this.maxCoords.y) {
                   this.coords.y = this.maxCoords.y; 
                   this.pixelCoords.y = this.maxCoords.y * Sim.config.map.tileSize;
                }
            }
        }
        
        if(this.moved === true || this.mouse.moved === true) {
            Sim.Screen.mouse.update();
            Sim.Minimap.tick();
            this.log.print();
        }
    },
    isInViewPort: function(x, y) {
        return (x >= Sim.Screen.coords.x && x < Sim.Screen.coords.x + Sim.Screen.tiles.x) &&
               (y >= Sim.Screen.coords.y && y < Sim.Screen.coords.y + Sim.Screen.tiles.y);
    }
};
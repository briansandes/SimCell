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
            Sim.Screen.mouse.position.x = pixelToCoord(e.pageX);
            Sim.Screen.mouse.position.y = pixelToCoord(e.pageY);
            Sim.Screen.mouse.update();
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
            this.element.textContent = 'Screen: ' + Sim.Screen.coords.x + 'x' + Sim.Screen.coords.y + ' Mouse: ' + Sim.Screen.mouse.coords.x + 'x' +  Sim.Screen.mouse.coords.y;
        }
    },
    
    init: function () {
        // setting screen sizes
        this.setSize();
        this.log.init();
    },
    
    // sets available size of screen
    setSize: function() {
        Sim.Screen.width = window.innerWidth;
        Sim.Screen.height = window.innerHeight;
            
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
            this.log.print();
        }
    }
};
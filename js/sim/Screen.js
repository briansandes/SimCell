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
            if(Sim.Screen.mouse.coords.x > -1 && Sim.Screen.mouse.coords.x < Sim.World.width
                    &&
            Sim.Screen.mouse.coords.y > -1 && Sim.Screen.mouse.coords.y < Sim.World.height) {
                let currentTile = Sim.World.tiles[Sim.Screen.mouse.coords.y][Sim.Screen.mouse.coords.x];
                var food = '';
                if('food' in currentTile) {
                    food = ' ' + currentTile.food;
                }
                    
                this.element.innerHTML = 'Screen: ' + Sim.Screen.coords.x + 'x' + Sim.Screen.coords.y + '<br />' +
                        'Mouse: ' + Sim.Screen.mouse.coords.x + 'x' +  Sim.Screen.mouse.coords.y + '<br />' +
                'Tile: ' + Sim.Tiles[Sim.World.data[Sim.Screen.mouse.coords.y][Sim.Screen.mouse.coords.x]].name + food;
            }
            
        }
    },
    
    init: function () {
        // setting screen sizes
        this.setSize();
        this.log.init();
    },
    
    reset: function() {
        this.setCoords(0, 0);
        this.setSize();
    },
    
    sidebarWidth: function() {
        return window.innerWidth < 768 ? 0 : 280 ;
    },
    
    /* TODO find a better way to get this value
     * because geez, we arent even considering box shadow */
    topbarHeight: function() {
        return 37 ;
    },
    
    // sets available size of screen
    setSize: function() {
        /* screen dimensions  minus top bar menu and sidebar (sidebar is not shown on mobile devices)  */
        Sim.Screen.width = window.innerWidth - this.sidebarWidth();
        if(window.innerWidth < 768) {
            Sim.Screen.height = window.innerHeight - this.topbarHeight() - 210;
        } else {
            Sim.Screen.height = window.innerHeight - this.topbarHeight();
        }
        
            
        /* sets the amount of tiles the screen can display at once on current avaliable dimensions */
        Sim.Screen.tiles.x = Math.ceil(Sim.Screen.width / Sim.config.map.tileSize);
        Sim.Screen.tiles.y = Math.ceil(Sim.Screen.height / Sim.config.map.tileSize);
        
        /* disables map horizontal scroll if the map's width is smaller than the screen's width */
        if(Sim.Screen.width > Sim.World.pixelWidth) {
            Sim.Screen.maxCoords.x = 0;
        } else {
            Sim.Screen.maxCoords.x = Sim.World.width - Sim.Screen.tiles.x;
        }
        
        /* disables map vertical scroll if the map's height is smaller than the screen's height */
        if(Sim.Screen.height > Sim.World.pixelHeight) {
            Sim.Screen.maxCoords.y = 0;
        } else {
            Sim.Screen.maxCoords.y = Sim.World.height - Sim.Screen.tiles.y;
        }
    },
    
    setCoords: function(x, y) {
       this.coords.x = x;
       this.pixelCoords.x = x * Sim.config.map.tileSize;
       
       this.coords.y = y; 
       this.pixelCoords.y = y * Sim.config.map.tileSize;
    },
    
    tick: function() {
        this.checkKeyboardScrolling();
        
        this.checkTouchScrolling();
        
        if(this.moved === true || this.mouse.moved === true) {
            /* updates coords on mouse object */
            Sim.Screen.mouse.update();
            
            /* moves rectacle on minimap */
            Sim.Minimap.tick();
            
            /* shows mouse hover information on screen */
            this.log.print();
        }
    },
    isInViewPort: function(x, y) {
        return (x >= Sim.Screen.coords.x && x < Sim.Screen.coords.x + Sim.Screen.tiles.x) &&
               (y >= Sim.Screen.coords.y && y < Sim.Screen.coords.y + Sim.Screen.tiles.y);
    },
    
    // @TODO move these callbacks to a config callback
    // that reports coords changes to this controller
    checkKeyboardScrolling: function() {
        if(Input.isGroupPressed('arrows') === true) {
            if(Input.isPressed('left_arrow') || Input.isPressed('left_arrow_a')) {
                this.coords.x--;
                this.pixelCoords.x -= Sim.config.map.tileSize;
                this.moved = true;
            } else
            if(Input.isPressed('right_arrow') || Input.isPressed('right_arrow_d')) {
                this.coords.x++;
                this.pixelCoords.x += Sim.config.map.tileSize;
                this.moved = true;
            }
            
            if(Input.isPressed('up_arrow') || Input.isPressed('up_arrow_w')) {
                this.coords.y--;
                this.pixelCoords.y -= Sim.config.map.tileSize;
                this.moved = true;
            } else
            if(Input.isPressed('down_arrow') || Input.isPressed('down_arrow_s')) {
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
    },
    
    checkTouchScrolling: function() {
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
    }
};
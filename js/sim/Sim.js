var Sim = {
    running: true,
    logging: true,
    isReady: false,
    firstRun: true,
    init: function (o) {
        /* displays loading overlay */
        this.Loading.show();
        
        // inits screen reference
        this.Screen.init();

        /* parses map configuration (if available) */
        var mapOptions;
        if(o) {
            if('map' in o) {
                mapOptions = o.map;
            }
        }
        
        /* either generates a map based of mapOptions */
        /* or a new random map using this.World.newMap(); */
        this.World.init(mapOptions);

        /* initializes the Grid manager object */
        this.Grid.init();

        /* initializes the Cells object, which manages and holds Cells information */
        this.Cells.init();

        /* initializes the Minimap object */
        this.Minimap.init();

        /* initializes the Context menu object */
        this.SpeciesMenu.init();
        
        //this.World.draw();
        
        /* draws minimap (assuming the map has been already loaded) */
        this.Minimap.draw();

        /* initializes Touch object for events on mobile devices */
        Touch.init();
        
        /* initializes Cells historic manager object */
        this.History.init();

        /* this event adds a new Cell to the map when the mouse gets double clicked */
        /* TODO move this event to a contextmenu */
        document.addEventListener('dblclick', function (e) {
            if(e.target.id === 'canvas-cells') {
                for(let i = 0; i < Sim.config.cellsToAddOnClick; i++) {
                    Sim.Cells.add(pixelToCoord(e.pageX) + Sim.Screen.coords.x, pixelToCoord(e.pageY - Sim.config.topBarHeight) + Sim.Screen.coords.y);
                }
            }
        });

        /* keeps an eye on mouse movement for all events */
        document.addEventListener('mousemove', Sim.Screen.mouse.handleMovement);


        /* binding resize event */
        window.addEventListener('resize', function () {
            // gets new window size to global screen variable
            Sim.Screen.setSize();

            // resizes world canvas
            Sim.World.resize();
            
            // Resize minimap
            Sim.Minimap.resize();
        

            // resizes grid canvas
            Sim.Grid.resize();

            // resizes cells canvas
            Sim.Cells.resize();
        });
        
        /* SIMULATION ABOUT TO START */
        this.isReady = true;
        
        /* tick-tack tick-tack */
        this.Clock.start();
        
        /* hides loading overlay */
        setTimeout(function() {
            Sim.Loading.hide();
        }, 500);
    },

    tick: function () {
        /* moves cells and calculate changes */
        this.Cells.tick();
        
        /* grows food basically */
        this.World.tick();
        
        /* TODO move drawing functions here */
        if(this.Screen.drawing === true) {
            //console.log('in drawing');
            /* checks for scrolling */
            this.Screen.tick();
            
            this.World.drawTick();
            
            /* draws cells over minimap */
            this.Minimap.drawCellsTick();
        }
        
        /* reseting state */
        this.Screen.moved = false;
        this.Screen.mouse.moved = false;
        
        if(Sim.logging === true) {
            /* updates cells info on screen every 30 ticks */
            /* TODO improve this condition's performance */
            /* TODO move 30 to a config value */
            if(Sim.Clock.ticks % 30 === 0) {
                Sim.History.updateScreen();
            }
        }
        
        /* TODO improve this condition's performance */
        /* TODO move 1000 to a config value */
        if(Sim.Clock.ticks % 1000 === 0) {
            Sim.History.log();
        }
    },
    
    draw: function() {},
    
    fastTicks: function (ticks) {
        this.Clock.stop();
        this.Loading.show();
        this.Screen.drawing = false;
        this.logging = false;
        
        setTimeout(function(){
            let percentage = 0;
            for (let i = 0; i < ticks; i++) {
                Sim.Clock.ticks++;
                Sim.tick();

                let newPercentage = Math.floor((i / ticks) * 100);
                if (newPercentage !== percentage) {
                    percentage = newPercentage;
                    console.log(percentage + '%');
                }
            }
            console.log(Sim.Clock.ticks + ' ticks ellapsed');
            console.log(Sim.Cells.alive.length + ' cells alive');
            console.log('newest cell:', Sim.Cells.getLast());
            console.log('oldest cell:', Sim.Cells.getOldest());
            setTimeout(function () {
                Sim.Screen.drawing = true;
                Sim.Clock.start();
                Sim.World.draw();
                Sim.logging = true;
                Sim.History.updateScreen();
                Sim.Loading.hide();
            }, 200);
        }, 100);
    },
    
    newMap: function() {
        //Sim.Clock.stop();
        Sim.Cells.reset();
        Sim.History.reset();
        Sim.World.importMap(Sim.World.newMap());
        Sim.Clock.reset();
        //Sim.Clock.start();
    },
    
    importMap: function(mapInfo) {
        if(!this.isReady) {
            this.init({
                map: mapInfo
            });
        } else {
            this.World.importMap(mapInfo);
        }
    },
    
    
    /* Static objects */
    /* TODO move this somewhere else in the future */
    
    
    /* Supposedly the only static 'component' of this whole thing */
    Loading: {
        show: function () {
            document.getElementById('loading-overlay').style.display = 'table';
        },
        hide: function () {
            document.getElementById('loading-overlay').style.display = 'none';
        },
        isVisible: function () {
            return document.getElementById('loading-overlay').style.display === 'table';
        }
    },
    
    Help: {
        show: function () {
            document.getElementById('help-overlay').style.display = 'table';
        },
        hide: function () {
            document.getElementById('help-overlay').style.display = 'none';
        },
        isVisible: function () {
            return document.getElementById('help-overlay').style.display === 'table';
        }
    },
    
    About: {
        show: function () {
            document.getElementById('about-overlay').style.display = 'table';
        },
        hide: function () {
            document.getElementById('about-overlay').style.display = 'none';
        },
        isVisible: function () {
            return document.getElementById('about-overlay').style.display === 'table';
        }
    }
};

var Sim = {
    config: {
        map: {
            name: '',
            width: 160,
            height: 100,
            tileSize: 25,
            chunkSize: 20
        },
        screen: {
            width: 800,
            height: 600,
            scale: 1
        },
        cells: {
            radius: 10,
            border: 2.5,
            width: 25,
            height: 25
        }
    },
    
    init: function () {
        this.Screen.init();
        
        this.World.init();
        
        this.Grid.init();
        
        this.Cells.init();
        
        for(let i = 0; i < 20; i++) {
            this.Cells.add(Sim.World.width / 2, Sim.World.height / 2);
        }

        this.Cells.add(0, 0);
        
        
        this.Clock.start();
        
        /* binding resize event */
        window.addEventListener('resize', function() {
            // gets new window size to global screen variable
            Sim.Screen.setSize();
            
            // resizes world canvas
            Sim.World.resize();
            
            // resizes grid canvas
            Sim.Grid.resize();

            // resizes cells canvas
            Sim.Cells.resize();
        });
    },
    
    tick: function() {
        this.Cells.tick();
    }
};

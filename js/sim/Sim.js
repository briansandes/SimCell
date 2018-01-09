var Sim = {    
    init: function () {
        // inits screen reference
        this.Screen.init();
        
        this.World.init();
        
        this.Grid.init();
        
        this.Cells.init();
        
        this.World.draw();
        
        for(let i = 0; i < 1000; i++) {
            //this.Cells.add(Math.floor(Sim.World.width / 2), Math.floor(Sim.World.height / 2));
            this.Cells.add(Math.floor(rand(Sim.World.width)), Math.floor(rand(Sim.World.height)));
        }
        
        this.Clock.start();

        //this.Cells.add(0, 0);
        
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
        this.Screen.tick();
        this.Cells.tick();
        this.World.tick();
        this.Screen.moved = false;
    }
};

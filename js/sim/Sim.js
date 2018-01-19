var Sim = {    
    init: function () {
        // inits screen reference
        this.Screen.init();
        
        this.World.init();
        
        this.Grid.init();
        
        this.Cells.init();
        
        this.World.draw();
        
        Touch.init();
        
//        for(let i = 0; i < 0; i++) {
            //this.Cells.add(Math.floor(Sim.World.width / 2), Math.floor(Sim.World.height / 2));
//            this.Cells.add();
//        }
        
        this.Clock.start();

        //this.Cells.add(0, 0);
        
        document.addEventListener('dblclick', function(e) {
            Sim.Cells.add(pixelToCoord(e.pageX) + Sim.Screen.coords.x, pixelToCoord(e.pageY) + Sim.Screen.coords.y);
        });
        
        document.addEventListener('mousemove', Sim.Screen.mouse.handleMovement);
        
        
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
        this.Screen.mouse.moved = false;
    },
    fastTicks: function(ticks) {
        this.Clock.stop();
        this.Screen.drawing = false;
        let percentage = 0;
        for(let i = 0; i < ticks; i++) {
            this.Clock.ticks++;
            this.tick();
            
            let newPercentage = Math.floor((i / ticks) * 100);
            if(newPercentage !== percentage) {
                percentage = newPercentage;
                console.log(percentage + '%');
            }
        }
        console.log(this.Clock.ticks + ' ticks ellapsed');
        console.log(this.Cells.alive.length + ' cells alive');
        console.log('newest cell:', this.Cells.getLast());
        console.log('oldest cell:', this.Cells.getOldest());
        setTimeout(function() {
            Sim.Screen.drawing = true;
            Sim.Clock.start();
        }, 100);
    }
};

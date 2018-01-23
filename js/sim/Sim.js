var Sim = {
    init: function () {
        // inits screen reference
        this.Screen.init();

        this.World.init();

        this.Grid.init();

        this.Cells.init();

        this.Minimap.init();
        
        this.World.draw();
        
//        this.Minimap.draw();

        Touch.init();

        this.Clock.start();

        document.addEventListener('dblclick', function (e) {
            Sim.Cells.add(pixelToCoord(e.pageX) + Sim.Screen.coords.x, pixelToCoord(e.pageY) + Sim.Screen.coords.y);
        });

        document.addEventListener('mousemove', Sim.Screen.mouse.handleMovement);


        /* binding resize event */
        window.addEventListener('resize', function () {
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

    tick: function () {
        if(this.Screen.drawing === true) {
            this.Screen.tick();
        }
        this.Cells.tick();
        this.World.tick();
        this.Screen.moved = false;
        this.Screen.mouse.moved = false;
        
        if(Sim.Clock.ticks % 1000 === 0) {
            Sim.History.log();
        }
    },
    fastTicks: function (ticks) {
        this.Clock.stop();
        this.Loading.show();
        this.Screen.drawing = false;
        
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
                Sim.Loading.hide();
            }, 200);
        }, 100);
    },
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
    }
};

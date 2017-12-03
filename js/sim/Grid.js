Sim.Grid = {
    context: null,
    init: function () {
        // adds a grid canvas to the screen
        Sim.Canvas.add('grid', {
            zIndex: 2
        });
        
        // Imma change this in the future
        this.context = Sim.Canvas.layers['grid'].context;

        this.render();
    },
    render: function () {
        this.context.clearRect(0, 0, Sim.Screen.width, Sim.Screen.height);

        for (var x = 0; x <= Sim.Screen.width; x += Sim.config.map.tileSize) {
            this.context.moveTo(0.5 + x, 0);
            this.context.lineTo(0.5 + x, Sim.Screen.height);
        }


        for (var x = 0; x <= Sim.Screen.height; x += Sim.config.map.tileSize) {
            this.context.moveTo(0, 0.5 + x);
            this.context.lineTo(Sim.Screen.width, 0.5 + x);
        }

        this.context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.context.stroke();
    },
    resize: function () {
        Sim.Canvas.layers['grid'].canvas.width = Sim.Screen.width;
        Sim.Canvas.layers['grid'].canvas.height = Sim.Screen.height;
        this.render();
    }
};
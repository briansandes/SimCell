Sim.Screen = {
    width: 0,
    height: 0,
    coords: {
        x: 0,
        y: 0
    },
    pixelCoords: {
        x: 0,
        y: 0
    },
    init: function () {
        this.setSize();
    },
    
    setSize: function() {
        Sim.Screen.width = window.innerWidth;
        Sim.Screen.height = window.innerHeight;
    }
};
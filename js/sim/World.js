Sim.World = {
    width: 50,
    height: 50,
    pixelWidth: 0,
    pixelHeight: 0,
    init: function () {
        Sim.Canvas.add('map', {
            zIndex: 1
        });
        this.resize();
    },
    resize: function() {
        this.width = this.pixelToCoord(Sim.Screen.width);
        this.height = this.pixelToCoord(Sim.Screen.height);

        this.pixelWidth = Sim.World.coordToPixel(this.width);
        this.pixelHeight = Sim.World.coordToPixel(this.height);
        Sim.Canvas.setSize('map', Sim.Screen.width, Sim.Screen.height);
    },
    
    isIn: function(x, y, w, h, b) {
        return ((x + w) - b < Sim.World.pixelWidth && x + b > 0
                &&
         (y + h) - b < Sim.World.pixelHeight && y + b > 0);
    },
    coordToPixel: function(coord) {
        return coord * Sim.config.map.tileSize;
    },
    pixelToCoord: function(coord) {
        return Math.floor(coord / Sim.config.map.tileSize);
    },
    boundMovement: function(axis, coord, w, h, b) {
        var new_coord;
        /* This shit was pretty hard to code */

        if(axis === 'x') {
            /* less than 0 */
            if(coord < 0 - b) {
                new_coord = 0 - b;
            } else
            /* greater than world width */
            if(coord + w > Sim.World.pixelWidth + b) {
                new_coord = Sim.World.pixelWidth - w + b;
            } else {
                /* move on that direction */
                new_coord = coord;
            }  

        } else
        if(axis === 'y') {
            /* less than 0 */
            if(coord < 0 - b) {
                new_coord = 0 - b;
            } else
            /* greater than world height */
            if(coord + h > Sim.World.pixelHeight + b) {
                new_coord = Sim.World.pixelHeight - h + b;
            } else {
                /* move on that direction */
                new_coord = coord;
            } 
        }

        return new_coord;
    }
};
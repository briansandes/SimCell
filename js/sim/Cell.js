'use strict';

// ES6 YAAAY

class Entity {
    constructor(x, y, width, height) {
        this.width = width;
        this.height = height;

        this.center = {
            x: Math.floor(this.width / 2),
            y: Math.floor(this.height / 2)
        };

        this.coords = {
            x: x,
            y: y
        };

        this.drawingCoords = {
            x: Sim.World.coordToPixel(x),
            y: Sim.World.coordToPixel(y)
        };
    }
}

class Cell extends Entity {
    constructor(sideLength) {
        super(sideLength, sideLength);
    }
    get area() {
        return this.height * this.width;
    }
    set sideLength(newLength) {
        this.height = newLength;
        this.width = newLength;
    }
}

var square = new Square(2);
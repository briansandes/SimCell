Sim.Cells = {
    alive: [],
    bag: [],
    context: null,
    init: function () {
        Sim.Canvas.add('cells', {
            zIndex: 3
        });
        this.context = Sim.Canvas.layers['cells'].context;
    },

    add: function (x, y) {
        let obj = {
            coords: {
                x: x,
                y: y
            },
            centerCoords: {
                x: Sim.World.coordToPixel(x) + (Sim.config.cells.width / 2),
                y: Sim.World.coordToPixel(y) + (Sim.config.cells.height / 2)
            },
            color: '#dd0000',
            angle: rand(359),
            speed: 1,
            vision: 20
            
        };

        this.bag.push(obj);

        this.alive.push(this.bag.length - 1);
    },
    
    resize: function () {
        Sim.Canvas.layers['cells'].canvas.width = Sim.Screen.width;
        Sim.Canvas.layers['cells'].canvas.height = Sim.Screen.height;
    },
    
    tick: function() {
        this.moveAll();
        this.draw();
    },
    
    moveAll: function() {
        for (let i = 0; i < this.alive.length; i++) {
            this.move(this.bag[this.alive[i]]);
        }
    },

    draw: function () {
        this.context.clearRect(0, 0, Sim.Screen.width, Sim.Screen.height);

        for (let i = 0; i < this.alive.length; i++) {
            let cell = this.bag[this.alive[i]];
            
            let screenCoords = {
                x: cell.centerCoords.x - Sim.Screen.pixelCoords.x,
                y: cell.centerCoords.y - Sim.Screen.pixelCoords.y
            };
            
            this.context.beginPath();

            this.context.strokeStyle = 'rgba(0, 0, 0, 1)';
            this.context.lineWidth = Sim.config.cells.border;
            this.context.arc(
                    screenCoords.x,
                    screenCoords.y,
                    Sim.config.cells.radius,
                    0,
                    2 * Math.PI,
                    false
                    );
            this.context.fillStyle = cell.color;
            this.context.fill();
            this.context.stroke();
            this.context.closePath();
            
            let radians = cell.angle * Math.PI / 180;
            
            this.context.moveTo(screenCoords.x, screenCoords.y);
            this.context.lineTo(screenCoords.x + (Sim.config.cells.radius * Math.cos(radians)), screenCoords.y + (Sim.config.cells.radius * Math.sin(radians)));
            this.context.stroke();
            this.context.closePath();
        }
    },
    
    move: function (cell) {
        var center_x, center_y;

        let vision = Math.round(cell.vision % 2 === 1 ? cell.vision -1 : cell.vision);

        /* Cell 'deciding' which angle should it move */
        let angle_variation = Math.round(rand(0, vision) - (vision / 2));
        
        let new_angle = cell.angle + angle_variation;

        /* Correcting angle */
        if (new_angle < 0) {
            new_angle = new_angle + 360;
        } else
        if (new_angle > 359) {
            new_angle = new_angle - 360;
        }

        /* Converting angle to radians in order to calc sen and cos */
        let radians_angle = new_angle * TO_RADIANS;

        /* distance of next point related to angle */
        let point_x = Math.cos(radians_angle) * cell.speed;
        let point_y = Math.sin(radians_angle) * cell.speed;

        /* new drawing coordinates */
        center_x = cell.centerCoords.x + point_x;
        center_y = cell.centerCoords.y + point_y;
        
        let top_x = center_x - (Sim.config.cells.width / 2);
        let top_y = center_y - (Sim.config.cells.height / 2);
        
        /* prevents cells from running out of map */
        if (!Sim.World.isIn(top_x, top_y, Sim.config.cells.width, Sim.config.cells.height, Sim.config.cells.border)) {
            top_x = Sim.World.boundMovement('x', top_x, Sim.config.cells.width, Sim.config.cells.height, Sim.config.cells.border);
            top_y = Sim.World.boundMovement('y', top_y, Sim.config.cells.width, Sim.config.cells.height, Sim.config.cells.border);
            
            center_x = top_x + (Sim.config.cells.width / 2);
            center_y = top_y + (Sim.config.cells.height / 2);
        }
        

        /* updating cell info */
        cell.angle = new_angle;
        cell.centerCoords.x = center_x;
        cell.centerCoords.y = center_y;
    }
};
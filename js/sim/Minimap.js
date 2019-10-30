Sim.Minimap = {
    element: null,
    canvas: null,
    context: null,
    rectCanvas: null,
    rectContext: null,
    
    isReady: false,
    
    mousePressed: false,
    ratio: {
        x: 0,
        y: 0
    },
    rectangle: {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    },
    
    init: function () {
        this.element = document.getElementById('minimap');
        
        Sim.Canvas.add('minimap', {
            width: Sim.config.minimap.width,
            height: Sim.config.minimap.height,
            appendTo: this.element,
            zIndex: 1
        });
        
        Sim.Canvas.add('minimap-area', {
            width: Sim.config.minimap.width,
            height: Sim.config.minimap.height,
            appendTo: this.element,
            zIndex: 2
        });
        
        this.context = Sim.Canvas.layers['minimap'].context;
        this.rectContext = Sim.Canvas.layers['minimap-area'].context;
        this.rectContext.strokeStyle = '#ffffff';
        
        this.setRatio();
        this.setRectangleSize();
        

        Sim.Canvas.layers['minimap-area'].canvas.addEventListener('mousedown', function (e) {
            Sim.Minimap.mousePressed = true;
        });

        Sim.Canvas.layers['minimap-area'].canvas.addEventListener('mousemove', function (e) {
            if (Sim.Minimap.mousePressed === true) {
                Sim.Minimap.click(e);
            }
        });

        Sim.Canvas.layers['minimap-area'].canvas.addEventListener('mouseup', function (e) {
            Sim.Minimap.click(e);
            Sim.Minimap.mousePressed = false;
        });

        Sim.Canvas.layers['minimap-area'].canvas.addEventListener('mouseout', function (e) {
            Sim.Minimap.mousePressed = false;
        });
        
        this.isReady = true;
    },
    tick: function() {
        if(Sim.Screen.moved === true) {
            this.drawRectangle();
        }
    },
    
    onChangeMap: function() {
        this.setRatio();
        this.setRectangleSize();
        this.draw();
        this.drawRectangle();
    },

    setRatio: function () {
        this.ratio.x = Sim.config.minimap.width / Sim.World.width;
        this.ratio.y = Sim.config.minimap.height / Sim.World.height;
    },
    setRectangleSize: function () {
        this.rectangle.width = Math.floor((Sim.Screen.width / Sim.World.pixelWidth) * Sim.config.minimap.width);
        this.rectangle.height = Math.floor((Sim.Screen.height / Sim.World.pixelHeight) * Sim.config.minimap.height);
    },
    drawRectangle: function () {
        this.rectContext.clearRect(0, 0, Sim.config.minimap.width, Sim.config.minimap.height);
        this.rectContext.strokeRect(
            Math.floor((Sim.Screen.coords.x / Sim.World.width) * Sim.config.minimap.width),
            Math.floor((Sim.Screen.coords.y / Sim.World.height) * Sim.config.minimap.height),
            this.rectangle.width,
            this.rectangle.height,
        );
    },
    draw: function () {
        let tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = Sim.World.width;
        tmpCanvas.height = Sim.World.height;
        let tmpContext = tmpCanvas.getContext('2d');
        
        for (let r = 0; r < Sim.World.height; r++) {
            for (let c = 0; c < Sim.World.width; c++) {
                tmpContext.fillStyle = Sim.Tiles[Sim.World.data[r][c]].hex;
                tmpContext.fillRect(
                    c,
                    r,
                    1,
                    1
                );
            }
        }
        this.context.imageSmoothingEnabled = false;
        this.context.drawImage(tmpCanvas, 0, 0, Sim.config.minimap.width, Sim.config.minimap.height);
        this.drawRectangle();
    },
    click: function (e) {
        let coords = Sim.Canvas.layers['minimap-area'].canvas.mouseCoords(e);

        let x = Math.round((coords.x - (Sim.Minimap.rectangle.width / 2)) / Sim.Minimap.ratio.x);
        let y = Math.round((coords.y - (Sim.Minimap.rectangle.height / 2)) / Sim.Minimap.ratio.y);
        
        if (x < 0) {
            x = 0;
        } else
        if (x > Sim.World.width - Sim.Screen.tiles.x) {
            x = Sim.World.width - Sim.Screen.tiles.x;
        }

        if (y < 0) {
            y = 0;
        } else
        if (y > Sim.World.height - Sim.Screen.tiles.y) {
            y = Sim.World.height - Sim.Screen.tiles.y;
        }

        Sim.Screen.setCoords(x, y);
        Sim.Screen.moved = true;
    },
    resize: function() {
        this.setRectangleSize();
        this.drawRectangle();
    }
};
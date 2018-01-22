Sim.Minimap = {
    canvas: null,
    context: null,
    init: function () {
        this.canvas = document.createElement('canvas');
        this.canvas.width = Sim.config.minimap.width;
        this.canvas.height = Sim.config.minimap.height;
        this.context = this.canvas.getContext('2d');
    },

    draw: function () {
        let tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = Sim.config.map.width;
        tmpCanvas.height = Sim.config.map.height;
        let tmpContext = tmpCanvas.getContext('2d');
        
        for (let r = 0; r < Sim.config.map.height; r++) {
            for (let c = 0; c < Sim.config.map.width; c++) {
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
        document.getElementById('minimap').appendChild(this.canvas);
    }
};
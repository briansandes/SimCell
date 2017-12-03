Sim.Canvas = {
    // contains canvas objects {canvas, context, zIndexs}
    layers: {},

    // will contain canvas elements on screen
    element: document.getElementById('canvas-holder'),

    init: function () {
        
    },

    // adds a new canvas object
    add: function (id, o) {
        if (typeof o === 'undefined') {
            // going default
            o = {
                width: Sim.Screen.width,
                height: Sim.Screen.height
            };
        }

        // creates canvas object
        this.layers[id] = {
            canvas: document.createElement('canvas')
        };

        // sets canvas dimensions
        this.layers[id].canvas.width = o.width || Sim.Screen.width;
        this.layers[id].canvas.height = o.height || Sim.Screen.height;

        // sets canvas context to object
        this.layers[id].context = this.layers[id].canvas.getContext('2d');
        this.layers[id].context.imageSmoothingEnabled = false;

        // appends canvas element to screen if any 'append' parameter has been set
        if ('appendTo' in o) {
            this.layers[id].canvas.style.zIndex = 'zIndex' in o ? o.zIndex : 1;
            this.append(id, o.appendTo);
        } else
        if ('zIndex' in o) {
            this.layers[id].canvas.style.zIndex = o.zIndex;
            this.append(id, this.element);
        }
    },
    
    append: function (id, parent) {
        if (typeof parent.appendChild === 'function') {
            this.layers[id].canvas.id = 'canvas-' + id;
            parent.appendChild(this.layers[id].canvas);
        } else {
            console.error('Parsed parent variable isn\'t a HTML Element for', '"canvas-' + id + '"', 'parent:', parent);
            console.trace();
        }
    },
    
    setSize: function(id, width, height) {
        // sets canvas dimensions
        this.layers[id].canvas.width = width;
        this.layers[id].canvas.height = height;
    }
};
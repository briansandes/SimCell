/* map function from p5.js I think */
function mapNumbers(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

/* noise map generator
 * NoiseMap.generate() returns an object containing, whose keys are:
 * data:a 2d array([y][x]) containing indexes of the generated tiles 
 * params: all parameters used to generete this map */
var NoiseMap = {
    defaultParams: {
        width: 240,
        height: 160,
        noiseWidth: 70,
        noiseHeight: 50,
        waterLine: 48,
        someValue: 4,
        func: 'abs',
        top: 160,
        makeMap: true,
        foodThreshold: 70,
        waterThreshold: 155
    },
    params: {
        width: 240,
        height: 160,
        noiseWidth: 70,
        noiseHeight: 50,
        waterLine: 48,
        someValue: 4,
        func: 'abs',
        top: 160,
        makeMap: true,
        foodThreshold: 70,
        waterThreshold: 155
    },
    /* holds converted data of the generated map */
    data: [],
    tiles: {
        /* TODO set a goddamn config file containing tiles' info, geez */
        index: ['dirt', 'water', 'food'],
        dirt: {
            index: 0,
            type: 'dirt',
            colors: [155, 118, 83]
        },
        water: {
            index: 1,
            type: 'water',
            colors: [64, 164, 220]
        },
        food: {
            index: 2,
            type: 'food',
            colors: [0, 150, 12]
        }
    },

    /* returns tile information based on parsed value */
    getTile: function (value) {
        let colorValue = value + Math.max(0, (this.params.waterLine - value) * this.params.someValue);
        let tile;

        // dirt
        if (colorValue < this.params.foodThreshold && value < this.params.foodThreshold) {
            tile = this.tiles.dirt;
        } else
        // food
        if (colorValue >= this.params.foodThreshold && colorValue < this.params.waterThreshold &&
                value >= this.params.foodThreshold && value < this.params.waterThreshold) {
            tile = this.tiles.food;
        } else
        // water
        if (colorValue >= this.params.waterThreshold) {
            tile = this.tiles.water;
        } else {
            tile = this.tiles.dirt;
        }

        return tile;
        //return {type: 'noise', colors: [value, value, value + Math.max(0, (this.params.waterLine - value) * this.params.someValue)]};
    },
    newSeed: function () {
        // generates odd seed
        this.params.seed = Math.floor(Math.random() * 10000);
        if (this.params.seed % 2 === 1) {
            //this.seed++;
        }
    },
    generate: function (o) {
        this.params = Object.assign({}, o ? o : {}, this.defaultParams);

        if (!this.params.seed) {
            this.newSeed();
        }
        
        noise.seed(this.params.seed);

        // setting methods inside loop
        if (this.params.func === 'abs') {
            var applyFunction = function (value, top) {
                return Math.round(Math.abs(value) * top);
            };
        } else
        if (this.params.func === 'map') {
            var applyFunction = function (value, top) {
                return mapNumbers(value, -1, 1, 0, top);
            };
        }

        this.data = [];

        for (let y = 0; y < this.params.height; y++) {
            this.data.push([]);

            for (let x = 0; x < this.params.width; x++) {
                // generating noise for current coords
                let value = noise.simplex2(x / this.params.noiseWidth, y / this.params.noiseHeight);

                // getting its absolute value, times 255 to get a byte color value
                value = applyFunction(value, this.params.top);
                let tile = this.getTile(value);

                this.data[y].push(tile.index);
            }
        }

        return {
            data: this.data,
            params: this.params
        };
    }
};
Sim.config = {
    cache: true,
    topBarHeight: 37,
    cellsToAddOnClick: 1,
    map: {
        tileSize: 25,
        chunkSize: 20,
        initialFood: 2000,
        maxFood: 20000,
        foodGrows: 50
    },
    minimap: {
        width: 235,
        height: 150
    },
    screen: {
        width: 800,
        height: 600,
        scale: 1
    },
    cells: {
        radius: 10,
        border: 2.5,
        width: 25,
        height: 25,
        half: 12,
        initialEnergy: 100000,
        energyForDividing: 200000,
        visionAngle: 48, // never gonna forget that name again
        numberOfAnglesToCache: 30, // never gonna forget that name again
        angleStep: 360 / 30, // has to be one of the 24 divisors of 360 https://en.wikipedia.org/wiki/360_(number)
        foodPerTick: 250,
        energyPerTick: 60,
        mutationRate: {min: 0.03, max: 0.1},
        xp: {
            divide: 10
        }
    },
    defaultSpecies: [{
            name: 'Red',
            color: '#e6194B'
        }, {
            name: 'Green',
            color: '#3cb44b'
        }, {
            name: 'Yellow',
            color: '#ffe119'
        }, {
            name: 'Blue',
            color: '#4363d8'
        }, {
            name: 'Orange',
            color: '#f58231'
        }, {
            name: 'Purple',
            color: '#911eb4'
        }, {
            name: 'Cyan',
            color: '#42d4f4'
        }, {
            name: 'Magenta',
            color: '#f032e6'
        }, {
            name: 'Lime',
            color: '#bfef45'
        }, {
            name: 'Pink',
            color: '#fabebe'
        }, {
            name: 'Teal',
            color: '#469990'
        }, {
            name: 'Lavender',
            color: '#e6beff'
        }, {
            name: 'Brown',
            color: '#9A6324'
        }, {
            name: 'Beige',
            color: '#fffac8'
        }, {
            name: 'Maroon',
            color: '#800000'
        }, {
            name: 'Mint',
            color: '#aaffc3'
        }, {
            name: 'Olive',
            color: '#808000'
        }, {
            name: 'Apricot',
            color: '#ffd8b1'
        }, {
            name: 'Navy',
            color: '#000075'
        }, {
            name: 'Grey',
            color: '#a9a9a9'
        }, {
            name: 'White',
            color: '#ffffff'
        }, {
            name: 'Black',
            color: '#000000'
        }]
};
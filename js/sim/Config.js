Sim.config = {
    cache: true,
    topBarHeight: 37,
    map: {
        name: '',
        width: 200,
        height: 120,
        pixelWidth: 200 * 25,
        pixelHeight: 120 * 25,
        tileSize: 25,
        chunkSize: 20,
        initialFood: 2000,
        maxFood: 20000,
        foodGrows: 50
    },
    minimap: {
        width: 280,
        height: 160
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
    }
};
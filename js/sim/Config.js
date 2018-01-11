Sim.config = {
    map: {
        name: '',
        width: 200,
        height: 120,
        pixelWidth: 200 * 25,
        pixelHeight: 120 * 25,
        tileSize: 25,
        chunkSize: 20,
        initialFood: 5000,
        foodGrows: 2
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
        energyForDividing: 250000,
        visionAngle: 48, // never gonna forget that name again
        numberOfAnglesToCache: 30, // never gonna forget that name again
        angleStep: 360 / 30,
        foodPerTick: 200,
        energyPerTick: 10
        // has to be one of the 24 divisors of 360 https://en.wikipedia.org/wiki/360_(number)
    }
};
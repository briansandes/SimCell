Sim.config = {
    map: {
        name: '',
        width: 120,
        height: 80,
        pixelWidth: 120 * 25,
        pixelHeight: 80 * 25,
        tileSize: 25,
        chunkSize: 20
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
        numberOfAnglesToCache: 30, // never gonna forget that name again
        angleStep: 360 / 30
        // has to be one of the 24 divisors of 360 https://en.wikipedia.org/wiki/360_(number)
    }
};
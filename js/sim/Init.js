/* binding keyboard arrows */
(function () {
    var keys = [
        {
            id: 'left_arrow',
            group: 'arrows',
            keyCode: 37
        },
        {
            id: 'up_arrow',
            group: 'arrows',
            keyCode: 38
        },
        {
            id: 'right_arrow',
            group: 'arrows',
            keyCode: 39
        },
        {
            id: 'down_arrow',
            group: 'arrows',
            keyCode: 40
        }
    ];

    Input.init(keys);
})();

/* intro screen */
Interface.addScreen('intro', {
    onInit: function (o) {
        console.log('called intro');
        //Interface.goTo('game');
    }
});

/* game screen */
Interface.addScreen('game', {
    onInit: function (o) {
        WorldMap.data = WorldMap.data1;
        let tempData = unpack(WorldMap.data);
        Sim.config.map.width = tempData[0].length;
        Sim.config.map.pixelWidth = tempData[0].length * Sim.config.map.tileSize;
        Sim.config.map.height = tempData.length;
        Sim.config.map.pixelHeight = tempData.length * Sim.config.map.tileSize;

        Sim.init();
    }
});

Interface.init({
    firstScreen: 'intro'
});
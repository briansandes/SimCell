/* binding keyboard arrows */
Input.init([
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
]);

/* setting game screens */

/* intro screen */
Interface.addScreen('intro', {
    onInit: function (o) {
        console.log('called intro');
        //Interface.goTo('game');
    }
});

/* new map screen */
Interface.addScreen('new-map', {
    onInit: function (o) {
        Sim.Loading.show();
        if(!Sim.isReady) {
            Sim.init();
        } else {
            Sim.newMap();
        }

        Interface.goTo('game');

        setTimeout(function() {
            Sim.Loading.hide();
        }, 600);
    }
});

/* game screen */
Interface.addScreen('game', {
    onInit: function (o) {}
});

/* import map screen */
Interface.addScreen('import', {
    onInit: function (o) {
        
    },
    import: function() {
        var data = JSON.parse(document.getElementById('import-data').value);
        Sim.importMap(data);
        Interface.goTo('game');
    }
});


/* initializes Interface component */
Interface.init({
    firstScreen: 'intro'
});
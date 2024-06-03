/* binding keyboard arrows */
Input.init([
    {
        id: 'left_arrow',
        callback: 'left_arrow',
        group: 'arrows',
        keyCode: 37
    }, {
        id: 'down_arrow',
        callback: 'down_arrow',
        group: 'arrows',
        keyCode: 40
    }, {
        id: 'right_arrow',
        callback: 'right_arrow',
        group: 'arrows',
        keyCode: 39
    }, {
        id: 'up_arrow',
        callback: 'up_arrow',
        group: 'arrows',
        keyCode: 38
    }, {
        id: 'left_arrow_a',
        callback: 'left_arrow',
        group: 'arrows',
        keyCode: 65
    }, {
        id: 'down_arrow_s',
        callback: 'down_arrow',
        group: 'arrows',
        keyCode: 83
    }, {
        id: 'right_arrow_d',
        callback: 'right_arrow',
        group: 'arrows',
        keyCode: 68
    }, {
        id: 'up_arrow_w',
        callback: 'up_arrow',
        group: 'arrows',
        keyCode: 87
    }
]);

/* -------------------------------------------------------------------------- */
/* setting game screens */

/* intro screen */
/* no javascript events tied to it */
Interface.addScreen('intro', {
    onInit: function (o) {}
});

/* new map "screen" */
/* its a virtual state */
/* when this screen is called, either the simulation will start or generate a new map */
/* then redirect the user to the 'game' screen */
Interface.addScreen('new-map', {
    onInit: function (o) {
        // shows loading overlay
        Sim.Loading.show();
        
        // starts a new simulation (usually first load)
        if(!Sim.isReady) {
            Sim.init();
        } else {
            // starts a new map
            Sim.newMap();
        }

        // displays the screen where the simulation interface are located
        Interface.goTo('game');

        // hides loading overlay
        setTimeout(function() {
            Sim.Loading.hide();
            // displays help dialog on first run
            if(Sim.firstRun === true) {
                Sim.firstRun = false;
                Sim.Help.show();
            }
        }, 600);
    }
});

/* game screen */
/* no logic, will simply display the simulation elements */
Interface.addScreen('game', {
    onInit: function (o) {}
});

/* import map screen */
Interface.addScreen('import', {
    onInit: function (o) {},
    import: function() {
        var data = JSON.parse(document.getElementById('import-data').value);
        Sim.importMap(data);
        Interface.goTo('game');
    }
});

/* -------------------------------------------------------------------------- */
/* initializes Interface component */
/* goes to the 'intro' screen defined above, displays its content on screen */
Interface.init({
    firstScreen: 'intro'
});
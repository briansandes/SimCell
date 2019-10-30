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

/* game screen */
Interface.addScreen('game', {
    onInit: function (o) {
        Sim.init();
    }
});

Interface.init({
    firstScreen: 'intro'
});
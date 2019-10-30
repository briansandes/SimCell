var Interface = {
    currentScreen: null,
    firstScreen: null,
    
    screens: {},
    
    init: function(o) {
        this.initConfig(o);
        
        /* hides all screens */
        var screensElements = document.querySelectorAll('#interface-screens .screen');
        
        for(let i = 0; i < screensElements.length; i++) {
            screensElements[i].style.display = 'none';
        }
        
        if(!this.firstScreen) {
            console.error('First screen not defined for Interface.js');
        } else {
            this.goTo(this.firstScreen);
        }
    },
    
    initConfig: function(o) {
        /* sets first step */
        this.firstScreen = o.firstScreen;
    },
    
    bindEvents: function() {},
    
    
    
    /* module functions */
    goTo: function(id, o) {
        if(!id) {
            console.error('Missing parameter "id" for goToScreen.');
            console.trace();
            return false;
        }
        
        if(!(id in this.screens)) {
            console.error("Screen id '"+id+"' nor registered in Interface.js");
            console.trace();
            return false;
        }
        
        /* checks for onLeave event on currentScreen before moving to next step */
        if(this.currentScreen) {
            console.log();
            if('onLeave' in this.screens[this.currentScreen]) {
                this.screens[this.currentScreen].onLeave(id, o);
            }
            /* hides last screen */
            let lastScreenElement = document.querySelector('.screen.screen-' + this.currentScreen);
            if(lastScreenElement) {
                lastScreenElement.style.display = 'none';
            }
        }
        
        /* shows next screen */
        let currentScreenElement = document.querySelector('.screen.screen-' + id);
        if(currentScreenElement) {
            currentScreenElement.style.display = 'block';
        }
        this.currentScreen = id;
        this.screens[id].onInit(o);
    },
    
    /* registers a new screen
     * TODO: define 'o' param 
     * defined events for 'o' so far: onInit (not optional), onLeave */
    addScreen: function(id, o) {
        this.screens[id] = o;
    },
    
    
    getScreen: function(id) {
        return this.screens[id];
    }
};
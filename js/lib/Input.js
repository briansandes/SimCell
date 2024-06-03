/* Input checker */

'use strict';

window.Input = {
    /* groups of keys to check defined on init
     * ex: arrows, numbers etc */
    groups: {},
    
    /*
     * object containing keys to be listened and its information
     */
    keys: {},
    key_ids: {},
    
    /* will be fired once a registered key is down */
    press: function(keyCode) {
        var key = Input.keys[keyCode];
        if(key.pressed === false) {
            key.pressed = true;
            if('group' in key) {
                Input.groups[key.group]++;
            }
        }
    },
    
    /* will be fired once a registered key has been released */
    release: function(keyCode) {
        var key = Input.keys[keyCode];
        if(key.pressed === true) {
            key.pressed = false;
            if('group' in key) {
                Input.groups[key.group]--;
            }
        }
    },
    
    /* used to check wheter a key is down */
    isPressed: function(id) {
        var keyCode = Input.key_ids[id];
        return Input.keys[keyCode].pressed;
    },

    /* used to check wheter a group of keys' callback is down */
    isCallbackPressed: function(id, callback) {
        var keyCode = Input.key_ids[id];
        return Input.keys[keyCode][callback];
    },
    
    
    
    /* IsGroupPressed (group)
     * 
     * used to avoid any external script to loop through all keys in order to check if any has been checked
     * 
     * Example:
     * if none of them has been pressed, there is no need to check which one has been pressed
     * 
     * if(Input.isGroupPressed('arrows')) {
     *    //code to check all keys here
     *    if(Input.isPressed('up_arrow')) {
     *      //code to check all keys here
     *    }
     * 
     *   if(Input.isPressed('down_arrow')) {
     *      //code to check all keys here
     *   }
     * 
     *   if(Input.isPressed('left_arrow')) {
     *      //code to check all keys here
     *   }
     * }
     *  
     *  instead of
     *  
     *  if(Input.isPressed('up_arrow')) {
     *    //code to check all keys here
     * }
     * 
     *  if(Input.isPressed('down_arrow')) {
     *    //code to check all keys here
     * }
     * 
     *  if(Input.isPressed('left_arrow')) {
     *    //code to check all keys here
     * }
     *  
     */
    isGroupPressed: function(group) {
        return Input.groups[group] > 0;
    },
    
    
    /* will register a key to be listened */
    
    register: function(key) {
        key.pressed = false;
        Input.keys[key.keyCode] = key;
        Input.key_ids[key.id] = key.keyCode;
        Input.groups[key.group] = 0;
    },
    
    /* internal function, too loop on keys on init and add 'em */
    setKeys: function(keys) {
        for(var i = 0; i < keys.length; i++) {
            var key = keys[i];
            Input.register(key);
        }
    },
    
    
    /* only binds key down and up events, which will change the state of the pressed key on the Input object
     * instead of binding the desired events directly to the down and up events */
    bindKeys: function() {
        document.addEventListener('keydown', function(e){
            if(e.keyCode in Input.keys) {
                Input.press(e.keyCode);
            }
        });
        
        document.addEventListener('keyup', function(e){
            if(e.keyCode in Input.keys) {
                Input.release(e.keyCode);
            }
        });
    },
    
    init: function(keys) {
        
        Input.setKeys(keys);
        
        Input.bindKeys();
    }
};
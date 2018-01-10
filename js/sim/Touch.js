var Touch = {
    pressed: false,
    startCoords: {
        x: 0,
        y: 0
    },
    endCoords: {
        x: 0,
        y: 0
    },
    direction: {
        x: '',
        y: ''
    },
    init: function() {
        document.addEventListener('touchstart', this.start, false);
        document.addEventListener('touchmove', this.move, false);
        document.addEventListener('touchend', this.end, false);
    },
    start: function(e) {
        e.preventDefault();
        Touch.startCoords.x = e.touches[0].clientX;
        Touch.startCoords.y = e.touches[0].clientY;
        Touch.pressed = true;
    },
    move: function(e) {
        e.preventDefault();
        Touch.endCoords.x = Touch.startCoords.x - e.touches[0].clientX;
        Touch.endCoords.y = Touch.startCoords.y - e.touches[0].clientY;
        
        if(Touch.endCoords.x === 0) {
            Touch.direction.x = '';
        } else
        if(Math.abs(Touch.endCoords.x) > 25) {
            if(Touch.endCoords.x < 0) {
                Touch.direction.x = 'right';
            } else
            if(Touch.endCoords.x > 0) {
                Touch.direction.x = 'left';
            }
        }
        
        if(Touch.endCoords.y === 0) {
            Touch.direction.y = '';
        } else
        if(Math.abs(Touch.endCoords.y) > 25) {
            if(Touch.endCoords.y < 0) {
                Touch.direction.y = 'down';
            } else
            if(Touch.endCoords.y > 0) {
                Touch.direction.y = 'up';
            }
        }
    },
    end: function(e) {
        Touch.startCoords.x = Touch.endCoords.x = 0;
        Touch.startCoords.y = Touch.endCoords.y = 0;
        Touch.direction.x = Touch.direction.y = '';
        Touch.pressed = false;
    },
    isPressed: function() {
        return this.pressed;
    }
};
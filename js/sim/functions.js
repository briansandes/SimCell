// from p5.js
function rand(min, max) {
    var rand;

    rand = Math.random();

    if (typeof min === 'undefined') {
        return rand;
    } else
    if (typeof max === 'undefined') {
        if (min instanceof Array) {
            return min[Math.floor(rand * min.length)];
        } else {
            return rand * min;
        }
    } else {
        if (min > max) {
            var tmp = min;
            min = max;
            max = tmp;
        }

        return rand * (max - min) + min;
    }
};

const TO_RADIANS = Math.PI / 180;
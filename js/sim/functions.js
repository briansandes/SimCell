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

function randStr(length = 32) {
  var text = '';
  var possible = "ABCDEF0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.round(Math.random() * possible.length));

  return text;
}

function coordToPixel(coord) {
    return coord * Sim.config.map.tileSize;
}

function pixelToCoord(coord) {
    return Math.floor(coord / Sim.config.map.tileSize);
}

function correctAngle(angle) {
    if (angle < 0) {
        angle = angle + 360;
    } else
    if (angle > 359) {
        angle = angle - 360;
    }
    return angle;
}

const TO_RADIANS = Math.PI / 180;

const FULL_CIRCLE = 2 * Math.PI;
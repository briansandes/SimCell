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
}
;
function randInt(start, end) {
    if (start > end) {
        throw new Exception("Start shall be smaller than the end");
    }

    var Rand = 0;

    /* negative numbers */
    if (start < 1 && end < 1) {
        Rand = Math.floor((Math.random() * (start * -1)) + (end * -1));
        Rand = Rand * -1;
    } else
    /* positive numbers */
    if (start > -1 && end > -1) {
        Rand = Math.floor(Math.random() * (end - start + 1) + start);
    } else
    /* both positive and numbers */
    if (start < 0 && end > 0) {
        Rand = Math.floor((Math.random() * (end + (start * -1))) + start);
    }

    if (Rand === -0) {
        Rand = 0;
    }

    return Rand;
}

function pickOne(array) {
    return array[Math.floor(randInt(0, array.length))];
}

function randStr(length = 32) {
    var text = '';
    var possible = "ABCDEF0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

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

function randTest() {


    var min = 0;
    var max = 10;
    var loop = 1000;

    var r1 = {}, r2 = {};

    for (let i = 0; i < loop; i++) {
        var n1 = Math.floor(rand(min, max));
        var n2 = rand2(min, max);

        if (n1 in r1) {
            r1[n1]++;
        } else {
            r1[n1] = 1;
        }

        if (n2 in r2) {
            r2[n2]++;
        } else {
            r2[n2] = 1;
        }
    }
    ;

    console.table(r1);
    console.table(r2);
}

function lerpColor(a, b, amount) {

    var ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}
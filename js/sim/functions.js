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

function randInt(start, end) {
    if(end !== undefined && end !== null) {
        if (start > end) {
            throw new Exception("Start shall be smaller than the end");
        }
    }

    var Rand = 0;
    if(!end && end !== 0) {
        end = start;
        start = 0;
    }

    /* negative start */
    if (start < 0) {
        let startAbs = Math.abs(start);
        let totalNumbers = startAbs + end + 1;

        Rand = Math.floor(totalNumbers * Math.random());

        Rand = Rand - startAbs;
    } else
    // screw it
    // from zero to anything
    if (start === 0 && end > 0) {
        //console.log('here');
        let totalNumbers = end + 1;
        Rand = Math.floor(Math.random() * totalNumbers);
    } else
    /* both numbers above zero */
    if (start > 0 && end > 0) {
        
        let totalNumbers = end - start + 1;
        Rand = Math.floor(Math.random() * totalNumbers) + start;
    }

    if (Rand === -0) {
        Rand = 0;
    }

    return Rand;
}

/* this motherfucking function had been returning out of bounds 
 * values ever since it has been written 
 * TODO check in the future if it is really working */
function pickOne(array) {
    return array[Math.round(randInt(0, array.length -1))];
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
    if(angle === null || angle === undefined) {
        console.trace();
        Sim.Clock.stop();
    }

    if (angle < 0) {
        angle = angle + 360;
    } else
    if (angle >= 360) {
        angle = angle - 360;
    }
  
    return angle;
}

const TO_RADIANS = Math.PI / 180;

const FULL_CIRCLE = 2 * Math.PI;

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

/* map function from p5.js I think */
function mapNumbers(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

Array.prototype.clone = function () {
    return this.slice(0);
};

HTMLCanvasElement.prototype.mouseCoords = function (event) {
    var rect = this.getBoundingClientRect();
    
    return {
        x: Math.round(event.clientX - rect.left),
        y: Math.round(event.clientY - rect.top)
    };
};


function checkRandomness(fn, rangeMin, rangeMax, iterations) {
    if(!iterations) {
        iterations = 1000000;
    }
    var results = {};
    
    let randomNumber = 0;
    for(let i = 0; i < iterations; i++) {
        randomNumber = fn(rangeMin, rangeMax);
        
        if(!(randomNumber in results)) {
            results[randomNumber] = 1;
        } else {
            results[randomNumber]++;
        }
    }
    
    var negativeNumbers = 0;
    var positiveNumbers = 0;
    var zeroes = 0;
    var undefineds = 0;
    var sumToHalfOfIterations = 0;
    var numbersToHalfOfIterations = 0;
    
    /* keys of generated numbers */
    var numberKeys = Object.keys(results);
    
    numberKeys.sort(function(a, b) {
        return results[b] - results[a];
    });
    
    /* loops on keys and adds them to either positive, negative or zeroes */
    for(let i = 0; i < numberKeys.length; i++) {
        if(numberKeys.length < 30) {
            console.log(results[numberKeys[i]] + ' of '+ numberKeys[i] +' generated.');
        }
        
        if(sumToHalfOfIterations < (iterations / 2)) {
            sumToHalfOfIterations += results[numberKeys[i]];
            numbersToHalfOfIterations++;
        }

        let number = new Number(numberKeys[i]);
        let amount = results[numberKeys[i]];
        
        if(number < 0) {
            negativeNumbers += amount;
        } else 
        if(number > 0) {
            positiveNumbers += amount;
        } else
        if(number === 0) {
            zeroes += amount;
        } else {
            undefineds += amount;
        }
    }
    
    console.log('------');
    
    console.log(numbersToHalfOfIterations + '('+ ((numbersToHalfOfIterations / numberKeys.length) * 100).toFixed(2) +'%) numbers got ' + ((sumToHalfOfIterations / iterations) * 100).toFixed(2) + '% of iterations');
    
    console.log('');
    console.log('------');
    
    var highest = results[numberKeys[0]];
    var lowest = results[numberKeys[numberKeys.length -1]];
    
    var difference = ((highest - lowest) / lowest) * 100 ;
    
    console.log('+'+difference.toFixed(2) + '% lowest / highest ratio');
    
    console.log('------');
    
    if(negativeNumbers > positiveNumbers) {
        console.log(((negativeNumbers - positiveNumbers) / iterations) * 100 + '% more of negative numbers');
    } else
    if(negativeNumbers < positiveNumbers) {
        console.log(((positiveNumbers - negativeNumbers) / iterations) * 100 + '% more of positive numbers');
    } else
    if(negativeNumbers === positiveNumbers) {
        console.log('same amount of positive and negative numbers generated');
    }

    if(zeroes) {
        console.log(zeroes + ((zeroes / iterations) * 100).toFixed(2) + ' zeores');
    }
}
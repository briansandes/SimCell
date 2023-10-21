function seededSelection(seed, arr) {
    const random = (min, max) => {
        const x = Math.sin(seed++) * 10000;
        return Math.floor((x - Math.floor(x)) * (max - min) + min);
    };

    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
        const j = random(0, i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const selectedItems = arr.slice(0, random(1, arr.length + 1));

    return selectedItems;
}

var DNAConfig = {
    inputs: [
        "N", "NE", "E", "SE", "S", "SW", "W", "NW", "N", "CURRENT_TILE",
        "energy", "level", "speed", "children", "ticks"
    ],
    actions: [{
        "id": "think",
        "ec": 1,
        "mutation": 1,
        "value": 0,
        "likelihood": 1
    }, {
        "id": "live",
        "ec": 1,
        "mutation": 1,
        "value": 0,
        "likelihood": 1
    }, {
        "id": "move",
        "ec": 1,
        "mutation": 1,
        "value": 0,
        "likelihood": 1
    }, {
        "id": "reproduce",
        "ec": 1,
        "mutation": 1,
        "value": 0,
        "likelihood": 1
    }, {
        "id": "eat",
        "ec": 1,
        "mutation": 1,
        "value": 0,
        "likelihood": 1
    }],
    actions_parameters_order: [
        'id', 'ec', 'mutation', 'value', 'likelihood'
    ]
};


// up to 166777216 versions
const DNA_version = 'FFFFFF';
// up to 255 input types
const DNA_inputs_length = 'FF';
// concatenated list of input ids
const DNA_inputs_list = '0C0A100301'; 
// up to 255 actions
const DNA_actions_length = 'FF';
const DNA_actions_parameters_length = 'FF';
// concatenated list of actions, along with its parameters (currently 4)
const DNA_actions_list = '01010102'



/*var DNA = {
    "inputs": DNAInputs,
    "actions": 
};*/
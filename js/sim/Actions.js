Sim.Actions = {
    
    cellStateDictionary: [
        ['"mutationRate"', '!'],
        ['"speedOnWater"', '@'],
        ['"ticksOnWater"', '$'],
        ['"visionVariation"', '%'],
        ['"birthDateTicks"', '&'],
        ['"birthPlace"', '*'],
        ['"specie"', '('],
        ['"parent"', ')'],
        ['"speed"', '?'],
        ['"ticks"', '|'],
        ['"vision"', '+'],
        ['},{', '_']
    ],
    
    encodeCellState: function(string) {
        var encondedString = string;
        
        for(let i = 0; i < this.cellStateDictionary.length; i++) {
            encondedString = encondedString.split(this.cellStateDictionary[i][0]).join(this.cellStateDictionary[i][1]);
        }
        
        return encondedString;
    },
    
    decodeCellState: function(encodedString) {
        var decodedString = encodedString;
        
        for(let i = 0; i < this.cellStateDictionary.length; i++) {
            decodedString = decodedString.split(this.cellStateDictionary[i][1]).join(this.cellStateDictionary[i][0]);
        }
        
        return decodedString;
    },
    
    /* kills a random amount of cells of a specie */
    randomSpecieKill: function(specie, amount) {
        if(!amount) {
            amount = 1;
        }
        
        if(Sim.Cells.species.alive[specie].length < amount) {
            amount = Sim.Cells.species.alive[specie].length;
        }
        
        /* this is genocide */
        for(let i = 0; i < amount; i++) {
            let cell = pickOne(Sim.Cells.species.alive[specie]);
            
            Sim.Cells.bag[cell].die();
            
            if(Sim.Cells.species.alive.length === 0) {
                break;
            }
        }
    },
    
    /* kills a random amount of cells of all cellls alive */
    randomKill: function(amount) {
        /* what are you doing geez you monster */
        if(!amount) {
            amount = 1;
        }

        if(Sim.Cells.alive.length < amount) {
            amount = Sim.Cells.alive.length;
        }
        
        
        for(let i = 0; i < amount; i++) {
            let WhyAreYouDoingThisToMe = pickOne(Sim.Cells.alive);
            
            Sim.Cells.bag[WhyAreYouDoingThisToMe].die();
            
            if(Sim.Cells.alive.length === 0) {
                break;
            }
        }
    },
    
    /* kills specified cells of a specie */
    /* yet filters are youngest, oldest */
    specieKill: function(specie, amount, filter) {
        if(!amount) {
            amount = 1;
        }
        
        var specieList = Sim.Cells.species.alive[specie];
        if(specieList.length < amount) {
            amount = specieList.length;
        }
        
        /* this is genocide */
        var cellsToRemove = [];
        
        if(!filter) {
            this.randomSpecieKill(specie, amount);
        } else
        if(filter === 'youngest') {
            for(let i = 1; i < amount + 1; i++) {
                let cellIndex = specieList[specieList.length - i];
                cellsToRemove.push(cellIndex);
            }
        } else
        if(filter === 'oldest') {
            for(let i = 1; i < amount + 1; i++) {
                let cellIndex = specieList[amount - i];
                cellsToRemove.push(cellIndex);
            }
        }
        
        if(cellsToRemove.length > 0) {
            for(let i = 0; i < cellsToRemove.length; i++) {
                console.log(cellsToRemove[i]);
            }
        }
    },
    
    
    exportGenome: function(cellId) {
        var currentCell = Sim.Cells.bag[cellId];
        if(!currentCell) {
            console.error('cellId: ' + cellId + ' not found.');
            return null;
        }
        var obj = {};
        
        var props = [
            'mutationRate',
            'parent',
            'speed',
            'speedOnWater',
            'ticks',
            'ticksOnWater',
            'vision'
        ];
        
        for(let i = 0; i < props.length; i++) {
            obj[props[i]] = currentCell[props[i]];
        }
        
        obj.specie = currentCell.specie;
        obj.color = currentCell.color;
        
        obj.birthPlace = [currentCell.coords.x, currentCell.coords.y];
        obj.birthDateTicks = currentCell.birthDate;
        
        obj.visionVariation = [currentCell.visionVariation.left, currentCell.visionVariation.right];
        obj.parent = currentCell.parent !== null && currentCell.parent > -1 ? this.exportCell(currentCell.parent) : null ;
        
        return obj;
    },
    
    exportLastGenome: function() {
        return this.exportCell(Sim.Cells.bag.length -1);
    },
    
    
    /* export cell state */
    
    exportCell: function(cellId) {
        var currentCell = Sim.Cells.bag[cellId];
        if(!currentCell) {
            console.error('cellId: ' + cellId + ' not found.');
            return null;
        }
        var obj = {};
        
        var props = [
            'mutationRate',
            'parent',
            'speed',
            'speedOnWater',
            'ticks',
            'ticksOnWater',
            'vision'
        ];
        
        for(let i = 0; i < props.length; i++) {
            obj[props[i]] = currentCell[props[i]];
        }
        
        obj.birthPlace = [currentCell.coords.x, currentCell.coords.y];
        obj.birthDateTicks = currentCell.birthDate;
        
        obj.visionVariation = [currentCell.visionVariation.left, currentCell.visionVariation.right];
        obj.parent = currentCell.parent;
        
        if(obj.parent === null) {
            obj.specie = currentCell.specie;
            obj.color = currentCell.color;
        }
        
        return obj;
    },
    
    exportBag: function() {
        var bag = [];
        for(let i = 0; i < Sim.Cells.bag.length; i++) {
            bag.push(this.exportCell(i));
        }
        return this.encodeCellState(JSON.stringify(bag));
    }
};
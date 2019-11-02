/* charts which shall show stacked lines */
var Charts8 = {
    bag: {},
    list: [],
    
    newElementId: function () {
        return '_' + (Math.round(Math.random() * 99999)).toString(16);
    },
    
    
    create: function(id, o) {
        this.bag[id] = {
            elementId: this.newElementId(),
            id: id,
            canvas: document.creteElemet('canvas'),
            axis: {
                xLabel:  o.axis.xLabel,
                yLabel:  o.axis.yLabel
            },
            data: []
        };
    },
    
    
    /* o id is demanded
     * o.axis.xLabel, o.axis.yLabel are demanded
     * o.data is demanded */
    add: function(id, o) {
        
    }
};
/* trying to make an static module */
Sim.HistoryWindow = {
    
    displayInformation: function() {
        
    },
    
    show: function() {
        var element = document.getElementById('game-history');
        element.style.display = 'block';
    },
    hide: function() {
        var element = document.getElementById('game-history');
        element.style.display = 'none';
    }
};
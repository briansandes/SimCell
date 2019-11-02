/* trying to make an static module */
Sim.HistoryWindow = {

    isVisible: false,

    displayInformation: function () {
        if(Sim.History.cellsHistory.data.length > 0) {
            this.drawChart(Sim.History.convertData(Sim.History.cellsHistory));
        }
    },

    show: function () {
        var element = document.getElementById('game-history');
        element.style.display = 'block';
        this.isVisible = true;
        this.displayInformation();
    },
    hide: function () {
        var element = document.getElementById('game-history');
        element.style.display = 'none';
        this.isVisible = false;
    },
    
    reset: function() {
        document.getElementById('population-chart').innerHTML = '';
    },

    drawChart: function (chartData) {
        var data = google.visualization.arrayToDataTable(chartData.data);

        var mobileOptions  = {
            chartArea: {'width': '70%'},
            hAxis: {
                title: 'Ticks (1000 ticks ~= 16 seconds)',
                titleTextStyle: {
                    color: "#000000",
                    fontName: "Press Start 2P",
                    fontSize: 8,
                    bold: false,
                    italic: false
                }
            },
            vAxis: {
                title: 'Population',
                titleTextStyle: {
                    color: "#000000",
                    fontName: "Press Start 2P",
                    fontSize: 8,
                    bold: false,
                    italic: false
                }
            }
        };


        var options = {
            width: '100%',
            height: '300',
            chartArea: {'width': '90%'},
            legend: {
                position: "none"
            },
            hAxis: {
                title: 'Ticks (1000 ticks ~= 16.666 seconds)',
                titleTextStyle: {
                    color: "#000000",
                    fontName: "Press Start 2P",
                    fontSize: 12,
                    bold: false,
                    italic: false
                }
            },
            vAxis: {
                title: 'Population',
                titleTextStyle: {
                    color: "#000000",
                    fontName: "Press Start 2P",
                    fontSize: 12,
                    bold: false,
                    italic: false
                }
            },
            annotations: {
                alwaysOutside: true,
                textStyle: {
                    fontSize: 14,
                    auraColor: 'none'
                }
            },
            backgroundColor: '#eeeeee',
            isStacked: true
        };
        
        if(window.innerWidth < 768) {
            options = Object.assign(options, chartData.options, mobileOptions);
        } else {
            options = Object.assign(options, chartData.options);
        }

        var chart = new google.visualization.AreaChart(document.getElementById('population-chart'));
        chart.draw(data, options);
    }
};
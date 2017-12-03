<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <style>
            body {
                margin: 0;
                overflow-x: hidden;
                font-size: 0;
            }
            
            #canvas-holder canvas {
                position: absolute;
            }
        </style>
    </head>
    <body>
        <div id="SimCell">
            <div id="canvas-holder"></div>
        </div>
        
        <script src="js/sim/functions.js" type="text/javascript"></script>
        <script src="js/sim/Sim.js" type="text/javascript"></script>

        <script src="js/sim/Canvas.js" type="text/javascript"></script>
        <script src="js/sim/Cells.js" type="text/javascript"></script>
        <script src="js/sim/Clock.js" type="text/javascript"></script>
        <script src="js/sim/Grid.js" type="text/javascript"></script>
        <script src="js/sim/Screen.js" type="text/javascript"></script>
        <script src="js/sim/World.js" type="text/javascript"></script>
        <script src="js/sim/Entity.js" type="text/javascript"></script>
        <script src="js/sim/Cell.js" type="text/javascript"></script>
        <script type="text/javascript">
            Sim.init();
        </script>
    </body>
</html>

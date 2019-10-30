Sim.Clock = {
    FPS: 1000 / 25,
    taskCoolDown: 5, // queued tasks waits for X ticks to ve evaluated for the first time
    running: false,
    busy: false,
    ticks: 0,
    start: function () {
        this.running = true;
        this.tick();
    },
    stop: function () {
        this.running = false;
    },
    tick: function () {
        // checks whether clock is running or not
        if (Sim.Clock.running === true) {
            // adds tick to ellapsed time
            Sim.Clock.ticks++;
            
            // Check for tasks to be executed
            Sim.Clock.checkTasks();

            // IF the clock isnt busy then run ticks
            if(Sim.Clock.busy === false) {
                Sim.tick(Sim.Clock.ticks);
            }

            // Request next tick if value of running hasnt been changed
            if (Sim.Clock.running === true) {
                requestAnimationFrame(Sim.Clock.tick);
            }
        }
    },
    reset: function() {
        this.tasks = [];
        this.ticks = 0;
    },

    tasks: [],
    queue: function(task, when) {
        this.tasks.push({
            task: task,
            when: when,
            time: this.ticks + this.tasks.length * this.taskCoolDown
        });
    },
    checkTasks: function() {
        let remove = [];
        for(let i = 0; i < this.tasks.length; i++) {
            if(this.tasks[i].time <= this.ticks) {
                if(this.tasks[i].when.call() === true) {
                    this.tasks[i].task.call();
                    remove.push(i);
                }
            }
        }
        
        for(let i = remove.length -1; i > -1; i--) {
            this.tasks.splice(remove[i], 1);
        }
    }
};
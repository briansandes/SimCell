# SimCell

**SimCell** is a Vanilla JavaScript-based evolution simulator where autonomous entities (“cells”) adapt and evolve to survive within a procedurally generated world.

Through natural selection and optimization, species compete for resources in an animated genetic algorithm influenced by environmental conditions and observer input.

Try the demo [here](https://briansandes.github.io/SimCell)!

**The simulation can produce emergent scenarios such as overpopulation, famine, extinction events, territorial domination, and unexpected evolutionary outcomes — making each run unique.**

It runs 100% on the browser both on desktop and mobile, tablets, toasters and mind reading apparactae.

### NOTE FOR DEVELOPERS
I started this project back in 2016, so this is old code, written through a period of 10 years (as of 2026) of evolution of my praxis of logic, code design, maths, genetic algorithms, statistics and performance ballance.

98% of the code has been written by me, with good use of technology and formulae discovered and developed by human beings for the past twelve thousand years or so, who knows.

As for libraries used: Perlin Noise, beloved Bootstrap 3 and some Angular 1 or 2 for the map editor interface.

## Instructions
- Join a new simulation
- Once the map has been rendered:
  - To add a new specie: double click on the map;
  - To scroll around the map: Use arrows or WASD;
  - On mobile, hold and move to scroll on map.
- Sidebar:
  - Live count of how many cells in total are alive.
  - List of species alive followed by their amount of alive individuals.
    - On this menu you can take some actions as killing a certain amount or percentage of that species.
  - You can navigate around the map by clicking / dragging the minimap (works on mobile)
  - The simulation speed can be increased useing the arrow controls up to 256x the normal speed.
- Top menu
  - Data: shows a timeline wave chart of the species
  - ? contains some static content like 'Help' and About

### Huge thanks to:
- Carykh for the inspiration;
- Stefan Gustavson, Peter Eastman and Joseph Gentle for Perlin Noise;
- Daniel Shiffman from Coding Train for his admirable didactics;
- The long gone ones who somehow contributed to my existence.

[SimCell](https://briansandes.github.io/SimCell)

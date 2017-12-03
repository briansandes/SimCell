function Entity(x, y) {
    this.x = x;
    this.y = y;
};

Entity.prototype.move = function() {
    console.log(x, y);
};
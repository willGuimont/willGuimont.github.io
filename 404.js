var parent = document.getElementById('404');
var x = 0;

function setup() {
    var canvas = createCanvas(parent.offsetWidth, parent.offsetHeight);
    canvas.parent('404');
}

function draw() {
    clear();
    fill(0);
    textSize(80);
    textAlign(CENTER);
    text("404", (width / 2 - 100) * sin(x) + width / 2, 70);
    x += 0.025;
}

function windowResized() {
    resizeCanvas(parent.offsetWidth, parent.offsetHeight);
}
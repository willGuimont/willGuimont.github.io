var parent = document.getElementById('404');

const cellSize = 20;
var numSizeX = 20;
var numSizeY = 20;
const deltaT = 50;
var CellType = { "Empty": 1, "Head": 2, "Tail": 3, "Wire": 4 }
Object.freeze(CellType);

var cells = [];
var time = 0;
var paused = false;

function setup() {
    var canvas = createCanvas(parent.offsetWidth, parent.offsetHeight);
    canvas.parent('404');

    numSizeX = Math.floor(width / cellSize);
    numSizeY = Math.floor(height / cellSize);

    cells = initialCells();
    time = millis();
}

function initialCells()
{
    var tmp = emptyCells();
    return tmp;
}

function draw() {
    background(0);
    var newTime = millis();
    if (!paused && newTime - time >= deltaT) {
        time = newTime;
        cells = getNewCells(cells);
    }
    drawCells(cells);
    if (paused) {
        textSize(32);
        fill(255);
        text("Paused", 10, 32);
    }
}

function getHeadNeighbors(i, j, currentCells) {
    var numHead = 0;
    for (var di = 0; di < 3; ++di) {
        var ni = i + di - 1;
        if (ni >= 0 && ni < numSizeX) {
            for (var dj = 0; dj < 3; ++dj) {
                var nj = j + dj - 1;
                if (nj >= 0 && nj < numSizeY) {
                    if (currentCells[ni][nj] == CellType.Head) {
                        ++numHead;
                    }
                }
            }
        }
    }
    return numHead;
}

function getNewCells(currentCells) {
    var out = emptyCells();

    for (var i = 0; i < numSizeX; ++i) {
        for (var j = 0; j < numSizeY; ++j) {
            var current = currentCells[i][j];
            switch (current) {
                case CellType.Empty:
                    out[i][j] = CellType.Empty;
                    break;
                case CellType.Head:
                    out[i][j] = CellType.Tail;
                    break;
                case CellType.Tail:
                    out[i][j] = CellType.Wire;
                    break;
                case CellType.Wire:
                    var numHead = getHeadNeighbors(i, j, currentCells);
                    if (numHead == 1 || numHead == 2) {
                        out[i][j] = CellType.Head;
                    }
                    else {
                        out[i][j] = CellType.Wire;
                    }
                    break;
                default:
                    out[i][j] = CellType.Empty;
                    break;
            }
        }
    }
    return out;
}

function mousePressed() {
    if (mouseX < 0 || mouseX >= width)
        return;
    if (mouseY < 0 || mouseY >= height)
        return;

    var x = Math.floor(mouseX / cellSize);
    var y = Math.floor(mouseY / cellSize);

    try {
        var current = cells[x][y];
    } catch{
        return;
    }

    if (mouseButton === LEFT) {
        if (current == CellType.Wire)
            cells[x][y] = CellType.Empty;
        else
            cells[x][y] = CellType.Wire;
    }
    else if (mouseButton === RIGHT) {
        if (current == CellType.Head)
            cells[x][y] = CellType.Empty;
        else
            cells[x][y] = CellType.Head;
    }
}

function keyPressed() {
    if (key === ' ')
        paused = !paused;
}

function getCellColor(type) {
    switch (type) {
        case CellType.Empty:
            return color(0);
        case CellType.Head:
            return color(0, 0, 255);
        case CellType.Tail:
            return color(255, 0, 0);
        case CellType.Wire:
            return color(255, 255, 0);
        default:
            return color(0);
    }
}

function drawCell(x, y, type) {
    var c = getCellColor(type);
    fill(c);
    stroke(c);
    rect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function drawCells(currentCells) {
    for (var i = 0; i < numSizeX; ++i) {
        for (var j = 0; j < numSizeY; ++j) {
            var current = currentCells[i][j];
            drawCell(i, j, current);
        }
    }
}

function emptyCells() {
    var tmp = [];
    for (var i = 0; i < numSizeX; ++i) {
        tmp[i] = [];
        for (var j = 0; j < numSizeY; ++j) {
            tmp[i][j] = CellType.Empty;
        }
    }
    return tmp;
}

function windowResized() {
    resizeCanvas(parent.offsetWidth, parent.offsetHeight);
}

schemeColors = [["rgb(238,202,175)","rgb(28,137,191)","rgb(19,79,146)","rgb(9,37,61)"],["rgb(219,219,219)","blue","black","black"],["black","rgb(34,153,40)","white","white"],["rgb(19,62,89)","orange","rgb(14,45,61)","yellow"],["rgb(6,30,4)","red","red","green"]];
    
var i;

class Cell { // the object to hold the properties of each individual cell
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this._links = [];
        this.outward = [];
        this.inward = null;
        this.cw = null;
        this.ccw = null;
        this.distance = null;
        this.exit = false;
    }
    link(cell, bidi) {
        // links the current cell to another cell. 
        // input is cell object, not cell number. 
        // bidi (bidirectional) sets whether to mark the current cell as linked in the other cell's properties
        this._links.push(cell.cellNumber());
        if (bidi === true) {
            cell._links.push(this.cellNumber());
        }
        return 1;
    }
    links() {
        // returns an array of the cell numbers of linked cells
        return this._links;
    }
    linked(cell) {
        // checks if the cell is linked to another cell
        // input requires cell number
        var _linked = false;
        for (var i =0; i < this._links.length; i++) { // loops through links and checks if any match the same cell number
            if (this._links[i] === cell) {
                _linked = true;
                i += 10;
            }
        }
        return _linked;
    }
    listNeighbors(_onlyUnlinked = false) {
        // returns an array of the neighboring cells
        this.list = [];
        if (this.cw) {
            if (_onlyUnlinked === true && this.cw.links().length > 0) {} else {
                this.list.push(this.cw);
            }
        }
        if (this.ccw) {
            if (_onlyUnlinked === true && this.ccw.links().length > 0) {} else {
                this.list.push(this.ccw);
            }
        }
        if (this.inward) {
            if (_onlyUnlinked === true && this.inward.links().length > 0) {} else {
                this.list.push(this.inward);
            }
        }
        if (this.outward) {
            for (var k = 0; k < this.outward.length; k++) {
                if (_onlyUnlinked === true && this.outward[k].links().length > 0) {} else {
                    this.list.push(this.outward[k]);
                }
            }
        }
        return this.list;
    }
    cellNumber() {
        // returns a number for identifying cells
        // format:
        // 0 => row 0, col 0
        // 100 => row 1, col 0
        // 206 => row 2, col 6
        if (this === null) {
            return undefined;
        } else {
            return this.row * 100 + this.column;
        }
    }
}

class Grid {
    // the object that powers the maze
    prepare_grid() {
        // creates an array of cell objects within the grid. called by constructor
        var _rows = new Array(this.rows).fill(null);
        var row_height = 1.0 / this.rows;
        _rows[0] = [new Cell(0, 0)];

        for (var i =0; i < this.rows; i++) {
            // checks if cells need to divide, then creates the cell objects
            var radius = i / this.rows;
            var circumference = 2 * Math.PI * radius;
            var previous_count = _rows[i - 1] != undefined ? _rows[i - 1].length : 1;
            var estimated_cell_width = circumference / previous_count;
            var ratio = Math.round(estimated_cell_width / row_height);
            var cells = previous_count * ratio;
            if (i === 0) {
                cells = 1;
            }
            _rows[i] = new Array(cells);
            for (var k = 0; k < cells; k++) {
                _rows[i][k] = new Cell(i, k);
            }
        }
        return _rows;
    }
    configure_cells() {
        // sets the neighboring cells. called by constructor
        for (var i =0; i < this.rows; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {
                if (i > 0) {
                    var ratio = this.grid[i].length / this.grid[i - 1].length;
                    var parent = ratio != 1 ? this.grid[i - 1][Math.floor(j / ratio)] : this.grid[i - 1][j];
                    parent.outward.push(this.grid[i][j]);
                    this.grid[i][j].inward = parent;

                    this.grid[i][j].cw = this.grid[i][(j + 1) % this.grid[i].length];
                    this.grid[i][j].ccw = this.grid[i][j === 0 ? this.grid[i].length - 1 : j - 1];
                }
            }
        }
    }
    constructor(rows, cell_size) {
        // initializes the grid object
        this.rows = rows;
        this.columns = 1;
        this.cell_size = cell_size;
        this.grid = this.prepare_grid(); // the grid variable contains the two-dimensional array of cells
        this.configure_cells();

    }
    random_cell() {
        // gets a random cell. called by the maze generation algorithm
        var row = Math.floor(Math.random() * this.rows);
        var col = Math.floor(Math.random() * this.grid[row].length);
        return this.grid[row][col];
    }
    getCellByCoordinates(_x, _y, cons = false) {
        //returns a cell object based on the x-y coordinates

        // calculate the distance from the center of the circle to calculate the "row", or the ring
        var xx = _x - 180;
        var yy = 180 - _y;
        var dist = Math.sqrt(Math.pow(xx, 2) + Math.pow(yy, 2)); // calculates the distance from the center of the screen
        var ring = Math.floor(dist / this.cell_size);
        // gets the number of cells in the ring
        if (ring < this.grid.length && ring !== 0) {
            var numCells = this.grid[ring].length;
            // calculates which cell it's in
            var _theta = Math.asin(yy / dist); // calculate the angle (in radians) of the line going to the expected point

            // finds actual angle
            if ((xx < 0 && yy > 0) || (xx < 0 && yy < 0)) {
                _theta = (Math.PI) + (_theta * (-1));
            } // quadrant II or III
            if (xx > 0 && yy < 0) {
                _theta = 2 * Math.PI + _theta;
            } // quadrant IV
            if (xx === 0 && yy > 0) {
                _theta = Math.PI * 1.5;
            }
            if (xx === 0 && yy < 0) {
                _theta = Math.PI / 2;
            }
            var radiansPerCell = Math.PI * 2 / numCells;
            var numCell = (numCells - 1) - Math.floor(_theta / radiansPerCell);
            if (numCell < 0) {
                numCell = numCells - (numCell * -1);
            }
            if (cons === true) {
                console.log(_theta);
                console.log(radiansPerCell);
                console.log(ring);
                console.log(numCell);
                console.log(this.grid[ring][numCell]);
            }
            return this.grid[ring][numCell];
        } else {
            if (ring === 0) {
                return this.grid[0][0];
            } else {
                return null; // outside bounds of maze
            }
        }

    }
    getCellByAngle(rad, row) {
        // returns a cell object based on the radian angle & the row
        if (row >= this.grid.length) {
            row -= 1;
        }
        var radiansPerCell = Math.PI * 2 / this.grid[row].length;
        var numCell = (this.grid[row].length - 1) - Math.floor((rad + 0.01) / radiansPerCell);
        if (numCell < 0) {
            numCell = this.grid[row].length - (numCell * -1);
        }
        return this.grid[row][numCell];
    }
    getCellByAngleAndDist(rad, dist) {
        // returns a cell object based on the radian angle & the row
        var row = Math.floor(dist / this.cell_size);
        if (row >= this.grid.length) {
            row -= 1;
        }
        var radiansPerCell = Math.PI * 2 / this.grid[row].length;
        var numCell = Math.floor(rad / radiansPerCell);
        //var numCell = (this.grid[row].length - 1) - Math.floor((rad + 0.01) / radiansPerCell);
        if (numCell < 0) {
            numCell = this.grid[row].length - (numCell * -1);
        }
        if (row === 0) {
            return this.grid[0][0];
        } else {
            return this.grid[row][numCell];
        }
    }
    getRadianLimits(r, c) {
        // returns the limits of the cell walls in radians
        var radiansPerCell = Math.PI * 2 / this.grid[r].length;
        c = this.grid[r].length - (c + 1);
        var lim1 = (c + 1) * (0 - radiansPerCell) < 0 ? (c + 1) * (0 - radiansPerCell) + Math.PI * 2 : (c + 1) * (0 - radiansPerCell);
        var lim2 = c * (0 - radiansPerCell) < 0 ? c * (0 - radiansPerCell) + Math.PI * 2 : c * (0 - radiansPerCell);
        if (lim2 === 0) {
            lim2 = Math.PI * 2;
        }
        return [lim1, lim2];
    }
    calculateDistances(rootRow, rootCol) {
        // calculates the distance between the center cell and each other cell. the furthest cell from the beginning is marked as the exit cell
        this.grid[rootRow][rootCol].distance = 0;
        markNeighbors(this.grid, this.grid[rootRow][rootCol], 1);
        var greatestDist = this.grid[0][0];
        if (greatestDist === this.grid[0][0]) { // if no "tunnel" cell is found, then just find the furthest cell
            for (var i =0; i < this.grid[this.grid.length - 1].length; i++) {
                if (this.grid[this.grid.length - 1][i].distance > greatestDist.distance) {
                    greatestDist = this.grid[this.grid.length - 1][i];
                }
            }
        }
        if (greatestDist === this.grid[0][0]) { // second check if no cell found, then pick a random one from the last ring
            var rand = Math.floor(Math.random() * this.grid[this.grid.length - 1].length);
            greatestDist = this.grid[this.grid.length - 1][rand];
        }
        greatestDist.exit = true;
        console.log(greatestDist);
        console.log(this.grid);
        //debugger;
    }
    checkCorner(x,y) {
        var off = 7;
        var sqrtOff = Math.round(Math.sqrt(off));
        var cells = [];
        for (var i =0; i < 9; i++) {
            var xx = x;
            var yy = y;
            switch (i) {
                case 0: break;
                case 1: xx += off; break;
                case 2: xx -= off; break;
                case 3: yy += off; break;
                case 4: yy -= off; break;
                case 5: xx += sqrtOff; yy += sqrtOff; break;
                case 6: xx += sqrtOff; yy -= sqrtOff; break;
                case 7: xx -= sqrtOff; yy += sqrtOff; break;
                case 8: xx -= sqrtOff; yy -= sqrtOff; break;
            }
            var thisCell = this.getCellByCoordinates(xx,yy);
            if (!cells.includes(thisCell)) {
                cells.push(thisCell);
            }
        }
        return cells;
    }
}

function markNeighbors(cellArray, cell, number) {
    // used by the calculateDistances function to mark neighboring cells with a distance one greater than the previous cell. called recursively.
    //var cellNum = cell.cellNumber();
    var links = cell._links;
    for (var i = 0; i < links.length; i++) {
        var neighborCol = links[i] % 100;
        var neighborRow = (links[i] - neighborCol) / 100;
    //debugger;
        if (cellArray[neighborRow][neighborCol].distance === null) {
            cellArray[neighborRow][neighborCol].distance = number;
            markNeighbors(cellArray, cellArray[neighborRow][neighborCol], number + 1);
        }
    }

}


function recursiveBacktracker(grid) {
    var start_at = grid.random_cell();
    var stack = [];
    stack.push(start_at);

    while (stack.length > 0) {
        var current = stack[stack.length - 1]; // grab the last element of the stack
        var _neighbors = current.listNeighbors(true);
        if (_neighbors.length === 0) {
            stack.pop();
        } else {
            var neighbor = _neighbors[Math.floor(Math.random() * _neighbors.length)];
            current.link(neighbor, true);
            stack.push(neighbor);
        }
    }

    return grid;
}
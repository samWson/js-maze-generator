document.getElementById('mazeAttributes').addEventListener('submit', generateMaze);

function Cell(row, column) {
  this.row = row;
  this.column = column;
  this.links = new Map();
}

Cell.prototype.getRow = function() {
  return this.row;
}

Cell.prototype.getColumn = function() {
  return this.column;
}

Cell.prototype.getNorth = function() {
  return this.north;
}

Cell.prototype.getSouth = function() {
  return this.south;
}

Cell.prototype.getEast = function() {
  return this.east;
}

Cell.prototype.getWest = function() {
  return this.west;
}

Cell.prototype.link = function(cell, bidirectional = true) {
  this.links.set(cell, true);

  if (bidirectional) {
    cell.link(this, false);
  }
}

Cell.prototype.unlink = function(cell, bidirectional = true) {
  this.links.delete(cell);
 
  if (bidirectional) {
    cell.unlink(this, false);
  }
}

Cell.prototype.links = function() {
  return this.links.keys();
}

Cell.prototype.isLinked = function(cell) {
  return this.links.has(cell);
}

Cell.prototype.neighbors = function() {
  let cells = [];
  cells.push(this.north);
  cells.push(this.south);
  cells.push(this.east);
  cells.push(this.west);

  cells = cells.filter(function(cell) {
    return cell !== undefined;
  });

  return cells;
}

function Grid(rows, columns) {
  this.rows = rows;
  this.columns = columns;
  this.grid = this.prepareGrid();
  this.configureCells();
}

Grid.prototype.prepareGrid = function() {
  let grid = new Array(this.rows);

  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(this.columns);

    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = new Cell(i + 1, j + 1);
    }
  }

  return grid;
}

Grid.prototype.configureCells = function() {
  // FIXME: eachCell is returning an array of numbers not cells.
  // for (let cell in this.eachCell()) {
  this.eachCell().forEach((cell) => {
    let row = cell.row;
    let column = cell.column;

    // TODO: Check that this arrangement works on the idea that 0,0 on the grid
    // starts at the top left.
    cell.north = this.cellAt(row - 1, column);
    cell.south = this.cellAt(row + 1, column);
    cell.west = this.cellAt(row, column - 1);
    cell.east = this.cellAt(row, column + 1);
  });
}

Grid.prototype.cellAt = function(row, column) {
  if (row < 0 || row > this.rows - 1) {
    return null;
  }

  if (column < 0 || column > this.columns - 1) {
    return null;
  }

  return this.grid[row][column];
}

Grid.prototype.eachRow = function() {
  return this.grid.entries();
}

Grid.prototype.eachCell = function() {
  return this.grid.flat();
}

Grid.prototype.toString = function() {
  const corner = "+";
  const horizontal = "---+";

  // Write the top boundary.
  let output = corner.concat(horizontal.repeat(this.columns), "\n");

  // Write each row.
  for (const [index, row] of this.eachRow()) {
    let top = "|";
    let bottom = "+";

    // for (cell in row) {
    row.forEach((cell) => {
      let body = "   "; // Three spaces.
      let eastBoundary = (cell.isLinked(cell.east)) ? " " : "|";

      top += body;
      top += eastBoundary;

      // Three spaces below, too
      let southBoundary = (cell.isLinked(cell.south)) ? "   " : "---";
      bottom += southBoundary;
      bottom += corner;
    });

    output += top + "\n";
    output += bottom + "\n";
  }

  return output;
}

function BinaryTree(grid) {
  this.grid = grid;
}

BinaryTree.prototype.applyAlgorithm = function() {
  for (let cell in this.grid.eachCell()) {
    let neighbors = [];
    
    if (cell.north) {
      neighbors.push(cell.north);
    }

    if (cell.east) {
      neighbors.push(cell.east);
    }

    let index = getRandomInt(neighbors.length);
    let neighbor = neighbors[index];

    if (neighbor) {
      cell.link(neighbor);
    }
  }
}

function getRandomInt(max) {
  min = 0;
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMaze(event) {
  event.preventDefault();

  let formElements = event.currentTarget.elements;
  let rows = formElements.namedItem('rows').value;
  let columns = formElements.namedItem('columns').value;

  let grid = new Grid(parseInt(rows), parseInt(columns));
  let algorithm = new BinaryTree(grid);
  algorithm.applyAlgorithm();

  let mazeArea = document.getElementById('mazeArea');
  mazeArea.innerText = grid.toString();
}

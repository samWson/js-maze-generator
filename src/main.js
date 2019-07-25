document.getElementById('mazeAttributes').addEventListener('submit', generateMaze);

function Cell(row, column) {
  this.row = row;
  this.column = column;
  this.links = new Map();
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
  this.grid = prepareGrid();
  configureCells();
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
  for (let cell in this.eachCell()) {
    let row = cell.row;
    let column = cell.column;

    // TODO: Check that this arrangement works on the idea that 0,0 on the grid
    // starts at the top left.
    cell.north = this.cellAt(row - 1, column);
    cell.south = this.cellAt(row + 1, column);
    cell.west = this.cellAt(row, column - 1);
    cell.east = this.cellAt(row, column + 1);
  }
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
  let cells = [];

  for (const [index, row] of this.eachRow()) {
    for (let cell in row) {
      cells.push(cell);
    }
  }

  return cells;
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
    let neighbor = neigbors[index];

    if (neigbor) {
      cell.link(neigbor);
    }
  }
}

function getRandomInt(max) {
  min = 0;
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMaze(event) {
  let formElements = event.currentTarget.elements;
  let rows = formElements.namedItem('rows').value;
  let columns = formElements.namedItem('columns').value;
  let grid = new Grid(rows, columns);
  let algorithm = new BinaryTree(grid);
  algorithm.applyAlgorithm();

  console.log(grid);
  console.log("rows " + rows);
  console.log("columns " + columns);
  return grid;
}

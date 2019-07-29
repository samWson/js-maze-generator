document.getElementById('mazeAttributes').addEventListener('submit', generateMaze);

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

class Cell {
  constructor(row, column) {
    this._row = row;
    this._column = column;
    this._links = new Map();
  }

  get row() {
    return this._row;
  }

  set row(number) {
    this._row = number;
  }

  get column() {
    return this._column;
  }

  get north() {
    return this._north;
  }

  set north(cell) {
    this._north = cell;
  }

  get south() {
    return this._south;
  }

  set south(cell) {
    this._south = cell;
  }

  get east() {
    return this._east;
  }

  set east(cell) {
    this._east = cell;
  }

  get west() {
    return this._west;
  }

  set west(cell) {
    this._west = cell;
  }

  link(cell, bidirectional = true) {
    this._links.set(cell, true);

    if (bidirectional) {
      cell.link(this, false);
    }
  }

  unlink(cell, bidirectional = true) {
    this._links.delete(cell);

    if (bidirectional) {
      cell.unlink(this, false);
    }
  }

  links() {
    return this._links.keys();
  }

  isLinked(cell) {
    return this._links.has(cell);
  }

  neighbors() {
    let cells = [];
    cells.push(this._north);
    cells.push(this._south);
    cells.push(this._east);
    cells.push(this._west);

    cells = cells.filter(function(cell) {
      return cell !== undefined;
    });

    return cells;
  }
}

class Grid {
  constructor(rows, columns) {
    this._rows = rows;
    this._columns = columns;
    this._grid = this.prepareGrid();
    this.configureCells();
  }

  prepareGrid() {
    let grid = new Array(this._rows);

    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array(this._columns);

      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j] = new Cell(i + 1, j + 1);
      }
    }

    return grid;
  }

  configureCells() {
    this.eachCell().forEach((cell) => {
      const row = cell.row;
      const column = cell.column;

      cell.north = this.cellAt(row - 1, column);
      cell.south = this.cellAt(row + 1, column);
      cell.west = this.cellAt(row, column - 1);
      cell.east = this.cellAt(row, column + 1);
    });
  }

  cellAt(row, column) {
    if (row <= 0 || row > this._rows) {
      return undefined;
    }

    if (column <= 0 || column > this._columns) {
      return undefined;
    }

    return this._grid[row - 1][column - 1];
  }

  eachCell() {
    return this._grid.flat();
  }

  toString() {
    const corner = "+";
    const horizontal = "---+";

    // Write the top boundary.
    let output = corner.concat(horizontal.repeat(this._columns), "\n");

    // Write each row.
    this._grid.forEach((row) => {
      let top = "|";
      let bottom = "+";

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
    });

    return output;
  }
}

class BinaryTree {
  constructor(grid) {
    this._grid = grid;
  }

  applyAlgorithm() {
    this._grid.eachCell().forEach((cell) => {
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
    });
  }
}

function getRandomInt(upperBound) {
  const min = 0;
  const max = Math.floor(upperBound - 1);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

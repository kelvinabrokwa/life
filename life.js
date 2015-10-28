'use strict';

const SIZE = 7;
const cell_num = 80;
var speed = 100; // regenerate once every 200 milliseconds
var interval;

var cells = [];

function reset() {
  if (interval) clearInterval(interval);
  cells = [];
  for (var i = 0; i < cell_num; i++) {
    var row = [];
    for (var j = 0; j < cell_num; j++) {
      row.push(false);
    }
    cells.push(row);
  }
};

function countNeighbors(row, cell, gen) {
  var up = (x) => (x + cell_num - 1) % cell_num,
      down = (x) => (x + 1) % cell_num,
      left = (y) => (y + cell_num - 1) % cell_num,
      right = (y) => (y + 1) % cell_num;
  var live_neighbors = 0;
  [ [ up(row)   , right(cell)  ],
    [ up(row)   , cell         ],
    [ up(row)   , left(cell)   ],
    [ row       , left(cell)   ],
    [ row       , right(cell)  ],
    [ down(row) , left(cell)   ],
    [ down(row) , cell         ],
    [ down(row) , right(cell)  ] ].forEach(n => {
        if (gen[n[0]][n[1]]) live_neighbors++
    });
  return live_neighbors;
}

function nextGen() {
  render();
  var last_gen = JSON.parse(JSON.stringify(cells));
  for (var row = 0, len = last_gen.length; row < len; row++) {
    for (var cell = 0, len2 = last_gen[row].length; cell < len2; cell++) {
      var neighbors = countNeighbors(row, cell, last_gen);
      if (last_gen[row][cell] && (neighbors < 2 || neighbors > 3)) cells[row][cell] = false;
      else if (neighbors === 3) cells[row][cell] = true;
    }
  }
}

const KILL = 0;
const REVIVE = 1;

function render() {
  for (var row = 0, len = cells.length; row<len; row++) {
    for (var cell = 0, len2 = cells[row].length; cell < len2; cell++) {
      renderCell(cell, row, cells[row][cell] ? REVIVE : KILL);
    }
  }
}

var c = document.getElementById('zone');
c.width = SIZE * cell_num;
c.height = SIZE * cell_num;
var ctx = c.getContext('2d');

function renderCell(x, y, opt) {
  ctx.beginPath();
  ctx.rect(x * SIZE, y * SIZE, SIZE, SIZE);
  ctx.fillStyle = opt == REVIVE ? 'black' : 'white';
  ctx.fill();
}

window.Random = function(start_num) {
  reset();
  var rando = () => Math.floor(Math.random() * cell_num);
  var row, cell;
  while (start_num--) {
    row = rando(), cell = rando();
    cells[row][cell] = true;
  }
}
window.Random.prototype.start = start

window.Glider = function() {
  reset();
  [
    [0, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ].forEach(c => {
    cells[c[0]][c[1]] = true;
  });
}
window.Glider.prototype.start = start;

function start() {
  interval = setInterval(nextGen, speed);
}

var random = new window.Random(800);
random.start();

'use strict';

var size = 7;
var cell_num = 80;

var c = document.getElementById('zone');
c.width = size * cell_num;
c.height = size * cell_num;
var ctx = c.getContext('2d');

var cell = [];

(function buildCells() {
  for (var i=0; i<cell_num; i++) {
    var inner = [];
    for (var j=0; j<cell_num; j++) {
      inner.push(false);
    }
    cell.push(inner);
  }
})();

function findNeighbors(x,y) {
  function up(_x) { return _x === 0 ? cell_num - 1 : _x - 1; }
  function down(_x) { return _x === cell_num - 1 ? 0 : _x + 1; }
  function left(_y) { return _y === 0 ? cell_num - 1 : _y - 1; }
  function right(_y) { return _y === cell_num - 1 ? 0 : _y + 1; }
  var live_neighbors = 0;
  [ [ up(x)   ,   right(y)  ],
    [ up(x)   ,   y         ],
    [ up(x)   ,   left(y)   ],
    [ x       ,   left(y)   ],
    [ x       ,   right(y)  ],
    [ down(x) ,   left(y)   ],
    [ down(x) ,   y         ],
    [ down(x) ,   right(y)  ] ].forEach(function(n) {
        if (cell[n[0]][n[1]]) live_neighbors++
    })
    return live_neighbors;
}

function adjustStatus() {
    var last_gen = cell;
    for (var x=0, len=last_gen.length; x<len; x++) {
        for (var y=0, len2=last_gen[x].length; y<len2; y++) {
            var neighbors = findNeighbors(x,y);
            if ((last_gen[x][y]) && ((neighbors < 2) || (neighbors > 3))) cell[x][y] = false;
            else if (neighbors === 3) cell[x][y] = true;
        }
    }
    generateNext();
}

function generateNext() {
  for (var x=0, len=cell.length; x<len; x++) {
    for (var y=0, len2=cell[x].length; y<len2; y++) {
      if (cell[x][y]) updateState(x,y,'revive');
      else updateState(x,y,'kill');
    }
  }
}

function updateState(x,y,opt) {
  ctx.beginPath();
  ctx.rect(x*size, y*size, size, size);
  ctx.fillStyle = opt == 'revive' ? 'black' : 'white';
  ctx.fill();
}

function random(start_num) {
  function rando() { return Math.floor(Math.random() * cell_num); }
  while (start_num--) {
    var x = rando(), y = rando();
    cell[x][y] = true;
  }
  generateNext();
};

random(800);
window.setInterval(adjustStatus, 300);

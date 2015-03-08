var size = 12;
var cell_num = 70;

var c = document.getElementById('zone');
c.width = size*cell_num;
c.height = size*cell_num;
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
  function up(_x) { return _x===0 ? cell_num-1 : _x-1; }
  function down(_x) { return _x===cell_num-1 ? 0 : _x+1; }
  function left(_y) { return _y===0 ? cell_num-1 : _y-1; }
  function right(_y) { return _y===cell_num-1 ? 0 : _y+1; }
  return [ [ up(x)   ,   right(y)  ],
           [ up(x)   ,   y         ],
           [ up(x)   ,   left(y)   ],
           [ x       ,   left(y)   ],
           [ x       ,   right(y)  ],
           [ down(x) ,   left(y)   ],
           [ down(x) ,   y         ],
           [ down(x) ,   right(y)  ] ];
}

function adjustStatus() {
  for (var x=0, len=cell.length; x<len; x++) {
    for (var y=0, len2=cell[x].length; y<len2; y++) {
      var live_neighbors = 0;
      findNeighbors(x,y).forEach(function(i) {
        if (cell[i[0]][i[1]]) live_neighbors++;
      });
      if ((cell[x][y]) && ((live_neighbors < 2) || (live_neighbors > 3))) cell[x][y] = false;
      else if (!cell[x][y] && (live_neighbors === 3)) cell[x][y] = true;
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

var seed = {};

seed.random = function(start_num) {
  function rando() { return Math.floor(Math.random() * cell_num); }
  var count = 0;
  while (count < start_num) {
    count++;
    var x = rando(), y = rando();
    cell[x][y] = true;
  }
  generateNext();
};

seed.random(700);
window.setInterval(adjustStatus, 300)

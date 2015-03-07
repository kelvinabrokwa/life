/**
 * To do:
 *    Implement color gradient for cell longevity
 */
var size = 10; // in pixels
var cell_num = 60;

var c = document.getElementById('zone');
c.width = size*cell_num;
c.height = size*cell_num;
var ctx = c.getContext("2d");

function drawGrid(x,y,s) {
  ctx.beginPath();
  ctx.rect(x*size, y*size, s, s);
  ctx.lineWidth = '0.3';
  ctx.stroke();
}

for (var i=0; i<cell_num; i++) {
  for (var j=0; j<cell_num; j++) {
      drawGrid(i, j, size);
  }
}

var cell = [];

(function buildCells() {
  for (var i=0; i<cell_num; i++) {
    var inner = [];
    for (var j=0; j<cell_num; j++) {
      inner.push(false)
    }
    cell.push(inner)
  }
})();

function findNeighbors(x,y) {
  if ((x>0) && (y>0)) {
    return [ [x,y-1], [x-1,y], [x-1,y+1], [x-1,y-1],
             [x,y+1], [x+1,y], [x+1,y-1], [x+1,y+1] ];
  } else if ((x>0) && (y===0)) {
    return [ [x-1,y], [x-1,y+1], [x+1,y], [x+1,y+1], [x,y+1] ];
  } else if ((x===0) && (y>0)) {
    return [ [x,y-1], [x+1,y-1], [x,y+1], [x+1,y+1], [x+1,y] ];
  } else if ((x===0) && (y===0)) {
    return [ [x+1,y], [x,y+1], [x+1,y+1] ];
  } else {
    console.log('idk what happened')
  }
}

function adjustStatus() {
  console.log('this is new')
  for (var x=0, len=cell.length; x<len; x++) {
    for (var y=0, len2=cell[x].length; y<len2; y++) {
      var live_neighbors = 0
      findNeighbors(x,y).forEach(function(i) {
        if (cell[i[0]][i[1]]) live_neighbors++;
      });
      if ((cell[x][y]) && ((live_neighbors < 2) || (live_neighbors > 3))) cell[x][y] = false;
      else if (!cell[x][y] && (live_neighbors === 3)) cell[x][y] = true
    }
  }
  generateNext();
}

function updateState(x,y,opt) { // 'kill' or revive
  ctx.beginPath();
  ctx.rect(x*size, y*size, size, size);
  ctx.fillStyle = opt == 'revive' ? 'black' : 'white'
  ctx.fill();
}

function generateNext() {
  for (var x=0, len=cell.length; x<len; x++) {
    for (var y=0, len2=cell[x].length; y<len2; y++) {
      if (cell[x][y]) updateState(x,y,'revive');
      else updateState(x,y,'kill');
    }
  }
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
}

seed.random(1000)

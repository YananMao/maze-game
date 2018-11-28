function generateMazeArray(rows,lines){
  
  // 初始数组在该位置的属性value是类似这样排列的,1是可以通过,偶数行并且偶数列的为1
  // 0 0 0 0 0
  // 0 1 0 1 0
  // 0 0 0 0 0
  // 0 1 0 1 0
  // 0 0 0 0 0
  for (var i=0;i<2*lines+1;i++){
    var temp =Array.apply(null, {length:rows*2+1}).map(function(value, index) {
        return {
          value:i%2&&index%2,
          position:[i,index],
          isVisited:false
        };
    });
    // var temp =Array.apply(null, Array(lines*2+1)).map(function(value, index) {
    //     return i%2&&index%2;
    // });
    mazeArray.push(temp);
  }
   // 随意选取一个现在为1的点作为起点
  var startX = Math.floor(Math.random()*lines)*2+1;
  var startY = Math.floor(Math.random()*rows)*2+1;
  var start = mazeArray[startX][startY];
  var current = start;
  initCurrentPoint(current);
  console.log(mazeArray);
  console.log(visitedPoints);
}
function initCurrentPoint(current){
  current.isVisited = true;
  if(visitedPoints.indexOf(current)<0){
    visitedPoints.push(current);
  }
  if(visitedPoints.length<rows*lines){
    var neighbor = getNeighbor(current);
    // 判断是否为空对象
    if(Object.getOwnPropertyNames(neighbor).length==0){
      initCurrentPoint(visitedPoints[Math.floor(Math.random()*visitedPoints.length)])
    }else{
      initCurrentPoint(neighbor)
    }
  }

}
function getNeighbor(current){
  var neighborsNotVisited = [];
  var neighborChosen = {};
  var currentPosition = current.position;
  // 依次是左 上 右 下
  var neighborsPosition = [
    [currentPosition[0]-2,currentPosition[1]],
    [currentPosition[0],currentPosition[1]-2],
    [currentPosition[0]+2,currentPosition[1]],
    [currentPosition[0],currentPosition[1]+2],
  ]
  neighborsPosition.forEach(function(position){
    var neighbor;
    if(position[0]>0&&position[0]<rows*2&&position[1]>0&&position[1]<lines*2){
      // 邻居点要在迷宫范围之内
      neighbor = mazeArray[position[0]][position[1]];
    }
    if(neighbor&&!neighbor.isVisited){
      neighborsNotVisited.push(neighbor)
    }
  })
  if(neighborsNotVisited.length){
    var randomIndex = Math.floor(Math.random()*neighborsNotVisited.length);
    neighborChosen = neighborsNotVisited[randomIndex];
    var middle = [(neighborChosen.position[0]+current.position[0])/2,(neighborChosen.position[1]+current.position[1])/2];
    mazeArray[middle[0]][middle[1]].value = 1;

  }
  return neighborChosen


}
function generateMazeGraphic(){
  initStartEnd();
  for(var i=0;i<2*lines+1;i++){
    for(var j=0;j<2*rows+1;j++){
      if(i==startPoint.position[0]&&j==startPoint.position[1]){
        // 起点
        ctx.fillStyle="red";
      }else if (i==targetPoint.position[0]&&j==targetPoint.position[1]){
        // 终点
        ctx.fillStyle="green";
      }else if(mazeArray[i][j].value=="1"){
        ctx.fillStyle="#fff";
      }else{
        ctx.fillStyle = '#000'
      }
      ctx.fillRect(width*i,height*j,width,height);
    }
  }
}
function initStartEnd(){
  var startIndex = 2*Math.floor(Math.random()*(rows))+1;
  var targetIndex = 2*Math.floor(Math.random()*(rows))+1;
  startPoint = mazeArray[1][startIndex];
  // targetPoint = mazeArray[2*lines-1][targetIndex];
  targetPoint = mazeArray[1][targetIndex];
  currentPoint = startPoint;
  // return [startIndex,targetIndex]
}
function keydownHandler(e){
  var keynum;
    if(window.event) {
      // IE
      keynum = e.keyCode
    }else if(e.which) {
      // Netscape/Firefox/Opera
      keynum = e.which
    }
    switch (keynum){
      case 37:
          //left
          move('left');
          break;
      case 38:
          // top
          move('top');
          break;
      case 39:
          // right
          move('right');
          break;
      case 40:
          // down
          move('down');
          break;


    }
}
function bindMoveEvent(){
  document.body.addEventListener('keydown',keydownHandler)
}
function removeMoveEvent(){
  document.body.removeEventListener('keydown',keydownHandler)
}

function move(flag){
  var currentPosition = currentPoint.position;
  var newPosition = [];
  switch(flag){
    case 'left':
      newPosition = [currentPosition[0]-1,currentPosition[1]];
      break;
    case 'top':
      newPosition = [currentPosition[0],currentPosition[1]-1];
      break;
    case 'right':
      newPosition = [currentPosition[0]+1,currentPosition[1]];
      break;
    case 'down':
      newPosition = [currentPosition[0],currentPosition[1]+1];
      break;

  }
  if(mazeArray[newPosition[0]][newPosition[1]].value==1){
    newPoint = mazeArray[newPosition[0]][newPosition[1]]
    moveTo(currentPoint,newPoint);
    currentPoint = newPoint;
    if(currentPoint.position.toString() == targetPoint.position.toString()){
      succeed()
    }
  }else{
    return
  }
}
function succeed(){
  alert('congrats!!!');
  restart()
}
function drawRect(point,color){
  ctx.fillStyle = color;
  ctx.fillRect(width*point.position[0],height*point.position[1],width,height)
}
function moveTo(currentPoint,newPoint){
  drawRect(currentPoint,'#fff');
  drawRect(newPoint,'red');

}

function initStartEvent(){
  var start = document.getElementById('start');
  start.addEventListener('click',function(){
    bindMoveEvent();
    var seconds = countDownSeconds;
    timer = setInterval(function(){
      seconds--;
      if(seconds>-1){
        timerButton.innerHTML = seconds+'s';
      }else{
        alert('nice try!!!')
        // 
        restart();
        

        
      }
    },1000)
  })
}
function restart(){
  window.clearInterval(timer);
  removeMoveEvent();
  init()
}
function init(){
  timerButton.innerHTML = countDownSeconds+'s';
  generateMazeArray(rows,lines);
  generateMazeGraphic();
  initStartEvent()
}
var mazeArray = [];
var visitedPoints = [];
var rows = 20;
var lines = 20;
var width = 10;
var height = 10;
var startPoint;
var targetPoint;
var currentPoint;
var countDownSeconds = 10;
var timer;
var myCanvas = document.getElementById('myCanvas');
var timerButton = document.getElementById('timer');
myCanvas.setAttribute('width',(lines*2+1)*width);
myCanvas.setAttribute('height',(rows*2+1)*height);

var ctx = myCanvas.getContext('2d');
init();

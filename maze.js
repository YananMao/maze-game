function generateMazeArray(rows,lines){
  
  // 初始数组在该位置的属性value是类似这样排列的,1是可以通过,偶数行并且偶数列的为1
  // 0 0 0 0 0
  // 0 1 0 1 0
  // 0 0 0 0 0
  // 0 1 0 1 0
  // 0 0 0 0 0
  for (var i=0;i<2*rows+1;i++){
    var temp =Array.apply(null, {length:lines*2+1}).map(function(value, index) {
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
  var startRow = Math.floor(Math.random()*rows)*2+1;
  var startLine = Math.floor(Math.random()*lines)*2+1;
  var start = mazeArray[startRow][startLine];
  var current = start;
  initCurrentPoint(current);
  console.log(mazeArray);
  return mazeArray;
}
function initCurrentPoint(current){
  current.isVisited = true;
  visitedPoints.push(current);
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
    if(position[0]>0&&position[0]<rows*2+1&&position[1]>0&&position[1]<lines*2+1){
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
var mazeArray = [];
var visitedPoints = [];
var rows = 2;
var lines = 2;
generateMazeArray(rows,lines)
import { grid } from "./maze.js";

function distance(a, b){
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2)
}

class cell{
    constructor(x, y, parent, g){
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.isConsidered = false;
        this.g = g;
    }

    evaluateFValue(destination, source, index){
        switch(index){
            case "1":{
                this.f = this.g + this.heuristic1(destination, source);
                console.log(1);
                break;
            }
            case "2":{
                this.f = this.g + this.heuristic2(destination, source);
                console.log(2);
                break;
            }
            case "3":{
                this.f = this.g + this.heuristic3(destination, source);
                console.log(3);
                break;
            }
            case "4":{
                this.f = this.g + this.heuristic4(destination, source);
                console.log(4);
                break;
            }
            case "5":{
                this.f = this.g + this.heuristic5(destination, source);
                console.log(5);
                break;
            }
            case "6":{
                this.f = this.g + this.heuristic6(destination, source);
                console.log(6);
                break;
            }
            case "7":{
                this.f = this.g + this.heuristic7(destination, source);
                console.log(7);
                break;
            }
            default:{
                this.f = this.g + this.heuristic1(destination, source);
                console.log(8);
                break;
            }
        }
        
    }

    heuristic1(destination, source){
        return distance(this, destination)
    }

    heuristic2(destination, source){
        return Math.floor(distance(this, destination) ** 2)
    }

    heuristic3(destination, source){
        return Math.max(Math.abs(destination.x - this.x), Math.abs(destination.y - this.y));

    }

    heuristic4(destination, source){
        return Math.abs(this.x - destination.x) + Math.abs(this.y - destination.y);
    }

    heuristic5(destination, source){
        var dx = Math.abs(destination.x - this.x);
        var dy = Math.abs(destination.y - this.y);
        return dx > dy ? dx + sqrt(2) * dy : sqrt(2) * dx + dy
    }

    heuristic6(destination, source){
        var dx1 = this.x - destination.x;
        var dy1 = this.y - destination.y;
        var dx2 = source.x - destination.x;
        var dy2 = source.y - destination.y;
        return Math.abs(dx1 * dy2 - dx2 * dy1) * 0.001 + this.heuristic2(destination, source);
    }

    heuristic7(destination, source){
        var CS = distance(this, source);
        var CD = distance(this, destination);
        var SD = distance(source, destination);
        var c =  -Math.abs(((CS**2 + SD**2 - CD**2) / (2 * CS * SD)));
        return this.heuristic2(destination, source) + c;
    }
}

var gridDetail = [];
var openList = [];
var closeList = [];

var pickedS = false;
var pickedD = false;
var source = null;
var destination = null;

var considered = [];
var cellConsidered = 0;
var result = null;
var hasPath = false;


function initialize(){
    for(var i = 0 ; i < grid.height ; i ++){
        var row = []
        for(var j = 0 ; j < grid.width ; j ++){
            var cellDetail = new cell(i, j, null, null);
            row.push(cellDetail)
        }
        gridDetail.push(row);
    }
}

function isNode(x, y, node){
    return (x === node.x && y === node.y);
}

function isWall(x, y){
    return (grid[x][y] === 0);
}

function isInsideGrid(x, y){
    return (x > -1 && x < grid.width && y > -1 && y < grid.height);
}

function pathTracing(){
    var temp_x = gridDetail[destination.x][destination.y].parent.x;
    var temp_y = gridDetail[destination.x][destination.y].parent.y;

    var path = [];
    path.push({x: destination.x, y: destination.y});

    while(temp_x !== source.x || temp_y !== source.y){
        var parent = gridDetail[temp_x][temp_y]

        temp_x = parent.parent.x;
        temp_y = parent.parent.y;
        path.push({x: parent.x, y: parent.y});
    }
    path.push({x: source.x, y: source.y});

    return path;
}

function samePositionInList(cell, list){
    for(var i = 0 ; i < list.length ; i ++){
        if(list[i].x == cell.x && list[i].y == cell.y){
            return {cell:list[i], index:i};
        }
    }
    return null;
}

function insertIntoOpenList(cell){
    var i = 0;
    while(i < openList.length && openList[i].f < cell.f){
        i ++;
    }

    if(i === openList.length){
        openList.push(cell);
    } else {
        openList.splice(i, 0, cell);
    }
    
}

function updateOpenList(index, cell){
    openList.splice(index, 1);
    insertIntoOpenList(cell);
}

function updateCell(x, y, parent, g, index){
    gridDetail[x][y].parent = parent;
    gridDetail[x][y].g = g;
    gridDetail[x][y].evaluateFValue(destination, source, index);
}

function checkGrid(){
    return !(isNode(source.x, source.y, destination) || isWall(source.x, source.y) || isWall(destination.x, destination.y) || !isInsideGrid(source.x, source.y) || !isInsideGrid(destination.x, destination.y))
}

function cost(result){
    var c = 0;
    for(var i = 1 ; i < result.length ; i ++){
        c += distance(result[i], result[i - 1]);
    }
    return c;
}

export function AStarAlgorithm(){
    initialize();
    if(!checkGrid()) return null;
    var index = $('input[name="heuristic"]:checked').val();

    insertIntoOpenList(gridDetail[source.x][source.y]);
    while(openList.length > 0){
        var current = openList.shift();
        cellConsidered ++;
        gridDetail[current.x][current.y].isConsidered = true;
        if(isNode(current.x, current.y, destination)){
            hasPath = true;
            return pathTracing();
        }

        var candidate = [{x:current.x, y:current.y - 1}, 
                        {x:current.x - 1, y:current.y}, 
                        {x:current.x + 1, y:current.y},  
                        {x:current.x, y:current.y + 1}]
        if($('input[name=diagonal]:checked').val() == "allowdiagonal"){
            candidate.push({x:current.x - 1, y:current.y - 1})
            candidate.push({x:current.x - 1, y:current.y + 1})
            candidate.push({x:current.x + 1, y:current.y - 1})  
            candidate.push({x:current.x + 1, y:current.y + 1})
        }

        var neighbors = [];
        for(let i = 0 ; i < candidate.length ; i ++){
            if(isInsideGrid(candidate[i].x, candidate[i].y) && !isWall(candidate[i].x, candidate[i].y)){
                neighbors.push(candidate[i]);
                if(!samePositionInList(candidate[i], considered)) considered.push({x : candidate[i].x, y : candidate[i].y})
            }
        }

        neighbors.forEach(successor => {
            var scDist = current.g + distance(successor, current);

            var samePositionO = samePositionInList(successor, openList);
            var samePositionC = samePositionInList(successor, closeList);

            if(samePositionO !== null){
                if(samePositionO.cell.g > scDist){
                    updateCell(successor.x, successor.y, current, scDist, index)
                    updateOpenList(samePositionO.index, gridDetail[successor.x][successor.y]);
                }
            } else if(samePositionC !== null){
                if(samePositionC.cell.g > scDist){
                    updateCell(successor.x, successor.y, current, scDist, index)
                    closeList.splice(samePositionC.index, 1);
                    insertIntoOpenList(gridDetail[successor.x][successor.y])
                }
            } else {
                updateCell(successor.x, successor.y, current, scDist, index)
                insertIntoOpenList(gridDetail[successor.x][successor.y]);
            }
        })
        closeList.push(current);
    }
    return null;
}
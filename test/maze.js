export var grid = {width: 30, height: 30};
export var markTable = [];

var grid = {width: 30, height: 30};
var markTable = [];

export function gridInitialize(){
	for(var i = 0 ; i < grid.height ; i ++){
		var row = [];
		var mark = [];
		for(var j = 0 ; j < grid.width ; j ++){
			row.push(0);
			mark.push(false);
		}
		grid[i] = row;
		markTable.push(mark);
	}
}

function isInsideGrid(x, y){
    if(x > -1 && x < grid.width && y > -1 && y < grid.height){
        return true;
    }
    else{
        return false;
    }
}

function check(root, cell){
	var first = !markTable[cell.x][cell.y];
	var second = !markTable[Math.floor((root.x + cell.x) / 2)][Math.floor((root.y + cell.y) / 2)];

	return (first && second);
}

function destroyWall(root, cell){
	markTable[cell.x][cell.y] = true;
	markTable[Math.floor((root.x + cell.x) / 2)][Math.floor((root.y + cell.y) / 2)] = true;
	grid[cell.x][cell.y] = 1;
	grid[Math.floor((root.x + cell.x) / 2)][Math.floor((root.y + cell.y) / 2)] = 1;
}

function drill(probability){
	for(var i = 0 ; i < grid.height ; i ++){
		for(var j = 0 ; j < grid.width ; j ++){
			if(grid[i][j] == 0){
				var rand = Math.floor(Math.random() * 100) / (100 - probability);
				if(rand > 1){
					grid[i][j] = 1;
				}
			}
		}
	}
}

export function generator(){
	var randomIndexSource = Math.floor(Math.random() * 3);
	var stack = [];

	stack.push({x: 0, y: randomIndexSource});
	while(stack.length > 0){
		var node = stack.pop();
		var gcandidate = [{x:node.x, y:node.y - 2}, 
						 {x:node.x - 2, y:node.y}, 
						 {x:node.x + 2, y:node.y},  
						 {x:node.x, y:node.y + 2}]
		var neighbors = []
		for(var i = 0 ; i < gcandidate.length ; i ++){
			if(isInsideGrid(gcandidate[i].x, gcandidate[i].y) && check(node, gcandidate[i])){
				neighbors.push(gcandidate[i]);
			}
		}
		while(neighbors.length > 0){
			var randomIndex = Math.floor(Math.random() * neighbors.length);
			var neighbor = neighbors.splice(randomIndex, 1)[0];
			var probability = Math.floor(Math.random() * 100) / 30;
			if(probability > 1){
				destroyWall(node, neighbor);
				stack.push(neighbor);
			}
		}


	}
	drill(70);

}
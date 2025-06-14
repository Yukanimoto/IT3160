var gwidth = 801;
var gheight = 801;
var cellWidth = 20;
var cellHeight = 20;
var allowToRun = false;
var createMaze = false;
var selectSD = true;

function drawGrid(){
    for(var i = 0 ; i < grid.width ; i ++){
        for(var j = 0 ; j < grid.height ; j ++){
            fill(grid[i][j] == 1 ? 255 : 0);
            rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
        }
    }
}

function setup(){
    mazeGenerating();
    pickedS = false;
    pickedD = false;
    var canvas = createCanvas(gwidth + cellWidth, gheight + cellHeight)
    canvas.parent('sketch-holder');
    drawGrid()

}

function mouseDragged(){
    if(createMaze){
        var i = Math.floor(mouseX / cellWidth);
        var j = Math.floor(mouseY / cellWidth);
        grid[i][j] = 0;
        fill(0);
        rect(Math.floor(mouseX / cellWidth) * cellWidth, Math.floor(mouseY / cellWidth) * cellHeight, cellWidth, cellHeight)
    }
}

function mousePressed(){
    var x = Math.floor(mouseX / cellWidth);
    var y = Math.floor(mouseY / cellHeight);
    if(selectSD){
        if(isInsideGrid(x, y) && !isWall(x, y)){    
            if(pickedS){
                if(pickedD){
                    pickedD = false;
                    considered = [];
                    openList = [];
                    closeList = []
                    gridDetail = [];
                    result = [];
                    cellConsidered = 0;
                    indexConsidered = 0;
                    drawGrid()
                    source = {x, y};
                    fill(255, 0, 0);
                    rect(source.x * cellWidth, source.y * cellHeight, cellWidth, cellHeight)

                } else{
                    if(x == source.x && y == source.y){
                        alert("Diem xuat phat va diem dich trung nhau")
                    } else{
                        destination = {x: x, y: y};
                        fill(230, 0, 172);
                        rect(destination.x * cellWidth, destination.y * cellHeight, cellWidth, cellHeight)
                        pickedD = true;

                        search();
                        $("#result").text(result.length);
                        $("#considered").text(cellConsidered);
                        $("#cost").text(Math.floor(cost(result) * 1000) / 1000);
                        loop();
                    }
                } 
            } else{
                source = {x, y};
                fill(255, 0, 0);
                rect(source.x * cellWidth, source.y * cellHeight, cellWidth, cellHeight)
                pickedS = true;
            }
        }
    } else if(createMaze){
        grid[x][y] = 0;
        fill(0);
        rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight)
    }
}

var indexConsidered = 0;
function draw(){
    frameRate(60);
    if(source == null || destination == null){
        noLoop();
    } else{
        if(considered[indexConsidered]){
            var node = considered[indexConsidered];
            if(!isNode(node.x, node.y, source) && !isNode(node.x, node.y, destination)){
                if(gridDetail[node.x][node.y].isConsidered){
                    fill(255, 119, 51)
                } else{
                    fill(255, 255, 77)
                }
                rect(considered[indexConsidered].x * cellWidth, considered[indexConsidered].y * cellHeight, cellWidth, cellHeight);
            }
            indexConsidered ++;
        } else{
            result.shift();
            for(var i = 0 ; i < result.length ; i ++){
                fill(0, 255, 0)
                rect(result[i].x * cellWidth, result[i].y * cellHeight, cellWidth, cellHeight);
            }
            fill(230, 0, 172)
            rect(destination.x * cellWidth, destination.y * cellHeight, cellWidth, cellHeight);
            fill(255, 0, 0)
            rect(source.x * cellWidth, source.y * cellHeight, cellWidth, cellHeight);

            noLoop();
        }
    }
}

$("#reload").on("click", function(){
    location.reload();
})

$("#createMaze").on("click", function(){
    createMaze = true;
    selectSD = false;
    $("#mode").text("Customize the maze")
})

$("#selectSD").on("click", function(){
    createMaze = false;
    selectSD = true;
    $("#mode").text("Select source and destination")
})

$("#clearMaze").on("click", function(){
    for(var i = 0 ; i < grid.width ; i ++){
        for(var j = 0 ; j < grid.height ; j ++){
            grid[i][j] = 1;
            fill(255);
            rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
        }
    }
})
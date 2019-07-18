const CFG = {
    "timer": 15,
    "width": 7,
    "height": 6
}

window.screen.orientation.lock('landscape-primary');
var gamediv = document.body.getElementsByClassName("game-grid")[0];
const turnlabel = document.getElementById("turn-label");
const popup = document.getElementsByClassName("popup")[0];
const popupLabel = document.getElementById("popup-label");
const timeLabel = document.getElementById("time-label");
const scoreLabelP1 = document.getElementById("score-yellow");
const scoreLabelP2 = document.getElementById("score-red");
const scoreLabelDraw = document.getElementById("score-draw");

var chipCount = 0;
var playerTurn = 1;
var scoreP1 = 0;
var scoreP2 = 0;
var scoreDraw = 0;
class Matrix {
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.matrix = this.createMatrix(width, height);
    };

    createMatrix(width, height){
        let tempMatrix = [];
        for(let i = 0; i < height; i++){
            tempMatrix[i] = [];
            for(let j = 0; j < width; j++){
                tempMatrix[i][j] = 0;
            }
        }
        return tempMatrix;
    }

    resetMatrix(){
        this.matrix = this.createMatrix(this.width, this.height);
    }

    setValue(x, y, value){
        if(x < this.height && x >= 0 && y < this.width && y >= 0){
            this.matrix[x][y] = value;
        }
    }

    getValue(x, y){
        if(x < this.height && x >= 0 && y < this.width && y >= 0){
            return this.matrix[x][y];
        }
    }

    get currentmatrix(){
        return this.matrix;
    }
}
const gamegrid = new Matrix(CFG.width, CFG.height);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function insertChip(col, player){
    for(let x = gamegrid.height - 1; x >= 0; x--){
        if(gamegrid.getValue(x, col) == 0){
            gamegrid.setValue(x, col, player);
            chipCount += 1;
            switchTurn();
            renderGame(gamegrid, gamediv);
            checkIfWin();
            return true;
        }
    }
    return false;
}

function timer(){
    let timeleft = CFG.timer;
    timeLabel.innerHTML = timeleft + "s";
    try{
        clearInterval(timerInterval);
    } catch {
    }
    timerInterval = setInterval(function(){
    timeLabel.innerHTML = (timeleft - 1) + "s";
    timeleft -= 1;
    if(timeleft <= 0){
        clearInterval(timerInterval);
        while(!insertChip(getRandomInt(0, 6), playerTurn));
        popup.style.display = "block";
        popupLabel.style.display = "block";
        if(playerTurn == 1){
            popupLabel.innerHTML = "Red didn't make a turn in time. A random play was made.";
        } else {
            popupLabel.innerHTML = "Yellow didn't make a turn in time. A random play was made.";
        }
        popup.onclick = function(){
            popup.style.display = "none";
            popupLabel.style.display = "none";
        }
    }
}, 1000);
}

function checkIfWin(){
    
    for(let x = 0; x < gamegrid.height; x++){
        for(let y = 0; y < gamegrid.width; y++){
            if(gamegrid.getValue(x, y) != 0){
                let player = gamegrid.getValue(x, y);
                if(gamegrid.getValue(x, y+1) == player && gamegrid.getValue(x, y+2) == player && gamegrid.getValue(x, y+3) == player){
                    let winningCells = [[x, y], [x, y+1], [x, y+2], [x, y+3]];
                    showWinner(player, winningCells);
                    return;
                }
                if(gamegrid.getValue(x+1, y) == player && gamegrid.getValue(x+2, y) == player && gamegrid.getValue(x+3, y) == player){
                    let winningCells = [[x, y], [x+1, y], [x+2, y], [x+3, y]];
                    showWinner(player, winningCells);
                    return;
                }
                if(gamegrid.getValue(x+1, y+1) == player && gamegrid.getValue(x+2, y+2) == player && gamegrid.getValue(x+3, y+3) == player){
                    let winningCells = [[x, y], [x+1, y+1], [x+2, y+2], [x+3, y+3]];
                    showWinner(player, winningCells);
                    return;
                }
                if(gamegrid.getValue(x-1, y+1) == player && gamegrid.getValue(x-2, y+2) == player && gamegrid.getValue(x-3, y+3) == player){
                    let winningCells = [[x, y], [x-1, y+1], [x-2, y+2], [x-3, y+3]];
                    showWinner(player, winningCells);
                    return;
                }
            }
        }
    }
    if(chipCount >= gamegrid.width * gamegrid.height){
        showDraw();
    }
}
function switchTurn(){
    if(playerTurn == 1){
        playerTurn = 2;
    } else {
        playerTurn = 1;
    }
    if(playerTurn == 1){
        turnlabel.innerHTML = "Gelb ist am Zug";
    } else {
        turnlabel.innerHTML = "Rot ist am Zug";
    }
    timer();
}

function showWinner(player, winningCells){
    clearInterval(timerInterval);
    for(let i = 0; i < 4; i++){
        let winningCell = document.getElementById(winningCells[i][0].toString() + winningCells[i][1].toString());
        if(player == 1){
            winningCell.style.boxShadow = "rgba(255, 255, 0, 1) 0px 0px 13px 4px";
        } else {
            winningCell.style.boxShadow = "rgba(255, 0, 0, 1) 0px 0px 13px 4px";
        }
        
    }
    let winnerName;
    if(player == 1){
        winnerName = "Yellow";
        scoreP1 += 1;
        localStorage.setItem("scoreP1", scoreP1);
    } else {
        winnerName = "Red";
        scoreP2 += 1;
        localStorage.setItem("scoreP2", scoreP2);
    } 
    scoreLabelP1.innerHTML = "Yellow : " + scoreP1;
    scoreLabelP2.innerHTML = "Red : " + scoreP2;
    scoreLabelDraw.innerHTML = "Draw : " + scoreDraw;


    window.setTimeout(()=>{
        popup.style.display = "block";
        popupLabel.style.display = "block";
        popupLabel.innerHTML = winnerName + " has won the game!";
        popup.onclick = function(){
            popup.style.display = "none";
            popupLabel.style.display = "none";
            newGame();
        }
    }, 1000)   
}

function showDraw(){
    clearInterval(timerInterval);
    scoreDraw += 1;
    localStorage.setItem("scoreDraw", scoreDraw);
    scoreLabelP1.innerHTML = "Yellow : " + scoreP1;
    scoreLabelP2.innerHTML = "Red : " + scoreP2;
    scoreLabelDraw.innerHTML = "Draw : " + scoreDraw;
    window.setTimeout(()=>{
        popup.style.display = "block";
        popupLabel.style.display = "block";
        popupLabel.innerHTML = "The game ended as a draw";
        popup.onclick = function(){
            popup.style.display = "none";
            popupLabel.style.display = "none";
            newGame();
        }
    }, 1000)
}

function renderGame(grid, container){
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    for(let x = 0; x < grid.height; x++){
        for(let y = 0; y < grid.width; y++){
            celldiv = document.createElement('div');
            if(grid.getValue(x, y) == 0){
                celldiv.className = 'celldiv empty';
            } else if(grid.getValue(x, y) == 1) {
                celldiv.className = 'celldiv p1';
            } else if(grid.getValue(x, y) == 2) {
                celldiv.className = 'celldiv p2';
            }
            celldiv.id = x.toString() + y.toString();
            celldiv.onclick = function() { 
                insertChip(y, playerTurn);
            };
            //celldiv.innerHTML = x.toString() + y.toString();
            container.appendChild(celldiv);

        }
    }
}

function newGame(){
    playerTurn = Math.round(Math.random()) + 1;
    chipCount = 0;
    gamegrid.resetMatrix();
    renderGame(gamegrid, gamediv);
    if(playerTurn == 1){
        turnlabel.innerHTML = "Gelb ist am Zug";
    } else {
        turnlabel.innerHTML = "Rot ist am Zug";
    }
}

/* if(localStorage.getItem("scoreP1") != undefined){
    scoreP1 = localStorage.getItem("scoreP1");
} else {
    localStorage.setItem("scoreP1", 0);
}
if(localStorage.getItem("scoreP2") != undefined){
    scoreP1 = localStorage.getItem("scoreP2");
} else {
    localStorage.setItem("scoreP2", 0);
}
if(localStorage.getItem("scoreDraw") != undefined){
    scoreDraw = localStorage.getItem("scoreDraw");
} else {
    localStorage.setItem("scoreDraw", 0);
} */
scoreLabelP1.innerHTML = "Yellow : " + scoreP1;
scoreLabelP2.innerHTML = "Red : " + scoreP2;
scoreLabelDraw.innerHTML = "Draw : " + scoreDraw;

newGame();


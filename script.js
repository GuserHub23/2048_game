// VALUES

var grid, gridElem = document.getElementById("grid");

var touchElem = document.getElementById("touch");

var score = 0, sum = 0,
	scoreElem = document.getElementById("score");

var infoText = document.getElementById("text");

var level = 0,
	levelText = infoText.getElementsByTagName("p")[0],
	levelBar = document.getElementById("bar").getElementsByTagName("div")[0];

var best = {
	score: 0,
	moves: 0
},
	bestElem = infoText.getElementsByTagName("p")[1];

var shareElem = document.getElementById("share");

// NUEVO CODIGO 
var moveCount = 0;
var totalMoveTime = 0;

var averageMoveTime;
var levelTimes = []; // Arreglo para almacenar los tiempos de cada nivel



// GRID FUNCTIONS

function updateGrid() {
	var e, x, y;

	for(y = 0; y < 4; y++) {
		for(x = 0; x < 4; x++) {
			e = gridElem.getElementsByTagName("div")[(y * 4) + x];

			if(grid[y][x] !== -1) {
				e.innerHTML = grid[y][x];
				e.setAttribute("class", "b" + grid[y][x]);
			} else {
				e.innerHTML = "";
				e.setAttribute("class", "bv");
			}
		}
	}
}

function moveGrid(direction) {
	var x, y, dontTouch = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];

	if (gridElem.classList.contains("over")) {
		// El juego está en estado de "game over", no se ejecuta el código de movimientos
		return;
	}
	if(direction === 1) {
		for(y = 3; y >= 0; y--) {
			for(x = 0; x < 4; x++) {
				if(y != 0 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
					if(grid[y - 1][x] === grid[y][x]) {
						addScore(grid[y][x]);
						grid[y][x] = -1;
						grid[y - 1][x] *= 2;
						dontTouch[y-1][x] = 1;
					} else if(grid[y - 1][x] === -1) {
						grid[y - 1][x] = grid[y][x];
						grid[y][x] = -1;
					}
				}
			}
		}
	} else if(direction === 2) {
		for(x = 0; x < 4; x++) {
			for(y = 0; y < 4; y++) {
				if(x != 3 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
					if(grid[y][x + 1] === grid[y][x]) {
						addScore(grid[y][x]);
						grid[y][x] = -1;
						grid[y][x + 1] *= 2;
						dontTouch[y][x+1] = 1;
					} else if(grid[y][x + 1] === -1) {
						grid[y][x + 1] = grid[y][x];
						grid[y][x] = -1;
					}
				}
			}
		}
	} else if(direction === 3) {
		for(x = 3; x >= 0; x--) {
			for(y = 3; y >= 0; y--) {
				if(x != 0 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
					if(grid[y][x - 1] === grid[y][x]) {
						addScore(grid[y][x]);
						grid[y][x] = -1;
						grid[y][x - 1] *= 2;
						dontTouch[y][x-1] = 1;
					} else if(grid[y][x - 1] === -1) {
						grid[y][x - 1] = grid[y][x];
						grid[y][x] = -1;
					}
				}
			}
		}
	} else if(direction === 4) {
		for(y = 0; y < 4; y++) {
			for(x = 3; x >= 0; x--) {
				if(y != 3 && grid[y][x] > 0 && dontTouch[y][x] === 0) {
					if(grid[y + 1][x] === grid[y][x]) {
						addScore(grid[y][x]);
						grid[y][x] = -1;
						grid[y + 1][x] *= 2;
						dontTouch[y+1][x] = 1;
					} else if(grid[y + 1][x] === -1) {
						grid[y + 1][x] = grid[y][x];
						grid[y][x] = -1;
					}
				}
			}
		}
	}
	
	var moveStartTime = performance.now();
	spawnRand();
	updateGrid();
	getScore();	
	var moveEndTime = performance.now();
	var moveTime = moveEndTime - moveStartTime;

	moveCount++;
	totalMoveTime += moveTime;

	averageMoveTime = calculateAverageMoveTime();
	console.log("Promedio de tiempo entre movimientos: " + averageMoveTime + " ms");
	console.log("Cantidad de movimientos: ", moveCount - 1)



}

function calculateAverageMoveTime() {
	if (moveCount > 0) {
		var averageMoveTime = totalMoveTime / moveCount;
		return averageMoveTime.toFixed(2); // Redondea el promedio a 2 decimales
	} else {
		return 0;
	}
}

// SCORE FUNCTIONS

function calcScore(n) {
	if(n === 2)
		return 2;
	else if(n === 4)
		return 5;
	else if(n === 8)
		return 10;
	else if(n === 16)
		return 25;
	else if(n === 32)
		return 50;
	else if(n === 64)
		return 125;
	else if(n === 128)
		return 250;
	else if(n === 256)
		return 500;
	else if(n === 512)
		return 1000;
	else if(n === 1024)
		return 2000;
	else if(n === 2048)
		return 4000;
	else if(n === 4096)
		return 8000;
	else if(n === 8192)
		return 16000;
	else if(n === 16384)
		return 32500;
	else
		return 0;
}

function addScore(block) {
	score += calcScore(block);
}

function getScore() {
	var x, y;

	sum = 0;

	for(y = 0; y < 4; y++) {
		for(x = 0; x < 4; x++) {
			if(grid[y][x] !== -1)
				sum += grid[y][x];
		}
	}

	updateScore();
}

function updateScore() {
	// shareElem.href = "https://twitter.com/home?status=Got%20a%20score%20of%20" + (score + sum) + "%20on%20%232048%20saming.fr/p/2048";

	scoreElem.innerHTML =  (score + sum) + "pts";

	updateBest();

	updateLevel();
}

// LEVEL FUNCTIONS

function getLevelText(lvl) {
	if(lvl === 1) // 4+
		return "Bienvenido Notavo";
	else if(lvl === 2) // 16+
		return "Parece que estas jugando";
	else if(lvl === 3) // 64+
		return "Manten la calma y presiona hacia arriba";
	else if(lvl === 4) // 256+
		return "Está bien para la primera vez, creo...";
	else if(lvl === 5) // 1024+
		return "Mejor que la vez anterior";
	else if(lvl === 6) // 4,096+
		return "Se está poniendo interesante";
	else if(lvl === 7) // 16,384+
		return "Wow!";
	else if(lvl === 8) // 65,536+
		return "¿Me das tu autografo?";
	else if(lvl === 9) // 262,144+
		return "No se supone que veas esto, por favor para";
	else if(lvl === 10) // 1,048,576+
		return "¿Sabías que es ilegal usar supercomputadoras para esto?";
	else
		return "";
}

function updateLevel() {
	level = Math.floor(Math.log(score + sum) / Math.log(4));

	levelTimes[level] = performance.now();


	if(level > 10)
		level = 10;
	if(level < 0)
		level = 0;

	
	var desc = getLevelText(level);
	levelText.innerHTML = "Nivel " + level + (desc === "" ? "" : (" — " + desc));
	levelBar.style.width = (level * 10) + "%";

}
// NUEVO
function printLevelTimes() {
	console.log("Tiempos de cada nivel:");
  
	for (var i = 1; i < levelTimes.length; i++) {
	  console.log("Nivel " + i + ": " + levelTimes[i] + " ms");
	}
	localStorage.setItem("2048LevelTimes", JSON.stringify(levelTimes))
  }

// BEST SCORE FUNCTIONS

function getBest() {
	best = {
		score: localStorage.getItem("2048best") ,
		moves: localStorage.getItem("2048bestMovesCount")
	};
}

function setBest(score, moves) {
	localStorage.setItem("2048best", score);
	localStorage.setItem("2048bestMovesCount", moves)
	localStorage.setItem("2048AverageMoveTime", averageMoveTime)
	best = {
		score: score,
		moves: moves
	};
}

function updateBest() {
	if(best.score < (score + sum) || best.score === (score + sum) && best.moves < moveCount) {
		setBest(score + sum, moveCount + 1);
	}
	bestElem.innerHTML = "Record: " + best.score + "pts";
}

// GAME OVER FUNCTIONS

function gameOver() {
	gridElem.setAttribute("class", "over");
	console.log("GAME OVER");
	printLevelTimes(); // Imprimir los tiempos de cada nivel
    document.getElementById("movimientos").innerHTML="cantidad de movimientos: " + moveCount
	console.log("PROMEDIO DE TIEMPO ENTRE MOVIMIENTOS POST GAME OVER: ", averageMoveTime , " ms")

}

// UTIL FUNCTIONS

function keyPress(code) {
	if(code === 37 || code === 74)
		moveGrid(3); // left
	else if(code === 38 || code === 73)
		moveGrid(1); // up
	else if(code === 39 || code === 76)
		moveGrid(2); // right
	else if(code === 40 || code === 75)
		moveGrid(4); // down
	else if(code === 13)
		init(); // reinit
}

function spawnRand() {
	var x, y, possibles = [];

	for(y = 0; y < 4; y++) {
		for(x = 0; x < 4; x++) {
			if(grid[y][x] === -1)
				possibles.push([x, y]);
		}
	}

	if(possibles.length) {
		var randomValue = (Math.floor(Math.random() * 9) === 8 ? 4 : 2),
			randomBlock = possibles[(Math.floor(Math.random() * possibles.length))],
			x = randomBlock[0],
			y = randomBlock[1];

		grid[y][x] = randomValue;
	} else {
		if(!checkMovable()) {
			gameOver();
		}
	}
}

function checkMovable() {
	for(y = 0; y < 4; y++) {
		for(x = 0; x < 4; x++) {
			if( (grid[y + 1] !== undefined && grid[y + 1][x] === grid[y][x]) || (grid[y][x + 1] !== undefined && grid[y][x + 1] === grid[y][x]) )
				return true;
		}
	}

	return false;
}

// INIT FUNCTIONS

function initScore() {
	score = 0, sum = 0;

	updateScore();
}

function initBest() {
	if(localStorage.getItem("2048best") === undefined)
		setBest(0, 0);

	getBest();
}

function initGrid() {
	grid = [[-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1]];

	spawnRand();
	spawnRand();

	updateGrid();
}

function init() {
	gridElem.removeAttribute("class");

	initScore();
	initBest();
	initGrid();

	moveCount = 0;
	totalMoveTime = 0;
}

// INITIAL SETUP

document.onkeydown = function(e) { keyPress(e.keyCode); }

document.getElementsByTagName("header")[0].getElementsByTagName("a")[0].onclick = init;

touchElem.getElementsByTagName("div")[0].onclick = function() { moveGrid(1); }
touchElem.getElementsByTagName("div")[1].onclick = function() { moveGrid(3); }
touchElem.getElementsByTagName("div")[2].onclick = function() { moveGrid(2); }
touchElem.getElementsByTagName("div")[3].onclick = function() { moveGrid(4); }

initGrid();
initBest();
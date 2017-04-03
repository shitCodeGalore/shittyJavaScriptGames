var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var squareHeight = 50;
var squareWidth = 50;
var squareX = (canvas.width-squareWidth)/2;
var squareY = (canvas.height-squareHeight)/2;
var upPressed = false;
var downPressed = false;
var rightPressed = false;
var leftPressed = false;
var speedFactor = 1;
var squareSpeed = 6;
var frameNumber = 0;
var scoreNumber = 0;
var levelCounter = 0;


var interval;

var gameOver = false;
var newGame = false;

$(document).ready( function() {
	"use strict";

	// Simulates "game over" when a score would be sent
	$("#submit_score").click( function ()
	{
		var msg =
		{
			"messageType": "SCORE",
			"score": parseFloat($("#score").text())
		};
		window.parent.postMessage(msg, "*");
	});

	// Sends this game's state to the service.
	// The format of the game state is decided
	// by the game
	$("#save").click( function ()
	{
		var msg =
		{
			"messageType": "SAVE",
			"gameState":
			{
				"playerItems": playerItems,
				"score": parseFloat($("#score").text())
			}
		};
		window.parent.postMessage(msg, "*");
	});

	// Sends a request to the service for a
	// state to be sent, if there is one.
	$("#load").click( function ()
	{
		var msg =
		{
			"messageType": "LOAD_REQUEST",
		};
		window.parent.postMessage(msg, "*");
	});

	// Listen incoming messages, if the messageType
	// is LOAD then the game state will be loaded.
	// Note that no checking is done, whether the
	// gameState in the incoming message contains
	// correct information.
	//
	// Also handles any errors that the service
	// wants to send (displays them as an alert).
	window.addEventListener("message", function(evt)
	{
		if(evt.data.messageType === "LOAD")
		{
			playerItems = evt.data.gameState.playerItems;
			points = evt.data.gameState.score;
			$("#score").text(points);
			updateItems();
		}
		else if (evt.data.messageType === "ERROR")
		{
			alert(evt.data.info);
		}
	});


	// Request the service to set the resolution of the
	// iframe correspondingly
	var message =
	{
		messageType: "SETTING",
		options:
		{
			"width": 700, //Integer
			"height": 300 //Integer
		}
	};
	window.parent.postMessage(message, "*");

});

function component(width, height, color, x, y)
{
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	ctx.fillStyle = color;
	ctx.fillRect(this.x, this.y, this.width, this.height);
	this.update = function()
	{
		ctx.font = this.width + " " + this.height;
		ctx.fillStyle = color;
		ctx.fillText(this.text, this.x, this.y);
	}
}



function keyDownHandler(e)
{
	if(e.keyCode == 87 || e.keyCode == 38)
	{
		upPressed = true;
	}
	else if(e.keyCode == 65 || e.keyCode == 37)
	{
		leftPressed = true;
	}
	else if(e.keyCode == 83 || e.keyCode == 40)
	{
		downPressed = true;
	}
	else if(e.keyCode == 68 || e.keyCode == 39)
	{
		rightPressed = true;
	}
}
function keyUpHandler(e) {
	if(e.keyCode == 87 || e.keyCode == 38)
	{
		upPressed = false;
	}
	else if(e.keyCode == 65 || e.keyCode == 37)
	{
		leftPressed = false;
	}
	else if(e.keyCode == 83 || e.keyCode == 40)
	{
		downPressed = false;
	}
	else if(e.keyCode == 68 || e.keyCode == 39)
	{
		rightPressed = false;
	}
}

function drawBall()
{
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#4169E1";
	ctx.fill();
	ctx.closePath();
}


function drawSquare()
{
	ctx.beginPath();
	ctx.rect(squareX, squareY, squareWidth, squareHeight);
	ctx.fillStyle = "#B22222";
	ctx.fill();
	ctx.closePath();
}

function draw()
{
	frameNumber += 1;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawSquare();

	if(x + dx > canvas.width-ballRadius || x + dx < ballRadius)
	{
		dx = -dx;
	}
	if(y + dy > canvas.height-ballRadius || y + dy < ballRadius)
	{
		dy = -dy;
	}

	if(rightPressed && squareX < canvas.width-squareWidth)
	{
		squareX += squareSpeed;
	}
	else if(leftPressed && squareX > 0)
	{
		squareX -= squareSpeed;
	}
	else if(downPressed && squareY < canvas.height-squareHeight)
	{
		squareY += squareSpeed;
	}
	else if(upPressed && squareY > 0)
	{
		squareY -= squareSpeed;
	}

	x += dx*speedFactor;
	y += dy*speedFactor;



	if(( x > squareX && x < squareX + squareWidth ))
	{
		if(( y > squareY && y < squareY + squareHeight ))
		{
			//document.location.reload();
			pauseGame();
		}

	}
	if (frameNumber > 100)
	{
		scoreNumber += 1;
		frameNumber = 0;
		levelCounter += 1;
	}

	$("#score").text(scoreNumber);

	if (levelCounter > 5)
	{
		speedFactor *= 1.1;
		levelCounter = 0;
	}
}


function startNewGame()
{
	ballRadius = 25;
	x = canvas.width/2;
	y = canvas.height-30;
	dx = 2;
	dy = -2;
	squareHeight = 50;
	squareWidth = 50;
	squareX = (canvas.width-squareWidth)/2;
	squareY = (canvas.height-squareHeight)/2;
	upPressed = false;
	downPressed = false;
	rightPressed = false;
	leftPressed = false;
	speedFactor = 1;
	squareSpeed = 6;
	frameNumber = 0;
	scoreNumber = 0;
	levelCounter = 0;
	interval;

	myScore = new component("30px", "Consolas", "black", 280, 40, "text");
	var startTime = performance.now();


	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	interval = setInterval(draw, 10);
}

function pauseGame()
{
	clearInterval(interval);
}


startNewGame();

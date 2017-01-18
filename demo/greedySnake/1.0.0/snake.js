// 遇到的问题：indexOf方法对于数组中找数组是无效的，即传参不能为Array类型
// 核心,蛇的身长增加是td块的颜色变化
var tds = document.querySelectorAll(".game table td");
var towards = "right"; //方向
var snake = [[1, 0], [2, 0], [3, 0]]; //snake 存储的是二维数组
var foodCount = 0;
var score = 0;
var food = [];
var showScore = document.querySelector(".score");
// 将方向按键暂时存储起来,防止3节的时候一通乱按会出错(向下走，左上右会撞到)
var tempTowards = [];

for (var i = 0; i < tds.length; i++) {
	//坐标从(0, 0)到(19, 19) 
	tds[i].x = i % 20; //x轴坐标
	tds[i].y = Math.floor(i / 20); //y坐标
	// tds[i].onclick = function(){
	// 	console.log("(x, y): (" + this.x + ", " + this.y + ")");
	// 	console.log(2);
	// }
}

//渲染蛇
function renderSnake(){
	for (var i = 0; i < tds.length; i++) {
		tds[i].className = "";
	}
	for (var i = 0; i < snake.length; i++) {
		var aBodyTd = getTd(snake[i][0], snake[i][1]);
		aBodyTd.className = "snake-body";
	}
	 // 渲染头部
	var temp = document.querySelectorAll("#snakeHead");
	if (temp.length) {
		for (var i = 0; i < temp.length; i++) {
			temp[i].id = "";
		}
	}
	var snakeHeadPosition = snake[snake.length-1]; 
	getTd(snakeHeadPosition[0], snakeHeadPosition[1]).id = "snakeHead";
}
// 传入坐标，返回坐标对应的一个td
function getTd(x, y) {
	var index = y * 20 + x;
	return tds[index];
}
// // 获得方向
// function getTowards(){
// 	var result = "right";
// 	return result;
// }

// 根据蛇头方向获得下个td的坐标,返回数组[x, y]
function getNextPosition(x, y, t){
	var nextX, nextY;
	switch (t) {
		case "up": 
		nextX = x;
		nextY = y - 1;
		break;
		case "down":
		nextX = x;
		nextY = y + 1;
		break;
		case "left":
		nextX = x - 1;
		nextY = y;
		break;
		case "right":
		nextX = x + 1;
		nextY = y;
		break;
		default: ;
	}
	return [nextX, nextY];
}

// 获取蛇头，返回[x, y]
function getSnakeHead(t) {
	// console.log(snake)
	var r = [];
	r.push(snake[snake.length - 1][0]);
	r.push(snake[snake.length - 1][1]);
	return r;
}

// 判断是否有墙,传入蛇头坐标与方向,x, y, t
function judgeWall(x, y, t){
	var nextX = getNextPosition(x, y, t)[0];
	// console.log(nextX);
	var nextY = getNextPosition(x, y, t)[1];
	if ((nextX >= 0 && nextX <= 19) && (nextY >= 0 && nextY <= 19)) {
		return false;
	} else {
		return true;
	}
}
// 判断是否有自己身体
function judgeBody(x, y, t){
	var nextX = getNextPosition(x, y, t)[0];
	var nextY = getNextPosition(x, y, t)[1];
	if (getTd(nextX, nextY).className == "snake-body") {
		return true;
	} else {
		return false;
	}
}

// 判断是否有食物
function judgeFood(x, y, t) {
	var nextX = getNextPosition(x, y, t)[0];
	var nextY = getNextPosition(x, y, t)[1];
	if (getTd(nextX, nextY).id == "food") {
		return true;
	} else {
		return false;
	}
}

function gameOver(){
	alert("你输了！");
	clearInterval(runIntervalId);
}

//向前跑！
function move(t){
	var oldHead = getSnakeHead(t);
	var newHead = [];
	newHead = getNextPosition(oldHead[0], oldHead[1], t);
	snake.shift();
	snake.push(newHead);
	renderSnake();
}
// 产生一个食物
function makeFood(){
	var temp = Math.random() * 20; // temp 值为[0, 20)
var x = Math.floor(Math.random() * 20);
var y = Math.floor(Math.random() * 20);
// console.log(snake);
food  = [x, y];
// console.log("第一次食物坐标" + food[0] + food[1]);
	// console.log(foodPosition)
	//若产生的食物坐标是蛇身体，则重新产生
	// 由于index不能数组找数组,所以转换为字符串查找
	while (snake.join("").indexOf(food.join("")) != -1) {
		food = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
	}
	// console.log("最终的食物坐标" + food[0] + food[1]);
	getTd(food[0], food[1]).id = "food";
	foodCount++;
}

function action(t){
	var head = getSnakeHead(t);
	var flag = 0; //看撞墙，吃食物，或者正常前进的状态
	//看是否撞墙撞身体
	if (judgeWall(head[0], head[1], t) || judgeBody(head[0], head[1], t)) {
		flag = 1;
		gameOver();
		return;
	}
	// 看是否有食物,若有食物则不move了，只需要重新渲染蛇等
	if (judgeFood(head[0], head[1], t)) {
		flag = 2;
		getTd(food[0], food[1]).id = ""; //食物消失
		foodCount--;
		score++;//加分数
		showScore.innerHTML = "分数是:" + score;
		snake.push([food[0], food[1]]);
		renderSnake(); //重新渲染蛇
		makeFood();
	}
	// 既没有撞墙也没有食物，则move
	if (flag == 0) {
		move(t);
	}
}

function changeTowards(){
	//若按了方向键,则改变方向
	if (tempTowards) {
		var t = tempTowards[tempTowards.length-1];

		switch(towards) {
			case "left":
			if (t == "up" || t == "down") {
				towards = t;
			}
			break;
			case "right":
			if (t == "up" || t == "down") {
				towards = t;
			}
			break;
			case "up":
			if (t == "left" || t == "right") {
				towards = t;
			}
			break;
			case "down":
			if (t == "left" || t == "right") {
				towards = t;
			}
			break;
			default: ;
		}
	}
}
// 监听按键,然后改变方向
document.body.onkeyup = function(event) {
	var tempEvent = window.event || event;
	switch (tempEvent.keyCode) {
		case 37: 
		tempTowards.push("left");
		break;
		case 38: 
		tempTowards.push("up");
		break;
		case 39: 
		tempTowards.push("right");
		break;
		case 40: 
		tempTowards.push("down");
		break;
		default: ;
	}
}
// 初始化
renderSnake();
makeFood();
// 循环
var runIntervalId = setInterval(function(){
	//更新方向
	changeTowards();
	action(towards);
}, 300);

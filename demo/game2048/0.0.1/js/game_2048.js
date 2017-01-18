/**
 * @Description 
 * @Author giovanni
 * @Date 2017年1月12日 12:54
 reset 清空数据 
 init 用一个二维数组存放item对象 或者null(没有item)
 init 二维数组随机出两个数据item
 根据二维数组来生成 item 和 dom
 item 是对象， 有它自己的color value  背景色
一个对象 存放样式
最终根据存储的样式 + className来渲染
*/
// 矩阵存放数据,dom从这拿
var matrix;
// 计分器
var score = 0;
// 游戏是否结束
var gameOverState = false;
// 进度  用于撤销 保存一个 带有二维数组属性和分数的object
var progressList = [];

//dom
var matrixPanel = document.querySelector(".data-item-wrap");
var gameScore = document.querySelector("#game-score");
var gameOverMask = document.querySelector("#gameOver-mask");
var tryAgainBtn = document.querySelector(".gameOver-mask-tryAgain");


function Game() {
	if (!(this instanceof Game)) {
		return new Game();
	}
	this.init();
}
// 保存进度
Game.prototype.saveProgress = function() {
	var tmp_matrix = Utils.deepClone(matrix);
	var obj = {
		matrix: tmp_matrix,
		score: score
	};
	progressList.push(obj);
};

Game.prototype.init = function() {
	matrix = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
	this.generateANumber();
	this.generateANumber();
	score = 0;
	gameOverState = false;
	this.saveProgress();
	this.resetRender();
	this.render();
	// 监听
	this.watchDirection();
};
// 在随机的数据空白格增加一个2或者4
Game.prototype.generateANumber = function() {
		var number = Math.random() > 0.25 ? 2 : 4;
		// 存储每个空白格的坐标
		var storeCoord = [];
		var len;

		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix[i].length; j++) {
				matrix[i][j] === 0 ? storeCoord.push({
					x: i,
					y: j
				}) : false;
			}
		}
		len = storeCoord.length;
		var tmp = Math.floor(Math.random() * len),
			x = storeCoord[tmp].x;
		y = storeCoord[tmp].y;
		matrix[x][y] = number;
	}
	// 撤销
Game.prototype.undo = function() {
		if (progressList.length <= 1) {
			return;
		}
		progressList.pop();
		var obj = progressList.slice(-1);
		matrix = Utils.deepClone(obj[0].matrix);
		score = obj[0].score;
		// 变为未结束
		gameOverState = false;
	}
	// 往右移动 计分 记录是否移动
Game.prototype.pushRight = function(matrix) {
	var obj = Utils.arrayPushRight(matrix);
	var isMoved = obj.isMoved;

	// 计分
	score += obj.mergeScore;

	return {
		matrix: matrix,
		isMoved: isMoved
	};
}

Game.prototype.judgeGameOver = function() {
	var noSpace = true;
	var allDifferent = true;
	// 空白格
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] === 0) {
				noSpace = false;
			}
		}
	}
	// 横着比较
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length - 1; j++) {
			if (matrix[i][j] === matrix[i][j + 1]) {
				allDifferent = false;
			}
		}
	}
	// 竖着比较
	for (var i = 0; i < matrix.length - 1; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] === matrix[i + 1][j]) {
				allDifferent = false;
			}
		}
	}
	// console.log(`noSpace is ${noSpace}, allDifferent is ${allDifferent}`)
	if (noSpace && allDifferent) {
		return true;
	}
	return false;
}
Game.prototype.move = function(position) {
	// 若游戏已经结束，则返回
	if (gameOverState) {
		return;
	}
	// 若游戏暂未结束，则判断现在是否结束
	if (this.judgeGameOver()) {
		gameOverState = true;
		this.render();
		// alert("游戏结束！");
		return;
	}
	var tmp_matrix,
		isMoved,
		self = this,
		// 暂存
		obj;
	switch (position) {
		case "up":
			// 旋转
			tmp_matrix = Utils.rotateArray(matrix);
			// 移动
			obj = self.pushRight(tmp_matrix);
			isMoved = obj.isMoved;
			// 反旋转
			tmp_matrix = Utils.rotateArray(tmp_matrix);
			tmp_matrix = Utils.rotateArray(tmp_matrix);
			tmp_matrix = Utils.rotateArray(tmp_matrix);
			break;
		case "right":
			tmp_matrix = matrix;
			obj = self.pushRight(tmp_matrix);
			isMoved = obj.isMoved;
			break;
		case "down":
			// 旋转
			tmp_matrix = Utils.rotateArray(matrix);
			tmp_matrix = Utils.rotateArray(tmp_matrix);
			tmp_matrix = Utils.rotateArray(tmp_matrix);
			// 移动
			obj = self.pushRight(tmp_matrix);
			isMoved = obj.isMoved;
			// 反旋转
			tmp_matrix = Utils.rotateArray(tmp_matrix);
			break;
		case "left":
			// 旋转
			tmp_matrix = Utils.rotateArray(matrix);
			tmp_matrix = Utils.rotateArray(tmp_matrix);
			// 移动
			obj = self.pushRight(tmp_matrix);
			isMoved = obj.isMoved;
			// 反旋转
			tmp_matrix = Utils.rotateArray(tmp_matrix);
			tmp_matrix = Utils.rotateArray(tmp_matrix);
			break;
	};
	// 若移动，则产生新数字，并且记录到进度
	if (isMoved) {
		matrix = tmp_matrix;
		self.generateANumber();
		self.saveProgress();
		self.resetRender();
		self.render();
	}
};

Game.prototype.resetRender = function() {
		matrixPanel.innerHTML = "";
		gameScore.innerHTML = 0;
		gameOverMask.style.display = "none";
	}
	// 根据数据渲染dom
Game.prototype.render = function() {
		var self = this;
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix[i].length; j++) {
				// 需要根据二维数组的i j 值来生成pos_class!
				// 若有
				if (matrix[i][j] !== 0) {
					var div = document.createElement("div");
					var text = matrix[i][j];

					div.className = "data-item";
					div.className += " item_value_" + text;
					div.className += " item_pos_" + i + "_" + j;
					div.innerHTML = text;
					matrixPanel.appendChild(div);
				}
			}
		}
		// 渲染分数
		gameScore.innerHTML = score;
		// gameover
		if (gameOverState) {
			gameOverMask.style.display = "block";
		} else {
			gameOverMask.style.display = "none";
		}
	}
	// 根据手势 获取方向   number 左 上 右 下  37~40
Game.prototype.watchDirection = function() {
	var self = this;
	// touch暂存
	var touchX;
	var touchY;
	// pc键盘监听
	document.body.addEventListener("keydown", function(e) {
		var keyCode = e.keyCode;
		switch (keyCode) {
			case 37:
				self.move("left");
				break;
			case 38:
				self.move("up");
				break;
			case 39:
				self.move("right");
				break;
			case 40:
				self.move("down");
				break;
		}
		if (keyCode >= 37 && keyCode <= 40) {
			e.preventDefault();
		}
	}, false);
	// 移动端touch监听
	matrixPanel.addEventListener("touchstart", function(e) {
		touchX = e.touches[0].pageX;
		touchY = e.touches[0].pageY;
		// alert(`touchX is ${touchX},touchY is ${touchY}`);
		e.preventDefault();
	}, false);
	matrixPanel.addEventListener("touchend", function(e) {
		var offsetX = e.changedTouches[0].pageX - touchX;
		var offsetY = e.changedTouches[0].pageY - touchY;
		var towards;

		if (Math.abs(offsetX) < 3 || Math.abs(offsetY) < 3) {
			return;
		}
		// 获取手指移动的方向  根据偏移量来计算
		if (offsetX > 0 && Math.abs(offsetX) > Math.abs(offsetY)) {
			towards = "right";
		} else if (offsetX < 0 && Math.abs(offsetX) > Math.abs(offsetY)) {
			towards = "left";
		} else if (offsetY > 0 && Math.abs(offsetY) > Math.abs(offsetX)) {
			towards = "down";
		} else {
			towards = "up";
		}

		// alert(`towards is ${towards}`);
		self.move(towards);
		e.preventDefault();
	}, false);

	// 撤销按钮
	document.getElementById("game-undo-btn").onclick = function() {
		self.undo();
		self.resetRender();
		self.render();
	};
	// 再来一次 相当于init
	tryAgainBtn.onclick = function() {
		self.init();
	}
}

var g = new Game();
Utils.printMatrix(matrix);
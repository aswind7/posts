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

// 最多16个
var MAX_ITEM_COUNT = 16;
var MAX_NUMBER = 2048;
var MIN_NUMBER = 2;
// itemStore存放数据,dom从这拿
var itemStore = [
[null, null, null, null],
[null, null, null, null],
[null, null, null, null],
[null, null, null, null]
];
var style = {
	// positionData: {},
	// valueData: {},
	positionClassNames: [],
	valueClassNames: []
};
// hash记录一下面板中已有的class防止重叠
var log_class = {
	val: {},
	pos: {}
};
// 跑动方向
var direction = -1;
// dom 
var itemPanel = document.querySelector(".data-item-wrap");



// 工具包
var Utils = {};
// 获取 2到2048的数字数组
Utils.getAllNumberArray = function(MIN_NUMBER, MAX_NUMBER) {
	var arr = [],
	now = MIN_NUMBER;

	while (now <= MAX_NUMBER) {
		arr.push(now);
		now *= 2;
	}
	return arr;
};
// 顺时针旋转二维数组90度 并返回新的数组 不影响原有
Utils.rotateArray = function(array) {
	var i = array.length;
	var j = array[0].length;
	var arr = new Array(j);

	for (var h = 0; h < arr.length; h++) {
		arr[h] = [];
	}

	for (var m = 0; m < i; m++) {
		for (var k = 0; k < j; k++) {
			arr[k].unshift(array[m][k]);
		}
	}
	return arr;
}
// 逆时针旋转二维数组90度 并返回新的数组 不影响原有
Utils.counterRotateArray = function(array) {
	// array为i行j列的二维数组 转换为j行i列
	var i = array.length;
	var j = array[0].length;
	var arr = new Array(j);
	for (var t = 0; t < arr.length; t++) {
		arr[t] = new Array(i);
	}
	// 赋值
	for (var m = 0; m < i; m++) {
		for (var n = 0; n < j; n++) {
			// m行n列的数字赋值给 j-1-n行m列
			arr[j-1-n][m] = array[m][n];
		}
	}
	return arr;
}
// 传入arrary 传出新的向右推完的arr 不影响原有数组
Utils.arrayPushRight = function(array) {
	var arr = array;
	var merge_index = -1;
	var t;
	// 消除0
	for (var i = arr.length - 2; i >= 0; i--) {
		var k = i;
		while(arr[k+1] === 0 && k <= arr.length - 2) {
			arr[k+1] = arr[k];
			arr[k] = 0;
			k++;
		}
	}
	// 合并
	for (var i = arr.length - 2; i >= 0; i--) {
		if (arr[i] === arr[i+1]) {
			arr[i+1] *= 2;
			arr[i] = 0;
		}
	}
	// 再次消除0
	for (var i = arr.length - 2; i >= 0; i--) {
		var k = i;
		while(arr[k+1] === 0 && k <= arr.length - 2) {
			arr[k+1] = arr[k];
			arr[k] = 0;
			k++;
		}
	}
	return arr;
}
/**
 * @Description 传入style对象 传出style对象
 * @Author giovanni
 * @param [object] 
 * @return [object] 
 */
 Utils.generateStyle = function(style) {
 	var count = MAX_ITEM_COUNT;
 	var pos_class = "";
 	var value_class = "";
 	style.positionClassNames = [];
 	style.valueClassNames = [];
 	var allNumberArr = Utils.getAllNumberArray(2, 2048);
	// 位置class 
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			pos_class = "item_pos_" + i + "_" + j;
			style.positionClassNames.push(pos_class);
		}
	}
	// 数值class
	for (var i = 0; i < allNumberArr.length; i++) {
		value_class = "item_value_" + allNumberArr[i];
		style.valueClassNames.push(value_class);
	}
	return style;
};



function Game() {
	if (!(this instanceof Game)) {
		return new Game();
	}
	this.init();
}

Game.prototype.init = function() {
	var self = this;
	var pos;
	var val;
	var num;
	var pos_x;
	var pos_y;
		// 生成2个
		pos = self.getRandomPositionClass();
		pos_x = pos.replace("item_pos_", "").substr(0, 1);
		pos_y = pos.replace("item_pos_", "").substr(2, 1);
		val = self.getRandomValueClass();
		num = parseInt(val.replace("item_value_"), "");
		itemStore[pos_x][pos_y] = {
			number: num,
			valueClassName: val,
			positionClassName: pos
		};
		// 记录，防冲突(只防止位置，数字可以相同)
		log_class.pos[pos] = true;
		// 当冲突时则循环
		do {
			pos = self.getRandomPositionClass();
			pos_x = pos.replace("item_pos_", "").substr(0, 1);
			pos_y = pos.replace("item_pos_", "").substr(2, 1);
			val = self.getRandomValueClass();
			num = parseInt(val.replace("item_value_"), "");
		} while (log_class.pos[pos]);
		log_class.pos[pos] = true;

		itemStore[pos_x][pos_y] = {
			number: num,
			valueClassName: val,
			positionClassName: pos
		};
		this.render();
		this.watchDirection();
	}
	// 根据数据渲染dom
	Game.prototype.render = function() {
		var self = this;
		for (var i = 0; i < itemStore.length; i++) {
			for (var j = 0; j < itemStore[i].length; j++) {
				// 需要根据二维数组的i j 值来生成pos_class!
				// 若有对象
				if (itemStore[i][j]) {
					self.makeItemDOM(itemStore[i][j]);
				}
			}
		}

	}
	// 根据obj生成div 背景色 文本 位置 并且append到panel
	Game.prototype.makeItemDOM = function(obj) {
		var div = document.createElement("div");
		var text = obj.valueClassName.replace("item_value_", "");

		div.className = "data-item";
	// 值
	div.className += " " + obj.valueClassName;
	// pos
	div.className += " " + obj.positionClassName;
	// 文本
	div.innerHTML = text;

	itemPanel.appendChild(div);
}

// 获取一个随机数 的 class
Game.prototype.getRandomValueClass = function() {
	// 2~16之间  即index在0~3之间 
	var index = Math.round(Math.random() * 3);
	var number = Utils.getAllNumberArray(MIN_NUMBER, MAX_NUMBER)[index];
	var className = "item_value_" + number;
	return className;
}

// 获取一个随机位置 的 class
Game.prototype.getRandomPositionClass = function() {
		// 0~3 之间 随机两次
		var i = Math.round(Math.random() * 3);
		var j = Math.round(Math.random() * 3);
		var className = "item_pos_" + i + "_" + j;
		return className;
	}
	// 根据手势 获取方向   number 1左 2上 3右 4下  37~40
	Game.prototype.watchDirection = function() {
		var self = this;
	// pc键盘监听
	document.body.addEventListener("keyup", function(e) {
		var keyCode = e.keyCode,
		d = keyCode - 36;
	}, false);
}

var g = new Game();




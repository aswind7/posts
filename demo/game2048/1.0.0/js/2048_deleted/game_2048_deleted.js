	// item数组数据变动
	Game.prototype.changeData = function(directionId) {
	// 一维数组 
	// 数组中的一项 此项在数组中的索引 数组本身 
	// 跑动方向 "up" "down" "left" "right" 只需左右！
	// 数组中的对象经过计算后 改变这个数组
	function traverse(nowIndex, arr, direction) {
		// return [1,2,3];
		var maxIndex = arr.length - 1;
		var item = arr[nowIndex];

		// console.log(item);
		// 超出界限
		if (item === undefined || nowIndex < 0) {
			return;
		}
		if (direction === "right") {
			if (item === null) {
				nowIndex--;
				traverse(nowIndex, arr, direction);
				return;
			}
			// 看此元素是否会与元素汇合
			var tmp_flag = false;
			for (var i = nowIndex + 1; i <= maxIndex; i++) {
				if (i === maxIndex && !tmp_flag) {
					// 前方没有元素
					arr[maxIndex] = item;
					arr[nowIndex] = null;
					nowIndex--;
					traverse(nowIndex, arr, direction);
					return;
				}
				if (arr[i]) {
					console.log("合");
					tmp_flag = true;
					if (arr[i].number === item.number) {
					console.log("合并");
					} else {
						console.log("不合并");
					}
				}


			}
		}
	}
	// 向右 则 从上到下 运行左右跑 四次
	for (var i = 0; i < 4; i++) {
		var nowIndex = 3;
		var arr = itemStore[i];
		var direction = "right";
		// console.log("遍历前arr");
		// console.log( arr);
		// 更新数组
		traverse(nowIndex, arr, direction);
		itemStore[i] = arr;
		// console.log("遍历后arr");
		// console.log(itemStore[i]);
	}
	// console.log(222);
}
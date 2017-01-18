// 工具包
var Utils = {};

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
	// 传入array  会影响原有数组 
	//  return 是否移动 和 合并的分数
	Utils.arrayPushRight = function(array) {
		var isMoved = false;
		var mergeScore = 0;

		for (var r = 0; r < array.length; r++) {
			arr = array[r];
		// 消除0
		for (var i = arr.length - 2; i >= 0; i--) {
			var k = i;
			while (arr[k + 1] === 0 && arr[k] !== 0 && k <= arr.length - 2) {
				arr[k + 1] = arr[k];
				arr[k] = 0;
				k++;
				isMoved = true;
			}
		}
		// 合并
		for (var i = arr.length - 2; i >= 0; i--) {
			if (arr[i] === arr[i + 1] && arr[i] !== 0) {
				arr[i + 1] *= 2;
				arr[i] = 0;
				mergeScore += arr[i + 1];
				isMoved = true;
			}
		}
		// 再次消除0
		for (var i = arr.length - 2; i >= 0; i--) {
			var k = i;
			while (arr[k + 1] === 0 && arr[k] !== 0 && k <= arr.length - 2) {
				arr[k + 1] = arr[k];
				arr[k] = 0;
				k++;
				isMoved = true;
			}
		}
	}
	return {
		isMoved: isMoved,
		mergeScore: mergeScore
	};
};
	// 比较两个二维数组是否完全相同
	Utils.isSameMatrix = function(a, b) {
		if (a.length !== b.length) {
			return false;
		}
		for (var i = 0; i < a.length; i++) {
			if (a[i].length !== b[i].length) {
				return false;
			}
			if (a[i].toString() !== b[i].toString()) {
				return false;
			}
		}
		console.log("a is the same as b")
		return true;
	}
	// 深拷贝 并返回一个拷贝
	Utils.deepClone = function(param) {
	// 数字或者字符串 简单类型
	if ((typeof param) !== "object") {
		return param;
	}
	if (Array.isArray(param)) {
		var arr = [];
		for (var i in param) {
			arr[i] = arguments.callee(param[i]);
		}
		return arr;
	}
	if (typeof param === "object") {
		var obj = {};
		for (var i in param) {
			obj[i] = arguments.callee(param[i]);
		}
		return obj;
	}
}
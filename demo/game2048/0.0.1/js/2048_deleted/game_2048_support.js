// 实现一个方向的移动，然后其他三个方向通过旋转 -> 移动 -> 反旋转 来实现
// 基本算法 向右 
// 先向右移动（交换0 到一边）    然后相邻的合并    合并完了之后再移动去除0(因为中间可能会有合并之后产生的0)
[2,2,2,4] -> [0,2,4,4]
[2,2,2,2] -> [0,0,4,4]


/* 
从倒数第二项开始
此项 与此项右边的比较 若此项右边为0 则交换，一直到倒数第二项

若此项右边不为0 且与此项不同  则不做任何操作

若此项右边不为0 且与此项相同 则合并：
此项变为0 此项右边变为2倍。 
并记录下合并的位置坐标，其他数字不能与此数比较，只能放在左边。
合并的坐标 会随着合并过的数字的移动而移动
*/

// 传入arr 传出新的向右推完的arr
function arrayPush(array) {
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


// 顺时针旋转90度 
// 传入i 行 j 列的数组  必须是二维数组
[[1,2,3],
[4,5,6]]
// 新的
[[4,1],
[5,2],
[6,3]]
// 
function rotateArray(array) {
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

var a = [
[1,2,3],
[4,5,6]
];
printMatrix(rotateArray(a));

function printMatrix(arr) {
	for (var i = 0; i < arr.length; i++) {
		console.log(arr[i]);
	}
}






// 逆时针90度
function convert(array) {
	// array为i行j列的二维数组 转换为j行i列
	var i = array.length;
	var j = array[0].length;

	var arr = new Array(j);
	for (var t = 0; t < arr.length; t++) {
		arr[t] = new Array(i);
		// arr[t] = [];
	}

	// 赋值
	for (var m = 0; m < i; m++) {
		for (var n = 0; n < j; n++) {
			// m行n列的数字赋值给 j-1-n行m列
			arr[j-1-n][m] = array[m][n];
			// console.log(array[m][n]);
			// console.log(array[m][n]);
		}
	}
	return arr;
}

var a1 = [[1,2,3],
		  [4,5,6]];
printMatrix(convert(a1));
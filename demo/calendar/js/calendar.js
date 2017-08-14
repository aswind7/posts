/**
 * @Description 主入口
 * @Author giovanni
 * @Date 2016年7月27日 16:37
 */
window.onload = function() {
	var dom = document.getElementById("calendar");
	var panelDOM = document.getElementsByClassName("calendar-box")[0];
	var c1 = new Calendar(dom);
	c1.panelDOM = panelDOM;
	c1.init();
	c1.bindEvent();
};

/**
 * @Description 库函数
 * @Author giovanni
 * @Date 2016年7月27日 16:37
 */
var calendarLibrary = {};

calendarLibrary.getWeekday = function(date) {
	// date是个Date对象
	switch (date.getDay()) {
		case 0:
			return "星期日";
		case 1:
			return "星期一";
		case 2:
			return "星期二";
		case 3:
			return "星期三";
		case 4:
			return "星期四";
		case 5:
			return "星期五";
		case 6:
			return "星期六";
	}
}

calendarLibrary.getDateFromInput = function(words) {
	var arr = [];
	arr = words.match(/([0-9]{4})-([0-9]+)-([0-9]+)/);
	if (!arr || arr.length !== 4) {
		return "格式错误";
	} else if (arr[1] > 3000 || arr[1] < 1000 || arr[2] < 1 || arr[2] > 12 || arr[3] < 1 || arr[3] > 31) {
		return "格式错误";
	} else {
		return {
			year: arr[1],
			month: arr[2],
			day: arr[3]
		}
	}
}

// 按照国内的方式，周日在最后
calendarLibrary.renderTable = function(nowYear, nowMonth, panelDOM) {
	// 渲染表格,先获取此月的第一天是周几,注意月数减一
	var d = new Date(nowYear, nowMonth - 1, 1);
	var weekdayNumber = d.getDay() === 0 ? 7 : d.getDay();
	// 获取这个月的天数
	var amountOfDays = (new Date(nowYear, nowMonth, 0)).getDate();
	var daysArray = [];
	var tdsArray = panelDOM.querySelectorAll("tbody td");
	// 把表格清空,重置
	tdsArray.forEach(function(elem) {
		elem.innerHTML = "";
		elem.className = "";
	});
	for (var i = 0; i < amountOfDays; i++) {
		daysArray.push(i + 1);
		tdsArray[i].weekdayNumber = (i + 1) % 7 === 0 ? 7 : (i + 1) % 7;
	}
	for (var i = 0; i < tdsArray.length; i++) {
		// 判断前七个是否有空,amountOfDays
		if (i < 7 && i + 1 < weekdayNumber) {
			tdsArray[i].innerHTML = "";
			tdsArray[i].className = "no-data";
		} else if (daysArray.length) {
			tdsArray[i].innerHTML = daysArray.shift();
			tdsArray[i].className = "have-data";
			// 判断是否今天
			var today = new Date();
			if (nowYear == today.getFullYear() && nowMonth == today.getMonth() + 1 && tdsArray[i].innerHTML == today.getDate()) {
				tdsArray[i].innerHTML = "今天";
				tdsArray[i].className = "today";
			}
		} else {
			tdsArray[i].className = "no-data";
		}
	}
}

// 按照国外的方式，周日在前面
calendarLibrary.renderTable2 = function(nowYear, nowMonth, panelDOM) {
	// 渲染表格,先获取此月的第一天是周几,注意月数减一
	var d = new Date(nowYear, nowMonth - 1, 1);
	var weekdayNumber = d.getDay();
	// 获取这个月的天数
	var amountOfDays = (new Date(nowYear, nowMonth, 0)).getDate();
	var daysArray = [];
	var tdsArray = panelDOM.querySelectorAll("tbody td");
	// 把表格清空,重置
	tdsArray.forEach(function(elem) {
		elem.innerHTML = "";
		elem.className = "";
	});
	for (var i = 0; i < amountOfDays; i++) {
		daysArray.push(i + 1);
		tdsArray[i].weekdayNumber = i % 7;
	}
	for (var i = 0; i < tdsArray.length; i++) {
		// 判断前七个是否有空,amountOfDays
		if (i < 7 && i < weekdayNumber) {
			tdsArray[i].className = "no-data";
		} else if (daysArray.length) {
			tdsArray[i].innerHTML = daysArray.shift();
			tdsArray[i].className = "have-data";
			// 判断是否今天
			var today = new Date();
			if (nowYear == today.getFullYear() && nowMonth == today.getMonth() + 1 && tdsArray[i].innerHTML == today.getDate()) {
				tdsArray[i].innerHTML = "今天";
				tdsArray[i].className = "today";
			}
		} else {
			tdsArray[i].className = "no-data";
		}
	}
}

/**
 * @Description 日历构造函数
 * @Author giovanni
 * @Date 2016年7月27日 16:38
 */
function Calendar(dom) {
	this.dom = dom;
	// 是否显示节日
	this.festival = false;
	// 面板dom
	this.panelDOM = false;
}

// 原型函数
Calendar.prototype.init = function() {
	var calendarDOM = this.dom;
	var panelDOM = this.panelDOM;
	var calendarInput = calendarDOM.getElementsByClassName("calendar-input")[0].querySelector("input[type=text]");
	var calendarInputWeekday = calendarDOM.querySelector(".weekdays");
	var calendarInputPrompt = calendarDOM.querySelector(".prompt");
	var calendarPanelTds = panelDOM.querySelectorAll("tbody td");

	// 渲染输入框
	var today = new Date();
	calendarInput.value = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
	// 渲染输入框的工作日
	calendarInputWeekday.innerHTML = calendarLibrary.getWeekday(today);
	// 提醒话语
	calendarInputPrompt.innerHTML = "";
	// 渲染面板上的日期
	panelDOM.querySelector("span.year").innerHTML = today.getFullYear();
	panelDOM.querySelector("span.month").innerHTML = (today.getMonth() + 1);
	// 渲染面板的表格
	calendarLibrary.renderTable(today.getFullYear(), today.getMonth() + 1, panelDOM);
	// 为input绑定函数
	calendarInput.addEventListener("click", function(event) {
		event = event || window.event;
		// 显示日历面板
		panelDOM.style.display = "block";
		// 渲染数据
		var dateObj = calendarLibrary.getDateFromInput(this.value);
		if (dateObj === "格式错误" || !dateObj) {
			calendarInputPrompt.innerHTML = "格式错误";
			calendarInputPrompt.style.display = "block";
			return;
		} else {
			calendarInputPrompt.style.display = "none";
		}
		// 渲染面板上的日期
		panelDOM.querySelector("span.year").innerHTML = dateObj.year;
		panelDOM.querySelector("span.month").innerHTML = dateObj.month;
		// 渲染面板的表格
		calendarLibrary.renderTable(dateObj.year, dateObj.month, panelDOM);
		event.stopPropagation();
	}, false);

	// 为日历对应的面板绑定函数
	panelDOM.addEventListener("click", function(event) {
		event = event || window.event;
		event.stopPropagation();
	}, false);
	calendarPanelTds.forEach(function(elem) {
		elem.addEventListener("click", function(event) {
			event = event || window.event;
			if (this.innerHTML == "") {
				return;
			}
			var year = panelDOM.querySelector("thead .year").innerHTML;
			var month = panelDOM.querySelector("thead .month").innerHTML;
			var day = this.innerHTML;
			var result = year + "-" + month + "-" + day;
			calendarInput.value = result;
			// 工作日
			if (day === "今天") {
				day = (new Date()).getDate();
			}
			var weekdays = calendarLibrary.getWeekday(new Date(year, month - 1, day));
			calendarInputWeekday.innerHTML = weekdays;
			// 隐藏面板
			panelDOM.style.display = "none";
		}, false);
	})

	// 为body绑定函数
	document.body.addEventListener("click", function(event) {
		event = event || window.event;
		// 隐藏日历面板
		panelDOM.style.display = "none";
	}, false);
}

Calendar.prototype.bindEvent = function() {
	// 为panel绑定事件
	if (!this.panelDOM) {
		throw new Error("没有panelDOM");
		return;
	}
	var prevBtn = this.panelDOM.querySelector(".prev");
	var nextBtn = this.panelDOM.querySelector(".next");
	var nowYear;
	var nowMonth;

	this.panelDOM.addEventListener("click", function(event) {
		event = event || window.event;
		// 若点击前一个
		if (event.target === prevBtn) {
			// 这个this是面板
			nowYearDOM = this.querySelector("span.year");
			nowMonthDOM = this.querySelector("span.month");
			// 若是1月，则换年
			if (nowMonthDOM.innerHTML - 0 === 1) {
				nowMonthDOM.innerHTML = 12;
				nowYearDOM.innerHTML = nowYear = nowYearDOM.innerHTML - 1;
			} else {
				nowMonthDOM.innerHTML = nowMonth = nowMonthDOM.innerHTML - 1;
				nowYear = nowYearDOM.innerHTML;
			}
			calendarLibrary.renderTable(nowYear, nowMonth, this);
		} else if (event.target === nextBtn) {
			// 这个this是面板
			nowYearDOM = this.querySelector("span.year");
			nowMonthDOM = this.querySelector("span.month");
			// 若是12月，则换年
			if (nowMonthDOM.innerHTML == 12) {
				nowMonthDOM.innerHTML = 1;
				nowYearDOM.innerHTML = nowYear = nowYearDOM.innerHTML - 0 + 1;
			} else {
				nowMonthDOM.innerHTML = nowMonth = nowMonthDOM.innerHTML - 0 + 1;
				nowYear = nowYearDOM.innerHTML;
			}
			calendarLibrary.renderTable(nowYear, nowMonth, this);
		}
	}, false);
}
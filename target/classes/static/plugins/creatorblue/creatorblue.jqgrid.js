/* 
 * jqGrid extends
 * Copyright: Copyright (c) 2017
 * Company:creatorblue.co.,ltd
 * @author creatorblue.co.,ltd
 * @version 1.0
 *  License: http://www.creatorblue.com
 */
//jqGrid的配置信息
$.jgrid.defaults.width = 1000;
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';
//var jq_token = localStorage.getItem("token");
// jqgrid全局配置
$.extend($.jgrid.defaults, {
	ajaxGridOptions : {
		headers : {
			"token" : cb.token
		}
	}
});

// 选择一条记录
Creatorblue.prototype.getselectedrow = function (selector) {
	var grid = $(selector);
	var rowKey = grid.getGridParam("selrow");
	if (!rowKey) {
		this.alert("请选择一条记录");
		return;
	}

	var selectedIDs = grid.getGridParam("selarrrow");
	if (selectedIDs.length > 1) {
		this.alert("只能选择一条记录");
		return;
	}

	return selectedIDs[0];
}

// 选择多条记录
Creatorblue.prototype.getselectedrows = function (selector) {
	var grid = $(selector);
	var rowKey = grid.getGridParam("selrow");
	if (!rowKey) {
		this.alert("请选择一条记录");
		return;
	}

	return grid.getGridParam("selarrrow");
}

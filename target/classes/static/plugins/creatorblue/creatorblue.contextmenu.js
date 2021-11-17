Creatorblue.prototype.contextmenus = {}

Creatorblue.prototype.contextmenu = function(){
	this.contentId = "";
	this.id = "";
	this.opts = {};
	this.menus = [];
}

Creatorblue.prototype.contextmenu.init = function(options){
	var menu = new cb.contextmenu();
	menu.contentId = options.contentId;
	var content = $("#" + menu.contentId);
	menu.id = options.id;
	var ul = $("<div  class=\"list-group cb-contextmenu\" id=\""+ menu.id +"\"></div>").appendTo("body");
	
	var menus = options.menus;
	
	for(var i in menus){
		var li = $("<a class=\"list-group-item\" href=\"javascript:void(0)\">" +
				(menus[i].icon? "<span class=\"" + menus[i].icon + "\"></span>":"") +
				"&nbsp;"+ menus[i].title +"</a>").appendTo(ul)
			li.bind("click",function(e){hideMenu();if(menus[i].click)menus[i].click(e);});
	}
	//取消视图原有的右键事件，并添加新的右键菜单
	content.bind("mousedown",function(e){
		if(3 == e.which){ //右键
			//取得鼠标的位置
			var left = e.pageX;
			var top = e.pageY;
			ul.css({"top": top + "px","left": left + "px","display": "block"});//显示右键菜单
			$("body").bind("mousedown",fun);//绑定关闭右键菜单事件
			$(document).bind('contextmenu',function(e){ //取消系统右键菜单
				return false; 
			}); 
			e.target.click();//同时触发单击事件
			return false; 
		}
		
	});
	
	var hideMenu = function(){
		ul.css("display","none");
		$("body").unbind("mousedown",fun);
		$(document).unbind('contextmenu'); 
	}
	
	var fun = function(e){
		
		if(e.target.id != menu.id && $(e.target).parents("#" + menu.id).length == 0){
			
			hideMenu();
		}
	}
	
	
	
}
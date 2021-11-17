Creatorblue.prototype.trees = {};

Creatorblue.prototype.Tree = function(){
	//var tree = new Tree();
	this.tree= {};//树对象
	this.display = {};//显示的文本框对象，节点name
	this.value = {};//隐藏的节点值
	this.btn = {};//操作按钮
	this.content = {};//下拉容器
	this.ps = {};//参数
	//return tree;
}

Creatorblue.prototype.Tree.init = function(ps){
	
	var tree = new cb.Tree();
	tree.ps = ps;
	tree.content.ele = $("#" + ps.contentId);
	tree.content.id = tree.ps.contentId;
	var type = ps.type;
	var setting = {};
	setting.callback = {};
	
	var attr = ps.attr;
	if(!attr) attr = {};
	setting.view = {selectedMulti:(ps.selectedMulti != null?ps.selectedMulti:true),dblClickExpand:true};
	
	if(ps.nodeOper && ps.nodeOper.operId){
		setting.view.addDiyDom = function(treeId, treeNode){
			var aObj = $("#" + treeNode.tId + "_a");
			aObj.append($("#" + ps.nodeOper.operId).html());
		}
	}
	
	setting.data = {simpleData:{enable : true}};
	
	if( ps.expandAll >= 0)ps.mapper["open"] = ps.expandAll;
	if(ps.check){//如果是复选框
		if(setting.check)setting.check.enable = ps.check;
		else setting.check = {enable:ps.check};
		//if(ps.selectedMulti == false)
		setting.check.chkStyle=setting.view.selectedMulti?"checkbox":"radio";
		if(ps.chChildren == false)
			setting.check.chkboxType = { "Y": "", "N": "" };
		var fun = function(tree){//勾选事件，同时选中节点
			return function(e,treeId,treeNode){
				if(ps.onClick)ps.onClick(e,treeId,treeNode);
				else tree.checkSelect(e,treeId,treeNode);
				if(treeNode.checked)
					tree.tree.obj.selectNode(treeNode,true,true);
				else
					tree.tree.obj.cancelSelectedNode(treeNode);	
				if(setting.view.selectedMulti == false && (ps.type=="select" || ps.type=="input")){
					tree.hideMenu();
				}
			};
		}
		setting.callback.onCheck= fun(tree);
		
		if(ps.leafonly){
			setting.callback.beforeCheck = function(treeId, treeNode){
				if(treeNode.isParent)return false;
			}
		}
		
		/*if(ps.onClick)
			setting.callback.onCheck=ps.onClick;
		else{
			var fun = function(tree){
				return function(e, treeId, treeNode){tree.checkSelect(e, treeId, treeNode)}
			}
			setting.callback.onCheck = fun(tree);
		}*/
	}
		//选中节点时，如果有复选框，则勾选或取消勾选
		fun = function(tree){
			return function(e, treeId, treeNode,clickFlag){
				if(ps.onClick)
					ps.onClick(e,treeId,treeNode);
				else
					tree.select(e, treeId, treeNode);
				tree.tree.obj.checkNode(treeNode,clickFlag >= 1,true);
				if(setting.view.selectedMulti == false && (ps.type=="select" || ps.type=="input")){
					tree.hideMenu();
				}
			};
		}
		setting.callback.onClick=fun(tree);
		
		if(ps.leafonly){
			setting.callback.beforeClick = function(treeId, treeNode, clickFlag){
				if(treeNode.isParent)return false;
			}
		}
		/*if(ps.onClick)
			setting.callback.onClick=ps.onClick;
		else{
			var fun = function(tree){
				return function(e, treeId, treeNode){tree.select(e, treeId, treeNode)};
			}
			setting.callback.onClick=fun(tree);
		}*/
	ps.setting = setting;
	
	var style = ps.style;
	
	var className = ps.className;
	if(className == "") className = "form-control cb-form-control";
	
	if(type){
		switch(type){
		case "select":
			//显示文本框
			var textId = cb.uuid().replaceAll("-","");
			tree.display.id = textId;
			var text = $("<input type='text' class='tree_display "+ className +"' id='"+ textId +"' style='"+ style +"' />").appendTo(tree.content.ele);
			tree.display.ele = text;
			text.attr(attr);
			
			
			//按钮
			var btnId = cb.uuid().replaceAll("-","");
			tree.btn.id = btnId;
			var b = $("<a href='#' class='tree_btn' id='"+ btnId +"' \">选择</a>").appendTo(tree.content.ele);
			tree.btn.ele = b;
			tree.btn.ele.bind("click",function(){tree.showMenu();});
			break;
		case "input":
			//显示文本框
			var textId = cb.uuid().replaceAll("-","");
			tree.display.id = textId;
			var text = $("<input type='text' class='tree_display "+ className +"' id='"+ textId +"' style='"+ style +"'\"/>").appendTo(tree.content.ele);
			text.attr(attr);
			tree.display.ele = text;
			tree.btn = tree.display;
			tree.btn.ele.bind("click",function(){tree.showMenu();});
			/*//隐藏文本框
			var valueId = cb.uuid().replaceAll("-","");
			tree.value.id = valueId;
			var val = $("<input type='hidden' name='"+ ps.name +"' class='tree_vlue' id='"+ valueId +"'/>").appendTo(tree.content.ele);
			tree.value.ele = val;*/
			break;
		}
	}
	//隐藏文本框
	var valueId = cb.uuid().replaceAll("-","");
	tree.value.id = valueId;
	var val = $("<input type='hidden' name='"+ ps.name +"' class='tree_vlue' id='"+ valueId +"'/>").appendTo(tree.content.ele);
	tree.value.ele = val;
	cb.trees[ps.contentId] = tree;
	return tree;
}

/**
 * 加载树
 */
Creatorblue.prototype.Tree.prototype.load = function(){
	

	var tree = this;
	if(tree.tree.id)
		$("#" + tree.tree.id).remove();
	if(tree.value.ele)
		 tree.value.ele.val("");
	 if(tree.display.ele)
	 	tree.display.ele.val("");
	var id = cb.uuid().replaceAll("-","");//UL的Id
	var setting = tree.ps.setting;//ztree的setting属性
	var data = tree.ps.data;//ztree的data节点json数据
	var url = tree.ps.url;//异步加载时的请求路径
	var param = tree.ps.param;//异步加载时的请求参数
	var mapper = tree.ps.mapper;
	if(!mapper) mapper = {};
	var parentId = mapper.parentId;//通过父级ID加载
	var parentValue = mapper.parentValue;//根节点父级的ID
	var children = mapper.children;//通过子级集合加载
	
	if(!setting) setting = {};
	if(!data){
		if(url && !setting.async){//如果未使用ztree的内部加载，则使用ajax加载
			cb.async(url,param,function(result){
				data = result;
			},{ contentType: "application/x-www-form-urlencoded"});
		}
	}
	var rootNode = tree.ps.rootNode;
	
	var level = 0;
	if(rootNode)
		level = 1;
	if(parentId){
		data = tree.loadtreebyparent(data,parentId,parentValue,level);
	}else if(children){
		data = tree.loadtreebychildren(data,level);
	}
	//cb.log(JSON.stringify(data));
	//如果定义了根节点，则使用定义的根节点
	
	if(rootNode){
		data = [{name:rootNode.name,cbid:tree.ps.mapper.parentValue,parentId:null,click:"return false;",children:data}];
		if(rootNode.icon) data[0]["icon"] = rootNode.icon;
		if(tree.ps.expandAll >=0)data[0]["open"] = true;
	}
	
	var className =  "ztree " + (tree.ps.type == "select" || tree.ps.type == "input"?"ztree-abs ":"") + tree.ps.treeClass;
	//树列表
	var ul = $("<ul id='"+ id +"' class='"+ className +"'></ul>").appendTo(tree.content.ele);
	//ul.css({})
	if(tree.ps.treeStyle){
		style = tree.ps.treeStyle.split(";");
		for(var i in style){
			if(style[i]!= ""){
				var css = style[i].split(":");
				ul.css(css[0],css[1]);
			}
		}
	}
	//如果是树默认显示，如果是列表默认不显示
	if(tree.ps.type == "select" || tree.ps.type=="input"){
		ul.css("display","none");
	}
	if(tree.ps.height) ul.css("height", tree.ps.height );
	tree.tree.ele = ul;
	if(!setting.callback)setting.callback={};
	setting.callback.onExpand = function(event, treeId, treeNode){	
		//重新定义图标，去掉Ztree自动加上的_ico
		replaceIco(treeNode.tId + "_ul");
		
	}
	var t = $.fn.zTree.init($("#"+id), setting , (data? data : null));
	tree.tree.id = id;
	tree.tree.obj = t;
	var replaceIco = function(id){
		if(mapper.iconSkin){
			//$("#" + id + " [title='"+ treeNode.name +"']")
			
			$("#" + id + "  [class*='_ico']").each(function(index,element){
				
				var i = $("<i></i>");
				i.attr("id",$(element).attr("id"));
				
				var className = $(element).attr("class");
				//className = className.split(" ");
				className = className.replaceAll("_ico"," ico");
				
				//i.addClass("glyphicon");
				i.addClass(className);
				i.css({"font-family":"'Glyphicons Halflings'","font-style":"normal"});
				$(element).replaceWith(i);
				var id = i.parents("li").find("ul").attr("id");
				replaceIco(id);
			})
		}
		
	}
	
	replaceIco(id);

	//如果有初始值，则显示初始值
	var value = tree.ps.value;
	if(value && value.length > 0){
		for(var i in value){
			var node = t.getNodeByParam("cbid",value[i],null);
			if(node){//如果是复选框，则勾选，如果不是则选中，
				
				if(tree.ps.check)t.checkNode(node,true,tree.ps.chChildrentrue?true:false);
				else t.selectNode(node,false,true);
				if(tree.value.ele){
					if(tree.value.ele.val()=="")
						tree.value.ele.val(node.cbid);
					else
						tree.value.ele.val(tree.value.ele.val() + "," + node.cbid);
				}
					
				if(tree.display.ele){
					if(tree.display.ele.val() == "")
						tree.display.ele.val(node.name);
					else
						tree.display.ele.val(tree.display.ele.val() + "," + node.name);
				}
					
				
			}
		}
	}else{
		 if(tree.value.ele)
			 tree.value.ele.val("");
		 if(tree.display.ele)
		 	tree.display.ele.val("");
	}
}

/**
 * 通过上级ID加载树
 */
Creatorblue.prototype.Tree.prototype.loadtreebyparent = function(data,parentname,parentId,level){
	var mapper = this.ps.mapper;
	
		var result = [];
		for(var i in data){
			var d = data[i];
			var r = {};
			if(d[parentname] == parentId){
				for(var key in mapper){
					if(key == "open"){
						if(level < mapper["open"] || mapper["open"] == 0){
							r["open"] = true;
						}
					}else if("parentId" != key && "parentValue" != key){
						var value = mapper[key]==true || mapper[key]==false? mapper[key]:  d[mapper[key]];
						r[key] = value;
					}
					
				}
				var children = this.loadtreebyparent(data,parentname,d[mapper["cbid"]],mapper,level + 1);
				if(children.length > 0) r["children"] = children;
				result[result.length] = r;
			}
		}
		return result;
}

/**
 * 通过下级集合加载树
 */
Creatorblue.prototype.Tree.prototype.loadtreebychildren = function(data,level){
	var mapper = this.ps.mapper;
	var result = [];
	if(data){							
		for(var i in data){
			var d = data[i];
			var r = {};
			for(var key in mapper){
				if(key == "open"){
					if(level < mapper["open"] || mapper["open"] == 0){
						r["open"] = true;	
					}
				}else if("children" != key){
					r[key] = mapper[key]==true || mapper[key]==false? mapper[key]: d[mapper[key]];
				}else if(d[mapper["children"]]){
					var children = this.loadtreebychildren(d[mapper["children"]],level + 1);
					if(children.length > 0)r["children"] = children;
				}
			}
			
			result[result.length] = r;
			
		}
	}
	return result;
}

/**
 * 单击前触发事件方法，只有叶子节点允许触发单击事件
 */
Creatorblue.prototype.Tree.prototype.beforeClick = function (treeId, treeNode) {
		var check = (treeNode && !treeNode.isParent);
		//if (!check) alert("只能选择城市...");
		return check;
	}

/**
 * 单击时选择当前值，赋值给指定元素
 */	
Creatorblue.prototype.Tree.prototype.select = function (e, treeId, treeNode) {
		var inputId = this.display.id;
		var t =  this.tree.obj;
		var nodes = t.getSelectedNodes();
		var v = "";
		var k = "";
		//nodes.sort(function compare(a,b){return a.id-b.id;});
		for (var i=0, l=nodes.length; i<l; i++) {
			if(v != "") {v+=",";k += ",";}
			v += nodes[i].name;
			k += nodes[i].cbid;
		}
		//if (v.length > 0 ) v = v.substring(0, v.length-1);
		if(this.display.ele){
			this.display.ele.val(v);
		}
		if(this.value.ele){
			this.value.ele.val(k);
		}
		if(this.ps.cascade != ""){
			var c = this.ps.cascade.split(":");
			this.cascade(c[0],c[1],k);
		}
		
		
	}
Creatorblue.prototype.Tree.prototype.checkSelect = function(event, treeId, treeNode){
	var inputId = this.display.id;
	var t =  this.tree.obj;
 	var nodes = t.getCheckedNodes(true);
	var v = "";
	var k = "";
	//nodes.sort(function compare(a,b){return a.id-b.id;});
	for(var i in nodes){
		if(v != "") {v+=",";k += ",";}
		v += nodes[i].name + "";
		k += nodes[i].cbid + "";
	}
	//if (v.length > 0 ) v = v.substring(0, v.length-1);
	//var cityObj = $("#" + inputId);
	if(this.display.ele){
		this.display.ele.val(v);
	}
	
	if(this.value.ele){
		this.value.ele.val(k);
	}
	if(this.ps.cascade != ""){
		var c = this.ps.cascade.split(":");
		this.cascade(c[0],c[1],k);
	}
}
//级联
Creatorblue.prototype.Tree.prototype.cascade = function(cascadeTree,cascadeId,v){
	var tree = cb.trees[cascadeTree];
	var ps = tree.ps;
	ps["param"] = {};
	ps["param"][cascadeId] = v;
	ps["mapper"]["parentValue"] = v;
	tree.load();
	
}


/**
 * 
 */
Creatorblue.prototype.Tree.prototype.showMenu = function () {
		
		var cityOffset = this.display.ele.offset();
		var left = cityOffset.left;
		var top = cityOffset.top;
		var content = this.tree.ele;
		while(content.parent().prop("tagName").toLowerCase() != "body"){
			content = content.parent();
			if(content.css("position") && content.css("position") == "absolute"){
				left -= content.offset().left;
				top -= content.offset().top;
			}
		}
		left -= this.display.ele.css("padding-left");
		this.tree.ele.css({left:left + "px", top:top + this.display.ele.outerHeight() + "px",width:this.display.ele.outerWidth() + "px"}).slideDown("fast");
		var tree = this;
		$("body").bind("mousedown",  function(e){tree.bodyDown(e);});
	}
/**
 * 
 */
Creatorblue.prototype.Tree.prototype.hideMenu = function () {
		var tree = this;
		var menuBtnId = this.btn.id;
		var contentId = this.tree.id;
		$("#" + contentId).fadeOut("fast");
		$("body").unbind("mousedown", function(e){tree.bodyDown(e);});
	}
/**
 * 
 */
Creatorblue.prototype.Tree.prototype.bodyDown = function (event) {
			
		if (!( event.target.id == this.tree.id 
				|| $(event.target).parents("#" + this.tree.id).length > 0)) {
			this.hideMenu();
			return;
		}
	}




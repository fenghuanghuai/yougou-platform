
//登录验证

//验证
	if(cb.token == null){
	  top.location.href = cb.baseurl+"login";
	}

/**
 * 表单验证
 */
Creatorblue.prototype.formvalidate = function(selector,position,method){
	if(!position)position = "bottomLeft";
	if(!method)method="validate";
	$.validationEngine.defaults.promptPosition=position;
	$(selector).validationEngine({
		showOnMouseOver : true
	});
	return $(selector).validationEngine(method);
}



//权限判断
Creatorblue.prototype.hasPermission = function (permission) {
  if (top.permissions.indexOf(permission) > -1) {
      return true;
  } else {
      return false;
  }
}
//当前页面所有上传组件
Creatorblue.prototype.uploaders = {};

Creatorblue.prototype.Uploader = function(){
	this.obj = {};
	this.params = {};
	
}

Creatorblue.prototype.Uploader.init = function(params){
	var uploader = new cb.Uploader();
	uploader.params = params;
	var id = params.id;
	var inputId= cb.uuid().replaceAll("-","");
	var imgId = cb.uuid().replaceAll("-","");
	var btnId = cb.uuid().replaceAll("-","");
	cb.uploaders[id] = uploader;
	var src= "";
	if(params.value) src = "src=\"" + params.value + "\"";
	var size = "";
	if(params.size) size = "width:" + params.size.split(",")[0] + "px;height:" + params.size.split(",")[1] + "px;";
	$("<img style=\""+ size +"border:1px solid #FFF;\" "+ src +"><br>").appendTo("#" + id);
	uploader.createFileInput(inputId);
	$("<a id=\""+ btnId +"\" class=\"btn btn-primary btn-sm\">选择</a>").appendTo("#" + id);
	$("#" + btnId).click(function(){$("#" + inputId).click();})
	/*var createParam = {
			swf:cb.baseurl + 'plugins/webuploaders/Uploader.swf',// swf文件路径
			resize: false, // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
			pick : "#" + inputId // 选择文件的按钮。可选
		};*/
	
	
	
}
Creatorblue.prototype.Uploader.prototype.createFileInput= function (inputId){
	var input =  $("<input type=\"file\" id=\""+ inputId +"\" style=\"display:none;\"/>");
	
	if($("#" + inputId).length == 0){
		input.appendTo("#" + this.params.id);
	}else{
		$("#" + inputId).replaceWith(input);
	}
	if(this.params.accept){
		input.attr("accept",this.params.accept);
	}
	
	
	
	//uploader.obj = WebUploader.create(createParam);//初始化上传组件
	
	if(this.params.name)
		input.attr("name",this.params.name);
	uploader = this;
	input.change(function(e){
		
		var file = uploader.getFile(this);
		if(uploader.validateimg(file)){
			var url = uploader.getObjectURL(file);
			$("#" + uploader.params.id + " img").attr("src",url);
		}else{
			uploader.createFileInput(inputId);
		}		
	});	
}

//判断不同浏览器，根据不同浏览器返回对应的上传文件
Creatorblue.prototype.Uploader.prototype.getFile= function (obj){
	var file = null;
	var isIE = /msie/i.test(navigator.userAgent) && !window.opera;            
    if (isIE && !obj.files) {       
         var filePath = obj.value;         
         var fileSystem = new ActiveXObject("Scripting.FileSystemObject");   
         file = fileSystem.GetFile (filePath);
    }else {  
    	file = obj.files[0];     
    } 
    return file;
}

//判断不同浏览器，根据不同浏览器返回对应的上传文件
Creatorblue.prototype.Uploader.prototype.getFiles= function (obj){
	var files = new Array();
	var isIE = /msie/i.test(navigator.userAgent) && !window.opera;            
    if (isIE && !obj.files) {       
         var filePath = obj.value;
         var fileSystem = new ActiveXObject("Scripting.FileSystemObject");   
         files = fileSystem.GetFile (filePath); 
    }else {  
    	files = obj.files;
    } 
    return files;
}

//判断图片是否符合要求
Creatorblue.prototype.Uploader.prototype.validateimg= function (file){
	var right = false;
	
	if(this.params.length){
		var fileSize = file.size; 
		fileSize=Math.round(fileSize/1024*100)/100; //单位为KB
	    if(fileSize>=this.params.length){
	        cb.alert("照片最大尺寸为" + this.params.length + "KB，请重新上传!");
	        return false;
	    }    
	}	
	return true;
}

Creatorblue.prototype.Uploader.prototype.getObjectURL = function (file) {
	 var url = null ; 
	 if (window.createObjectURL!=undefined) { // basic
	  url = window.createObjectURL(file) ;
	 } else if (window.URL!=undefined) { // mozilla(firefox)
	  url = window.URL.createObjectURL(file) ;
	 } else if (window.webkitURL!=undefined) { // webkit or chrome
	  url = window.webkitURL.createObjectURL(file) ;
	 }
	 return url ;
}
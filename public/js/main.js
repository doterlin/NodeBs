$(function() {
	$('#usename').text(getCookie('username'));
	var pageOpt = window.pageOpt;
	var jsonall = getJson(pageOpt);
	var changeJson = jsonall;

	//重置
	$('.jsonreset').on('click', function(){
		location.reload();
	});

	//保存
	$('.savejson').on('click', function(){
		saveJson(pageOpt);
	})
	//保存
	$('.preview').on('click', function(){
		window.open(window.preview)
	})

	function saveJson(pageOpt){
		var $json = $('[data-json]');
		$json.each(function(index) {
		var _arr = $(this).data('json').split(".");
			if (_arr.length < 0) {
				return
			} else if (_arr.length == 1) {
				changeJson[_arr[0]] = $(this).val();
			} else if (_arr.length == 2) {
				changeJson[_arr[0]][_arr[1]]= $(this).val();
			} else if (_arr.length == 3) {
				changeJson[_arr[0]][_arr[1]][_arr[2]]= $(this).val();
			}

		})
		pageOpt.data = JSON.stringify(changeJson); //post方式要把长的对象转化为字符串。不然服务端可能获取不到该参数内容
		$.ajax({
			url: 'http://192.168.2.69:3000/savejson',
			type: 'POST',
			data: pageOpt
		}).done(function(res) {
			alert(res.msg);
			if(res.code==1){
				location.reload();
			}
		})
	}

	function getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}

	function getJson(pageOpt) {
		var _res;

		$.ajax({
			url: 'http://192.168.2.69:3000/getjson',
			data: pageOpt,
			async: false, //设置为同步获取，保证函数返回值正确
			success: function(res) {
				_res = res
			}

		})
		return _res.data;
	}
	var $json = $('[data-json]');
	$json.each(function(index) {
		var _arr = $(this).data('json').split(".");

		if (_arr.length < 0) {
			return
		} else if (_arr.length == 1) {
			$(this).val(jsonall[_arr[0]])
		} else if (_arr.length == 2) {
			$(this).val(jsonall[_arr[0]][_arr[1]]);
		} else if (_arr.length == 3) {
			$(this).val(jsonall[_arr[0]][_arr[1]][_arr[2]]);
		}

	})

	var $jsonsrc = $('[data-jsonsrc]');
	$jsonsrc.each(function(index) {
		var _arr = $(this).data('jsonsrc').split(".");
		var basePath = 'http://www.itsme.media/';

		if (_arr.length < 0) {
			return
		} else if (_arr.length == 1) {
			$(this).attr('src', basePath + jsonall[_arr[0]])
		} else if (_arr.length == 2) {
			$(this).attr('src', basePath + jsonall[_arr[0]][_arr[1]]);
		} else if (_arr.length == 3) {
			$(this).attr('src', basePath + jsonall[_arr[0]][_arr[1]][_arr[2]]);
		}

	})

	Dropzone.autoDiscover = false;
	//图片上传
	try {
		$(".dropzone").dropzone({
			url: '/savejson',
			paramName: "file", // The name that will be used to transfer the file
			maxFilesize: 1, // MB
			parallelUploads: 1,

			addRemoveLinks: true,
			dictResponseError: '上传时遇到错误!',
			autoProcessQueue: false,
			maxFiles: +$(this).data('maxfiles') || 1,
			dictMaxFilesExceeded: "最多可上传"+ (+$(this).data('maxfiles') || 1)+'个文件',
			dictRemoveFile:'移除文件',
			acceptedFiles: '.png,.jpg',
			dictInvalidFileType: '文件类型不正确!',

			//change the previewTemplate to use Bootstrap progress bars
			previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"progress progress-small progress-striped active\"><div class=\"progress-bar progress-bar-success\" data-dz-uploadprogress></div></div>\n  <div class=\"dz-success-mark\"><span></span></div>\n  <div class=\"dz-error-mark\"><span></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
		});
	} catch (e) {
		alert('您的浏览器不支持图片上传!');
	}


})
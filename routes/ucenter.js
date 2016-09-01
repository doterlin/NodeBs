var express = require('express');
var fs = require("fs")
var router = express.Router();

var pageInfo = {
	'index': {
		name: '首页'
	},
	'official_home': {
		name: '官网-主页',
		jsonPath: '../resource/data/index/'
	},
	'official_about': {
		name: '官网-关于',
		jsonPath: '../resource/data/about/'
	}
}

router.get('/ucenter', function(req, res) {
	res.redirect('/ucenter/index');
});

router.get('/ucenter/:iframeName', function(req, res) {
	var _iName = req.params.iframeName.replace('.html', ''); //支持.html地址，例如/index和/index.html是等同的
	if (_iName === '') {
		_iName = 'index';
	}
	res.render('ucenter', {
		iframeName: _iName + '.html',
		name: pageInfo[_iName].name
	});
});

router.get('/getjson', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	var _lang = req.query.lang || 'english';
	var _page = req.query.page;
	var result = {
		code: 1,
		msg: '获取成功！'
	};

	if (!_page) {
		result.code = -1;
		result.msg = 'page参数不能为空！';
	} else {
		result.src = pageInfo[_page].jsonPath + _lang + '.json';
		result.data = openjson(pageInfo[_page].jsonPath + _lang + '.json');
	}

	res.json(result);
})

router.post('/savejson', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	var _lang = req.body.lang || 'english';
	var _page = req.body.page;
	var _data = req.body.data;
	var result = {
		code: 1,
		msg: '保存成功！'
	};

	if (!_page) {
		result.code = -1;
		result.msg = 'page参数不能为空！';
	} else {
		result.src = pageInfo[_page].jsonPath + _lang + '.json';
		result.data = _data;
		writejson(pageInfo[_page].jsonPath + _lang + '.json',_data);
	}

	res.json(result);
})

function openjson(src) { //读取json并返回
	var _data = fs.readFileSync(src, {
		encoding: 'utf8'
	});
	//console.log(JSON.parse(_data));
	return JSON.parse(_data);
}

function writejson(src,data) { //读取json并返回
	fs.writeFile(src, data, function (err) {
        if (err) throw err;
        console.log("Save Success!");
    });
}

module.exports = router;
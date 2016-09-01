var express = require('express');
var router = express.Router();
var user = require('../database/db').user;

/* GET home page. */
router.get('/', function(req, res) {
	res.render('login', {
		title: '用户登录'
	});
});

/* login */
router.get('/login', function(req, res) {
	res.render('login', {
		title: '用户登录'
	});
});

/* 登录请求 */
router.post('/login', function(req, res) {
	var query = {
		name: req.body.name,
		password: req.body.password
	};

	(function() {
		user.count(query, function(err, doc) { //count返回集合中文档的数量，和 find 一样可以接收查询条件。query 表示查询的条件
			console.log("接收登录信息:"+JSON.stringify(req.body)+"; doc："+doc);
			if (doc == 1) {
				console.log(query.name + ": 登录成功！ 时间：" + new Date());
				res.cookie('username',req.body.name);
				res.send({
					code: 1,
					msg: '登录成功！'
				});
			} else {
				console.log(query.name + ": 登录失败！ 时间：" + new Date());
				res.send({
					code: 0,
					msg: '登录失败！'
				});
			}
		});
	})(query);
});

module.exports = router;
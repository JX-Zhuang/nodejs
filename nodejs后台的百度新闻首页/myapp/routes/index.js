var express = require('express');
var router = express.Router();
var orm = require('orm');
var dbs = require('../dbs/mysql')(router);
//type
var options=['推荐','百家','本地','图片','娱乐','社会','军事','科技','互联网','体育','国外'];
//backstage

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});
//mobile
router.get('/newsmobile/:id', dbs.select, function(req, res, next) {
	var mobile={
	title:'手机新闻首页',
	type:options,
	news:res.locals.news,
	newstype:req.params['id']
};
    res.render('newsmobile',mobile);
});
//backstage
router.get('/backstage',dbs.select,function(req, res, next) {
	var backstage={
	title:'新闻系统管后台',
    type:options,
    news:res.locals.news,
   	newstype:req.query.newstypesearch
};
    res.render('backstage',backstage);
});
//select->Id
router.post('/select',dbs.selectId,function(req, res, next) {
    res.json(res.locals.news);
});
//delete
router.post('/delete', dbs.remove, function(req, res) {
    res.json(res.locals.news);
});
//insert
router.post('/insert', dbs.insert, function(req, res) {
    res.json(res.locals.news);
});
//update
router.post('/update',dbs.update,function(req,res){
    res.json(res.locals.news);
});

module.exports = router;

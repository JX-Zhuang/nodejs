//引入
var express = require('express');
var orm = require('orm');
//数据库
var config = {
    user: 'root',
    host: '127.0.0.1',
    password: '',
    db: 'my_news'
};
var newsTable = {
    newstitle: String,
    newscontent: String,
    newsimg: String,
    newstype: String,
    addtime: Date,
    id: Number
};

//数据库操作 'mysql://' + config.user + '@' + config.host + '/' + config.db
module.exports = function(router) {
    //connect
    router.use(orm.express('mysql://root@127.0.0.1/my_news', {
        define: function(db, models, next) {
            console.log('connect ok');
            models.News = db.define('News', newsTable);
            next();
        }
    }));
    //数据库增删改查
    var dbs = {
        //select ->mobile or backstage  
        select: function(req, res, next) {
            var condition=(req.params['id']!=undefined)?{newstype:req.params['id']}:{newstype:req.query.newstypesearch};
            req.models.News.find(condition, function(err, news) {
                if (err) {
                    console.log('error:' + err);
                    return res.locals.news = {
                        err: 'error'
                    };
                } else {
                    res.locals.news = news;
                }
                console.log('select ok');
                next();
            });
        },




        //select ->mobile or backstage  
        // select: function(req, res, next) {
        //     var condition=(req.params['id']!=undefined)?{newstype:req.params['id']}:{newstype:req.query.newstypesearch};
        //     req.models.News.find(condition, function(err, news) {
        //         if (err) {
        //             console.log('error:' + err);
        //             return res.locals.news = {
        //                 err: 'error'
        //             };
        //         } else {
        //             res.locals.news = news;
        //         }
        //         console.log('select ok');
        //         next();
        //     });
        // },
        //select->Id
        selectId: function(req, res, next) {
            req.models.News.find(req.body, function(err, news) {
                if (err) {
                    console.log('error:' + err);
                    return res.locals.news = {
                        err: 'error'
                    };
                } else {
                    res.locals.news = news;
                }
                console.log('select Id ok');
                next();
            });
        },
        //delete
        remove: function(req, res, next) {
            req.models.News.find(req.body).remove(function(err) {
                if (err) {
                    console.log('error:' + err);
                    return res.locals.news = {
                        err: 'error'
                    };
                } else {
                    res.locals.news = {
                        success: 'ok'
                    };
                }
                console.log('remove ok');
                next();
            });
        },
        //insert
        insert: function(req, res, next) {
            req.models.News.create(req.body, function(err, items) {
                if (err) {
                    console.log('error:' + err);
                    return res.locals.news = {
                        err: 'error'
                    };
                } else {
                    res.locals.news = {
                        success: 'ok'
                    };
                }
                console.log('insert ok');
                next();
            });
        },
        //upadte
        update: function(req, res, next) {
            req.models.News.get(req.body.id, function(err, news) {
                if (err) {
                    console.log('error:' + err);
                    return res.locals.news = {
                        err: 'error'
                    };
                }
                news.save(req.body, function(err) {
                    if (err) {
                        console.log('error:' + err);
                        return res.locals.news = {
                            err: 'error'
                        };
                    } else {
                        res.locals.news = {
                            success: 'ok'
                        };
                    }
                    console.log('update ok');
                    next();
                });
            });
        }
    };
    return dbs;
}

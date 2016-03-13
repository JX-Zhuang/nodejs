1.启动命令：node myapp/bin/www
2.Html Css JavaScript Nodejs 新闻管理系统
3.前台：百度新闻手机端，显示数据库内容
4.后台：可以对数据库进行增删改查
5.项目基本结构如下

|----myapp
|	  |----bin
|	  |		|----www(启动文件)
|	  |
|	  |----dbs
|	  |		|----mysql.js(数据库操作文件)
|	  |
|	  |----node_modules(必要的库)
|	  |
|	  |----public(静态文件)
|	  |
|	  |----routes(路由)
|	  |		|----index.js
|	  |
|	  |----views(用ejs模板渲染html)
|	  |
|	  |----app.js(设置模板，引入静态文件)
|	  |
|	  |----package.json(项目基本信息，需要库的版本)
|
|----my_news.sql(导出的数据库)

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
//加载mysql模块

//增加ejs变量
var ejs = require('ejs');
//通过mongodb来保存session，实现后台登陆后用户对象传递
SessionStore = require("session-mongoose")(express);
var store = new SessionStore({
	url: "mongodb://localhost/session",
	interval: 120000
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
//视图文件的目录，存放模板文件
app.set('views', path.join(__dirname, 'views'));
//视图模板引擎
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
//用于支持制定的 HTTP 方法
app.use(express.methodOverride());
//session
//加载 express.bodyParser()解析客户端请求,就能直接通过req.body获取post的数据了。
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'fens.me'}));
app.use(express.session({
	secret: 'fens.me',
	store: store,
	cookie: { maxAge: 900000 }
}));

//增加res.locals.message
app.use(function(req, res, next)
{
	res.locals.user = req.session.user;
	var err = req.session.error;
	delete req.session.error;
	res.locals.message = '';
	if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
	next();
});

//增加authentication,  notAuthentication 两个方法
function authentication(req, res, next)
{
	if (!req.session.user)
	{
		req.session.error = '请先登陆';
		return res.redirect('/login');
	}
	next();
}

function notAuthentication(req, res, next)
{
	if (req.session.user)
	{
		req.session.error = '已经登陆';
		return res.redirect('/');
	}
	next();
}

app.use(app.router);
//静态文件服务器
app.use(express.static(path.join(__dirname, 'public')));


//让ejs模板文件，使用扩展名为html的文件
app.engine('.html', ejs.__express);
app.set("view engine", 'html'); // app.set("view engine", 'ejs');



// errorHandler 错误控制器
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//path resolution
app.get('/', routes.index);
app.get('/users', user.list);
//访问控制
app.all('/login', notAuthentication);
//增加路由配置
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', authentication);
app.get('/logout', routes.logout);
//认证
app.get('/home', authentication);
app.get('/home', routes.home);

//注册
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);


//路径设置路由规则，还支持更高级的路径匹配模式,加上第三个参数 next可以转移控制权继续执行
app.get('/user/:username',function(req, res, next){
	//res.send('Dear user:' + req.params.username);
	console.log('user: '+ req.params.username);
next();
});


app.get('/user/:username', function(req, res){
	res.send('again user: ' + req.params.username);
})


/*
 谁访问都行，没有任何控制
/login，用all拦截所有访问/login的请求，先调用authentication，用户登陆检查
/logout，用get拦截访问/login的请求，先调用notAuthentication，用户不登陆检查
/home，用get拦截访问/home的请求，先调用Authentication，用户登陆检查
*/

//start port
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
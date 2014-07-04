
/*
 * GET home page.
 */
var mysql = require('./db');
//调用模板解析引擎，翻译名为 index 的模板
exports.index = function(req, res){
  res.render('index', { title: "Blog" });
};

//增加方法
exports.login = function (req, res)
{
	res.render('login', { title: '用户登录'});
}

//注册
exports.reg = function(req, res)
{
	req.session.error = '欢迎注册';
	res.render('reg', { title: '欢迎注册'});
}

exports.doReg = function(req, res)
{
	if (req.body.username == '' || req.body['password'] == '')
	{
		req.session.error = '用户名和密码不能为空';
		return res.redirect('/reg');
	}
	
	if (req.body['password'] != req.body['password-repeat'])
	{
		req.session.error = '两次密码不一致';
		return res.redirect('/reg');
	}
	//验证用户是否已存在
	
		mysql.query(
        'SELECT username FROM blog_user where `username`="'+req.body.username+'"',
        function selectDb(error, results, fields) {
			if (error)
			{
				 console.log(error);
			}
			else if(results.length > 0)
			{
				req.session.error = '该用户已存在';
				return res.redirect('/reg');
			}
		});
	
	//用户不存在则插入数据
	var values = [req.body.username, req.body.password];
	mysql.query('INSERT INTO blog_user SET `username` = ?, `password` = ?', values,
		function insertDb(error, results, fields){
			if (error)
			{
				console.log(error);
			}
			else
			{
				req.session.error = '恭喜您注册成功,赶快登陆吧';
				return res.redirect('/login');
			}
		
		});
}

exports.doLogin = function (req, res)
{
	//var user ={
	//	username: 'xiaomao',
	//	password: 'admin'
	//}
	
	//查询数据库
	mysql.query(
        'SELECT * FROM blog_user where username="'+req.body.username+'" AND password="'+req.body.password+'"',
        function selectDb(error, results, fields) {
			if (error)
			{
				 console.log(error);
			}
			else if(results.length > 0)
			{
			//判断条件 results.length > 0 会避免因数据结果为空导致页面无法访问
				var user = {
					username: results[0]['username'],
				}
				req.session.user = user;
				return res.redirect('/home');
				
			}
			else
			{
				req.session.error = '用户名或密码不正确';
				return res.redirect('/login');
			}
		});
		
		//500 Error: Cannot enqueue Quit after invoking //quit.node连接上mysql后如果因网络原因丢失连接或者用户手工关闭连接后，原有的连接挂掉，需要重新连接；
		//mysql.end();
		
/*
	if (req.body.username === user.username && req.body.password === user.password)
	{
		req.session.user = user;
		//获取数据库用户信息
		mysql.query("SELECT * FROM user ", function(err, result)
		{
			//暂时没有在模板中输出用户信息
			if (!err)
			{
				res.render('home', { data: result});
				
			}
		})
		return res.redirect('/home');
	}
	else
	{
		req.session.error = '用户名或密码不正确';
		return res.redirect('/login');
	}
*/

}

exports.logout = function (req, res)
{
	req.session.user = null;
	res.redirect('/');
}

exports.home = function (req, res)
{
//	var user = {
//		username: 'admin',
//		password: 'admin'
//	}
//这里session已经起作用了，所以user显示传值已经被去掉了，是通过app.use的 res.locals变量,通过框架进行的赋值
	res.render('home', { title: 'Home'});
}


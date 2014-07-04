var mysql = require('mysql');
var	settings = require('./setting');
var connection = mysql.createConnection({
	host: settings.host,
	port: settings.port,
	database: settings.db_name,
	user: settings.username,
	password: settings.password
});
	connection.connect();
/*
	module是一个关键字，相当于return，就是说明我这个文件返回也就是exports一个类型的数据，
	当别的文件调用时，可以直接使用，不用new！
*/
	module.exports = connection;
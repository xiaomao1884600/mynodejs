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
	module��һ���ؼ��֣��൱��return������˵��������ļ�����Ҳ����exportsһ�����͵����ݣ�
	������ļ�����ʱ������ֱ��ʹ�ã�����new��
*/
	module.exports = connection;
const funcs = require('../lib/genFuncs');
const colors = require('colors');
const fs = require("fs");						// ■ 加载 fs 模块

var iniFileURL = 'conf/res_ini.json';			// 初始化文件路径
var iniResult;									// 初始化文件加载结果对象
//var svrState = -1;							// 服务器工作状态值

iniResult = JSON.parse( fs.readFileSync( iniFileURL ) );				// 获取配置文件 (同步调用模式)
var silence = iniResult[ "silence" ] || false;							// 服务器终端静默模式

funcs.printf( "Receive 'GET' server on " + " @" + colors.magenta( funcs.timeNow() ) );

module.exports = async function ( fastify, options, next ) {			// async function proxy( fastify, options, next ) {
	// [ GET ] =================================================================================================================================================
	fastify.get( '/', ( req, reply ) => {			// fastify.get( '/', async ( req, reply ) => {
		if( silence == false ){ funcs.print( colors.inverse( colors.cyan( " GET '/' " ) ) ); }
		reply.send( { "version":"0.0.1", query:req.query } );
	});
	fastify.get( '/time', ( req, reply ) => {		// fastify.get( '/time', async ( req, reply ) => {
		if( silence == false ){ funcs.print( colors.inverse( colors.cyan( " GET '/time' " ) ) + colors.magenta( " @" + funcs.timeNow( new Date() ) ) ); }
		reply.send( { time:funcs.timeNow(), "version":"0.0.1" } );				// return { time:funcs.timeNow(), "version":"0.0.1" };	// 返回数据的两种写法
	});
}						// module.exports = proxy;



/**
 * 
 * 
 * var http = require('http');
var querystring = require('querystring');

var contents = querystring.stringify({
	name:'byvoid',
	email:'byvoid@byvoid.com',
	address:'Zijing'
});

var options = {
	host:'www.byvoid.com',
	path:'/application/node/post.php',
	method:'POST',
	headers:{
		'Content-Type':'application/x-www-form-urlencoded',
		'Content-Length':contents.length
	}
}

var req = http.request(options, function(res){
	res.setEncoding('utf8');
	res.on('data',function(data){
		console.log("data:",data);   //一段html代码
	});
});

req.write(contents);
req.end;
 */
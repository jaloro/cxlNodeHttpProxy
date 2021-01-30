const funcs = require("../lib/genFunc.js");						// ■ 加载自定义通用函数模板
const colors = require( "colors" );
const fs = require("fs");								// ■ 加载 fs 模块
// const express = require("express");						// ■ 加载 express 框架
// const bodyParser=require("body-parser");
// const proxy = require('express-http-proxy');
// const proxy = require( 'fastify-http-proxy' );
// const { nextTick } = require("process");

var iniFileURL = 'conf/transfer_ini.json';	// 初始化文件路径
var iniResult;							// 初始化文件加载结果对象
//var svrState = -1;					// 服务器工作状态值
var serverPort = 3001;
var serverRoute = "/";
var silence = false;					// 服务器静默状态
var proxyHost = '127.0.0.1';			// 目标服务器 URL 地址
var proxyPort = '8001';					// 目标服务器开放的监听端口
var proxyRoute = "/";
var _params;							// 用于获取 URL 参数的数组对象
//var app = express();

iniResult = JSON.parse( fs.readFileSync( iniFileURL ) );				// 获取配置文件
silence = iniResult[ "silence" ];							// 服务器终端静默模式
serverPort = iniResult[ "serverPort" ];						// 服务器端口号
serverRoute = iniResult[ "serverRoute" ];					// 服务器路径
proxyHost = iniResult[ "proxyHost" ];						// 需要转发的目标服务器地址
proxyPort = iniResult[ "proxyPort" ];						// 需要转发的目标服务器端口号
proxyRoute = iniResult[ "proxyRoute" ];						// 需要转发的目标服务器路径

// var server = app.listen( serverPort, function (){
// 	funcs.print( colors.cyan( "    Server port:" ) + colors.yellow( serverPort ) + " - " + colors.cyan( "route:" ) + colors.green( "'" + serverRoute + "'" ) );
// 	funcs.print( colors.cyan( "    Proxy host:" ) + colors.yellow( proxyHost ) + " - " + colors.cyan( "port:" ) + colors.yellow( proxyPort ) + " - " + colors.cyan( "route:" ) + colors.green( proxyRoute ) );
// 	funcs.printf( "=======================================================================");
// });
funcs.printf( "Proxy http server start on " + colors.yellow( serverPort ) + " --> " + colors.yellow( proxyHost + ':' + proxyPort ) + colors.green( " '" + proxyRoute + "'" ) + " @" + colors.magenta( funcs.timeNow() ) );

// module.exports = async function ( fastify, opts, next) {
// 	// //fastify.register( require( './routes/transfer.js' ) );
// 	// fastify.register( proxy, {
// 	// 	upstream:"http://192.168.3.220:3000",		// 表示要用于代理的目标服务器的URL（包括协议）。
// 	// 	prefix:'/',									// 装载此插件的前缀(相当于路由)。以给定前缀开始的对当前服务器的所有请求都将被代理到提供的上游服务器。转发HTTP请求时，将从URL中删除前缀。
// 	// 	http2:false
// 	// })

// 	fastify.addHook( 'onRequest', function( req, reply, next ) {		// 添加钩子'onRequest'处理
// 		funcs.print( "Request object keys on fastify's request" );
// 		// funcs.print( Object.keys( req ) );
// 		// funcs.print( req.ip );
// 		// funcs.print( req.ips );
// 		funcs.print( req.headers );
// 		next();
// 	} );

// }

module.exports = async function ( fastify, opts, next) {

	fastify.addHook( 'onRequest', function( req, reply, next ) {		// 添加钩子'onRequest'处理
		funcs.print( "Request object keys on fastify's request" );
		// funcs.print( Object.keys( req ) );
		// funcs.print( req.ip );
		// funcs.print( req.ips );
		funcs.print( req.headers );
		next();
	} );

// 	fastify.get( serverRoute, function( req, reply ){
// 		funcs.print( "Request object keys on fastify's GET" );
// 		// funcs.print( Object.keys( req ) );
// 		funcs.print( req.headers );
// 		reply.send( req.query );
// 	});


};

		// funcs.print( req.url );
		// funcs.print( req.method );
		// funcs.print( req.header );
		// funcs.print( req.body );

	// fastify.post('/createSession', (req,reply) =>{
	// 	let dbo = db.db(mongoConfig.liveSessionDB);
	// 	dbo.collection(mongoConfig.liveSessionCollection).insertOne({name: "test"}, function (err, res){
	// 	if (err) {
	// 		reply.code(500);
	// 		reply.send({"Error" : err})
	// 	}
	// 	let sId = res.insertedId + "";
	// 	console.log("databaseName : " + dbo.databaseName);
	// 	dbo.createCollection(sId, function(err, res){
	// 		if (err) throw err;
	// 		reply.send( { "sId": sId })
	// 	});
	// 	});
	// })

		// funcs.print( req.method );		
		// funcs.print( req.params );
		// funcs.print( req.query );
	// 	// funcs.printf( req.headers );
	// 	// funcs.printf( req.raw );
	// 	// funcs.printf( req.id );
		// funcs.print( req.ip );
		// funcs.print( req.ips );
	// 	// funcs.printf( req.hostname );
	// 	// _params = req.url.split( "?" );
	// 	// if( silence == false ){
	// 	// 	funcs.printf( colors.inverse( "GET" ) + colors.green( " '" + serverRoute + "'" ) + " --> " + colors.green( "'" + proxyHost + ':' + proxyPort + proxyRoute + "'" ) + " @" + colors.green( sillyDatetime.format( new Date(), 'YYYY-MM-DD HH:mm:ss' ) ) );
	// 	// 	funcs.print( '\t' + JSON.stringify( req.query ) );
	// 	// }
	// 	// return { "version" : "0.0.1" };

	// fastify.get( serverRoute, proxy( proxyHost + ':' + proxyPort, { 	// 处理转发
	// 		proxyReqPathResolver:function( req ) {
	// 			if ( _params[ 1 ] == undefined ) return proxyRoute;
	// 			else return proxyRoute + "?" + _params[ 1 ];				//转发请求路径
	// 		}
	// // fastify.get( serverRoute, async function ( req, reply ){
	// // 	funcs.printf( "GET --> next" );
	// // });
	// }));

	// fastify.get( serverRoute, proxy( proxyHost + ':' + proxyPort ))		// 处理转发

// GET ==========================================================================================================================================
//*******************************************************
// module.exports = function ( fastify, opts, next ) {

// 	fastify.get( serverRoute, function(req, reply) {
// 		reply.send({ route: 'test' })
// 	});

	// fastify.get( serverRoute, function( req, res ){				// 处理 url 参数
	// 	_params = req.url.split( "?" );
	// 	if( silence == false ){
	// 		funcs.printf( colors.inverse( "GET" ) + colors.green( " '" + serverRoute + "'" ) + " --> " + colors.green( "'" + proxyHost + ':' + proxyPort + proxyRoute + "'" ) + " @" + colors.green( sillyDatetime.format( new Date(), 'YYYY-MM-DD HH:mm:ss' ) ) );
	// 		funcs.print( '\t' + JSON.stringify( req.query ) );
	// 	}
	// 	next();
	// });
	// fastify.get( serverRoute, proxy( proxyHost + ':' + proxyPort, { 	// 处理转发
	// 	proxyReqPathResolver:function( req ) {
	// 		if ( _params[ 1 ] == undefined ) return proxyRoute;
	// 		else return proxyRoute + "?" + _params[ 1 ];				//转发请求路径
	// 	}
	// }));

	// fastify.post('/createSession', ( req, reply ) => {
		
	// 	}
	// )
// }


//******************************************************

// app.get( serverRoute, function( req, res, next ){				// 处理 url 参数
// 	_params = req.url.split("?");
// 	if( silence == false ){
// 		funcs.printf( colors.inverse( "GET" ) + colors.green( " '" + serverRoute + "'" ) + " --> " + colors.green( "'" + proxyHost + ':' + proxyPort + proxyRoute + "'" ) + " @" + colors.green( sillyDatetime.format( new Date(), 'YYYY-MM-DD HH:mm:ss' ) ) );
// 		funcs.print( '\t' + JSON.stringify( req.query ) );
// 	}
// 	next();
// });
// app.get( serverRoute, proxy( proxyHost + ':' + proxyPort, { 	// 处理转发
// 	proxyReqPathResolver:function( req ) {
// 		if ( _params[ 1 ] == undefined ) return proxyRoute;
// 		else return proxyRoute + "?" + _params[ 1 ];       //转发请求路径
//     }
// } ) );

// POST =========================================================================================================================================
// app.post( serverRoute, function( req, res, next ){				// 处理 url 参数
// 	_params = req.url.split("?");
// 	if( silence == false ){
// 		// funcs.printf( "POST: " + "'" + serverRoute + "'" + " --> '" + proxyHost + ':' + proxyPort + proxyRoute + "' @" + sillyDatetime.format( new Date(), 'YYYY-MM-DD HH:mm:ss' ) );
// 		funcs.printf( colors.inverse( "POST" ) + colors.green( " '" + serverRoute + "'" ) + " --> " + colors.green( "'" + proxyHost + ':' + proxyPort + proxyRoute + "'" ) + " @" + colors.green( sillyDatetime.format( new Date(), 'YYYY-MM-DD HH:mm:ss' ) ) );
// 		funcs.print( '\t' + JSON.stringify( req.query ) );
// 	}
// 	next();
// });
// app.post( serverRoute, proxy( proxyHost + ':' + proxyPort, {	// 处理转发
// 	proxyReqPathResolver:function( req ) {
// 		// return proxyRoute + req.url;       //转发请求路径
// 		if ( _params[ 1 ] == undefined ) return proxyRoute;
// 		else return proxyRoute + "?" + _params[ 1 ];       //转发请求路径
// 	}
// } ) );

const funcs = require("../lib/genFunc.js");						// ■ 加载自定义通用函数模板
const colors = require( "colors" );
const sillyDatetime = require('silly-datetime');		// ■ 加载 silly-datetime 模块
const fs = require("fs");								// ■ 加载 fs 模块
const express = require("express");						// ■ 加载 express 框架
const bodyParser=require("body-parser");
const proxy = require('express-http-proxy');
// const { nextTick } = require("process");

var iniFileURL = 'conf/transfer_ini.json';	// 初始化文件路径
var iniResult;							// 初始化文件加载结果对象
//var svrState = -1;					// 服务器工作状态值
var serverPost = 3001;
var serverRoute = "/";
var silence = false;					// 服务器静默状态
var proxyHost = '127.0.0.1';			// 目标服务器 URL 地址
var proxyPost = '8001';					// 目标服务器开放的监听端口
var proxyRoute = "/";
var _params;							// 用于获取 URL 参数的数组对象

var app = express();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// app.use( express.json() );
// app.use( express.urlencoded( { extended: false } ) );
// var urlencodedParser = bodyParser.urlencoded( { extended:false } );

iniResult = JSON.parse( fs.readFileSync( iniFileURL ) );				// 获取配置文件
silence = iniResult[ "silence" ];
serverPort = iniResult[ "serverPort" ];						// 
serverRoute = iniResult[ "serverRoute" ];					//
proxyHost = iniResult[ "proxyHost" ];						// 
proxyPost = iniResult[ "proxyPort" ];						// 
proxyRoute = iniResult[ "proxyRoute" ];						// 

var server = app.listen( serverPost, function (){
	funcs.print( colors.cyan( "    Server port:" ) + colors.yellow( serverPost ) + " - " + colors.cyan( "route:" ) + colors.green( "'" + serverRoute + "'" ) );
	funcs.print( colors.cyan( "    Proxy host:" ) + colors.yellow( proxyHost ) + " - " + colors.cyan( "port:" ) + colors.yellow( proxyPost ) + " - " + colors.cyan( "route:" ) + colors.green( proxyRoute ) );
	funcs.printf( "=======================================================================");
});
funcs.printf( "Proxy http server start on " + colors.yellow( serverPost ) + " @" + colors.green( sillyDatetime.format( new Date(), 'YYYY-MM-DD HH:mm:ss' ) ) );

// GET ==========================================================================================================================================
//*******************************************************
//module.exports = function (fastify, opts, next) {
//  fastify.post('/createSession', (req,reply) =>{
//      do your work.....
//  }
//}
//******************************************************
app.get( serverRoute, function( req, res, next ){				// 处理 url 参数
	_params = req.url.split("?");
	if( silence == false ){
		funcs.printf( colors.inverse( "GET" ) + colors.green( " '" + serverRoute + "'" ) + " --> " + colors.green( "'" + proxyHost + ':' + proxyPost + proxyRoute + "'" ) + " @" + colors.green( sillyDatetime.format( new Date(), 'YYYY-MM-DD HH:mm:ss' ) ) );
		funcs.print( '\t' + JSON.stringify( req.query ) );
	}
	next();
});
app.get( serverRoute, proxy( proxyHost + ':' + proxyPost, { 	// 处理转发
	proxyReqPathResolver:function( req ) {
		if ( _params[ 1 ] == undefined ) return proxyRoute;
		else return proxyRoute + "?" + _params[ 1 ];       //转发请求路径
    }
} ) );

// POST =========================================================================================================================================
app.post( serverRoute, function( req, res, next ){				// 处理 url 参数
	_params = req.url.split("?");
	if( silence == false ){
		// funcs.printf( "POST: " + "'" + serverRoute + "'" + " --> '" + proxyHost + ':' + proxyPost + proxyRoute + "' @" + sillyDatetime.format( new Date(), 'YYYY-MM-DD HH:mm:ss' ) );
		funcs.printf( colors.inverse( "POST" ) + colors.green( " '" + serverRoute + "'" ) + " --> " + colors.green( "'" + proxyHost + ':' + proxyPost + proxyRoute + "'" ) + " @" + colors.green( sillyDatetime.format( new Date(), 'YYYY-MM-DD HH:mm:ss' ) ) );
		funcs.print( '\t' + JSON.stringify( req.query ) );
	}
	next();
});
app.post( serverRoute, proxy( proxyHost + ':' + proxyPost, {	// 处理转发
	proxyReqPathResolver:function( req ) {
		// return proxyRoute + req.url;       //转发请求路径
		if ( _params[ 1 ] == undefined ) return proxyRoute;
		else return proxyRoute + "?" + _params[ 1 ];       //转发请求路径
	}
} ) );

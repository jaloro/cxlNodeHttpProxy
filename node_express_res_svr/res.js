const funcs = require("./genFuncs");				// ■ 加载自定义通用函数模板
const colors = require( "colors" );
const express = require("express");					// ■ 加载 express 框架
const formidable = require("formidable");
const fs = require("fs");							// ■ 加载 fs 模块
const path = require('path');						// ■ 加载 path 模块

var iniFileURL = './res_ini.json';		// 初始化文件路径
var iniResult;							// 初始化文件加载结果对象

iniResult = JSON.parse( fs.readFileSync( path.resolve( __dirname, iniFileURL ) ) );				// 获取配置文件

var silence = iniResult[ "silence" ] || false;				//
var serverPort = iniResult[ "serverPort" ] || 8080;			//
var serverRoute = iniResult[ "serverRoute" ] || '/';		//
var fileDir = iniResult[ "fileDir" ] || "./uploads/";		// 临时接收 POST 文件的目录
var app = express();
var server;

// funcs.mkdir( fileDir, function( a_rtn ){	// 监测是否有保存 POST 文件的目录，没有则创建
// 	// funcs.printf( a_rtn );
// } );
fs.mkdir( path.resolve( __dirname, fileDir ), { recursive: true }, function( err ){
	if ( err ) throw err;
	funcs.printf( "创建保存文件目录成功: " + colors.green( path.resolve( __dirname, fileDir ) ) );
	server = app.listen( serverPort, function (){
		funcs.printf( "server Port:", serverPort, "route:", colors.green( serverRoute ) );
		funcs.printf( "=================================================================================");
	});
	//funcs.printf( "RES http server start on " + serverPort + " @" + sillyDatetime.format( new Date(), 'YYYY-MM-DD HH:mm:ss' ) );
	funcs.printf( "RES http server start on " + colors.yellow( serverPort ) + " @" + colors.magenta( funcs.timeNow() ) );
} );

app.get( '/time', function( req, res ){
	var _time = funcs.timeNow();
	funcs.printf( colors.inverse( "GET" ) + colors.green( " '/time'" ) + " @" + colors.magenta( _time ) );
	res.jsonp( { "host":"cxl res svr", "method":"get", now:_time } );
	res.end();
});
app.get( serverRoute, function( req, res ){
	if( silence == false ){
		funcs.printf( colors.inverse( "GET" ) + colors.green( " '" + serverRoute + "'" ) + " @" + colors.magenta( funcs.timeNow( new Date() ) ) );
		funcs.print( '\t' + JSON.stringify( req.query ) );
	}
	if ( req.url.indexOf( '?' ) !== -1 ) res.write( JSON.stringify( { "host":"cxl res svr", "method":"get", "query":req.query } ) );
	else res.write( JSON.stringify( { "host":"cxl res svr", "method":"get", "query":null } ) );
	res.end();
});


app.post( serverRoute, function( req, res ){
	if( silence == false ){
		funcs.printf( colors.inverse( "POST" ) + colors.green( " '" + serverRoute + "'" ) + " @" + colors.magenta( funcs.timeNow( new Date() ) ) );
		funcs.print( '\t' + JSON.stringify( req.query ) );
	}
	var form = new formidable.IncomingForm();  
	form.uploadDir = path.resolve( __dirname, fileDir );	// 保存图片的目录，最后的 “/” 必须有; 此处增加 __dirname 是为了在任何地方运行本脚本，都可以找到正确对应的文件保存目录
	form.keepExtensions = true;				// 保存图片时是否保留文件的扩展名
	form.parse( req, function ( err, fields, files ) {
		var obj = {};
		Object.keys( fields ).forEach( function ( name ) {
			obj[ name ] = fields[ name ];
			funcs.print('+++');
		});
		funcs.printf( Object.keys( req ) );
		let _filesNum = Object.keys( files ).length;
		// funcs.printf( _filesNum );
		// funcs.printf( Object.keys( files.file ) );
		if ( _filesNum > 0 ){		// 检测是否有 post 文件对象
			let _resData = { "host":"cxl res svr", "method":"post", "files":[], "query":req.query };
			let _filesIdx = 0;		// 处理多个文件对象时所需的临时索引值
			let _files = [];
			Object.keys( files ).forEach( function ( name ) {
				if ( files[ name ] && files[ name ].name ) {
					// obj[ name ] = files[ name ];
					// ====================== 同步写法 ===================================
					// funcs.print( colors.inverse( colors.cyan( ' 同步模式 > ' ) ) );
					// funcs.printf( _filesIdx + '/' + _filesNum, files[ name ].name );
					try {
						fs.renameSync( files[ name ].path, form.uploadDir + "/" + files[ name ].name );
						// _resData[ "files" ].push( { "file":files[ name ].name, "idx":_filesIdx } );
						_files.push( { "file":files[ name ].name, "idx":_filesIdx } );
						_filesIdx ++;
						funcs.printf( _filesIdx + '/' + _filesNum, files[ name ].name );
					} catch( error ) {
						throw( error );
					}
					
					// funcs.printf( _filesIdx + '/' + _filesNum, files[ name ].name );
					// if ( _filesIdx >= _filesNum ){		// 判断是否已经处理完所有文件对象
					// 	res.type( 'application/json' );			// 可屏蔽？
					// 	_resData[ "files" ] = _files;
					// 	res.jsonp( _resData );
					// 	res.end();								// 可屏蔽？
					// }
					
					// ====================== 异步写法（通过回调函数）======================
					// fs.rename( files[ name ].path, form.uploadDir + "/" + files[ name ].name, function( err ){
					// 	if ( err ) throw err;
					// 	_resData[ "files" ].push( { "file":files[ name ].name, "idx":_filesIdx } );
					// 	_filesIdx ++;
					// 	funcs.printf( _filesIdx, files[ name ].name );
					// 	if ( _filesIdx >= _filesNum ){		// 判断是否已经处理完所有文件对象
					// 		res.type( 'application/json' );			// 可屏蔽？
					// 		res.jsonp( _resData );
					// 		res.end();								// 可屏蔽？
					// 	}
					// } );
				}
			});
			// _resData[ "files" ] = _files;
			res.jsonp( _resData );
		}
		else{
			res.jsonp( { "host":"cxl res svr", "method":"post", "file":[], "query":req.query } );
		}
	});
});



// const funcs = require('../lib/genFuncs');
// const colors = require('colors');
// const http = require('http');

const path = require('path');
const fs = require("fs");						// ■ 加载 fs 模块
// const iconv = require('iconv-lite');
const util = require("util");
const fuRequire = require("myjs-common").FuRequire;
const { pipeline } = require('stream');
const { stringify } = require('querystring');
const pump = util.promisify(pipeline);

var iniFileURL = 'conf/transfer_ini.json';	// 初始化文件路径
var iniResult;								// 初始化文件加载结果对象
//var svrState = -1;						// 服务器工作状态值

iniResult = JSON.parse( fs.readFileSync( iniFileURL ) );				// 获取配置文件 (同步调用模式)
var silence = iniResult[ "silence" ] || false;							// 服务器终端静默模式
var serverRoute = iniResult[ "serverRoute" ] || "/";					// 服务器路径
var imgsDir = iniResult[ "imgsDir" ] || "./imgsTemp/";					// 
var proxyHost = iniResult[ "proxyHost" ] || "127.0.0.1";				// 需要转发的目标服务器地址
var proxyPort = iniResult[ "proxyPort" ] || '8000';						// 需要转发的目标服务器端口号
var proxyRoute = iniResult[ "proxyRoute" ] || "/";						// 需要转发的目标服务器路径

fs.mkdir( path.resolve( "./", imgsDir ), { recursive: true }, function( err ){		// 把 __dirname 修改为 "./"
	if ( err ) throw err;
	console.log( "创建保存文件目录成功: " + path.resolve( "./", imgsDir ) );
	console.log( "Transfer http server start on " + " @" + Date().toLocaleString() );
} );

var _uufnIndex = 0;
// 获取唯一文件名函数
function uufn(){
	let _uufn = '';
	if ( ++_uufnIndex > 10000 ) _uufnIndex = 0;
	_uufn = _uufn + parseInt( Date.now() ) + "-" + _uufnIndex;
	// _uufn = _uufn + funcs.getTimestamp() + "-" + _uufnIndex;
	return _uufn;
}

// async function proxy( fastify, options, next ) {
module.exports = async function ( fastify, options, next ) {
	// [ POST ] ================================================================================================================================================
	// Register plugins
	fastify.register(require('fastify-multipart'),{	addToBody:false });		// 把 form-data 中的数据转移到 request 的 body 中；适合接收多个文件的情况
	fastify.post( serverRoute, async ( req, reply ) => {
		if( silence == false ) console.log(  " POST '/' " );
		// req.log.info('some info');
		// 多文件处理 ====================================================================
		var _filePathName = '';
		var _files = [];
		const _datas = await req.parts();
		for await ( const _data of _datas ) {
			// if (_data.file) { funcs.printf( _data.file + " - " + _data.filename ); }
			// else funcs.printf( _data.fieldname + " : " + _data.value );
			if ( _data.file ) {
				try {	// 尝试保存文件
					// await pump( _data.file, fs.createWriteStream( path.resolve( "./", imgsDir ) + "/" + _data.filename ) );
					_filePathName = path.resolve( "./", imgsDir ) + "/" + uufn() + path.extname( _data.filename );
					_files.push( _filePathName );
					await pump( _data.file, fs.createWriteStream( _filePathName ) );
				} catch ( error ) {
					if ( error instanceof fastify.multipartErrors.FilesLimitError ) { }
					throw( error );
				}
			} else {
				// funcs.printf( Object.keys( _data ) );
				// funcs.printf( _data.fieldname, _data.value );
			}
		}
		// 发送 post 请求
		// funcs.print( _files );
		if ( _files.length < 1 ) {
			reply.send( { "statusCode":8414, "code":"FST_INVALID_MULTIPART_CONTENT_TYPE", "error":"Not Acceptable", "message":"the request is not multipart", "query":req.query, "on":Date().toLocaleString() } );	// return { "res":'POST /', "version":"0.0.1", "query":req.query, "on":funcs.timeNow() };
		} else {
			let _query = stringify( req.query );
			let _options = {
				method: 'post',
				host: proxyHost,
				port: proxyPort,
				path: proxyRoute + ( _query == '' ? '' : ( "?" + _query ) ),
				file: "file",
				params: req.query
			};
			fuRequire.http( _files, _options, ( code, data ) => {
				// console.log(`响应码: ${code}`);
				// console.log(`响应数据: ${data}`);
				reply.send( data );
			});
		}
	});
}
// module.exports = proxy;		//routes









	// [ GET ] =================================================================================================================================================
	// fastify.get( serverRoute, ( req, reply ) => {			// fastify.get( '/', async ( req, reply ) => {
	// 	if( silence == false ){ funcs.print( colors.inverse( colors.cyan( " GET '/' " ) ) ); }
	// 	http.get('http://' + proxyHost + ':' + proxyPort + proxyRoute + req.raw.url, ( response ) => {
	// 		let _resData = '';
	// 		response.on('data', ( _chunk ) => {	_resData += _chunk; });			// called when a data chunk is received. // 接收转发 http 请求后返回的数据块
	// 		response.on('end', () => { reply.send( JSON.parse(_resData) ); });	// called when the complete response is received. // 接收返回数据结束，返回接收到的数据给 fastify
	// 	}).on("error", ( error ) => {	reply.send( error ); });				// 转发 http 请求时发生错误
	// });
	// fastify.get( '/time', ( req, reply ) => {		// fastify.get( '/time', async ( req, reply ) => {
	// 	if( silence == false ){ funcs.print( colors.inverse( colors.cyan( " GET '/time' " ) ) + colors.magenta( " @" + funcs.timeNow( new Date() ) ) ); }
	// 	reply.send( { time:funcs.timeNow(), "version":"0.0.1" } );				// return { time:funcs.timeNow(), "version":"0.0.1" };	// 返回数据的两种写法
	// });
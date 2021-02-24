const funcs = require('../lib/genFuncs');
const colors = require('colors');
const http = require('http');
const path = require('path');
const fs = require("fs");						// ■ 加载 fs 模块
const util = require("util");
const { pipeline } = require('stream');
const pump = util.promisify(pipeline);
// const { stringify } = require('querystring');

var iniFileURL = 'conf/res_ini.json';	// 初始化文件路径
var iniResult;							// 初始化文件加载结果对象
//var svrState = -1;					// 服务器工作状态值

iniResult = JSON.parse( fs.readFileSync( iniFileURL ) );				// 获取配置文件 (同步调用模式)
var silence = iniResult[ "silence" ] || false;							// 服务器终端静默模式
var serverRoute = iniResult[ "serverRoute" ] || "/";					// 服务器路径
var imgsDir = iniResult[ "imgsDir" ] || "./imgsTemp/";					// 图片保存位置

fs.mkdir( path.resolve( "./", imgsDir ), { recursive: true }, function( err ){		// 把 __dirname 修改为 "./"
	if ( err ) throw err;
	funcs.printf( "创建保存文件目录成功: " + colors.green( path.resolve( "./", imgsDir ) ) );
	funcs.printf( "Receive 'POST' server on " + " @" + colors.magenta( funcs.timeNow() ) );
} );

var _uufnIndex = 0;
function uufn() {		// 函数 --- 创建唯一文件名
	let _uufn = '';
	if ( ++_uufnIndex > 10000 ) _uufnIndex = 0;
	_uufn = _uufn + funcs.getTimestamp() + "-" + _uufnIndex;
	return _uufn;
}

module.exports = async function ( fastify, options, next ) {		// async function proxy( fastify, options, next ) {
	fastify.register(require('fastify-multipart', {addToBody:false}));				// 此句被移到了加载此代码的外部脚本处 by CXL
	fastify.post( serverRoute, async ( req, reply ) => {
		if( silence == false ){ funcs.print( colors.inverse( colors.cyan( " POST '/' " ) ) ); }	// req.log.info('some info');
		let _filePathName = '';
		let _files = [];
		let _values = {};
		let _res = {};
		const _datas = await req.parts();							// 多文件（或值对）处理 =====================================
		try {		// 注：如果不用 try，当没有任何 form-data 参数传递时，会触发错误并自动返回一个 statusCode 为 406 的 json 值，程序不会 crash
			for await ( const _data of _datas ) {
				if ( _data.file ) {
					try {	// 尝试保存文件
						_filePathName = path.resolve( "./", imgsDir ) + "/" + uufn() + path.extname( _data.filename );
						_files.push( _filePathName );				// 暂存文件参
						await pump( _data.file, fs.createWriteStream( _filePathName ) );		// 保存文件
					} catch ( error ) {
						if ( error instanceof fastify.multipartErrors.FilesLimitError ) { }
						throw( error );
					}
				} else {
					_values[ _data.fieldname ] = _data.value;		// 暂存值对参
				}
			}
			// _res = { "statusCode":200, "version":"0.0.1", "method":"POST", "time":funcs.timeNow(), "files":_files, "values":_values, "query":req.query };
			_res = {
				"filename":"dog.jpg",
				"objects":[
					{"class_id":58,"confidence":32.5,"name":"people-face","relative_coordinates":{"center_x":0.130001,"center_y":0.682989,"width":0.140001,"height":0.180412}},
					{"class_id":16,"confidence":97.9,"name":"dog","relative_coordinates":{"center_x":0.430001,"center_y":0.634021,"width":0.300001,"height":0.340206}},
					{"class_id":1,"confidence":92.3,"name":"bicycle","relative_coordinates":{"center_x":0.960001,"center_y":0.335051,"width":0.080001,"height":0.283505}}
				],
				"frame_id":1
			};
			if( silence == false ) funcs.print( _res );
			reply.send( _res );
		}
		catch( error ){
			_res = { "statusCode":406, "version":"0.0.1", "code":"FST_INVALID_MULTIPART_CONTENT_TYPE", "method":"POST", "time":funcs.timeNow(), "error":"Not Acceptable", "message": "the request is not multipart" };
			if( silence == false ) funcs.print( _res );
			reply.send(  );
		}
	});
}					// module.exports = proxy;






/**
 // 单文件处理【 通过 fastify-multipart 直接处理req 】 ====================================================================
		// funcs.print( req.query );
		// var _data = {};
		// try {
		// 	_data = await req.file();
		// } catch ( error ) {
		// 	if (error instanceof fastify.multipartErrors.FilesLimitError) {
		// 		// handle error
		// 	}
		// 	throw( error );
		// }
		// // funcs.printf( "fields", ( _data.fields ) ); funcs.printf( "file", typeof( _data.file ) ); funcs.printf( "_buf", typeof( _data._buf ) ); funcs.printf( Object.keys( _data ) );
		// // funcs.printf( "fieldname", ( _data.fieldname ) );	funcs.printf( "filename", ( _data.filename ) );	funcs.printf( "encoding", ( _data.encoding ) );	funcs.printf( "mimetype", ( _data.mimetype ) );
		// // await _data.toBuffer() // Buffer // to accumulate the file in memory! Be careful!
		// // funcs.printf( colors.yellow( funcs.timeNow() ) );
		// try {
		// 	await pump( _data.file, fs.createWriteStream( path.resolve( "./", imgsDir ) + "/" +　_data.filename ) );
		// } catch ( error ) {
		// 	if (error instanceof fastify.multipartErrors.FilesLimitError) { }
		// 	throw( error );
		// }
 */
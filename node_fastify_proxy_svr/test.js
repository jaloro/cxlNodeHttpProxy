const http = require('http');
// Require the framework and instantiate it
const fastify = require('fastify')({
	// trustProxy: true,
	// logger: true
});

// fastify.register( require('fastify-formbody') );
fastify.register( require('fastify-multipart') );

// Declare a route
fastify.post('/', async ( request, reply ) => {
	console.log( " POST " );
	return { "version" : "0.0.1" }
});

fastify.get( '/', ( req, reply ) => {			// fastify.get( '/', async ( req, reply ) => {
	console.log( " GET " );	//if( silence == false ){ funcs.print( colors.inverse( colors.cyan( " GET '/' " ) ) ); }
	reply.send( req.query );
	// http.get('http://' + proxyHost + ':' + proxyPort + proxyRoute + req.raw.url, ( response ) => {
	// 	let _resData = '';
	// 	response.on('data', ( _chunk ) => {	_resData += _chunk; });			// called when a data chunk is received. // 接收转发 http 请求后返回的数据块
	// 	response.on('end', () => { reply.send( JSON.parse(_resData) ); });	// called when the complete response is received. // 接收返回数据结束，返回接收到的数据给 fastify
	// }).on("error", ( error ) => {	reply.send( error ); });				// 转发 http 请求时发生错误
});

// fastify.addHook('onRequest', ( request, reply, done ) => {
// 	// 其他代码
// 	done();
// 	console.log( "Hook 'onRequest': " + request.method );
// 	console.log( "request.url " + request.url );
// 	console.log( "request.originaUrl " + request.originalUrl );
// 	console.log( Object.keys( request ) );
// 	// Object.keys( request ).forEach( function ( _key ) {
// 	//	 console.log( "request." + _key );
// 	//	 // console.log( "request." + _key + ":" + request[ _key ] );
// 	// } );
// 	let params = {};
// 	if ( request.url.indexOf('?') !== -1)
// 	{
// 		params = request.url.split("?");
// 		console.log( params );
// 		params = decodeURIComponent( params[ 1 ] ).split("&");
// 		for(var $i=0; $i<params.length; $i++)
// 		{
// 			var myitem = params[$i].split("=");
// 			console.log( myitem[ 0 ] + ":" + myitem[ 1 ] );
// 		}
// 	}
// 	console.log( request.body );
// });

// Run the server! ===================================== 同步写法
const start = async () => {
	try {
		await fastify.listen( process.env.PORT || 3000, '0.0.0.0' );
		console.log( "server listening on " + fastify.server.address().port );
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}
start();

// Run the server! ===================================== 异步写法
// const start = function(){
// 	fastify.listen( process.env.PORT || 3000, '0.0.0.0', function ( err, address ) {
// 		if ( err ) {
// 			fastify.log.error( err );
// 			process.exit( 1 );
// 		}
// 		// fastify.log.info(`server listening on ${address}`)
// 		// fastify.log.info(`server listening on ${fastify.server.address().port}`);	// fastify.server.address().port / fastify.server.address().address
// 		funcs.print( 'Proxy Svr listening on ' + colors.yellow( address + colors.magenta( ' @' + funcs.timeNow() ) ) );
// 	} )
// };
// start();


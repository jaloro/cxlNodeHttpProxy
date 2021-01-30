const funcs = require('./lib/genFuncs');
const colors = require('colors');

// Require the framework and instantiate it
const fastify = require('fastify')({
	// trustProxy: true,
	// logger: true
})

// Declare a route
// fastify.post('/', async ( request, options, reply ) => {
// 	funcs.print( colors.inverse( colors.cyan( " POST " ) ) + " req");
// 	return { "version" : "0.0.1" }
// })

// Register plugins
fastify.register(require('fastify-multipart'),{
	addToBody:false			// 把 form-data 中的数据转移到 request 的 body 中；适合接收多个文件的情况
});

// Register rountes
// for tictactoe
fastify.register(require('./routes/transfer.js'));
// fastify.register(require('./routes/sessions.js'))

// Run the server!
// 同步写法
const start = async () => {
	try {
		await fastify.listen(process.env.PORT || 3000, '0.0.0.0');
		fastify.log.info(`server listening on ${fastify.server.address().port}`);
		funcs.print( 'Proxy Svr listening on ' + colors.yellow( fastify.server.address().port ) + colors.magenta( ' @' + funcs.timeNow() ) );
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}
start();

// 异步写法
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












//================================================================================================================================================= 参考资料
// fastify.register(require('fastify-multipart'), {
// 	addToBody:true,
// 	attachFieldsToBody: true,
// 	limits: {
// 		fieldNameSize: 100,	// Max field name size in bytes
// 		fieldSize: 1000000,	// Max field value size in bytes
// 		fields: 10,			// Max number of non-file fields
// 		fileSize: 100,		// For multipart forms, the max file size
// 		files: 1,			// Max number of file fields
// 		headerPairs: 2000	// Max number of header key=>value pairs
// 	}
// });

// 20210113061445-���G
// 20210113061445-微信图片
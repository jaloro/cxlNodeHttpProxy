// Require the framework and instantiate it
const fastify = require('fastify')({
	//trustProxy: true,
	logger: true
});
// const proxy = require( 'fastify-http-proxy' );

// Declare a route
// fastify.get('/', async (request, reply) => {
// 	return { "version" : "0.0.1" };
// });

// Register rountes
// for tictactoe
// fastify.register(require('./routes/sessions.js'));
fastify.register( require( './routes/transfer.js' ) );
// fastify.register( proxy, {
// 	upstream:"http://192.168.3.220:3000",		// 表示要用于代理的目标服务器的URL（包括协议）。
// 	prefix:'/',									// 装载此插件的前缀(相当于路由)。以给定前缀开始的对当前服务器的所有请求都将被代理到提供的上游服务器。转发HTTP请求时，将从URL中删除前缀。
// 	http2:false
// })
// Run the server!
const start = async () => {
	try {
		await fastify.listen( process.env.PORT || 3000, '0.0.0.0' );
		// fastify.log.info(`server listening on ${fastify.server.address().port}`);
		// fastify.log.info( 'server listening on ${fastify.server.address().port}' );
	} catch ( err ) {
		fastify.log.error( err );
		process.exit( 1 );
	};
};
start();

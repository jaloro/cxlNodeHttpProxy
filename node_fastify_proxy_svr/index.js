// Require the framework and instantiate it
const fastify = require('fastify')({
	logger: false
})

// Health check route
fastify.get('/', async ( request, options, reply ) => {
	return { "version" : "0.0.1" }
});

// Register rountes
fastify.register(require('./routes/transfer.js'));
// fastify.register(require('./routes/sessions.js'))

// Run the server!
const start = async () => {
	try {
		console.log( '==========================================================' );
		var serverPort = 4000;
		await fastify.listen(process.env.PORT || serverPort, '0.0.0.0');
		fastify.log.info(`server listening on ${fastify.server.address().port}`);
		console.log( '\x1b[96m%s\x1b[0m', "Server Port:", serverPort );
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}
start();

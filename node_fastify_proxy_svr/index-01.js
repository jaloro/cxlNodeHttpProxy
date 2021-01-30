// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})

// Declare a route
fastify.get('/', async (request, reply) => {
  return { "version" : "0.0.1" }
})

// Register rountes
// for tictactoe
// fastify.register(require('./routes/sessions.js'));
fastify.register(require('./routes/transfer.js'));

// Run the server!
const start = async () => {
  try {
    await fastify.listen( process.env.PORT || 3000, '0.0.0.0' );
    // fastify.log.info(`server listening on ${fastify.server.address().port}`);
    fastify.log.info( 'server listening on ${fastify.server.address().port}' );
  } catch ( err ) {
    fastify.log.error( err );
    process.exit( 1 );
  };
};
start();

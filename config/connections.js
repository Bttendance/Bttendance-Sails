/**
 * Connections
 * 
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `sails-mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.) 
 * A `connection` is that additional information.
 * 
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys 
 * in `config/local.js`, environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 * For more information on configuration, check out:
 * http://links.sailsjs.org/docs/config/connections
 */

module.exports.connections = {

  // psql "dbname=d8n4i2f6q5clp2 host=ec2-54-225-88-13.compute-1.amazonaws.com user=u7nsa3j4q3ng05 password=pf3koh48m9br384km90u7kng962 port=5642 sslmode=require"
  postgresProduction: {
    module   : 'sails-postgresql',
    host     : 'ec2-54-225-88-13.compute-1.amazonaws.com',
    port     : 5642,
    user     : 'u7nsa3j4q3ng05',
    password : 'pf3koh48m9br384km90u7kng962',
    database : 'd8n4i2f6q5clp2',
    ssl      : true
  },

  // psql "dbname=d9vocafm0kncoe host=ec2-54-204-42-178.compute-1.amazonaws.com user=neqpefgtcbgyym password=ub0oR3o9VsAbGsuiYarNsx4yqw port=5432 sslmode=require"
  postgresDevelopment: {
    module   : 'sails-postgresql',
    host     : 'ec2-54-204-42-178.compute-1.amazonaws.com',
    port     : 5432,
    user     : 'neqpefgtcbgyym',
    password : 'ub0oR3o9VsAbGsuiYarNsx4yqw',
    database : 'd9vocafm0kncoe',
    ssl      : true
  },

  // psql "dbname=postgres"
  postgresLocal: {
    module   : 'sails-postgresql',
    host     : 'localhost',
    port     : 5432,
    user     : 'TheFinestArtist',
    password : 'postgres',
    database : 'postgres'
  },

  // redis-cli -h pub-redis-13039.us-east-1-3.3.ec2.garantiadata.com -p 13039 -a Wpx1B0Mn54G0I1mT
  redisProduction: {
    module   : 'sails-redis',
    host     : 'pub-redis-13039.us-east-1-3.3.ec2.garantiadata.com',
    port     : 13039,
    options: {
      auth_pass: 'Wpx1B0Mn54G0I1mT',
      parser: 'javascript',
      return_buffers: false,
      detect_buffers: false,
      socket_nodelay: true,
      no_ready_check: false,
      enable_offline_queue: true
    }
  },

  // redis-cli -h pub-redis-18746.us-east-1-3.3.ec2.garantiadata.com -p 18746 -a gMKUfHW5uRSxpd54
  redisDevelopment: {
    module   : 'sails-redis',
    host     : 'pub-redis-18746.us-east-1-3.3.ec2.garantiadata.com',
    port     : 18746,
    options: {
      auth_pass: 'gMKUfHW5uRSxpd54',
      parser: 'javascript',
      return_buffers: false,
      detect_buffers: false,
      socket_nodelay: true,
      no_ready_check: false,
      enable_offline_queue: true
    }
  }

};

exports.getPostgres = function() {
  if (process.env.NODE_ENV == 'production')
    return 'postgresProduction';
  else if (process.env.NODE_ENV == 'development')
    return 'postgresDevelopment';
  else 
    return 'postgresLocal';
}

exports.getRedis = function() {
  if (process.env.NODE_ENV == 'production')
    return 'redisProduction';
  else if (process.env.NODE_ENV == 'development')
    return 'redisDevelopment';
  else 
    return 'redisDevelopment';
}
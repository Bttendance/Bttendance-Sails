/**
 * Connections
 * (sails.config.connections)
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
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.connections.html
 */

module.exports.connections = {

  /***************************************************************************
  *                                                                          *
  * Local disk storage for DEVELOPMENT ONLY                                  *
  *                                                                          *
  * Installed by default.                                                    *
  *                                                                          *
  ***************************************************************************/
  localDiskDb: {
    adapter: 'sails-disk'
  },

  /***************************************************************************
  *                                                                          *
  * MySQL is the world's most popular relational database.                   *
  * http://en.wikipedia.org/wiki/MySQL                                       *
  *                                                                          *
  * Run: npm install sails-mysql                                             *
  *                                                                          *
  ***************************************************************************/
  someMysqlServer: {
    adapter: 'sails-mysql',
    host: 'YOUR_MYSQL_SERVER_HOSTNAME_OR_IP_ADDRESS',
    user: 'YOUR_MYSQL_USER',
    password: 'YOUR_MYSQL_PASSWORD',
    database: 'YOUR_MYSQL_DB'
  },

  /***************************************************************************
  *                                                                          *
  * MongoDB is the leading NoSQL database.                                   *
  * http://en.wikipedia.org/wiki/MongoDB                                     *
  *                                                                          *
  * Run: npm install sails-mongo                                             *
  *                                                                          *
  ***************************************************************************/
  someMongodbServer: {
    adapter: 'sails-mongo',
    host: 'localhost',
    port: 27017,
    // user: 'username',
    // password: 'password',
    // database: 'your_mongo_db_name_here'
  },

  /***************************************************************************
  *                                                                          *
  * PostgreSQL is another officially supported relational database.          *
  * http://en.wikipedia.org/wiki/PostgreSQL                                  *
  *                                                                          *
  * Run: npm install sails-postgresql                                        *
  *                                                                          *
  *                                                                          *
  ***************************************************************************/
  somePostgresqlServer: {
    adapter: 'sails-postgresql',
    host: 'YOUR_POSTGRES_SERVER_HOSTNAME_OR_IP_ADDRESS',
    user: 'YOUR_POSTGRES_USER',
    password: 'YOUR_POSTGRES_PASSWORD',
    database: 'YOUR_POSTGRES_DB'
  },

  /***************************************************************************
  *                                                                          *
  * PostgreSQL is another officially supported relational database.          *
  * http://en.wikipedia.org/wiki/PostgreSQL                                  *
  *                                                                          *
  * Run: npm install sails-postgresql                                        *
  *                                                                          *
  *                                                                          *
  ***************************************************************************/
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

  /***************************************************************************
  *                                                                          *
  * PostgreSQL is another officially supported relational database.          *
  * http://en.wikipedia.org/wiki/PostgreSQL                                  *
  *                                                                          *
  * Run: npm install sails-postgresql                                        *
  *                                                                          *
  *                                                                          *
  ***************************************************************************/
  // psql "dbname=db7ttqi4se36vg host=ec2-54-83-43-49.compute-1.amazonaws.com user=dvdygiyqqnldrr password=BDh-fCMXcP-4JzdjKm1tSLCHuG port=5432 sslmode=require"
  postgresDevelopment: {
    module   : 'sails-postgresql',
    host     : 'ec2-54-83-43-49.compute-1.amazonaws.com',
    port     : 5432,
    user     : 'dvdygiyqqnldrr',
    password : 'BDh-fCMXcP-4JzdjKm1tSLCHuG',
    database : 'db7ttqi4se36vg',
    ssl      : true
  },


  /***************************************************************************
  *                                                                          *
  * More adapters: https://github.com/balderdashy/sails                      *
  *                                                                          *
  ***************************************************************************/

  // psql "dbname=postgres"
  // postgresLocal: {
  //   module   : 'sails-postgresql',
  //   host     : 'localhost',
  //   port     : 5432,
  //   user     : 'TheFinestArtist',
  //   password : 'postgres',
  //   database : 'postgres'
  // },

  // memory: {
  //   adapter: 'sails-memory'
  // }

  // redis-cli -h pub-redis-15511.us-east-1-3.3.ec2.garantiadata.com -p 15511 -a eBKknThiKi1VHZSe
  redisProduction: {
    module   : 'sails-redis',
    host     : 'pub-redis-15511.us-east-1-3.3.ec2.garantiadata.com',
    port     : 15511,
    options: {
      auth_pass: 'eBKknThiKi1VHZSe',
      parser: 'javascript',
      return_buffers: false,
      detect_buffers: false,
      socket_nodelay: true,
      no_ready_check: false,
      enable_offline_queue: true
    }
  },

  // redis-cli -h pub-redis-19584.us-east-1-4.1.ec2.garantiadata.com -p 19584 -a ViQtWlylHb2VcBwE
  redisDevelopment: {
    module   : 'sails-redis',
    host     : 'pub-redis-19584.us-east-1-4.1.ec2.garantiadata.com',
    port     : 19584,
    options: {
      auth_pass: 'ViQtWlylHb2VcBwE',
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
    return 'postgresDevelopment';
},

exports.getRedis = function() {
    if (process.env.NODE_ENV == 'production')
        return 'redisProduction';
    else if (process.env.NODE_ENV == 'development')
        return 'redisDevelopment';
    else 
        return 'redisDevelopment';
}
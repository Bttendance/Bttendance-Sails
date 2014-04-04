

####Install wget
    $ ftp http://ftp.gnu.org/pub/gnu/wget/wget-1.15.tar.gz
    $ tar -xzf wget-1.15.tar.gz
    $ cd wget-1.15
    $ ./configure --with-ssl=openssl
    $ make
    $ sudo make install

####Install Redis
    $ wget http://download.redis.io/releases/redis-2.8.8.tar.gz
    $ tar xzf redis-2.8.8.tar.gz
    $ cd redis-2.8.8
    $ make

####redis-cli codes
    $ redis-cli -h pub-redis-13039.us-east-1-3.3.ec2.garantiadata.com -p 13039 -a Wpx1B0Mn54G0I1mT
    $ redis-cli -h pub-redis-18746.us-east-1-3.3.ec2.garantiadata.com -p 18746 -a gMKUfHW5uRSxpd54




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

    exports.getRedis = function() {
        if (process.env.NODE_ENV == 'production')
            return 'redisProduction';
        else if (process.env.NODE_ENV == 'development')
            return 'redisDevelopment';
        else 
            return 'redisDevelopment';
    }
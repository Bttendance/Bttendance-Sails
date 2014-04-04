/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name : ['Bttendance-dev'],
  /**
   * Your New Relic license key.
   */
  license_key : '302cd8c75e7a012a91a4810be466198eb4a31cf5',
  
  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : 'trace'
  }
};

var getAppname = function() {
  if (process.env.NODE_ENV == 'production')
    return ['Bttendance'];
  else if (process.env.NODE_ENV == 'development')
    return ['Bttendance-dev'];
  else 
    return ['Bttendance-local'];
}

var getLicense = function() {
  if (process.env.NODE_ENV == 'production')
    return '39d45e8fc99c1bf416541fa836b87b5b1978d615';
  else if (process.env.NODE_ENV == 'development')
    return '302cd8c75e7a012a91a4810be466198eb4a31cf5';
  else 
    return '';
}
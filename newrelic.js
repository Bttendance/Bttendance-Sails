'use strict';

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
  app_ : getAppname(),
  /**
   * Your New Relic license key.
   */
  license_key : '39d45e8fc99c1bf416541fa836b87b5b1978d615',

  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : 'info'
  }
};

function getAppname() {
  if (process.env.NODE_ENV === 'production')
    return ['Bttendance'];
  else if (process.env.NODE_ENV === 'development')
    return ['Bttendance-dev'];
  else
    return ['Bttendance-local'];
}

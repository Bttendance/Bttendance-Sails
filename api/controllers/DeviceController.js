/**
 * DeviceController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to DeviceController)
   */
  _config: {},


  destroy: function(req, res) {
    res.contentType('application/json');
    var id = req.param('id');

    Device.findOneById(id).done(function(err, obj) {

      if (err) {
        console.log(err);
        res.send(500, { error: "Object Find Error" });
        return;
      } 

      if (!obj) {
        console.log('No Object Found (id : ' + id + ')');
        res.send(404, { error: "No Object Found Error" });
        return;
      }

      obj.destroy(function(err) {

        if (err) {
          console.log(err);
          res.send(500, { error: "Object Destroy Error" });
          return;
        }

        console.log("Object has been destroyed (id : " + id + ')');
        var objJSON = JSON.stringify(obj);
        res.send(objJSON);
              
      });
      return;
    });
  }
  
};

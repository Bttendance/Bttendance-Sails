/**
 * PostController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  destroy: function(req, res) {
    res.contentType('application/json');
    var id = req.param('id');

    Post.findOneById(id).done(function(err, obj) {

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

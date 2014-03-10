var db = require('./db');

module.exports = function(app) {
  app.get('/:service/:user', function(req, res) {
    var service = req.param('service')
      , user = req.param('user');

    db.get(service, user, function(err, data) {
      if(err) throw err;
      res.send(data, data ? 200 : 404);
    });
  });
};
var redis = require('redis')
  , client = redis.createClient();

client.on('error', function(err) {
  console.log('Error: ' + err);
});

function generateKey(service, user) {
  return service + ':' + user;
}

module.exports = {
  set: function(service, user, data, cb) {
    client.set(generateKey(service, user), data, cb);
  },
  get: function(service, user, cb) {
    client.get(generateKey(service, user), cb);
  }
};
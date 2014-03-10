var redis = require('redis')
  , client;

if(process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  client = redis.createClient(rtg.port, rtg.hostname);
  redis.client.auth(rtg.auth.split(":")[1]);
} else {
  client = redis.createClient();
}

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
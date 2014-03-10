var redwrap = require('redwrap')
  , db = require('./db')
  , Seq = require('seq')
  , subreddit = 'coinbook';


function update() {
  Seq()
    .seq(function() {
      db.get('reddit_bookkeeping', 'last_post', this);
    })
    .seq(function(lastPost) {
      console.log('lastPost', lastPost);
      redwrap
        .r(subreddit)
        .sort('new')
        .after(lastPost, this);
    })
    .seq(function(listing) {
      var data = listing.data
        , self = this;

      if(data.after) {
        db.set('reddit_bookkeeping', 'last_post', data.after, function(err, reply) {
          self(err, data.children);
        });
      } else
        self(null, data.children);
    })
    .flatten()
    .reverse()  // We want the most recent post to be applied last (to make updates work)
    .parEach(function(post) {
      db.set('reddit', post.data.author, post.data.title);
    })
    .catch(function(err) {
      console.log('Error (reddit): ' + err);
    });
}

var hInterval = null;
module.exports = function(app) {
  app.configure('development', function() {
    app.get('/poll', function(req, res) {
      update();
      res.send(200);
    });
  });

  return {
    start: function(interval) {
      hInterval = setInterval(update, interval || (1000*60*60*3));
      return this;
    },
    stop: function() {
      clearInterval(hInterval);
      hInterval = null;
      return this;
    },
    poll: update
  };
};


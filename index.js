var express = require('express')
  , app = express();

app.configure('development', function() {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

app.use(require('cors')());
app.listen(process.env.PORT || 5000);

require('./lib/query')(app);

var reddit = require('./lib/reddit')(app);
reddit.start();
require('dotenv').config()
var googleDrive = require('google-drive');
//
// # Peer Editing Thing
//
// Get your shit edited
//
var http = require('http');
var path = require('path');

var async = require('async');

// === express shit ===
var express = require('express');
var app = express();
var server = http.createServer(app);
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var exphbs  = require('express-handlebars');
const uuidv1 = require('uuid/v1');
var sleep = require('sleep');


app.use(session({ secret: 'lhd--boiz' })); 
app.use('/view', express.static('views'));
app.use('/', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(passport.session()); 

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// === Mongoose Shit === 
mongoose.promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);
var User = require('./app/models/user');
var Document = require('./app/models/document');
require('./config/passport')(passport);

// === Middleware ===

function checkAuth(req, res, next){
  if(req.isAuthenticated()){
    next();
  }
  else{
    res.redirect('/');
  }
}

// === Routes ===

app.get('/', function(req, res){
  res.render('frontPage');
});

app.get('/dashboard', checkAuth, function(req, res){
  Document.find({userSubmitted: req.user.google.id}).lean().exec(function(err, docs){
    if(err){res.render('index', {user: req.user});}
    res.render('index', {user: req.user, arr: docs});
  });
});

app.get('/newDoc', checkAuth, function(req, res){
  if(req.user.credits > 0){
    res.render('newDoc');
  }
  else{
    res.send("not enough credits");
  }
});

app.get('/reviewDoc/:subject', checkAuth, function(req, res){
  Document.findOne({reviewedAmount: 0, level: req.params.subject, userSubmitted: {$not: {$eq : req.user.google.id}}   }, function(err, doc){
    if(err){ console.log(err);}
    if(doc){
      res.render('editDoc', {user: req.user, doc: doc});
    }
    else{
      res.redirect('dashboard')
    }
  })
});

app.get('/finalDoc/:uuid', checkAuth, function(req, res){
  Document.findOne({id: req.params.uuid}, function(err, doc){
    if(err){}
    else{
      res.render('finalDoc', {user: req.user, doc: doc});
    }
  });
});
// === Authentication Routes ===

app.get('/auth/google/authorize', passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/drive.metadata.readonly'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/', successRedirect: "/dashboard" }));

// === APIs ===

app.post('/api/receive', checkAuth, function(req, res){
  console.log(req.body.contents);
  var newDoc = new Document();
  
  newDoc.id = uuidv1();
  newDoc.userSubmitted = req.user.google.id;
  newDoc.reviewedAmount = 0;
  newDoc.doc.edited = "";
  newDoc.level = req.body.subject;
  newDoc.doc.original = req.body.contents;
  newDoc.title = req.body.title;
  
  newDoc.save(function(err){
    if(err){throw err}
    else{
      req.user.credits = req.user.credits - 1;
    req.user.save(function(err){
      if(err){}
      res.send({success: true});
    });
    }
  });
});

app.post('/api/receiveedit/:docid', function(req, res){
  console.log(req.body)
  Document.findOne({id: req.params.docid}, function(err, doc){
    if(err){}
    doc.doc.edited = req.body.contents;
    doc.reviewedAmount = 1;
    doc.save(function(err){
      if(err){}
      else{
        req.user.credits = req.user.credits + 1;
        req.user.save(function(s){
          res.send({success: true});
        })
        
        
      }
    })
  });
});

app.post('/api/edit', checkAuth, function(req, res){
  //Document.findOne({id: req.})
});

app.get('/api/get/:id', checkAuth, function(req, res ){
  Document.findOne({id: req.params.id}, function(err, doc){
    if(err){throw err}
    res.send(doc);
  });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

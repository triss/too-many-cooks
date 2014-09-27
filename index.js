var scjs = require('supercolliderjs');
var connect = require('connect');
var serveStatic = require('serve-static')

// the SuperCollider language
var lang;

// history of run commands
var history = [];

////////////////////////////////////////////////////////////////////////////////
// serve up static pages
////////////////////////////////////////////////////////////////////////////////

var app = connect().use(serveStatic(__dirname + "/static")).listen(8080);
var io = require('socket.io').listen(app);

console.log('Now serving on port 8080');

////////////////////////////////////////////////////////////////////////////////
// launch supercollider language and server
////////////////////////////////////////////////////////////////////////////////

scjs.resolveOptions().then(function(options) {
    var SCLang = scjs.sclang;
    lang = new SCLang(options);
    lang.boot();
    lang.initInterpreter();

//    var Server = scjs.scsynth;
//    var s = new Server(options);
//        
//    // don't choke on messages to stderr - just send them to the console
//    s.on('error', function(msg) {
//        console.log(msg);
//    });
//
//    s.boot();
});

////////////////////////////////////////////////////////////////////////////////
// handle incoming data from web page
////////////////////////////////////////////////////////////////////////////////

io.sockets.on('connection', function(socket) {
    // when a new user connects send them all the recently run code snippets
    history.forEach(function(item) {
        socket.emit('addToHistory', item);
    });

    socket.on('execute', function(code) {
        history.push(code);
        
        lang.interpret(code)
            .then(function(result) {
                console.log(result);
                socket.emit('result', result); 
            }, function(error) {
                console.log(error);
                socket.emit('error', error); 
            });
        
        socket.emit('addToHistory', code);
    });
});

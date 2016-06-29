var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function(request, response) {

    response.sendFile(__dirname + '/index.html');

});

var sockets = [];

function getSocketIds() {

    var returnArray = [];

    for(i = 0; i < sockets.length; i++){
        returnArray[i] = sockets[i].id;
    }

    return returnArray;

}

io.on('connection', function(socket) {
    sockets.push(socket);
    console.log('Socket connected :'+socket.id);

    socket.on('disconnect', function() {

        var i = sockets.indexOf(socket);
        console.log('Socket '+sockets[i].id+ ' got disconnected');
        sockets.splice(i, 1);


        io.emit('allsockets', {
            data: getSocketIds()
        });

    });

    socket.on('getall:sockets', function(){
        io.emit('allsockets', {
            data: getSocketIds()
        });
    });


    socket.on('mouse:move', function(message) {
        console.log(message);
        io.emit('mouse:update', {
            data: message
        });
    });




});



server.listen(3000, function(){
    console.log('Listening on port 3000');
});










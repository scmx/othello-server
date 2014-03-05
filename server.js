var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var User = require('./lib/user');

server.listen(8088);

io.sockets.on('connection', function (socket) {
  socket.on('disconnect', function () {
    socket.get('user_id', function (_, user_id) {
      console.log('id: ' + user_id)
      if (user = User.find(user_id)) {
        user.destroy();
        socket.broadcast.emit('new:msg', { text: user.nickname + ' disconnected',
                                           time: (new Date).getTime() });
        socket.broadcast.emit('users', User.all());
      }
    });
  });

  socket.on('nickname', function (nickname) {
    var user = new User({ nickname: nickname });
    user.persist();
    socket.set('user_id', user.id, function () {
      socket.emit('ready');
      socket.emit('users', User.all());
      socket.broadcast.emit('users', User.all());
    });

    socket.broadcast.emit('new:msg', { text: user.nickname + ' connected',
                                       time: (new Date).getTime()});
  });

  socket.emit('new:msg', { text: 'Welcome!',
                           time: (new Date).getTime()});
});

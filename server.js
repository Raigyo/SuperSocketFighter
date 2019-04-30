var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require ('path');
var port = process.env.PORT || 8000; // connection heroku

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
let roomArray=[/*{name:'', users:[]}*/];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/socket-client/public/index.html');
});
//app.get('/:room?', function(req, res) {res.sendFile('index.html', {root: __dirname});});



io.on('connection', function (socket) {
console.log('user connected');
  
  var loggedUser; // Utilisateur connecté a la socket
  let roomID;
  // io.emit('room-list', roomArray)
  /**
   * Connexion d'un utilisateur via le formulaire :
   *  - sauvegarde du user
   *  - broadcast d'un 'service-message'
   */
  socket.on('user-login', function (user) {
    loggedUser = user;
     console.log('user connected : ' + loggedUser.username);
    socket.emit('login', {userName: loggedUser.username});
    var message = {message: loggedUser.username + " joined the room"}
    socket.to(roomID).broadcast.emit('chat-message', message);
    io.emit('room-list', roomArray)
  });
   /**
   * Réception de l'événement 'room-service' et réémission vers tous les utilisateurs
   */
  socket.on('sendRoom', function(data){
    socket.leave(roomID);
    roomID = data.roomName;
    console.log('[socket]','join room :',roomID);
    socket.join(roomID);

    if(roomArray.indexOf(roomID) === -1){roomArray.push(roomID)};
    console.log('array check', roomArray)
    socket.emit('room-service', roomID);
    // io.emit('room-list', roomArray)
  });

  socket.on('leaveRoom', function(data){
    socket.leave(data.roomName);
    io.emit('room-list', roomArray)

  })
  
   /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  socket.on('chat-message', function (message) {
    console.log('chat-message', message);
    console.log('roomID', roomID);
    message.username = loggedUser.username + " says : ";
    io.to(roomID).emit('chat-message', message);
   
  });
  /**
   * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
   */
  socket.on('disconnect', function () {
    if(loggedUser !== undefined){
      console.log('user disconnected : ' + loggedUser.username);
      var serviceMessage = {
        text: 'User "' + loggedUser.username + '" disconnected',
        type: 'logout'
      };
      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

});

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
http.listen(port, function(){
  console.log('listening on ${ port }');
});
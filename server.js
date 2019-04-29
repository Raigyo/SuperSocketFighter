var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require ('path');
var port = process.env.PORT || 8000; // connection heroku

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
var rooms = 0;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/socket-client/public/index.html');
});
//app.get('/:room?', function(req, res) {res.sendFile('index.html', {root: __dirname});});



io.on('connection', function (socket) {
console.log('user connected');
  
  var loggedUser; // Utilisateur connecté a la socket
  var roomId = socket.id;
  var randomNumb = Math.floor(Math.random()*Math.floor(30));
  var saloon = {
    'id': roomId,
    'nom': "Room/"+randomNumb
  };
  socket.emit('room-service', saloon);
  console.log(saloon);

  /**
   * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
   */
  socket.on('disconnect', function () {
    if (loggedUser !== undefined) {
      console.log('user disconnected : ' + loggedUser.username);
      var serviceMessage = {
        text: 'User "' + loggedUser.username + '" disconnected',
        type: 'logout'
      };
      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

  /**
   * Connexion d'un utilisateur via le formulaire :
   *  - sauvegarde du user
   *  - broadcast d'un 'service-message'
   */
  socket.on('user-login', function (user) {
    loggedUser = user;
     console.log('user connected : ' + loggedUser.username);
    if (loggedUser !== undefined) {
      var serviceMessage = {
        userName: loggedUser.username,
      };
      socket.emit('login', serviceMessage);

      var message = {
        message: loggedUser.username + " joined the room"
      }
      socket.broadcast.emit('chat-message', message);
    }
  });

  /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  socket.on('chat-message', function (message) {
    console.log(message)
    message.username = loggedUser.username + " says : ";
    io.emit('chat-message', message);
   
  });

});

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
http.listen(port, function(){
  console.log('listening on ${ port }');
});
let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require ('path');
let port = process.env.PORT || 8000; // connexion heroku
let playerOne;
let playerTwo;

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
let roomArray=[]
let usersList = [];


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/socket-client/public/index.html');
});

io.on('connection', function (socket) {
console.log('user connected');

  let loggedUser; // Utilisateur connecté a la socket
  let roomID;
  /**
   * Connexion d'un utilisateur via le formulaire :
   *  - sauvegarde du user
   */
  socket.on('user-login', function (user) {    
      console.log('incoming chat-message', message);
    loggedUser = user;

    console.log('user connected : ' + loggedUser.username);
    socket.emit('login', {userName: loggedUser.username});
    let message = {message: loggedUser.username + " joined the room"}
    socket.to(roomID).broadcast.emit('chat-message', message);
    io.emit('room-list', roomArray)
  });
   /**
   * Réception de l'événement 'room-service' et réémission vers tous les utilisateurs
   */

  socket.on('createRoom', function(data){
    playerOne = data.user;
    console.log('p1 '+ playerOne);
    socket.leave(roomID);
    roomID = data.roomName;
    console.log(loggedUser.username,'join room :',roomID);
    socket.join(roomID);

    if(roomArray.indexOf(roomID) === -1){roomArray.push(roomID)};
    console.log('array check', roomArray)
    socket.emit('room-service', [roomID, playerOne, playerTwo]);

  });
  /**
   * Réception de l'événement 'joinRoom-service' et réémission vers tous les utilisateurs
   */
  socket.on('joinRoom', function(data){
      console.log('joinRoom', data)
    playerTwo = data.user;
    console.log('p2 '+ playerTwo);
    socket.leave(roomID);
    roomID = data.roomName;
      console.log(roomID)
    socket.join(roomID)
     io.emit('room-service', [roomID, playerOne, playerTwo]);
      console.log('room clear')
    clientsInRoom = io.nsps['/'].adapter.rooms[roomID].length;

    if(clientsInRoom === 2){
      roomArray.splice(roomArray.indexOf(roomID),1)
        console.log('room complet')
      }
    }
  );


  /**
   * Réception de l'événement 'romm-list' et réémission vers tous les utilisateurs
   */
  socket.on('leaveRoom', function(data){
    roomID = data.roomName;
    clientsInRoom = io.nsps['/'].adapter.rooms[roomID].length;

    if(clientsInRoom >1){
      if(roomArray.indexOf(roomID) === -1)  {
        roomArray.push(roomID)
        console.log('room un place')
      }
    }

    else if(clientsInRoom ===1)  {
      roomArray.splice(roomArray.indexOf(roomID),1)

    }
    socket.leave(data.roomName);
    io.emit('room-list', roomArray)

  })

   /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  socket.on('chat-message', function (message) {
    console.log('incoming chat-message', message);
    console.log('roomID', roomID);
    message.username = loggedUser.username + " says : ";
    io.to(roomID).emit('chat-message', message);
    console.log('outgoing chat-message', message);

  });

  /**
   Le jeu de dames
   *****************************************
  */

  socket.on('handleClick', function(data){
    console.log('handleClick', data);
     io.emit('click', "coucou")


  })

  /**
   * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
   */
  socket.on('disconnect', function () {
    if(loggedUser !== undefined){
      console.log('user disconnected : ' + loggedUser.username);
      let serviceMessage = {
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
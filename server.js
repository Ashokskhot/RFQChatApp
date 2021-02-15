var port = process.env.PORT || 3000,
    app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

// Allow CORS support and remote requests to the service
// app.use(function(req, res, next) {
//    res.setHeader('Access-Control-Allow-Origin: *');
//    res.setHeader("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, POST, DELETE, OPTIONS");
//    res.setHeader('Access-Control-Max-Age: 86400');
//    res.setHeader("Access-Control-Expose-Headers: Content-Length, X-JSON");
//    res.setHeader("Access-Control-Allow-Headers: *");
//    res.setHeader("Content-Type: application/json; charset=UTF-8");
//     next();
// });


app.use(function (req, res, next) {
   /*var err = new Error('Not Found');
    err.status = 404;
    next(err);*/

   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', '*');

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

 //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

   // Pass to next layer of middleware
   next();
 });

// Set up route
app.get('/', (req, res) => {
   res.sendFile('index.html', { root: __dirname });
});

// Manage the Socket server event listener methods and
// how realtime chat messages are handled/broadcast
io.on('connection', (socket) => {
   /* Set up a disconnect event*/
   console.log("connected");
   socket.on('disconnect', ()=> {
      // Broadcast the event and return a JavaScript map of values
      // for use within the Ionic app
      io.emit('user-exited', { user: socket.alias });
   });

   /**
    * Listen for when a message has been sent from the Ionic app
    */
   socket.on('add-message', (data)=> {
      // Broadcast the message and return a JavaScript map of values
      // for use within the Ionic app
      console.log(data);
      console.log(socket.username);
      socket.emit('message', data);
      socket.to(socket.room).broadcast.emit('message', data);
   });

   /**
    * Listen for when an image has been sent from the Ionic app
    */
   socket.on('add-image', (message) => {
      // Broadcast the message and return a JavaScript map of values
      // for use within the Ionic app
   	  io.emit('message', { image: message.image, sender: socket.alias, tagline: socket.handle, location: socket.location, published: new Date() });
   });

   /**
    * Allows the user to join the current chat session
    */
   socket.on('add-user', (obj)=> {

      // store the username in the socket session for this client
		socket.username = obj.name;
		// store the room name in the socket session for this client
		socket.room = obj.room;
		// send client to room 1
		socket.join(obj.room);
		// echo to client they've connected
		socket.emit('connected', 'you have connected to ' + obj.room);
		// echo to room 1 that a person has connected to their room
		socket.to(obj.room).broadcast.emit('user-connected', obj.name + ' has connected to this room');
		// socket.emit('updaterooms', 'rooms', username);


      // Define socket object properties (which we can use with our other
      // Socket.io event listener methods) and return a JavaScript map of
      // values for use within the Ionic app
   	// socket.alias = obj.alias;
   	// socket.handle = obj.handle;
   	// socket.location = obj.location;
      // io.emit('alias-added', { user: obj.alias, tagline: obj.handle, location: obj.location });
   });
});

// Instruct node to run the socket server on the following port
http.listen(port, function() {
  console.log('listening on port ' + port);
});

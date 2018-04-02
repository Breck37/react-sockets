require('dotenv').config();
const express = require('express'),
      port = 3700;
      bodyParser = require('body-parser'),
      cors = require('cors'),
      massive = require('massive'),
      //Specific dependency for Socket.IO that integrates the dependency with our ExpressJS Server
      socket = require('socket.io');

const app = express();

app.use(bodyParser.json());
app.use(cors());

console.log(process.env.CONNECTION_STRING)

massive(process.env.CONNECTION_STRING).then(db => app.set('db', db)).catch(err=> console.error(err));



//Initial Setup
app.get('/init', (req, res) => {
      const db = req.app.get('db');
      db.init().then(() => {
            console.log('Database Initialized');
            res.send();
      }).catch(err => console.log(err))
})


//-------------------Chat------------------
app.get('/chat', (req,res) => {
      // console.log('2', 'Getting Messages')
      // const {room} = req.query;
      const db = req.app.get('db');
      db.chat_message().then( messages => {
            // console.log('2', messages);
          res.status(200).send(messages);
      }).catch(err => {
          console.log('Error getting messages:', err);
          res.status(500).send('Oops, something went wrong!');
      })
  });

app.post('/chat', (req,res) => {
      // console.log('Post', req.body)
      let {username, messageBody, roomNumber} = req.body;
      const db = req.app.get('db');
      db.add_chat_message([username, messageBody, roomNumber]).then(response => {
            // console.log(response)
          res.status(200).send(response);
      }).catch(err => {
          console.log('Error saving message:', err);
          res.status(500).send('Oops, something went wrong!');
      })
  });

app.delete('/chat/delete', (req, res) => {
      const db = req.app.get('db');
      db.delete_room().then(() => {
            res.status(200).send('Refresh to start new room')
      })
})



//Create an 'instance of socket.io by passing in the 'Server'
//This creates the opportunity to continue our normal server communications but also add socket communications
const io = socket(
      app.listen(port, () => console.log(`We be jamming to the tunes of ${port}`)));

//Create and Monitor Connection
io.on('connection', (socket) => {
      //1
      console.log('1', 'User connected:');

      //Create and monitor Disconnect
      socket.on('disconnect', (req, res) => {
            console.log('User disconnected:');
      });
        
      socket.on('SEND_MESSAGE', function(data){
            console.log('2', data)
            io.emit('RECEIVE_MESSAGE', data);
      })
            socket.on('draw', (data) => {
                  socket.broadcast.emit('drawing', data)
                  console.log('drawing')
            }
      );
        });

// messages = ['hey!'];
// //Create Connection
// io.on('connection', onConnect)

// function onConnect(socket){
//       socket.join('Chat Room');
//       console.log('New user has joined your chatroom')

//       //Send messages to everyone, including Sender 
//       socket.on('send message', message => {
//             console.log('New message', message)
//             messages.push(message);
//             console.log('Array', messages);
//             io.in('Chat Room').emit('get messages', messages)
//       })
      
//       //Get messages upon joining
//       socket.on('join', () => {
//             socket.emit('get messages', messages)
//       })

//       //Create Disconnect
//       socket.on('disconnect', () => {
//             console.log('A user has disconnected')
//       })
// }







app.get('/', (req, res) => {
      res.send('<h1>Hello Brent</h1>')
})
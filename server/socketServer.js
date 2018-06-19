require('dotenv').config();
const express = require('express'),
      port = 3700;
      bodyParser = require('body-parser'),
      cors = require('cors'),
      massive = require('massive'),
      //Specific dependency for Socket.IO that integrates the dependency with our ExpressJS Server
      socket = require('socket.io'),
      path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(`${__dirname}/../build`)))

app.get('*', (req, res)=>{
      res.sendFile(path.join(__dirname, '../build/index.html'));
    })

////////////////Database Connection
// console.log(process.env.CONNECTION_STRING)
// massive(process.env.CONNECTION_STRING).then(db => app.set('db', db)).catch(err=> console.error(err));


let messages = [];
//Initial Setup
// app.get('/init', (req, res) => {
//       const db = req.app.get('db');
//       db.init().then(() => {
//             console.log('Database Initialized');
//             res.send();
//       }).catch(err => console.log(err))
// })


//-------------------Chat------------------
// app.get('/chat', (req,res) => {
      // console.log('2', 'Getting Messages')
      // const {room} = req.query;
      // const db = req.app.get('db');
      // db.chat_message().then( messages => {
      //       // console.log('2', messages);
      //     res.status(200).send(messages);
      // }).catch(err => {
      //     console.log('Error getting messages:', err);
      //     res.status(500).send('Oops, something went wrong!');
      // })
      // console.log(req);
//       console.log(messages)
//       res.send(messages)
//   });

// app.post('/chat', (req,res) => {
      // console.log('Post', req.body)
      // let {username, messageBody, roomNumber} = req.body;
      // const db = req.app.get('db');
      // db.add_chat_message([username, messageBody, roomNumber]).then(response => {
      //       // console.log(response)
      //     res.status(200).send(response);
      // }).catch(err => {
      //     console.log('Error saving message:', err);
      //     res.status(500).send('Oops, something went wrong!');
      // })
      // messages.push({username, messageBody, roomNumber});
      // console.log('!', messages)
      // res.send(messages)
//   });

// app.delete('/chat/delete', (req, res) => {
//       const db = req.app.get('db');
//       db.delete_room().then(() => {
//             res.status(200).send('Refresh to start new room')
//       })
// })



//Create an 'instance of socket.io by passing in the 'Server'
//This creates the opportunity to continue our normal server communications but also add socket communications
const io = socket(
      app.listen(port, () => console.log(`We be jamming to the tunes of ${port}`)));

//Create and Monitor Connection
io.on('connection', (socket) => {
      console.log('User connected:');

      //Create and monitor Disconnect
      socket.on('disconnect', (req, res) => {
            console.log('User disconnected:');
      });
        
      socket.on('SEND_MESSAGE', function(data){
            console.log('2', data)
            messages.push(data)
            io.emit('RECEIVE_MESSAGE', messages);
      })
      socket.on('isTyping', name => {
            console.log(name)
            io.emit('currentTyper', name)
      })
      socket.on('stopTyping', name => {
            console.log('stop', name)
            io.emit('previousTyper', name)
      })

      socket.on('draw', (data) => {
            socket.broadcast.emit('drawing', data)
            console.log('drawing')
      });
        });


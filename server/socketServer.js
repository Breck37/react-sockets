const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),

      //Specific dependency for Socket.IO that integrates the dependency with our ExpressJS Server
      socket = require('socket.io');

const app = express();

app.use(bodyParser.json());
app.use(cors());


const port = 3700;

//Create an 'instance of socket.io by passing in the 'Server'
//This creates the opportunity to continue our normal server communications but also add socket communications
const io = socket(
      app.listen(port, () => console.log(`We be jamming to the tunes of ${port}`)));

//Create Connection
io.on('connection', onConnect)

function onConnect(socket){
      socket.join('Chat Room');
      console.log('New user has joined your chatroom')

      //Include Sender 
      

      //Create Disconnect
      socket.on('disconnect', () => {
            console.log('A user has disconnected')
      })
}







app.get('/', (req, res) => {
      res.send('<h1>Hello Brent</h1>')
})
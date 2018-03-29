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
const io = socket(app.listen(port, () => console.log(`We be jamming to the tunes of ${port}`)));

app.get('/', (req, res) => {
      res.send('<h1>Hello World</h1>')
})
const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      socket = require('socket.io');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 3700;
app.listen(port, () => console.log(`We be jamming to the tunes of ${port}`));
import http = require('http');
import * as express from 'express';
import cors = require('cors');
const bodyParser = require('body-parser');
import mongoose = require('mongoose');
import api from './routes';

let config: any;

if (process.env.NODE_ENV === 'test') {
  config = require('./test-config.json');
} else if (process.env.NODE_ENV === 'development') {
  config = require('./dev-config.json');
}

let app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const options = {
  autoIndex: false,
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true

};
const DATABASE = process.env.MONGODB_URI || config.db;
mongoose.Promise = Promise;
mongoose.connect(DATABASE, options);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});
app.use('/api', api);

app.set('port', process.env.PORT || config.port);
http.createServer(app).listen(app.get('port'));
console.log(`Ready on port ${app.get('port')}`);
console.log(`Ready on DB ${DATABASE}`);

export default app;

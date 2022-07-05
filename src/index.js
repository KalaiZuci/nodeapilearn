const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(require('./router.js'));

app.listen(port, ()=>console.log('APP Listening Port ' + port));

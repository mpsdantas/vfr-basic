const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/vfr-basic', { useNewUrlParser: true });
mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6
mongoose.connection.on('error', err => {
    console.log(`🙅 🚫 → ${err.message}`);
});

const bodyParser = require('body-parser');

const vfr = require('vfr-module');
vfr.use('myKeySecret');

const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* ROUTER FREE */
app.get('/', (req, res) => {
    res.send('Hello world');
});

/* GET ONE TOKEN */
app.get('/getToken', async (req, res) => {
    const tokenUser = vfr.getToken({user:'mpsdantas'});
    await vfr.saveToken(tokenUser);
    return res.status(200).json({token:tokenUser});
});

/* BLOCK ROUTER */
app.get('/hiApi/:token', vfr.analyzer, async (req, res, next) => {
    const data = await vfr.decoded(vfr.getTokenRequest(req));
    res.status(200).json({data: data})
});

app.listen('3000', () => {
    console.log(`➡➡➡ The server is online: http://localhost:3000/ ☻`)
});
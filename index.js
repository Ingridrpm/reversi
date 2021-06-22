var reversi = require('./reversi.js');

var express = require('express');
var app = express();

app.get('/', function (req, res) {
    var turno = req.query.turno;
    var estado = req.query.estado;
    res.send(reversi.siguiente_movimiento(turno, estado)+"")
});

var puerto = process.env.PORT || 3000;

app.listen(puerto);
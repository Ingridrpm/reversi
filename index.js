var reversi = require('./reversi.js');

var express = require('express');
var app = express();

app.get('/', function (req, res) {
    var turno = req.query.turno;
    var estado = req.query.estado;
    var resultado = reversi.siguiente_movimiento(turno, estado)+""
    var v1 = parseInt(resultado.charAt(0))-1
    var v2 = parseInt(resultado.charAt(1))-1
    res.send(v1+""+v2)
});

var puerto = process.env.PORT || 3000;

app.listen(puerto);
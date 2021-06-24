var reversi = require('./reversi.js');

var express = require('express');
var app = express();

app.get('/', function (req, res) {
    var turno = req.query.turno;
    var estado = req.query.estado;
    var resultado = reversi.siguiente_movimiento(turno, estado)+""
    var v1 = resultado == "null" ? 0 : parseInt(resultado.charAt(0))-1
    var v2 = resultado == "null" ? 0 : parseInt(resultado.charAt(1))-1
    res.send(v1+""+v2)
});

app.get('/info', function (req, res) {
    var info = "Ingrid Pérez Mena";
    info += "<br/>Profundidad de minimax: " + reversi.prof;
    info += "<br/>version 26"
    info += "<br/>las esquinas del cuadrado de adentro3333333"
    res.send(info)
});

var puerto = process.env.PORT || 3000;

app.listen(puerto);
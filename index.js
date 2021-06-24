var reversi = require('./reversi.js');

var express = require('express');
var app = express();

var t = "";
var e = "";

app.get('/', function (req, res) {
    var turno = req.query.turno;
    t = turno;
    var estado = req.query.estado;
    e = estado;
    var resultado = reversi.siguiente_movimiento(turno, estado)+""
    var v1 = resultado == "null" ? 0 : parseInt(resultado.charAt(0))-1
    var v2 = resultado == "null" ? 0 : parseInt(resultado.charAt(1))-1
    res.send(v1+""+v2)
});

app.get('/info', function (req, res) {
    var info = "Ingrid Pérez Mena";
    info += "<br/>Profundidad de minimax: " + reversi.prof;
    info += "<br/>version 33"
    info += "<br/> mayor a 3"
    res.send(info)
});

app.get('/gets', function (req, res) {
    var info = "localhost:3000/?turno="+t+"&estado="+e
    res.send(info)
});

var puerto = process.env.PORT || 3000;

app.listen(puerto);
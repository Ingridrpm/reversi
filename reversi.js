const BLANCO = "0";
const NEGRO = "1";
const VACIO = ".";
const FUERA = "*";
var direcciones = new Array(-10,10,-1,1,-9,11,9,-11)

function siguiente_movimiento(jugador, estado) {
    //0 = blanca
    //1 = negra
    //2 = vacio
    tablero = llenar_tablero(estado)
    movimiento_minimax_h1 = minimax(jugador,tablero,3,peso_por_casilla)
    //movimiento_minimax_h2 = minimax(jugador,5,puntuacion,tablero)
    return (movimiento_minimax_h1[1])
    //console.log(movimiento_minimax_h2)
}

function llenar_tablero(estado) {
    var arrego_estado = estado.split("")
    var tablero = []
    for (let i = 0; i < 100; i++)
        tablero[i] = FUERA
    var columna = 1;
    var actual = 0;
    for (var i = 11; i < 89; i++) {
        if(arrego_estado[actual]=="0") tablero[i] = BLANCO
        else if (arrego_estado[actual]=="1") tablero[i] = NEGRO
        else if (arrego_estado[actual]=="2") tablero[i] = VACIO
        actual++;
        columna++;
        if (columna == 9) {
            columna = 1;
            i = i+2;
        }
    }
    return tablero
}

//Oponente
function oponente(jugador){
    return jugador == BLANCO ? NEGRO : BLANCO;
}

//HEURISTICAS
//Puntuacion: cantidad de fichas del jugador menos las del oponente
function puntuacion(jugador, tablero){
    var puntuacion_jugador = 0;
    var puntuacion_oponente = 0;
    var op = oponente(jugador)
    for(ficha in tablero){
        if(ficha==jugador) puntuacion_jugador++;
        if(ficha==op) puntuacion_oponente++;
    }
    return puntuacion_jugador-puntuacion_oponente;
}

var PESO_CASILLAS = [
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    0, 120, -20,  20,   5,   5,  20, -20, 120,   0,
    0, -20, -40,  -5,  -5,  -5,  -5, -40, -20,   0,
    0,  20,  -5,  15,   3,   3,  15,  -5,  20,   0,
    0,   5,  -5,   3,   3,   3,   3,  -5,   5,   0,
    0,   5,  -5,   3,   3,   3,   3,  -5,   5,   0,
    0,  20,  -5,  15,   3,   3,  15,  -5,  20,   0,
    0, -20, -40,  -5,  -5,  -5,  -5, -40, -20,   0,
    0, 120, -20,  20,   5,   5,  20, -20, 120,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
]

function peso_por_casilla(jugador, tablero){
    var op = oponente(jugador)
    var total = 0
    for(var i = 0; i<100;i++){
        var ficha = tablero[i]
        if(ficha==jugador) total += PESO_CASILLAS[i];
        else if(ficha==op) total -= PESO_CASILLAS[i];
    }
    return total;
}

//Movimientos
function encontrar_linea(casilla,jugador,tablero,direccion,imprimr){

    var linea = casilla + direccion;
    if(imprimr==3){
    console.log(casilla+"CASILLA************")
    console.log(direccion+"DIRECCION************")
    console.log(linea+"************")
    }
    if(tablero[linea] == jugador) return null
    op = oponente(jugador)
    while(tablero[linea] == op) linea += direccion
    if(tablero[linea] == FUERA || tablero[linea] == VACIO) return null
    //console.log(tablero[linea]+"--final")
    return linea
}

function es_posible(movimiento,jugador,tablero){
    for(var i = 0; i < direcciones.length; i++){
        var direccion = direcciones[i]
        //console.log(direccion+"diredire")
        if(tablero[movimiento] == VACIO && encontrar_linea(movimiento,jugador,tablero,direccion,1)!= null){
            return true
        }
    }
    return false
}

function movimientos_posibles(jugador, tablero){
    var movimientos = []
    var columna = 1;
    for (var i = 11; i < 89; i++) {
        if(es_posible(i,jugador,tablero)) movimientos.push(i);
        columna++;
        if (columna == 9) {
            columna = 1;
            i = i+2;
        }
    }
    console.log(movimientos)
    return movimientos;
}

//movimiento
function mover(movimiento,jugador,tablero){
    tablero[movimiento] = jugador
    for(var i = 0; i < direcciones.length; i++){
        var d = direcciones[i]
        tablero = convertir(movimiento,jugador,tablero,d)
    }
    return tablero
}

function convertir(movimiento,jugador,tablero,direccion){
    var linea = encontrar_linea(movimiento,jugador,tablero,direccion,2)
    if(linea==null) return tablero
    var casilla = movimiento + direccion
    while(casilla!=linea){
        tablero[casilla] = jugador
        casilla += direccion
    }
    return tablero
}

//Algoritmos
var algo_anda_mal = 0;
function minimax(jugador,tablero,profundidad,heuristica){
    console.log("AAAAAlgo anda mal "+algo_anda_mal)
    algo_anda_mal++;

    //if(algo_anda_mal>50) return[null,null]
    function valor(tablero){
        return -minimax(oponente(jugador),tablero,profundidad-1,heuristica)[0]
    }

    if(profundidad == 0) {
        return [heuristica(jugador,tablero),null]
    }

    var movimientos  = movimientos_posibles(jugador,tablero)

    console.log(movimientos.length)
    if(!movimientos.length){
        if(!movimientos_posibles(oponente(jugador),tablero).length){
            return [valor_final(jugador,tablero), null]
        }
        return [valor(tablero),null]
    }
    var mayor = [-Infinity,0]
    for(var i = 0; i<movimientos.length; i++){
        var m = movimientos[i]
        var val = valor(mover(m,jugador,[...tablero]));
        if(mayor[0] < val){
            mayor[0] = val;
            mayor[1] = m;
        }

    }
    console.log(mayor)
    return mayor
}

function imprimir_tablero(tablero){
    var columna = 1;
    var linea = "";
    for (var i = 11; i < 89; i++) {
        linea += tablero[i]
        columna++;
        if (columna == 9) {
            columna = 1;
            i = i+2;
            linea+="\n"
        }
    }
    return linea
}

var VALOR_MAXIMO = -suma_absoluta(PESO_CASILLAS)
var VALOR_MINIMO = -VALOR_MAXIMO

function valor_final(jugador,tabero){
    diferencia = puntuacion(jugador,tabero)
    if(diferencia<0) return VALOR_MINIMO
    else if(diferencia>0) return VALOR_MAXIMO;
    return diferencia;
}

function suma_absoluta(arr) {
	var result = 0;
	for (var i = 1; i < arr.length; i++) {
		result += Math.abs(arr[i] - arr[i - 1]);
	}
	return result;
}

module.exports = { siguiente_movimiento };
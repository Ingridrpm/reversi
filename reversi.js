const BLANCO = "0";
const NEGRO = "1";
const VACIO = ".";
const FUERA = "*";
var direcciones = new Array(-10, 10, -1, 1, -9, 11, 9, -11)
var prof = 4;

function siguiente_movimiento(jugador, estado) {
    //0 = blanca
    //1 = negra
    //2 = vacio
    tablero = llenar_tablero(estado)
    var movimientos = movimientos_posibles(jugador, tablero);
    for (var i = 0; i < movimientos.length; i++) {
        if (PESO_CASILLAS[movimientos[i]] == 120) return movimientos[i]
    }
    //console.log(movimientos)
    movimiento_minimax_h1 = minimax(jugador, tablero, 4, peso_por_casilla)
    movimiento_minimax_h2 = minimax(jugador, tablero, 3, puntuacion)
    //console.log(movimiento_minimax_h1[1])
    //console.log(movimiento_minimax_h2[1])

    var cv = casillas_vacias(tablero);
    if (PESO_CASILLAS[movimiento_minimax_h1[1]] <= -20 || PESO_CASILLAS[movimiento_minimax_h2[1]] <= -20) {
        if (PESO_CASILLAS[movimiento_minimax_h1[1]] > -20) return movimiento_minimax_h1[1];
        if (PESO_CASILLAS[movimiento_minimax_h2[1]] <= -20) {
            if (cv < 17) {
                var tablero_h1 = mover(movimiento_minimax_h1[1], jugador, [...tablero])
                movimiento_oponente_h1 = mejor_movimiento(oponente(jugador), tablero_h1, puntuacion)

                var tablero_h2 = mover(movimiento_minimax_h2[1], jugador, [...tablero])
                movimiento_oponente_h2 = mejor_movimiento(oponente(jugador), tablero_h2, puntuacion)

                punteo_oponente_h1 = puntuacion(jugador, mover(movimiento_oponente_h1[1], oponente(jugador), [...tablero_h1]))
                punteo_oponente_h2 = puntuacion(jugador, mover(movimiento_oponente_h2[1], oponente(jugador), [...tablero_h2]))

                return punteo_oponente_h1 > punteo_oponente_h2 ? movimiento_minimax_h1[1] : movimiento_minimax_h2[1];
            }
            var e2 = 0;
            for (var i = 0; i < movimientos.length; i++) {
                if (movimiento_minimax_h1[1] == movimiento_minimax_h2[1]) {
                    if (movimientos[i] == movimiento_minimax_h1[1]) {
                        movimientos.splice(i, 1);
                        break;
                    }
                } else {
                    if (movimientos[i] == movimiento_minimax_h1[1]) {
                        movimientos.splice(i, 1);
                        e2++;
                        i--;
                        if (e2 == 2) break;
                    }
                    if (movimientos[i] == movimiento_minimax_h2[1]) {
                        movimientos.splice(i, 1);
                        e2++;
                        i--;
                        if (e2 == 2) break;
                    }
                }
            }
            //console.log(movimientos)
            if (movimientos.length == 1) return movimientos[0]
            if (movimientos.length > 0) return mejor_movimiento_modificado(movimientos, jugador, tablero, puntuacion)[1]
            else return movimiento_minimax_h2[1]
        } else return movimiento_minimax_h2[1]
    }

    var hay_positivo = false; //var acumulado = 0
    var positivos = 0;
    var negativos = 0;
    for (var i = 0; i < movimientos.length; i++) {
        if (movimientos[i] == VACIO && PESO_CASILLAS[movimientos[i]] > 0) { // quitar peso[casillas]
            hay_positivo == true; //acumulado++
            positivos++
            //break; //quiaar
        } else if (movimientos[i] == VACIO && PESO_CASILLAS[movimientos[i]] < 0) { // quitar peso[casillas]
            //hay_positivo == true; //acumulado++
            negativos++
            //break; //quiaar
        }
    }
    if (negativos/cv >=0.75 ) { //si el acumuladao es < a -120
        var tablero_h1 = mover(movimiento_minimax_h1[1], jugador, [...tablero])
        movimiento_oponente_h1 = mejor_movimiento(oponente(jugador), tablero_h1, puntuacion)

        var tablero_h2 = mover(movimiento_minimax_h2[1], jugador, [...tablero])
        movimiento_oponente_h2 = mejor_movimiento(oponente(jugador), tablero_h2, puntuacion)

        punteo_oponente_h1 = puntuacion(jugador, mover(movimiento_oponente_h1[1], oponente(jugador), [...tablero_h1]))
        punteo_oponente_h2 = puntuacion(jugador, mover(movimiento_oponente_h2[1], oponente(jugador), [...tablero_h2]))

        return punteo_oponente_h1 > punteo_oponente_h2 ? movimiento_minimax_h1[1] : movimiento_minimax_h2[1];
    }
    if (movimiento_minimax_h1[1] == movimiento_minimax_h2[1]) return movimiento_minimax_h1[1];
    if (cv > 15 && PESO_CASILLAS[movimiento_minimax_h1[1]] >= 3) return movimiento_minimax_h1[1];
    if (cv > 15 && PESO_CASILLAS[movimiento_minimax_h2[1]] >= 3) return movimiento_minimax_h2[1];
    if (cv > 15 && PESO_CASILLAS[movimiento_minimax_h1[1]] < -10) return movimiento_minimax_h2[1];
    if (cv > 15 && PESO_CASILLAS[movimiento_minimax_h2[1]] < -10) return movimiento_minimax_h1[1];
    if (cv > 5) {
        var punteo_h1 = peso_por_casilla(jugador, mover(movimiento_minimax_h1[1], jugador, [...tablero]))
        var punteo_h2 = peso_por_casilla(jugador, mover(movimiento_minimax_h2[1], jugador, [...tablero]))

        var mayor_de_peso = punteo_h1 > punteo_h2 ? 1 : 2;

        punteo_h1 = puntuacion(jugador, mover(movimiento_minimax_h1[1], jugador, [...tablero]))
        punteo_h2 = puntuacion(jugador, mover(movimiento_minimax_h2[1], jugador, [...tablero]))


        var mayor_de_punteo = punteo_h1 > punteo_h2 ? 1 : 2;

        if (mayor_de_peso == mayor_de_punteo) return mayor_de_punteo == 1 ? movimiento_minimax_h1[1] : movimiento_minimax_h2[1];

    }

    var tablero_h1 = mover(movimiento_minimax_h1[1], jugador, [...tablero])
    movimiento_oponente_h1 = mejor_movimiento(oponente(jugador), tablero_h1, puntuacion)

    var tablero_h2 = mover(movimiento_minimax_h2[1], jugador, [...tablero])
    movimiento_oponente_h2 = mejor_movimiento(oponente(jugador), tablero_h2, puntuacion)

    punteo_oponente_h1 = puntuacion(jugador, mover(movimiento_oponente_h1[1], oponente(jugador), [...tablero_h1]))
    punteo_oponente_h2 = puntuacion(jugador, mover(movimiento_oponente_h2[1], oponente(jugador), [...tablero_h2]))

    return punteo_oponente_h1 > punteo_oponente_h2 ? movimiento_minimax_h1[1] : movimiento_minimax_h2[1];
}

function llenar_tablero(estado) {
    var arrego_estado = estado.split("")
    var tablero = []
    for (let i = 0; i < 100; i++)
        tablero[i] = FUERA
    var columna = 1;
    var actual = 0;
    for (var i = 11; i < 89; i++) {
        if (arrego_estado[actual] == "0") tablero[i] = BLANCO
        else if (arrego_estado[actual] == "1") tablero[i] = NEGRO
        else if (arrego_estado[actual] == "2") tablero[i] = VACIO
        actual++;
        columna++;
        if (columna == 9) {
            columna = 1;
            i = i + 2;
        }
    }
    return tablero
}

function casillas_vacias(tablero) {
    var cv = 0;
    for (var i = 0; i < tablero.length; i++) {
        if (tablero[i] == VACIO) cv++
    }
    return cv;
}

//Oponente
function oponente(jugador) {
    return jugador == BLANCO ? NEGRO : BLANCO;
}

//HEURISTICAS
//Puntuacion: cantidad de fichas del jugador menos las del oponente
function puntuacion(jugador, tablero) {
    var puntuacion_jugador = 0;
    var puntuacion_oponente = 0;
    var op = oponente(jugador)
    for (var i = 0; i < tablero.length; i++) {
        var ficha = tablero[i]
        if (ficha == jugador) puntuacion_jugador++;
        if (ficha == op) puntuacion_oponente++;
    }
    return puntuacion_jugador - puntuacion_oponente;
}

var PESO_CASILLAS = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 120, -20, 20, 5, 5, 20, -20, 120, 0,
    0, -20, -40, -5, -5, -5, -5, -40, -20, 0,
    0, 20, -5, 15, 3, 3, 15, -5, 20, 0,
    0, 5, -5, 3, 3, 3, 3, -5, 5, 0,
    0, 5, -5, 3, 3, 3, 3, -5, 5, 0,
    0, 20, -5, 15, 3, 3, 15, -5, 20, 0,
    0, -20, -40, -5, -5, -5, -5, -40, -20, 0,
    0, 120, -20, 20, 5, 5, 20, -20, 120, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]

function peso_por_casilla(jugador, tablero) {
    var op = oponente(jugador)
    var total = 0
    for (var i = 0; i < 100; i++) {
        var ficha = tablero[i]
        if (ficha == jugador) total += PESO_CASILLAS[i];
        else if (ficha == op) total -= PESO_CASILLAS[i];
    }
    return total;
}

//Movimientos
function encontrar_linea(casilla, jugador, tablero, direccion, imprimr) {

    var linea = casilla + direccion;
    if (imprimr == 3) {
        console.log(casilla + "CASILLA************")
        console.log(direccion + "DIRECCION************")
        console.log(linea + "************")
    }
    if (tablero[linea] == jugador) return null
    op = oponente(jugador)
    while (tablero[linea] == op) linea += direccion
    if (tablero[linea] == FUERA || tablero[linea] == VACIO) return null
    //console.log(tablero[linea]+"--final")
    return linea
}

function es_posible(movimiento, jugador, tablero) {
    for (var i = 0; i < direcciones.length; i++) {
        var direccion = direcciones[i]
        //console.log(direccion+"diredire")
        if (tablero[movimiento] == VACIO && encontrar_linea(movimiento, jugador, tablero, direccion, 1) != null) {
            return true
        }
    }
    return false
}

function movimientos_posibles(jugador, tablero) {
    var movimientos = []
    var columna = 1;
    for (var i = 11; i < 89; i++) {
        if (es_posible(i, jugador, tablero)) movimientos.push(i);
        columna++;
        if (columna == 9) {
            columna = 1;
            i = i + 2;
        }
    }
    //console.log(movimientos)
    return movimientos;
}

//movimiento
function mover(movimiento, jugador, tablero) {
    tablero[movimiento] = jugador
    for (var i = 0; i < direcciones.length; i++) {
        var d = direcciones[i]
        tablero = convertir(movimiento, jugador, tablero, d)
    }
    return tablero
}

function convertir(movimiento, jugador, tablero, direccion) {
    var linea = encontrar_linea(movimiento, jugador, tablero, direccion, 2)
    if (linea == null) return tablero
    var casilla = movimiento + direccion
    while (casilla != linea) {
        tablero[casilla] = jugador
        casilla += direccion
    }
    return tablero
}

//Algoritmos
//Mejor movimiento
function mejor_movimiento(jugador, tablero, heuristica) {
    var movimientos = movimientos_posibles(jugador, tablero)

    if (!movimientos.length) {
        if (!movimientos_posibles(oponente(jugador), tablero).length) {
            return [valor_final(jugador, tablero), null]
        }
        return [heuristica(jugador, tablero), null]
    }
    var mayor = [-Infinity, 0]
    var resultados = []
    for (var i = 0; i < movimientos.length; i++) {
        var m = movimientos[i]
        var val = heuristica(jugador, mover(m, jugador, [...tablero]));
        resultados.push(val)
        if (mayor[0] < val) {
            mayor[0] = val;
            mayor[1] = m;
        }

    }
    return mayor
}

//Mejor movimiento modificado
function mejor_movimiento_modificado(movimientos, jugador, tablero, heuristica) {
    if (!movimientos.length) {
        if (!movimientos_posibles(oponente(jugador), tablero).length) {
            return [valor_final(jugador, tablero), null]
        }
        return [heuristica(jugador, tablero), null]
    }
    var mayor = [-Infinity, 0]
    var resultados = []
    for (var i = 0; i < movimientos.length; i++) {
        var m = movimientos[i]
        //console.log("tamaño:"+movimientos.length)
        //console.log("completo:"+movimientos)
        if (movimientos.length > 1) {
            if (PESO_CASILLAS[m] <= -20) {
                movimientos.splice(i, 1);
                //console.log(movimientos)
                i = -1;
                continue;
            }
        }
        var val = heuristica(jugador, mover(m, jugador, [...tablero]));
        //console.log(val+"val")
        resultados.push(val)
        if (mayor[0] < val) {
            mayor[0] = val;
            mayor[1] = m;
        }

    }
    //console.log("mayor:"+mayor)
    return mayor
}

var algo_anda_mal = 0;
function minimax(jugador, tablero, profundidad, heuristica) {
    //console.log("AAAAAlgo anda mal "+algo_anda_mal)
    //algo_anda_mal++;

    //if(algo_anda_mal>50) return[null,null]
    function valor(tablero) {
        return -minimax(oponente(jugador), tablero, profundidad - 1, heuristica)[0]
    }

    if (profundidad == 0) {
        return [heuristica(jugador, tablero), null]
    }

    var movimientos = movimientos_posibles(jugador, tablero)

    //console.log(movimientos.length)
    if (!movimientos.length) {
        if (!movimientos_posibles(oponente(jugador), tablero).length) {
            return [valor_final(jugador, tablero), null]
        }
        return [valor(tablero), null]
    }
    var mayor = [-Infinity, 0]
    for (var i = 0; i < movimientos.length; i++) {
        var m = movimientos[i]
        var val = valor(mover(m, jugador, [...tablero]));
        if (mayor[0] < val) {
            mayor[0] = val;
            mayor[1] = m;
        }

    }
    //console.log(mayor)
    return mayor
}

function imprimir_tablero(tablero) {
    var columna = 1;
    var linea = "";
    for (var i = 11; i < 89; i++) {
        linea += tablero[i]
        columna++;
        if (columna == 9) {
            columna = 1;
            i = i + 2;
            linea += "\n"
        }
    }
    return linea
}

var VALOR_MAXIMO = -suma_absoluta(PESO_CASILLAS)
var VALOR_MINIMO = -VALOR_MAXIMO

function valor_final(jugador, tabero) {
    diferencia = puntuacion(jugador, tabero)
    if (diferencia < 0) return VALOR_MINIMO
    else if (diferencia > 0) return VALOR_MAXIMO;
    return diferencia;
}

function suma_absoluta(arr) {
    var result = 0;
    for (var i = 1; i < arr.length; i++) {
        result += Math.abs(arr[i] - arr[i - 1]);
    }
    return result;
}

module.exports = { siguiente_movimiento, prof };
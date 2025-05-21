"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ingreso {
    constructor(cantidad) {
        this.cantidad = cantidad;
    }
    getCantidad() {
        return this.cantidad;
    }
    setCantidad(cantidad) {
        this.cantidad = cantidad;
    }
    cantidadAceptable() {
        return this.cantidad >= 0;
    }
}
class IngresoRepository {
    constructor(connection) {
        this.connection = connection;
    }
    guardarIngreso(ingreso, usrId) { }
    eliminarIngreo(ingrsoId) { }
}

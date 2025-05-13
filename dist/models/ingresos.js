"use strict";
class Ingresos {
    constructor(cantidad) {
        this.cantidad = cantidad;
    }
    getCantidad() {
        return this.cantidad;
    }
    setCantidad(cantidad) {
        this.cantidad = this.cantidadAceptable() ? cantidad : 0;
    }
    cantidadAceptable() {
        return this.cantidad >= 0;
    }
}

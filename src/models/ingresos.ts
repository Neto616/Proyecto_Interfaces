class Ingresos {
    constructor (private cantidad: number){}

    public getCantidad (): number {
        return this.cantidad;
    }

    public setCantidad (cantidad: number): void {
        this.cantidad = this.cantidadAceptable() ? cantidad : 0
    }

    public cantidadAceptable (): boolean {
        return this.cantidad >= 0;
    }
}
import { Connection } from "mysql2/promise";

class Ingreso {
    constructor (private cantidad: number){}

    public getCantidad (): number {
        return this.cantidad;
    }

    public setCantidad (cantidad: number): void {
        this.cantidad = cantidad;
    }

    public cantidadAceptable (): boolean {
        return this.cantidad >= 0;
    }
}

class IngresoRepository {
    constructor(private connection: Connection){}

    public guardarIngreso(ingreso: Ingreso, usrId: number){}

    public eliminarIngreo(ingrsoId: number){}
}
import DB from "./db";

class Gasto{
    constructor(public cantidad: number){}

    public getGasto(): number {
        return this.cantidad;
    }

    public setGasto(cantidad: number): void {
        this.cantidad = cantidad;
    }
}

class GastoRepository extends DB{
    public async getInfo() {}

    public async save() {}

    public async update() {}

    public async delete() {}
}

export {
    Gasto,
    GastoRepository
}
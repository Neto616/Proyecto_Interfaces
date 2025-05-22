import { Connection, FieldPacket } from "mysql2/promise";
import { all_ingresos } from "../types/tipos_ingresos";

class Ingreso {
    private cantidad: number;
    constructor (cantidad: number){
        this.cantidad = this.cantidadAceptable(cantidad);
    }

    public getCantidad (): number {
        return this.cantidad;
    }

    public cantidadAceptable (cantidad_ingresada: number): number {
        if(cantidad_ingresada > 0) return cantidad_ingresada;
        else throw new Error("Favor de ingresar un valor mayor a 0");
    }
}

class IngresoRepository {
    constructor(private connection: Connection){}

    private async isMine(userId: number, ingresoId: number): Promise<boolean>{
        try {
            const [rows] = await this.connection.execute(`
                select
                 +
                from ingresos
                where id = ? and id_usuario = ?    
            `, [ingresoId, userId]) as [all_ingresos[], FieldPacket[]];

            return rows.length ? true : false;
        } catch (error) {
            console.error("Ha ocurrido un error: ", error);
            return false;
        }
    }

    public async obtenerTodos(userId: number, pagina: number = 1, limit: number = 5){
        try {
            const offset = (pagina - 1) * limit;

            const [rows] = await this.connection.execute(`
                select 
                    *
                from ingresos
                where id_usuario = ?
                order by id desc
                limit ${limit} offset ${offset}
            `, [userId]) as [all_ingresos[], FieldPacket[]];

            return { estatus: 1,
                info: {
                    message: "Listado de los ingresos realizados por el usuario",
                    data: rows ?? [],
                    pagina: pagina,
                    cantidad: limit
                }
            }
        } catch (error) {
            console.error("Ha ocurrido un error al obtener los ingresos: ", error);
            return { estatus: 0,
                info: {
                    message: "Ha ocurrido un error al obtener los ingresos: "+error,
                    data: [],
                    pagina: 0,
                    cantidad: 0
                }}
        }
    }

    public async guardar(ingreso: Ingreso, userId: number){
        try {
            await this.connection.execute(`
                insert into ingresos (cantidad, id_usuario)
                values (?, ?)    
            `, [ingreso.getCantidad(), userId]);

            return {estatus: 1, info: {
                message: "Se ha guardado el ingreso de manera correcta"
            }};
        } catch (error) {
            console.error("Ha ocurrido un error al guardar un ingreso: ", error);
            return {estatus: 0, info: {
                message: "Ha ocurrido un error al guardar un ingreso: "+error
            }};
        }
    }

    public async eliminar(ingresoId: number, userId: number){
        try {
            const isMine: boolean = await this.isMine(userId, ingresoId);
            if(!isMine) return { estatus: 2, 
                info: { 
                    message: "El ingreso no le pertenece al usuario"
                }
            }

            await this.connection.execute(`
                delete from ingresos
                where id = ?
            `, [ingresoId]);

            return {estatus: 1,
                info: {
                    message: "Se ha eliminado el ingreos de manera exitosa"
                }
            };

        } catch (error) {
            console.error("Ha ocurrido un error intentando eliminar el registro: ", error);
            return {estatus: 0,
                info: {
                    message: "Ha ocurrido un error intentado eliminar el registro: "+error
                }};
        }
    }
}

export {
    Ingreso, 
    IngresoRepository
}
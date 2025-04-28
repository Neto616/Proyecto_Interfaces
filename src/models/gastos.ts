import { FieldPacket } from "mysql2";
import { all_gastos } from "../types/tipos_gastos";
import { Connection } from "mysql2/promise";
class Gasto{
    constructor(public cantidad: number, public valueCategory: (number | null),
        public valueCategoryP: (number | null), private userId: number
    ){}

    public getCantidad(): number {
        return this.cantidad;
    }
    
    public getValueCategory(): (number | null) {
        return this.valueCategory;
    }

    public getValueCategoryP(): (number | null) {
        return this.valueCategoryP;
    }

    public getUserId(): number {
        return this.userId;
    }

    public setCantidad(cantidad: number): void {
        this.cantidad = cantidad;
    }
}

class GastoRepository {
    constructor (private connection: Connection){}

    public async getAll(gasto: Gasto, pagina: number = 1, limit: number = 10) {
        try {
            const offset = (pagina - 1) * limit;

            const [rows] = await this.connection.execute(
                `select 
                    g.id as id,
                    format(g.cantidad, 2) as cantidad,
                    concat(u.nombre, " ", apellido) as usuario,
                    c.titulo as categoria_titulo,
                    c.icono as categoria_icono,
                    cp.titulo as categoria_personalizada_titulo,
                    cp.icono as categoria_personalizada_icono,
                    g.fecha_alta
                from gastos g
                left join gastos_categorias_r gcr on gcr.id_gasto = g.id
                inner join usuarios u on u.id = g.usuario
                left join categorias c on c.id = gcr.id_categoria
                left join categoria_personalizada cp on cp.id = gcr.id_categoria_per and cp.usuario = ?
                where g.usuario = ?
                order by g.id
                limit ${limit} offset ${offset};`,
                [gasto.getUserId(), gasto.getUserId()]
            ) as [all_gastos[], FieldPacket[]];

            return {
                estatus: 1, 
                info: {
                    message: "Listado de gastos del usuario",
                    data: rows || [],
                    pagina: pagina,
                    cantidad: limit
                }
            };
        } catch (error) {
            console.log(error);
            return {
                estatus: 0, 
                info: {
                    message: "Ha ocurrido un error: "+error,
                    data: []
                }
            };
        }
    }

    public async create(gasto: Gasto) {
        try {
            console.log(gasto)

            await this.connection.execute(
                `insert into gastos
                (cantidad, fecha_alta, usuario)
                values
                (?, now(), ?)`,
                [gasto.getCantidad(), gasto.getUserId()]
            );

            await this.connection.execute(
                `insert into gastos_categorias_r
                (id_gasto, id_categoria, id_categoria_per)
                value
                (LAST_INSERT_ID(), ?, ?)`, 
                [gasto?.getValueCategory(), gasto?.getValueCategoryP()])

            return {
                estatus: 1,
                info: {
                    message: "Se ha guardado el gasto"
                }
            }
        } catch (error) {
            console.log(error);
            return {
                estatus: 0,
                info: {
                    message: "Ha ocurrido un error: "+error
                }
            };
        }
    }

    public async update(gasto: Gasto, gastoId: number) {
        try {
            await this.connection.execute(
                `update gastos
                set cantidad = ?
                where id = ?`,
                [gasto.getCantidad(), gastoId]
            );

            await this.connection.execute(
                `update gastos_Categorias_r
                set id_categoria = ?,
                id_categoria_per = ?
                where id_gasto = ?`,
                [gasto.getValueCategory(), gasto.getValueCategoryP(), gastoId]
            );

            return {
                estatus: 1,
                info: {
                    message: "Se actualizo la información del gasto con exito"
                }
            };
        } catch (error) {
            console.log(error);
            return {
                estatus: 0,
                info: {
                    message: "Ha ocurrido un error: "+error
                }
            };
        }
    }

    public async delete(gastoId: number) {
        try {
            await this.connection.execute(`delete from gastos_categorias_r where id_gasto = ?`, [gastoId]);
            await this.connection.execute(`delete from gastos where id = ?`, [gastoId]);
            return {
                estatus: 1,
                info: {
                    message: "Se ha borrado el gasto"
                }
            };
        } catch (error) {
            console.log(error);
            return {
                estatus: 0,
                info: {
                    message: "Ha ocurrido un error: "+error
                }
            };
        }
    }
}

export {
    Gasto,
    GastoRepository
}
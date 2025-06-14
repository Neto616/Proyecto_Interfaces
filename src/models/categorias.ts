import { FieldPacket } from "mysql2";
import { all_categories } from "../types/tipos_categorias";
import { Connection } from 'mysql2/promise';

class Categoria {
    constructor(public nombre: string, public icono: string = ""){ 
    }

    public getNombre(): string {
        return this.nombre;
    }

    public getIcono(): string {
        return this.icono;
    }

    public setNombre(newName: string): void {
        this.nombre = newName;
    }

    public setIcono(path: string): void {
        this.icono = path;
    }
}

class CategoriaRepository {
    constructor(private connection: Connection){}
    private async exist(categoria: Categoria, userId: number, active=true): Promise<boolean> {
        try {
            const [rows] = await this.connection.execute(
                `select 
                    *
                from categoria_personalizada
                where estatus = ?
                and titulo = ?
                and usuario = ?`, 
                [(active ? 1 : 0), categoria.getNombre(), userId]
            ) as [all_categories[], FieldPacket[]];

            return rows.length ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async getAll(userId: number){
        try {
            const [categorias] = await this.connection.execute(
                `select * from categorias`) as [all_categories[], FieldPacket[]];
            const [categorias_personalizadas] = await this.connection.execute(
                `select 
                    * 
                from categoria_personalizada
                where usuario = ?
                and estatus = 1;`,
                [userId]) as [all_categories[], FieldPacket[]];

            return {
                estatus: 1,
                info: {
                    message: "Listado de categorias y de categorias creadas por el usuario",
                    data: {
                        categorias: (categorias || []),
                        categorias_personalizadas: (categorias_personalizadas || [])
                    }
                }
            }
        } catch (error) {
            console.log(error);
            return {
                estatus: 0,
                info: {
                    message: "Ha ocurrido un error: "+error,
                    data: {
                        categorias: [],
                        categorias_personalizadas: []
                    }
                }
            };
        }
    }

    public async crear(categoria: Categoria, userId: number) {
        try {
            const existActive: boolean = await this.exist(categoria, userId);
            const existDesactive: boolean = await this.exist(categoria, userId, false);
            
            if(existActive) {
                return {
                    estatus: 2,
                    info: {
                        message: "Ya existe la categoria que se desea crear"
                    }
                };
            }

            if(existDesactive){
                await this.connection.execute(
                    `update categoria_personalizada
                    set estatus = 1
                    where usuario = ?
                    and titulo = ?`, 
                    [userId, categoria.getNombre()]
                );
            }else{
                await this.connection.execute(
                    `insert into categoria_personalizada
                    (usuario, titulo, icono, fecha_creacion, estatus)
                    values
                    (?, ?, ?, now(), 1)`, 
                    [userId, categoria.getNombre(), categoria.getIcono()]
                );
            }

            return {
                estatus: 1, 
                info: {
                    message: "Se ha creado una nueva categoria"
                }
            };
        } catch (error) {
            return {
                estatus: 0,
                info: {
                    message: "Ha ocurrido un error: "+error
                }
            };
        }
    }
    
    public async eliminar(categoria: Categoria, userId: number) {
        try {
            const exist: boolean = await this.exist(categoria, userId);
            if(!exist){
                return {
                    estatus: 2,
                    info: {
                        message: "La categoria no existe"
                    }
                };
            }

            await this.connection.execute(
                `update categoria_personalizada
                set estatus = 0
                where usuario = ?
                and titulo = ?`,
                [userId, categoria.getNombre()]
            );

            return {
                estatus: 1,
                info: {
                    message: "Se ha eliminado la categoria"
                }
            };
        } catch (error) {
            console.log(error);
            return {
                estatus: 0,
                info: {
                    message: "Ha ocurrido un error: "+error
                }
            }
        }
    }
}

export {
    Categoria,
    CategoriaRepository
}
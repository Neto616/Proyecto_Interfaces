//Modulos de terceros
import dotenv from 'dotenv';
dotenv.config();
import Cryptr from "cryptr";
//Modulos creados
import DB from "./db";
import { all_users } from '../types/tipos_usuarios';
import { FieldPacket } from 'mysql2';

class Usuario extends DB {
    constructor(
        public correo: string, 
        private contrasena: string,
        public nombre: string,
        public apellido: string
    ) {
        super();
    }

    public getCorreo(): string {
        return this.correo;
    }

    public getPass(): string{
        return this.contrasena;
    }

    public setPass(contrasena: string): string{
        return this.contrasena = contrasena;
    }

    private encodePass(): string {
        try {
            const cryptr: Cryptr = new Cryptr((process.env.SECRET || ""), {saltLength: 10});
            const contrasena: string = this.contrasena;
            this.setPass(cryptr.encrypt(contrasena));

            return this.contrasena;
        } catch (error) {
            console.log(error);
            return "";
        }
    }

    private decodePass(contrasena: string): string {
        try {
            const cryptr: Cryptr = new Cryptr((process.env.SECRET || ""), {saltLength: 10});
            return cryptr.decrypt(contrasena);
        } catch (error) {
            console.log(error);
            return "";
        }
    }

    public async existUser(): Promise<boolean> {
        try {
            if(!this.connection) await this.PoolConnect();

            const [rows] = await this.connection.execute(`
                select 
                    * 
                from usuarios 
                where correo = ?
                limit 1`,
                [this.correo]
            ) as [all_users[], FieldPacket[]] || [void[]];
            console.log(rows)
            
            return rows.length ? true : false;
        } catch (error) {
            return false;
        }
    }

    public async createUser() {
        try {
            if(!this.connection) await this.PoolConnect();

            const existUser: boolean = await this.existUser();

            if(existUser) {
                return {
                    estatus: 2,
                    info: {
                        message: "Usuario existente",
                        usuario: `${this.nombre} ${this.apellido}`
                    }
                };
            }
            this.encodePass();

            await this.connection.execute(
                `insert into usuarios
                (nombre, apellido, correo, contrasena, fecha_creacion)
                values
                (?, ?, ?, ?, now())`,
                [this.nombre, this.apellido, this.getCorreo(), this.getPass()]
            );

            return {
                estatus: 1,
                info: {
                    message: "Se ha creado el usuario de manera correcta",
                    usuario: `${this.nombre} ${this.apellido}`
                }
            };
        } catch (error) {
            return {
                estatus: 0,
                info: {
                    message: "Ha ocurrido un error: "+error,
                    usuario: ""
                }
            };
        }
    }

    public async updateUser(id: number) {
        try {
            if(!this.connection) await this.PoolConnect();

            const existUser: boolean = await this.existUser();

            return {
                estatus: 1,
                info: {
                    message: "El usuario se ha actualizado"
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

    public async deleteUer(id: number) {
        try {
            if(!this.connection) await this.PoolConnect();

            const existUser: boolean = await this.existUser();

            if(!existUser) {
                return {
                    estatus: 2,
                    info: {
                        message: "El usuario no existe"
                    }
                }
            }

            await this.connection.execute(
                `delete from usuarios
                where id = ?`,
                [id]
            )

            return {
                estatus: 1,
                info: {
                    message: "El usuario se elimino con exito"
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
    };
}

export default Usuario;
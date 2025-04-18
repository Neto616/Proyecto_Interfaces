//Modulos de terceros
import dotenv from 'dotenv';
dotenv.config();
import Cryptr from "cryptr";
//Modulos creados
import DB from "./db";
import { all_users } from '../types/tipos_usuarios';
import { FieldPacket } from 'mysql2';

class Usuario{
    constructor(
        public correo: string, 
        private contrasena: string,
        public nombre: string,
        public apellido: string
    ) {}

    public getCorreo(): string {
        return this.correo;
    }

    public getPass(): string{
        return this.contrasena;
    }

    public setPass(contrasena: string): string{
        return this.contrasena = contrasena;
    }

    public encodePass(): string {
        try {
            const cryptr: Cryptr = new Cryptr((process.env.SECRET || ""), {saltLength: 10});
            const contrasena: string = this.contrasena;
            this.setPass(cryptr.encrypt(contrasena));

            return this.contrasena;
        } catch (error) {
            console.log(error);
            return "";
        }
    };

    public decodePass(contrasena: string): string {
        try {
            const cryptr: Cryptr = new Cryptr((process.env.SECRET || ""), {saltLength: 10});
            return cryptr.decrypt(contrasena);
        } catch (error) {
            console.log(error);
            return "";
        }
    };
}

class UsuarioRepository extends DB {
    private async existUser(usuario: Usuario): Promise<boolean> {
        try {
            await this.checkConnection()

            const [rows] = await this.connection.execute(`
                select 
                    * 
                from usuarios 
                where correo = ?
                limit 1`,
                [usuario.correo]
            ) as [all_users[], FieldPacket[]] || [void[]];
            console.log(rows)
            
            return rows.length ? true : false;
        } catch (error) {
            return false;
        }
    };

    private async findUserById(id: number): Promise<boolean>{
        try {
            await this.checkConnection()

            const [rows] = await this.connection.execute(
                `select
                    *
                from usuarios
                where id = ? 
                limit 1`,
                [id]
            ) as [all_users[], FieldPacket[]]

            return rows.length ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    private async existOtherUser(id: number, usuario: Usuario): Promise<boolean>{
        try {
            await this.checkConnection();

            const [rows] = await this.connection.execute(
                `select
                    *
                from usuarios
                where id != ? 
                and correo = ?
                limit 1`,
                [id, usuario.getCorreo()]
            ) as [all_users[], FieldPacket[]]

            return rows.length ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async createUser(usuario: Usuario) {
        try {
            await this.checkConnection();

            const existUser: boolean = await this.existUser(usuario);

            if(existUser) {
                return {
                    estatus: 2,
                    info: {
                        message: "Usuario existente",
                        usuario: `${usuario.nombre} ${usuario.apellido}`
                    }
                };
            }

            await this.connection.execute(
                `insert into usuarios
                (nombre, apellido, correo, contrasena, fecha_creacion)
                values
                (?, ?, ?, ?, now())`,
                [usuario.nombre, usuario.apellido, usuario.getCorreo(), usuario.encodePass()]
            );

            return {
                estatus: 1,
                info: {
                    message: "Se ha creado el usuario de manera correcta",
                    usuario: `${usuario.nombre} ${usuario.apellido}`
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

    public async updateUser(id: number, usuario: Usuario) {
        try {
            await this.checkConnection();
            const existUser: boolean = await this.existOtherUser(id, usuario);

            if(existUser){
                return {
                    estatus: 2,
                    info: {
                        message: "Ya existe un usuario con ese correo"
                    }
                };
            }
            await this.connection.execute(
                `update usuarios
                set correo = ?,
                nombre = ?,
                apellido = ?
                where id = ?`,
                [usuario.getCorreo(), usuario.nombre, usuario.apellido, id]
            )

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

    public async updatePassword(id:number, lastPassword: string, usuario: Usuario){
        try {
            await this.checkConnection()

            const [rows] = await this.connection.execute(
                `select
                    *
                from usuarios
                where id = ?`,
                [id]
            ) as [all_users[], FieldPacket[]];

            if(!rows.length){
                return {
                    estatus: 2,
                    info: {
                        message: "No existe el usuario en base de datos"
                    }
                };
            }

            const passDB: string = usuario.decodePass(rows[0].contrasena);

            if(lastPassword !== passDB) {
                return {
                    estatus: 3,
                    info: {
                        message: "No coincide la contraseña actual del usuario"
                    }
                };
            }

            await this.connection.execute(
                `update usuarios
                    set contrasena = ?
                where id = ?`,
                [usuario.encodePass(), id]
            )

            return {
                estatus: 1, 
                info: {
                    message: "Se ha cambiado la contraseña del usuario"
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

    public async deleteUser(id: number) {
        try {
            await this.checkConnection()

            const existUser: boolean = await this.findUserById(id);

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
    }
}

export {
    Usuario,
    UsuarioRepository
};
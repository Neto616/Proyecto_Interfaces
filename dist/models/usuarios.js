"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepository = exports.Usuario = void 0;
//Modulos de terceros
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cryptr_1 = __importDefault(require("cryptr"));
//Modulos creados
const db_1 = __importDefault(require("./db"));
class Usuario {
    constructor(correo, contrasena, nombre, apellido) {
        this.correo = correo;
        this.contrasena = contrasena;
        this.nombre = nombre;
        this.apellido = apellido;
    }
    getCorreo() {
        return this.correo;
    }
    getPass() {
        return this.contrasena;
    }
    setPass(contrasena) {
        return this.contrasena = contrasena;
    }
    encodePass() {
        try {
            const cryptr = new cryptr_1.default((process.env.SECRET || ""), { saltLength: 10 });
            const contrasena = this.contrasena;
            this.setPass(cryptr.encrypt(contrasena));
            return this.contrasena;
        }
        catch (error) {
            console.log(error);
            return "";
        }
    }
    ;
    decodePass(contrasena) {
        try {
            const cryptr = new cryptr_1.default((process.env.SECRET || ""), { saltLength: 10 });
            return cryptr.decrypt(contrasena);
        }
        catch (error) {
            console.log(error);
            return "";
        }
    }
    ;
}
exports.Usuario = Usuario;
class UsuarioRepository extends db_1.default {
    existUser(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkConnection();
                const [rows] = (yield this.connection.execute(`
                select 
                    * 
                from usuarios 
                where correo = ?
                limit 1`, [usuario.correo])) || [void []];
                console.log(rows);
                return rows.length ? true : false;
            }
            catch (error) {
                return false;
            }
        });
    }
    ;
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkConnection();
                const [rows] = yield this.connection.execute(`select
                    *
                from usuarios
                where id = ? 
                limit 1`, [id]);
                return rows.length ? true : false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    existOtherUser(id, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkConnection();
                const [rows] = yield this.connection.execute(`select
                    *
                from usuarios
                where id != ? 
                and correo = ?
                limit 1`, [id, usuario.getCorreo()]);
                return rows.length ? true : false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkConnection();
                const userInfo = yield this.findUserById(id);
                if (!userInfo) {
                    return {
                        estatus: 2,
                        info: {
                            message: "El usuario no existe",
                            data: []
                        }
                    };
                }
                const [rows] = yield this.connection.query(`select
                    *
                from usuarios
                where id = ?
                limit 1
                `, [id]);
                return {
                    estatus: 1,
                    info: {
                        message: "Datos del usuario",
                        data: rows[0] || {}
                    }
                };
            }
            catch (error) {
                console.log(error);
                return {
                    estatus: 0,
                    info: {
                        message: "Ha ocurrido un error: " + error,
                        data: []
                    }
                };
            }
        });
    }
    createUser(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkConnection();
                const existUser = yield this.existUser(usuario);
                if (existUser) {
                    return {
                        estatus: 2,
                        info: {
                            message: "Usuario existente",
                            usuario: `${usuario.nombre} ${usuario.apellido}`
                        }
                    };
                }
                yield this.connection.execute(`insert into usuarios
                (nombre, apellido, correo, contrasena, fecha_creacion)
                values
                (?, ?, ?, ?, now())`, [usuario.nombre, usuario.apellido, usuario.getCorreo(), usuario.encodePass()]);
                return {
                    estatus: 1,
                    info: {
                        message: "Se ha creado el usuario de manera correcta",
                        usuario: `${usuario.nombre} ${usuario.apellido}`
                    }
                };
            }
            catch (error) {
                return {
                    estatus: 0,
                    info: {
                        message: "Ha ocurrido un error: " + error,
                        usuario: ""
                    }
                };
            }
        });
    }
    updateUser(id, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkConnection();
                const existUser = yield this.existOtherUser(id, usuario);
                if (existUser) {
                    return {
                        estatus: 2,
                        info: {
                            message: "Ya existe un usuario con ese correo"
                        }
                    };
                }
                yield this.connection.execute(`update usuarios
                set correo = ?,
                nombre = ?,
                apellido = ?
                where id = ?`, [usuario.getCorreo(), usuario.nombre, usuario.apellido, id]);
                return {
                    estatus: 1,
                    info: {
                        message: "El usuario se ha actualizado"
                    }
                };
            }
            catch (error) {
                console.log(error);
                return {
                    estatus: 0,
                    info: {
                        message: "Ha ocurrido un error: " + error
                    }
                };
            }
        });
    }
    updatePassword(id, lastPassword, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkConnection();
                const [rows] = yield this.connection.execute(`select
                    *
                from usuarios
                where id = ?`, [id]);
                if (!rows.length) {
                    return {
                        estatus: 2,
                        info: {
                            message: "No existe el usuario en base de datos"
                        }
                    };
                }
                const passDB = usuario.decodePass(rows[0].contrasena);
                if (lastPassword !== passDB) {
                    return {
                        estatus: 3,
                        info: {
                            message: "No coincide la contraseña actual del usuario"
                        }
                    };
                }
                yield this.connection.execute(`update usuarios
                    set contrasena = ?
                where id = ?`, [usuario.encodePass(), id]);
                return {
                    estatus: 1,
                    info: {
                        message: "Se ha cambiado la contraseña del usuario"
                    }
                };
            }
            catch (error) {
                console.log(error);
                return {
                    estatus: 0,
                    info: {
                        message: "Ha ocurrido un error: " + error
                    }
                };
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkConnection();
                const existUser = yield this.findUserById(id);
                if (!existUser) {
                    return {
                        estatus: 2,
                        info: {
                            message: "El usuario no existe"
                        }
                    };
                }
                yield this.connection.execute(`delete from usuarios
                where id = ?`, [id]);
                return {
                    estatus: 1,
                    info: {
                        message: "El usuario se elimino con exito"
                    }
                };
            }
            catch (error) {
                console.log(error);
                return {
                    estatus: 0,
                    info: {
                        message: "Ha ocurrido un error: " + error
                    }
                };
            }
        });
    }
}
exports.UsuarioRepository = UsuarioRepository;

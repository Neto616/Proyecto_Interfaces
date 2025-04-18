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
//Modulos de terceros
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cryptr_1 = __importDefault(require("cryptr"));
//Modulos creados
const db_1 = __importDefault(require("./db"));
class Usuario extends db_1.default {
    constructor(correo, contrasena, nombre, apellido) {
        super();
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
    existUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.connection)
                    yield this.PoolConnect();
                const [rows] = (yield this.connection.execute(`
                select 
                    * 
                from usuarios 
                where correo = ?
                limit 1`, [this.correo])) || [void []];
                console.log(rows);
                return rows.length ? true : false;
            }
            catch (error) {
                return false;
            }
        });
    }
    createUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.connection)
                    yield this.PoolConnect();
                const existUser = yield this.existUser();
                if (existUser) {
                    return {
                        estatus: 2,
                        info: {
                            message: "Usuario existente",
                            usuario: `${this.nombre} ${this.apellido}`
                        }
                    };
                }
                this.encodePass();
                yield this.connection.execute(`insert into usuarios
                (nombre, apellido, correo, contrasena, fecha_creacion)
                values
                (?, ?, ?, ?, now())`, [this.nombre, this.apellido, this.getCorreo(), this.getPass()]);
                return {
                    estatus: 1,
                    info: {
                        message: "Se ha creado el usuario de manera correcta",
                        usuario: `${this.nombre} ${this.apellido}`
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
    updateUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.connection)
                    yield this.PoolConnect();
                const existUser = yield this.existUser();
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
    deleteUer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.connection)
                    yield this.PoolConnect();
                const existUser = yield this.existUser();
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
    ;
}
exports.default = Usuario;

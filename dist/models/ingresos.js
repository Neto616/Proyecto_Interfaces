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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngresoRepository = exports.Ingreso = void 0;
class Ingreso {
    constructor(cantidad) {
        this.cantidad = this.cantidadAceptable(cantidad);
    }
    getCantidad() {
        return this.cantidad;
    }
    cantidadAceptable(cantidad_ingresada) {
        if (cantidad_ingresada > 0)
            return cantidad_ingresada;
        else
            throw new Error("Favor de ingresar un valor mayor a 0");
    }
}
exports.Ingreso = Ingreso;
class IngresoRepository {
    constructor(connection) {
        this.connection = connection;
    }
    isMine(userId, ingresoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield this.connection.execute(`
                select
                 *
                from ingresos
                where id = ? and id_usuario = ?    
            `, [ingresoId, userId]);
                console.log(rows);
                return rows.length ? true : false;
            }
            catch (error) {
                console.error("Ha ocurrido un error: ", error);
                return false;
            }
        });
    }
    obtenerTodos(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, pagina = 1, limit = 5) {
            try {
                const offset = (pagina - 1) * limit;
                const [rows] = yield this.connection.execute(`
                select 
                    *
                from ingresos
                where id_usuario = ?
                order by id desc
                limit ${limit} offset ${offset}
            `, [userId]);
                return { estatus: 1,
                    info: {
                        message: "Listado de los ingresos realizados por el usuario",
                        data: rows !== null && rows !== void 0 ? rows : [],
                        pagina: pagina,
                        cantidad: limit
                    }
                };
            }
            catch (error) {
                console.error("Ha ocurrido un error al obtener los ingresos: ", error);
                return { estatus: 0,
                    info: {
                        message: "Ha ocurrido un error al obtener los ingresos: " + error,
                        data: [],
                        pagina: 0,
                        cantidad: 0
                    } };
            }
        });
    }
    guardar(ingreso, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.execute(`
                insert into ingresos (cantidad, id_usuario)
                values (?, ?)    
            `, [ingreso.getCantidad(), userId]);
                return { estatus: 1, info: {
                        message: "Se ha guardado el ingreso de manera correcta"
                    } };
            }
            catch (error) {
                console.error("Ha ocurrido un error al guardar un ingreso: ", error);
                return { estatus: 0, info: {
                        message: "Ha ocurrido un error al guardar un ingreso: " + error
                    } };
            }
        });
    }
    eliminar(ingresoId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isMine = yield this.isMine(userId, ingresoId);
                if (!isMine)
                    return { estatus: 2,
                        info: {
                            message: "El ingreso no le pertenece al usuario"
                        }
                    };
                yield this.connection.execute(`
                delete from ingresos
                where id = ?
            `, [ingresoId]);
                return { estatus: 1,
                    info: {
                        message: "Se ha eliminado el ingreos de manera exitosa"
                    }
                };
            }
            catch (error) {
                console.error("Ha ocurrido un error intentando eliminar el registro: ", error);
                return { estatus: 0,
                    info: {
                        message: "Ha ocurrido un error intentado eliminar el registro: " + error
                    } };
            }
        });
    }
}
exports.IngresoRepository = IngresoRepository;

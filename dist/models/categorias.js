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
exports.CategoriaRepository = exports.Categoria = void 0;
const db_1 = __importDefault(require("./db"));
class Categoria {
    constructor(nombre, icono = "") {
        this.nombre = nombre;
        this.icono = icono;
    }
    getNombre() {
        return this.nombre;
    }
    getIcono() {
        return this.icono;
    }
    setNombre(newName) {
        this.nombre = newName;
    }
    setIcono(path) {
        this.icono = path;
    }
}
exports.Categoria = Categoria;
class CategoriaRepository extends db_1.default {
    exist(categoria_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (categoria, userId, active = true) {
            try {
                yield this.checkConnection();
                const [rows] = yield this.connection.execute(`select 
                    *
                from categoria_personalizada
                where estatus = ?
                and titulo = ?
                and usuario = ?`, [(active ? 1 : 0), categoria.getNombre(), userId]);
                return rows.length ? true : false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkConnection();
                const [categorias] = yield this.connection.execute(`select * from categorias`);
                const [categorias_personalizadas] = yield this.connection.execute(`select 
                    * 
                from categoria_personalizada
                where usuario = ?
                and estatus = 1;`, [userId]);
                return {
                    estatus: 1,
                    info: {
                        message: "Listado de categorias y de categorias creadas por el usuario",
                        data: {
                            categorias: (categorias || []),
                            categorias_personalizadas: (categorias_personalizadas || [])
                        }
                    }
                };
            }
            catch (error) {
                console.log(error);
                return {
                    estatus: 0,
                    info: {
                        message: "Ha ocurrido un error: " + error,
                        data: {
                            categorias: [],
                            categorias_personalizadas: []
                        }
                    }
                };
            }
        });
    }
    crear(categoria, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkConnection();
                const existActive = yield this.exist(categoria, userId);
                const existDesactive = yield this.exist(categoria, userId, false);
                if (existActive) {
                    return {
                        estatus: 2,
                        info: {
                            message: "Ya existe la categoria que se desea crear"
                        }
                    };
                }
                if (existDesactive) {
                    yield this.connection.execute(`update categoria_personalizada
                    set estatus = 1
                    where usuario = ?
                    and titulo = ?`, [userId, categoria.getNombre()]);
                }
                else {
                    yield this.connection.execute(`insert into categoria_personalizada
                    (usuario, titulo, icono, fecha_creacion, estatus)
                    values
                    (?, ?, ?, now(), 1)`, [userId, categoria.getNombre(), categoria.getIcono()]);
                }
                return {
                    estatus: 1,
                    info: {
                        message: "Se ha creado una nueva categoria"
                    }
                };
            }
            catch (error) {
                return {
                    estatus: 0,
                    info: {
                        message: "Ha ocurrido un error: " + error
                    }
                };
            }
        });
    }
    eliminar(categoria, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkConnection();
                const exist = yield this.exist(categoria, userId);
                if (!exist) {
                    return {
                        estatus: 2,
                        info: {
                            message: "La categoria no existe"
                        }
                    };
                }
                yield this.connection.execute(`update categoria_personalizada
                set estatus = 0
                where usuario = ?
                and titulo = ?`, [userId, categoria.getNombre()]);
                return {
                    estatus: 1,
                    info: {
                        message: "Se ha eliminado la categoria"
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
exports.CategoriaRepository = CategoriaRepository;

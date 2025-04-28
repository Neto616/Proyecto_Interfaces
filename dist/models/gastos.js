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
exports.GastoRepository = exports.Gasto = void 0;
class Gasto {
    constructor(cantidad, valueCategory, valueCategoryP, userId) {
        this.cantidad = cantidad;
        this.valueCategory = valueCategory;
        this.valueCategoryP = valueCategoryP;
        this.userId = userId;
    }
    getCantidad() {
        return this.cantidad;
    }
    getValueCategory() {
        return this.valueCategory;
    }
    getValueCategoryP() {
        return this.valueCategoryP;
    }
    getUserId() {
        return this.userId;
    }
    setCantidad(cantidad) {
        this.cantidad = cantidad;
    }
}
exports.Gasto = Gasto;
class GastoRepository {
    constructor(connection) {
        this.connection = connection;
    }
    getAll(gasto_1) {
        return __awaiter(this, arguments, void 0, function* (gasto, pagina = 1, limit = 10) {
            try {
                const offset = (pagina - 1) * limit;
                const [rows] = yield this.connection.execute(`select 
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
                limit ${limit} offset ${offset};`, [gasto.getUserId(), gasto.getUserId()]);
                return {
                    estatus: 1,
                    info: {
                        message: "Listado de gastos del usuario",
                        data: rows || [],
                        pagina: pagina,
                        cantidad: limit
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
    create(gasto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(gasto);
                yield this.connection.execute(`insert into gastos
                (cantidad, fecha_alta, usuario)
                values
                (?, now(), ?)`, [gasto.getCantidad(), gasto.getUserId()]);
                yield this.connection.execute(`insert into gastos_categorias_r
                (id_gasto, id_categoria, id_categoria_per)
                value
                (LAST_INSERT_ID(), ?, ?)`, [gasto === null || gasto === void 0 ? void 0 : gasto.getValueCategory(), gasto === null || gasto === void 0 ? void 0 : gasto.getValueCategoryP()]);
                return {
                    estatus: 1,
                    info: {
                        message: "Se ha guardado el gasto"
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
    update(gasto, gastoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.execute(`update gastos
                set cantidad = ?
                where id = ?`, [gasto.getCantidad(), gastoId]);
                yield this.connection.execute(`update gastos_Categorias_r
                set id_categoria = ?,
                id_categoria_per = ?
                where id_gasto = ?`, [gasto.getValueCategory(), gasto.getValueCategoryP(), gastoId]);
                return {
                    estatus: 1,
                    info: {
                        message: "Se actualizo la información del gasto con exito"
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
    delete(gastoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.execute(`delete from gastos_categorias_r where id_gasto = ?`, [gastoId]);
                yield this.connection.execute(`delete from gastos where id = ?`, [gastoId]);
                return {
                    estatus: 1,
                    info: {
                        message: "Se ha borrado el gasto"
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
exports.GastoRepository = GastoRepository;

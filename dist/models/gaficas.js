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
exports.GraficaService = exports.Grafica = void 0;
const tipos_graficas_1 = require("../types/tipos_graficas");
class Grafica {
    constructor(data, colors) {
        this.data = data;
        this.colors = colors !== null && colors !== void 0 ? colors : this.setColors();
    }
    getData() {
        return this.data;
    }
    getColors() {
        return this.colors;
    }
    setColors() {
        const availableColors = tipos_graficas_1.CHART_JS_COLOR_VALUES;
        const colorsToAssign = [];
        for (let i = 0; i < this.data.length; i++) {
            const colorIndex = i % availableColors.length;
            colorsToAssign.push(availableColors[colorIndex]);
        }
        return colorsToAssign;
    }
}
exports.Grafica = Grafica;
class GraficaService {
    constructor(connection) {
        this.connection = connection;
    }
    getGastosIngresos(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield this.connection.execute(`
                SELECT
                    'Gasto' AS label,
                    COALESCE(SUM(g.cantidad), 0) AS value
                FROM
                control_gastos_app.gastos g
                WHERE g.usuario = ?
                UNION ALL
                
                SELECT
                    'Ingreso' AS label,
                    COALESCE(SUM(i.cantidad), 0) AS value
                FROM
                control_gastos_app.ingresos i
                WHERE i.id_usuario = ?;`, [userId, userId]);
                const result = new Grafica((rows || []), ["red", "green"]);
                return {
                    estatus: 1, info: {
                        message: "Se han traido los calculos de los gastos e ingresos del usuario",
                        data: result
                    }
                };
            }
            catch (error) {
                console.log(error);
                return { estatus: 0, info: {
                        message: "Ha ocurrido un error al traer la información de los gastos y los ingresos del usuario: " + error,
                        data: null
                    } };
            }
        });
    }
    getGastoCategorias(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield this.connection.execute(`
                select 
                    sum(g.cantidad) as value,
                    if( c.titulo is not null,c.titulo, cp.titulo) as label
                from gastos g
                left join gastos_categorias_r gcr on gcr.id_gasto = g.id
                inner join usuarios u on u.id = g.usuario
                left join categorias c on c.id = gcr.id_categoria
                left join categoria_personalizada cp on cp.id = gcr.id_categoria_per and cp.usuario = ?
                where g.usuario = ?
                group by c.titulo, cp.titulo
                `, [userId, userId]);
                const resultado = new Grafica((rows || []), null);
                return {
                    estatus: 1, info: {
                        message: "Se han traido los datos de los gastos por categoria del usuario",
                        data: resultado
                    }
                };
            }
            catch (error) {
                console.log(error);
                return { estatus: 0, info: {
                        message: "Se ha traido los calculos de los gastos por categoria",
                        data: null
                    } };
            }
        });
    }
    getGastoSemana(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield this.connection.execute(`                
                SELECT
                    CASE DAYOFWEEK(calendar.date)
                        WHEN 1 THEN 'Domingo'
                        WHEN 2 THEN 'Lunes'
                        WHEN 3 THEN 'Martes'
                        WHEN 4 THEN 'Miércoles'
                        WHEN 5 THEN 'Jueves'
                        WHEN 6 THEN 'Viernes'
                        WHEN 7 THEN 'Sábado'
                    END AS label,
                    COALESCE(SUM(g.cantidad), 0) AS value
                FROM (
                    SELECT CURDATE() - INTERVAL (WEEKDAY(CURDATE()) - n.n) DAY AS date
                    FROM (
                        SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
                    ) AS n
                ) AS calendar
                LEFT JOIN gastos g
                    ON DATE(g.fecha_alta) = calendar.date AND g.usuario = ?
                GROUP BY calendar.date
                ORDER BY calendar.date;
            `, [userId]);
                return { estatus: 1, info: {
                        message: "Datos de los gastos semanales",
                        data: rows || []
                    } };
            }
            catch (error) {
                console.log(error);
                return { estatus: 0, info: {
                        message: "Se ha traido los calculos de los gastos por categoria",
                        data: null
                    } };
            }
        });
    }
}
exports.GraficaService = GraficaService;

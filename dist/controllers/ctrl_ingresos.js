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
const db_1 = require("../models/db");
const cryptr_1 = __importDefault(require("cryptr"));
const ingresos_1 = require("../models/ingresos");
const cryptr = new cryptr_1.default((process.env.SECRET || ""), { saltLength: 10 });
const ctrl_ingresos = {
    obtener_ingresos: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = parseInt(cryptr.decrypt(((_a = req.session.usuario) === null || _a === void 0 ? void 0 : _a.userNumber) || "0"));
            const connection = yield db_1.db.connect();
            const servicio = new ingresos_1.IngresoRepository(connection);
            const resultado = yield servicio.obtenerTodos(userId);
            return res.status(200).json(resultado);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0 });
        }
    }),
    crear_ingreso: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { cantidad } = req.body;
            const userId = parseInt(cryptr.decrypt(((_a = req.session.usuario) === null || _a === void 0 ? void 0 : _a.userNumber) || "0"));
            const connection = yield db_1.db.connect();
            const ingreso = new ingresos_1.Ingreso(cantidad);
            const servicio = new ingresos_1.IngresoRepository(connection);
            const resultado = yield servicio.guardar(ingreso, userId);
            return res.status(200).json(resultado);
        }
        catch (error) {
            console.log("Ha sucedido un error al crear ingreso: ", error);
            return res.status(500).json({ estatus: 0 });
        }
    }),
    eliminar_ingreso: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const ingresoId = parseInt(req.query.numero || "0");
            const userId = parseInt(cryptr.decrypt(((_a = req.session.usuario) === null || _a === void 0 ? void 0 : _a.userNumber) || "0"));
            console.log("El id del usuario es: ", userId, "\nEl id del ingreso es: ", ingresoId);
            const connection = yield db_1.db.connect();
            const servicio = new ingresos_1.IngresoRepository(connection);
            const resultado = yield servicio.eliminar(ingresoId, userId);
            return res.status(200).json(resultado);
        }
        catch (error) {
            console.error("Ha ocurrido un error al eliminar: ", error);
            return res.status(500).json({ estatus: 0 });
        }
    })
};
exports.default = ctrl_ingresos;

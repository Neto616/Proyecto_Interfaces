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
const cryptr_1 = __importDefault(require("cryptr"));
const cryptr = new cryptr_1.default((process.env.SECRET || ""), { saltLength: 10 });
const db_1 = require("../models/db");
const gaficas_1 = require("../models/gaficas");
const ctrl_graficos = {
    gastosCategorias: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const userId = parseInt(cryptr.decrypt(req.session.usuario?.userNumber)  || "0");
            const userId = 5;
            console.log(userId);
            const connection = yield db_1.db.connect();
            const graficaService = new gaficas_1.GraficaService(connection);
            const resultado = yield graficaService.getGastoCategorias(userId);
            console.log("Gasto por categorias: " + JSON.stringify(resultado));
            return res.status(200).json(resultado);
        }
        catch (error) {
            console.log("Ha ocurrido un error al obtener datos: ", error);
            return res.status(500).json({ estatus: 0 });
        }
    }),
    gastosIngresos: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const userId: number = parseInt(cryptr.decrypt(req.session.usuario?.userNumber || "0"));
            const userId = 5;
            const connection = yield db_1.db.connect();
            const graficaService = new gaficas_1.GraficaService(connection);
            const resultado = yield graficaService.getGastosIngresos(userId);
            console.log("Gasto Ingreso: ", resultado);
            return res.status(200).json(resultado);
        }
        catch (error) {
            console.log("Ha ocurrido un error al obtener losd atos: ", error);
            return res.status(500).json({ estatus: 0 });
        }
    })
};
exports.default = ctrl_graficos;

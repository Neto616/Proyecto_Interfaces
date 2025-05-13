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
const gastos_1 = require("../models/gastos");
const db_1 = require("../models/db");
const ctrl_gastos = {
    crear: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const connection = yield db_1.db.connect();
            const userId = res.locals.id;
            const { cantidad, categoria, categoria_p } = req.body;
            const gasto = new gastos_1.Gasto(cantidad, categoria, categoria_p, userId);
            const service = new gastos_1.GastoRepository(connection);
            const result = service.create(gasto);
            return res.status(200).json(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0, info: { message: "Ha ocurrido un error: " + error } });
        }
    }),
    actualizar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const connection = yield db_1.db.connect();
            const gasto = new gastos_1.Gasto(0, null, null, 0);
            const service = new gastos_1.GastoRepository(connection);
            const result = service.update(gasto, 0);
            return res.status(200).json(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0, info: { message: "Ha ocurrido un error: " + error } });
        }
    }),
    eliminar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { gasto } = req.query;
            const conncection = yield db_1.db.connect();
            const service = new gastos_1.GastoRepository(conncection);
            const result = service.delete(parseInt(gasto || "0"));
            return res.status(200).json(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0, info: { message: "Ha ocurrido un error: " + error } });
        }
    })
};
exports.default = ctrl_gastos;

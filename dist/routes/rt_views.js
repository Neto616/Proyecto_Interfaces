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
const express_1 = require("express");
const usuarios_1 = require("../models/usuarios");
const gastos_1 = require("../models/gastos");
const route = (0, express_1.Router)();
route.get("/user-info/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; //Por el momento es query pero cambiara una vez tengamos sessions y cookies
        const service = new usuarios_1.UsuarioRepository();
        const result = yield service.getInfo(parseInt(id || "0"));
        console.log(result);
        return res.json(result);
    }
    catch (error) {
        console.log(error);
        return res.json({
            estatus: 0,
            data: {
                nombre: ""
            }
        });
    }
}));
route.get("/get-gastos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; //Por el momento es query pero cambiara una vez tengamos sessions y cookies
        const gasto = new gastos_1.Gasto(0, null, null, parseInt(id || "0"));
        const service = new gastos_1.GastoRepository();
        const result = yield service.getAll(gasto);
        console.log(result);
        return res.json(result);
    }
    catch (error) {
        console.log(error);
        return res.json({
            estatus: 0,
            data: {}
        });
    }
}));
route.get("/iniciar-sesion", (req, res) => {
    res.send('Iniciar sesion');
});
route.get("/", (req, res) => {
    res.send('DashBoards');
});
exports.default = route;

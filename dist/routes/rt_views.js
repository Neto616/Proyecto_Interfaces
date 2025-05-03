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
const express_1 = require("express");
const usuarios_1 = require("../models/usuarios");
const gastos_1 = require("../models/gastos");
const path_1 = __importDefault(require("path"));
const authMdw_1 = require("../middlewares/authMdw");
const db_1 = require("../models/db");
const cryptr_1 = __importDefault(require("cryptr"));
const cryptr = new cryptr_1.default((process.env.SECRET || ""), { saltLength: 10 });
const route = (0, express_1.Router)();
route.get("/session", (req, res) => res.send(req.session));
route.get("/cerrar-sesion", (req, res) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.usuario)
        req.session.destroy((err) => console.log(err));
    res.redirect("/");
});
route.get("/user-info", [authMdw_1.hasAccount], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield db_1.db.connect();
        const service = new usuarios_1.UsuarioRepository(connection);
        const { userNumber } = req.session.usuario;
        const result = yield service.getInfo(parseInt(cryptr.decrypt(userNumber) || "0"));
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
route.get("/get-gastos", [authMdw_1.hasAccount], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield db_1.db.connect();
        const { userNumber } = req.session.usuario;
        const gasto = new gastos_1.Gasto(0, null, null, parseInt(cryptr.decrypt(userNumber) || "0"));
        const service = new gastos_1.GastoRepository(connection);
        const result = yield service.getAll(gasto);
        // console.log(result);
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
    res.sendFile(path_1.default.join(__dirname, "../client/index.html"));
});
route.get("/crear-cuenta", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../client/index.html"));
});
route.get("/", [authMdw_1.hasAccount], (req, res) => {
    console.log("La sesion es: ", req.session);
    if (req.session.usuario) {
        console.log("Hola   ");
        return res.sendFile(path_1.default.join(__dirname, "../client/index.html"), (err) => console.log("Ha ocurrido un error", err));
    }
    return res.redirect("/iniciar-sesion");
});
exports.default = route;

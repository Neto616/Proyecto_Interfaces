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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = require("express");
const usuarios_1 = require("../models/usuarios");
const gastos_1 = require("../models/gastos");
const path_1 = __importDefault(require("path"));
const authMdw_1 = require("../middlewares/authMdw");
const db_1 = require("../models/db");
const cryptr_1 = __importDefault(require("cryptr"));
const ctrl_categorias_1 = __importDefault(require("../controllers/ctrl_categorias"));
const ctrl_ingresos_1 = __importDefault(require("../controllers/ctrl_ingresos"));
const ctrl_graficas_1 = __importDefault(require("../controllers/ctrl_graficas"));
const cryptr = new cryptr_1.default((process.env.SECRET || ""), { saltLength: 10 });
const route = (0, express_1.Router)();
route.get("/session", (req, res) => res.send(req.session));
route.get("/cerrar-sesion", (req, res) => {
    var _a;
    try {
        if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.usuario)
            req.session.destroy((err) => console.log(err));
        return res.redirect("/");
    }
    catch (error) {
        console.log(error);
        return res.redirect("/");
    }
});
//Obtencion de datos
route.get("/user-info", [authMdw_1.hasAccount], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield db_1.db.connect();
        const service = new usuarios_1.UsuarioRepository(connection);
        const { userNumber } = req.session.usuario;
        const result = yield service.getInfo(parseInt(cryptr.decrypt(userNumber) || "0"));
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
        const result = yield service.getAll(gasto, 1, 5);
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
route.get("/categorias", /*[hasAccount],*/ ctrl_categorias_1.default.getAll);
route.get("/ingresos", [], ctrl_ingresos_1.default.obtener_ingresos);
route.get("/gastos_categorias", [authMdw_1.hasAccount], ctrl_graficas_1.default.gastosCategorias);
route.get("/gastos_ingresos", [authMdw_1.hasAccount], ctrl_graficas_1.default.gastosIngresos);
route.get("/gastos_semanales", [authMdw_1.hasAccount], ctrl_graficas_1.default.gastosSemanales);
//Rutas para el chat
route.post("/get-chat", [authMdw_1.hasAccount], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const idUser = cryptr.decrypt(req.session.usuario.userNumber);
        let data = JSON.parse(yield db_1.dbRedis.getData(idUser.toString()));
        const usrMsj = (_a = req.body.usrMsj) !== null && _a !== void 0 ? _a : "";
        const fetchData = yield fetch(`http://localhost:8000/chat_bot?password=${process.env.API_PASS}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: usrMsj !== null && usrMsj !== void 0 ? usrMsj : "", correo: req.session.usuario.correo })
        });
        const { estatus, result } = yield fetchData.json();
        if (data && usrMsj) {
            let msjArr = data;
            msjArr.push({ tipo: "mensaje enviado", mensaje: usrMsj });
            data = msjArr;
        }
        ;
        if (data.length && !usrMsj) {
            return res.json({
                estatus: 1,
                info: {
                    data: data || []
                }
            });
        }
        data.push({ tipo: "mensaje recibido", mensaje: result.respuesta_bot });
        yield db_1.dbRedis.setData(idUser.toString(), JSON.stringify(data));
        data = JSON.parse(yield db_1.dbRedis.getData(idUser.toString()));
        const lastMsj = [data[data.length - 1]];
        return res.json({
            estatus: 1,
            info: {
                data: (usrMsj ? lastMsj : data) || []
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}));
//Carga de vistas
route.get("/iniciar-sesion", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../client/index.html"));
});
route.get("/crear-cuenta", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../client/index.html"));
});
route.get("/chatito", [authMdw_1.hasAccount], (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../client/index.html"));
});
route.get("/", [authMdw_1.hasAccount], (req, res) => {
    if (req.session.usuario) {
        return res.sendFile(path_1.default.join(__dirname, "../client/index.html"), (err) => console.log("Ha ocurrido un error", err));
    }
    return res.redirect("/iniciar-sesion");
});
exports.default = route;

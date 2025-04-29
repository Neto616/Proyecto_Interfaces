"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ctrl_usuarios_1 = __importDefault(require("../controllers/ctrl_usuarios"));
const ctrl_servicios_1 = __importDefault(require("../controllers/ctrl_servicios"));
const usersMdw_1 = require("../middlewares/usersMdw");
const route = (0, express_1.Router)();
//usuarios
route.put("/iniciar-sesion", [usersMdw_1.isCorreo], ctrl_servicios_1.default.login);
route.post("/crear-usuario", [usersMdw_1.isCorreo, usersMdw_1.samePass], ctrl_usuarios_1.default.crear);
route.put("/actualizar-usuario", ctrl_usuarios_1.default.actualizar);
exports.default = route;

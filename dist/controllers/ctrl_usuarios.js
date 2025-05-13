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
const usuarios_1 = require("../models/usuarios");
const db_1 = require("../models/db");
const ctrl_usuario = {
    crear: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const connection = yield db_1.db.connect();
            const { correo, contrasena, nombre, apellido } = req.body;
            console.log(req.body);
            const usuario = new usuarios_1.Usuario(correo, contrasena, nombre, apellido);
            const service = new usuarios_1.UsuarioRepository(connection);
            const result = yield service.createUser(usuario);
            console.log(result);
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
            const userId = res.locals.id;
            const { correo, nombre, apellido } = req.body;
            const usuario = new usuarios_1.Usuario(correo, "", nombre, apellido);
            const service = new usuarios_1.UsuarioRepository(connection);
            const result = yield service.updateUser(userId, usuario);
            console.log(result);
            return res.status(200).json(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0, info: { message: "Ha ocurrido un error: " + error } });
        }
    }),
    eliminar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const connection = yield db_1.db.connect();
            const userId = res.locals.id;
            const service = new usuarios_1.UsuarioRepository(connection);
            const result = yield service.deleteUser(userId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0, info: { message: "Ha ocurrido un error: " + error } });
        }
    })
};
exports.default = ctrl_usuario;

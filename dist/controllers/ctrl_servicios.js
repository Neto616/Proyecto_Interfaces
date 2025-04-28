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
const usuarios_1 = require("../models/usuarios");
const db_1 = require("../models/db");
const authService_1 = __importDefault(require("../models/authService"));
const ctrl_service = {
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const connection = yield db_1.db.connect();
            const { correo, contrasena } = req.body;
            console.log("Datos: ", correo, contrasena);
            const usuario = new usuarios_1.Usuario(correo, contrasena, "", "");
            const user_service = new usuarios_1.UsuarioRepository(connection);
            const authentication = new authService_1.default(user_service);
            const login = yield authentication.logIn(usuario);
            console.log(login);
            if (login.estatus === 1) {
                console.log("Creacion de una cookie");
                req.session.usuario = login.info;
                console.log(req.session);
            }
            return res.json(login);
        }
        catch (error) {
            console.log(error);
            return res.json({
                estatus: 0
            });
        }
    })
};
exports.default = ctrl_service;

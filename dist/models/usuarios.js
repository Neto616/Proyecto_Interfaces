"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
class Usuario extends db_1.default {
    constructor(correo, contrasena) {
        super();
        this.correo = correo;
        this.contrasena = contrasena;
    }
}
exports.default = Usuario;

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
const categorias_1 = require("../models/categorias");
const cryptr_1 = __importDefault(require("cryptr"));
const cryptr = new cryptr_1.default((process.env.SECRET || ""), { saltLength: 10 });
const categorias = {
    crear: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { nombre, icono } = req.body;
            const userId = parseInt(
            // cryptr.decrypt(req.session.usuario.userNumber)
            "5");
            const connection = yield db_1.db.connect();
            const categoria = new categorias_1.Categoria(nombre, icono);
            const service = new categorias_1.CategoriaRepository(connection);
            const resultado = yield service.crear(categoria, userId);
            console.log(resultado);
            return res.json(resultado);
        }
        catch (error) {
            console.log("Ha sucedidad un error al crear la cateogria: ", error);
            return res.json({ estatus: 0 });
        }
    })
};
exports.default = categorias;

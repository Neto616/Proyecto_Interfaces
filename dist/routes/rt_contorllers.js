"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route = (0, express_1.Router)();
route.post("/crear-usuario", (req, res) => {
    try {
        const { correo, contrasena, nombre, apellido } = req.body;
        return res.status(200).json({ estatus: 1 });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ estatus: "Error al crear usuario" });
    }
});
exports.default = route;

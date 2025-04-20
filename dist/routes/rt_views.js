"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route = (0, express_1.Router)();
route.get("/iniciar-sesion", (req, res) => {
    res.send('Iniciar sesion');
});
route.get("/", (req, res) => {
    res.send('DashBoards');
});
exports.default = route;

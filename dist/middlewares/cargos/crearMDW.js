"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasEmptys = hasEmptys;
exports.procesarDatos = procesarDatos;
function hasEmptys(req, res, next) {
    try {
        const { cantidad, categoria } = req.body;
        if (!cantidad || !categoria)
            return res.json({ estatus: 2 });
        // console.log(`Datos desde el middleware: \nCantidad: ${cantidad}\nCategoria: ${categoria}`);
        return next();
    }
    catch (error) {
        console.log("Error MDW crear: ", error);
        return res.json({ estatus: 0 });
    }
}
function procesarDatos(req, res, next) {
    try {
        const { categoria } = req.body;
        let categoriaNum = 0;
        let categoriaPer = 0;
        if (categoria.includes("pers-cat-"))
            categoriaPer = parseInt(categoria.split("-").slice(-1)[0]);
        else
            categoriaNum = parseInt(categoria.split("-").slice(-1)[0]);
        req.body["categoria"] = categoriaNum;
        req.body["categoria_p"] = categoriaPer;
        // console.log(`MDW procesar datos\n\nCantidad: ${cantidad}\nCategoria: ${categoriaNum}\nCategoria Personalizada: ${categoriaPer}`);
        return next();
    }
    catch (error) {
        console.log("Ha ocurrido un error en MDW procesar datos: ", error);
        return res.json({ estatus: 0 });
    }
}

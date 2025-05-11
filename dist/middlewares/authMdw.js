"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAccount = hasAccount;
function hasAccount(req, res, next) {
    if (!req.session.usuario) {
        console.log("Redirect user");
        return res.redirect("/iniciar-sesion");
    }
    return next();
}

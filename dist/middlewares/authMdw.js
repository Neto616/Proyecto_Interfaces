"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAccount = hasAccount;
function hasAccount(req, res, next) {
    console.log("Has account?", req.session);
    return next();
}

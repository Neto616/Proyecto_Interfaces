import { Request, Response, NextFunction } from "express"

function hasAccount(req: Request, res: Response, next:NextFunction){
    if(!req.session.usuario) {
        console.log("Redirect user");
        return res.redirect("/iniciar-sesion");
    }
    return next();
}

export {
    hasAccount
}
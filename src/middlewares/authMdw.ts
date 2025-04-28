import { Request, Response, NextFunction } from "express"

function hasAccount(req: Request, res: Response, next:NextFunction){
    console.log("Has account?", req.session);
    
    return next();
}

export {
    hasAccount
}
import { Request, Response, NextFunction } from "express";

async function hasEmptys(req: Request, res: Response, next: NextFunction){
    try {
        const { cantidad } = req.body;

        if(!cantidad) return res.json({ estatus: 2, info: { message: "No se pueden dejar campos vacios" }});

        return next();        
    } catch (error) {
        console.error("Ha ocurrido un error en el mdw de ingresos: ", error);
        return res.redirect("/");
    }
}

export {
    hasEmptys,
}
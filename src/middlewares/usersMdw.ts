import { Request, Response, NextFunction } from "express"

function isCorreo(req: Request, res: Response, next: NextFunction) {
    try {
        const { correo } = req.body;
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if(!regex.test(correo)){
            return res.json({
                estatus: -1,
                info: {
                    message: "El correo no tiene la estructura de un correo"
                }
            })
        }

        next();
    } catch (error) {
        console.log(error);
        return res.json({
            estatus: 0,
            info: {
                message: "Ha ocurrido un error: "+error
            }
        });
    }
}

function samePass(req: Request, res: Response, next: NextFunction){
    try {
        const { contrasena, confirmar } = req.body;

        if(contrasena !== confirmar){
            return res.json({ 
                estatus: -2,
                info: {
                    message: "Las contraseñas no son iguales"
                }
            })
        }

        next();
    } catch (error) {
        console.log(error);
        return res.json({
            estatus: 0,
            info: {
                message: "Ha ocurrido un error: "+error
            }
        })
    }
}

export {
    isCorreo, samePass
}
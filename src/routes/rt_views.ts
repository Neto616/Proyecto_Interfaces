import { Router, Request, Response } from "express";
import { UsuarioRepository } from "../models/usuarios";
import { Gasto, GastoRepository } from "../models/gastos";
import path from "path";
import { hasAccount } from "../middlewares/authMdw";
import { db } from "../models/db";
import Cryptr from "cryptr";

const cryptr: Cryptr = new Cryptr((process.env.SECRET || ""), {saltLength: 10});
const route: Router = Router();

route.get("/session", (req: Request, res: Response)=> res.send(req.session))

route.get("/cerrar-sesion", (req: Request, res: Response) => {
        if(req.session?.usuario) req.session.destroy((err) => console.log(err));
        res.redirect("/");

})

route.get("/user-info", [hasAccount],async (req: Request, res: Response) => {
    try {
        const connection = await db.connect();
        const service: UsuarioRepository = new UsuarioRepository(connection);
        const {userNumber } = req.session.usuario;
        const result = await service.getInfo(parseInt(cryptr.decrypt(userNumber) || "0"));
        console.log(result);
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.json({
            estatus: 0,
            data: {
                nombre: ""
            }
        })
    }
})

route.get("/get-gastos", [hasAccount], async (req: Request, res: Response) => {
    try {
        const connection = await db.connect()
        const {userNumber } = req.session.usuario;
        const gasto: Gasto = new Gasto(0, null, null, parseInt(cryptr.decrypt(userNumber) || "0"));
        const service: GastoRepository = new GastoRepository(connection);
        const result = await service.getAll(gasto);
        // console.log(result);

        return res.json(result);
    } catch (error) {
     console.log(error);
     return res.json({
        estatus: 0, 
        data: {}
     })
    }
})

route.get("/iniciar-sesion", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../client/index.html"))
});

route.get("/crear-cuenta", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../client/index.html"))
})

route.get("/", [hasAccount], (req: Request, res: Response) => {
    console.log("La sesion es: ",req.session)
    if(req.session.usuario){
        console.log("Hola   ")
        return res.sendFile(path.join(__dirname, "../client/index.html"), (err)=> console.log("Ha ocurrido un error", err));
    }
    return res.redirect("/iniciar-sesion")
});

export default route;
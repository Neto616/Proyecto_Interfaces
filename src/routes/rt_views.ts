import { Router, Request, Response } from "express";
import { UsuarioRepository } from "../models/usuarios";
import { Gasto, GastoRepository } from "../models/gastos";

const route: Router = Router();

route.get("/user-info/:id", async (req: Request, res: Response) => {
    try {
        const {id} = req.params; //Por el momento es query pero cambiara una vez tengamos sessions y cookies
        const service: UsuarioRepository = new UsuarioRepository();
        const result = await service.getInfo(parseInt(id || "0"));
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

route.get("/get-gastos/:id", async (req: Request, res: Response) => {
    try {
        const {id} = req.params; //Por el momento es query pero cambiara una vez tengamos sessions y cookies
        const gasto: Gasto = new Gasto(0, null, null, parseInt(id || "0"));
        const service: GastoRepository = new GastoRepository();
        const result = await service.getAll(gasto);
        console.log(result);

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
    res.send('Iniciar sesion');
});

route.get("/", (req: Request, res: Response) => {
    res.send('DashBoards');
});

export default route;
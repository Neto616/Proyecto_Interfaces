import { Router, Request, Response } from "express";

const route: Router = Router();

route.get("/iniciar-sesion", (req: Request, res: Response) => {
    res.send('Iniciar sesion');
});

route.get("/", (req: Request, res: Response) => {
    res.send('DashBoards');
});

export default route;
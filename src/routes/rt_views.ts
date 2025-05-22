import dotenv from 'dotenv';
dotenv.config();
import { Router, Request, Response } from "express";
import { UsuarioRepository } from "../models/usuarios";
import { Gasto, GastoRepository } from "../models/gastos";
import path from "path";
import { hasAccount } from "../middlewares/authMdw";
import { db, dbRedis } from '../models/db';
import Cryptr from "cryptr";
import categorias from '../controllers/ctrl_categorias';

const cryptr: Cryptr = new Cryptr((process.env.SECRET || ""), {saltLength: 10});
const route: Router = Router();

route.get("/session", (req: Request, res: Response)=> res.send(req.session))

route.get("/cerrar-sesion", (req: Request, res: Response) => {
    try {
        if(req.session?.usuario) req.session.destroy((err) => console.log(err));
        return res.redirect("/");
    } catch (error) {   
        console.log(error);
        return res.redirect("/");
    }
})
//Obtencion de datos
route.get("/user-info", [hasAccount],async (req: Request, res: Response) => {
    try {
        const connection = await db.connect();
        const service: UsuarioRepository = new UsuarioRepository(connection);
        const {userNumber } = req.session.usuario;
        const result = await service.getInfo(parseInt(cryptr.decrypt(userNumber) || "0"));
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
        const result = await service.getAll(gasto, 1, 5);
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
route.get("/categorias",/* [hasAccount],*/ categorias.getAll);
//Rutas para el chat
route.post("/get-chat", async (req: Request, res: Response) => {
    try {
        const idUser: string = cryptr.decrypt(req.session.usuario.userNumber);
        let data = JSON.parse(await dbRedis.getData(idUser.toString()));
        const usrMsj: string = req.body.usrMsj ?? "";

        const fetchData = await fetch(`http://localhost:8000/chat_bot?password=${process.env.API_PASS}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message: usrMsj ?? "", correo: req.session.usuario.correo})
        });
        const {estatus, result} = await fetchData.json();

        if(data && usrMsj){
            let msjArr: Array<{tipo: string, mensaje: string}> = data;
            msjArr.push({tipo: "mensaje enviado", mensaje: usrMsj});
            data = msjArr;
        };

        if (data.length && !usrMsj) {
            return res.json({
            estatus: 1, 
            info: {
                data: data || []
                }
            });
        }
        data.push({tipo: "mensaje recibido", mensaje: result.respuesta_bot})
        await dbRedis.setData(idUser.toString(), JSON.stringify(data));
        data = JSON.parse(await dbRedis.getData(idUser.toString()));
        const lastMsj: Array<{tipo: string, mensaje: string}> = [data[data.length-1]];

        return res.json({
            estatus: 1, 
            info: {
                data: (usrMsj ? lastMsj : data) || []
            }
        });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
})
//Carga de vistas
route.get("/iniciar-sesion", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../client/index.html"))
});

route.get("/crear-cuenta", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

route.get("/chatito", [hasAccount], (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

route.get("/", [hasAccount], (req: Request, res: Response) => {
    if(req.session.usuario){
        return res.sendFile(path.join(__dirname, "../client/index.html"), (err)=> console.log("Ha ocurrido un error", err));
    }
    return res.redirect("/iniciar-sesion");
});

export default route;
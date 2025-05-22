import {Request, Response} from 'express';
import { Gasto, GastoRepository } from '../models/gastos';
import { db } from '../models/db';
import Cryptr from "cryptr";
const cryptr: Cryptr = new Cryptr((process.env.SECRET || ""), {saltLength: 10});

const ctrl_gastos = {
    crear: async (req: Request, res:Response): Promise<Response> => {
        try {
            const connection = await db.connect();
            const userId = parseInt(cryptr.decrypt(req.session.usuario?.userNumber || "0"));
            const { cantidad, categoria, categoria_p } = req.body;
            console.log(`controlador\n\nCantidad: ${cantidad} \nCategoria: ${categoria}\nCategoria personalizada: ${categoria_p}`)
            const gasto: Gasto = new Gasto(cantidad, categoria, categoria_p, userId);
            const service: GastoRepository = new GastoRepository(connection);
            const result = await service.create(gasto);
            
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0, info: {message: "Ha ocurrido un error: "+error}});
        }
    },
    actualizar: async (req:Request, res:Response) => {
        try {
            const connection = await db.connect();
            const gasto: Gasto = new Gasto(0,null, null, 0);
            const service: GastoRepository = new GastoRepository(connection);
            const result = service.update(gasto, 0);

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0, info: {message: "Ha ocurrido un error: "+error}});
        }
    },
    eliminar: async (req:Request, res:Response) => {
        try {
            const { gasto } = req.query;
            const conncection = await db.connect();
            const service: GastoRepository = new GastoRepository(conncection);
            const result = service.delete(parseInt(gasto as string || "0"));

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0, info: {message: "Ha ocurrido un error: "+error}});
        }
    }
};

export default ctrl_gastos;
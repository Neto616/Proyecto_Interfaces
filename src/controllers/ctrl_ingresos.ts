import { Request, Response } from 'express';
import { db } from '../models/db';
import Cryptr from "cryptr";
import { Ingreso, IngresoRepository } from '../models/ingresos';
const cryptr: Cryptr = new Cryptr((process.env.SECRET || ""), {saltLength: 10});

const ctrl_ingresos = {
    obtener_ingresos: async (req: Request, res: Response) => {
        try {
            const userId = parseInt(cryptr.decrypt(req.session.usuario?.userNumber || "0"));
            const connection = await db.connect();
            const servicio: IngresoRepository = new IngresoRepository(connection);
            const resultado = await servicio.obtenerTodos(userId);

            return res.status(200).json(resultado);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0 });
        }
    },
    crear_ingreso: async (req: Request, res: Response) => {
        try {
            const { cantidad } = req.body;
            const userId = parseInt(cryptr.decrypt(req.session.usuario?.userNumber || "0"));
            const connection = await db.connect();
            const ingreso: Ingreso = new Ingreso( cantidad );
            const servicio: IngresoRepository = new IngresoRepository( connection );
            const resultado = await servicio.guardar(ingreso, userId);

            return res.status(200).json(resultado);
        } catch (error) {
            console.log("Ha sucedido un error al crear ingreso: ", error);
            return res.status(500).json({ estatus: 0 });
        }
    },
    eliminar_ingreso: async (req: Request, res: Response) => {
        try {
            const ingresoId = parseInt(req.query.numero as string || "0");
            const userId = parseInt(cryptr.decrypt(req.session.usuario?.userNumber || "0"));
            console.log("El id del usuario es: ", userId,"\nEl id del ingreso es: ", ingresoId)
            const connection = await db.connect();
            const servicio: IngresoRepository = new IngresoRepository( connection );
            const resultado = await servicio.eliminar( ingresoId, userId );

            return res.status(200).json(resultado);
        } catch (error) {
            console.error("Ha ocurrido un error al eliminar: ", error);
            return res.status(500).json({ estatus: 0 });
        }
    }
}

export default ctrl_ingresos;
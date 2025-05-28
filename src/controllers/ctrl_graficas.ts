import { Request, Response } from "express";
import Cryptr from "cryptr";
const cryptr: Cryptr = new Cryptr((process.env.SECRET || ""), {saltLength: 10});
import { db } from "../models/db";
import { Grafica, GraficaService } from "../models/gaficas";
import { MethodCostosIngresos } from "../types/tipos_graficas";

const ctrl_graficos = {
    gastosCategorias: async (req: Request, res: Response) => {
        try {
            const userId = parseInt(cryptr.decrypt(req.session.usuario?.userNumber)  || "0");
            // const userId = 5
            console.log(userId)
            const connection = await db.connect();
            const graficaService: GraficaService = new GraficaService(connection);
            const resultado: MethodCostosIngresos = await graficaService.getGastoCategorias(userId);
            console.log("Gasto por categorias: "+JSON.stringify(resultado))
            return res.status(200).json(resultado);
        } catch (error) {
            console.log("Ha ocurrido un error al obtener datos: ",error);
            return res.status(500).json({ estatus: 0 });
        }
    },
    gastosIngresos: async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(cryptr.decrypt(req.session.usuario?.userNumber || "0"));
            // const userId: number = 5;
            const connection = await db.connect();
            const graficaService: GraficaService = new GraficaService(connection);
            const resultado: MethodCostosIngresos = await graficaService.getGastosIngresos(userId);
            console.log("Gasto Ingreso: ", resultado)
            return res.status(200).json(resultado);
        } catch (error) {
            console.log("Ha ocurrido un error al obtener losd atos: ", error);
            return res.status(500).json({ estatus: 0 })
        } 
    },
    gastosSemanales: async (req:Request, res:Response) => {
        try {
            const userId: number = parseInt(cryptr.decrypt(req.session.usuario?.userNumber || "0"));
            // const userId: number = 5;
            const connection = await db.connect();
            const graficaService: GraficaService = new GraficaService(connection);
            const resultado = await graficaService.getGastoSemana(userId);

            return res.status(200).json(resultado);
        } catch (error) {
            console.error("Ha ocurrido un error al obtener los gastos semanales: ", error);
            return res.status(500).json({ estatus: 0 });
        }
    }
}

export default ctrl_graficos;
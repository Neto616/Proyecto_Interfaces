import { Request, Response } from "express";
import { db } from "../models/db";
import { Categoria, CategoriaRepository } from "../models/categorias";
import Cryptr from "cryptr";

const cryptr: Cryptr = new Cryptr((process.env.SECRET || ""), {saltLength: 10});

const categorias = {
    crear: async (req: Request, res: Response) => {
        try {
            const {nombre, icono} = req.body;
            const userId: number = parseInt(
                // cryptr.decrypt(req.session.usuario.userNumber)
                "5");

            const connection = await db.connect();
            const categoria = new Categoria(nombre, icono);
            const service = new CategoriaRepository(connection);

            const resultado = await service.crear(categoria, userId);
            console.log(resultado);
            return res.json(resultado);
        } catch (error) {
            console.log("Ha sucedidad un error al crear la cateogria: ", error);
            return res.json({ estatus: 0 })
        }
    }
}

export default categorias;
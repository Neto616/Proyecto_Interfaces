import {Request, Response} from 'express';
import { Usuario, UsuarioRepository } from '../models/usuarios';
import { db } from '../models/db';

const ctrl_usuario = {
    crear: async (req: Request, res: Response): Promise<Response> => {
        try {
            const connection = await db.connect();
            const { correo, contrasena, nombre, apellido } = req.body;
            const usuario: Usuario = new Usuario(correo, contrasena, nombre, apellido);
            const service: UsuarioRepository = new UsuarioRepository(connection);
            const result = await service.createUser(usuario);
            console.log(result);

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0, info: {message: "Ha ocurrido un error: "+error}});
        }
    },
    actualizar: async (req: Request, res: Response): Promise<Response> => {
        try {
            const connection = await db.connect();
            const userId = res.locals.id;
            const { correo, nombre, apellido } = req.body;
            const usuario: Usuario = new Usuario(correo, "", nombre, apellido);
            const service: UsuarioRepository = new UsuarioRepository(connection);
            const result = await service.updateUser(userId, usuario);
            console.log(result);

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0, info: {message: "Ha ocurrido un error: "+error}});
        }
    },
    eliminar: async (req: Request, res: Response): Promise<Response> => {
        try {
            const connection = await db.connect();
            const userId = res.locals.id;
            const service: UsuarioRepository = new UsuarioRepository(connection);
            const result = await service.deleteUser(userId);
            
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ estatus: 0, info: {message: "Ha ocurrido un error: "+error}});
        }
    }
};

export default ctrl_usuario;
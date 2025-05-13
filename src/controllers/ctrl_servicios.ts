import { Request, Response } from "express"
import { Usuario, UsuarioRepository } from "../models/usuarios";
import { db } from "../models/db";
import AuthService from '../models/authService';

const ctrl_service = {
    login: async ( req: Request, res: Response ) => {
        try {
            const connection = await db.connect();
            const {correo, contrasena} = req.body;
            console.log("Datos: ",correo, contrasena)
            const usuario: Usuario = new Usuario(correo, contrasena, "", "");
            const user_service: UsuarioRepository = new UsuarioRepository(connection);
            const authentication: AuthService = new AuthService(user_service);
            const login = await authentication.logIn(usuario);
            console.log(login)

            if(login.estatus === 1) {
                console.log("Creacion de una cookie")
                req.session.usuario = login.info;
                // console.log(req.session)
            }

            return res.json(login);
        } catch (error) {
            console.log(error);
            return res.json({
                estatus: 0
            })
        }
    }
}

export default ctrl_service
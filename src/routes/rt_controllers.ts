import { Router } from "express"
import ctrl_usuario from "../controllers/ctrl_usuarios";
import ctrl_service from "../controllers/ctrl_servicios";
import { isCorreo, samePass } from "../middlewares/usersMdw";
import categorias from "../controllers/ctrl_categorias";
import { hasAccount } from "../middlewares/authMdw";
const route = Router();

//usuarios
route.put("/iniciar-sesion", [isCorreo], ctrl_service.login);
route.post("/crear-usuario", [isCorreo, samePass], ctrl_usuario.crear);
route.put("/actualizar-usuario", ctrl_usuario.actualizar);

//Categoria personalizada
route.post("/crear-categoria", /*[hasAccount],*/ categorias.crear);
export default route;
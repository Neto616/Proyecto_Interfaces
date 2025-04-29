import { Router } from "express"
import ctrl_usuario from "../controllers/ctrl_usuarios";
import ctrl_service from "../controllers/ctrl_servicios";
import { isCorreo, samePass } from "../middlewares/usersMdw";
const route = Router();

//usuarios
route.put("/iniciar-sesion", [isCorreo], ctrl_service.login);
route.post("/crear-usuario", [isCorreo, samePass], ctrl_usuario.crear);
route.put("/actualizar-usuario", ctrl_usuario.actualizar);
export default route;
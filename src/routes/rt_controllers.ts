import { Router } from "express"
import ctrl_usuario from "../controllers/ctrl_usuarios";
import ctrl_service from "../controllers/ctrl_servicios";
const route = Router();

//usuarios
route.put("/iniciar-sesion", ctrl_service.login)
route.post("/crear-usuario", ctrl_usuario.crear);
route.put("/actualizar-usuario", ctrl_usuario.actualizar)
export default route;
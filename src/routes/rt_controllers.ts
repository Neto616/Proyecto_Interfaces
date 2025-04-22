import { Router } from "express"
import ctrl_usuario from "../controllers/ctrl_usuarios";
const route = Router();

//usuarios
route.post("/crear-usuario", ctrl_usuario.crear);
route.put("/actualizar-usuario", ctrl_usuario.actualizar)
export default route;
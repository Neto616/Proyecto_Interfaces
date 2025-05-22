import { Router } from "express"
import ctrl_usuario from "../controllers/ctrl_usuarios";
import ctrl_service from "../controllers/ctrl_servicios";
import { isCorreo, samePass } from "../middlewares/usersMdw";
import categorias from "../controllers/ctrl_categorias";
import { hasAccount } from "../middlewares/authMdw";
import ctrl_gastos from "../controllers/ctrl_gastos";
import {hasEmptys, procesarDatos} from "../middlewares/cargos/crearMDW";
import ctrl_ingresos from "../controllers/ctrl_ingresos";
const route = Router();

//usuarios
route.put("/iniciar-sesion", [isCorreo], ctrl_service.login);
route.post("/crear-usuario", [isCorreo, samePass], ctrl_usuario.crear);
route.put("/actualizar-usuario", ctrl_usuario.actualizar);

//Categoria personalizada
route.post("/crear-categoria", categorias.crear);
route.delete("/eliminar-categoria", categorias.eliminar);

//Gastos
route.post("/gasto", [hasEmptys, procesarDatos],ctrl_gastos.crear);
route.put("/gasto", ctrl_gastos.actualizar); //No funciona aun
route.delete("/gasto", ctrl_gastos.eliminar);

//Ingresos
route.post("/ingreso", ctrl_ingresos.crear_ingreso);
route.delete("/ingreso", ctrl_ingresos.eliminar_ingreso);

export default route;
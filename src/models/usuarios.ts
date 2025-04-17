import { error } from "console";
import DB from "./db";

class Usuario extends DB {
    constructor(public correo: string, private contrasena: string) {
        super();
    }
}

export default Usuario;
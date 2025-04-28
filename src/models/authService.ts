import { Usuario, UsuarioRepository } from "./usuarios";
import Cryptr from "cryptr";
const cryptr: Cryptr = new Cryptr((process.env.SECRET || ""), {saltLength: 10});

class AuthService {
    constructor(
        private usuarioRepo: UsuarioRepository
    ){ }

    private async checkPasswords(contrasenaUsuario: string, contrasena:string){
        try {
            const contrasenaDecode = cryptr.decrypt(contrasena);
            console.log(contrasenaDecode)
            if(contrasenaUsuario === contrasenaDecode){
                return {
                    estatus: 1,
                    info: "Contraseñas iguales"
                };
            }

            return {
                estatus: 2,
                info: "Contraseñas no iguales"
            };
        } catch (error) {
            return {
                estatus: 0, 
                message: "Ha ocurrido un error: "+error
            }
        }
    }

    public async logIn(usuario: Usuario){
        try {
            const { estatus, info } = await this.usuarioRepo.getUserData(usuario);

            switch (estatus) {
                case 2: return { estatus, info };
                case 1: {
                    const checkPass = await this.checkPasswords(usuario.getPass(), info.data[0].contrasena)
                    if(checkPass.estatus == 1){
                        return {
                            estatus, 
                            info: {
                                userNumber: cryptr.encrypt(info.data[0].id.toString()),
                                name: `${info.data[0].nombre} ${info.data[0].apellido}`
                            }
                        }
                    }
                    return {
                        estatus: 2, 
                        info: {}
                    }
                };
                default: return { estatus, info };
            }
        } catch (error) {
            console.log(error);
            return {
                estatus: 0,
                info: {
                    message: "Ha ocurrido un error: "+error,
                    contrasena: ""
                }
            };
        }
    }
}

export default AuthService
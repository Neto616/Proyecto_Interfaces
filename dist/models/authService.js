"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cryptr_1 = __importDefault(require("cryptr"));
const cryptr = new cryptr_1.default((process.env.SECRET || ""), { saltLength: 10 });
class AuthService {
    constructor(usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }
    checkPasswords(contrasenaUsuario, contrasena) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contrasenaDecode = cryptr.decrypt(contrasena);
                console.log(contrasenaDecode);
                if (contrasenaUsuario === contrasenaDecode) {
                    return {
                        estatus: 1,
                        info: "Contraseñas iguales"
                    };
                }
                return {
                    estatus: 2,
                    info: "Contraseñas no iguales"
                };
            }
            catch (error) {
                return {
                    estatus: 0,
                    message: "Ha ocurrido un error: " + error
                };
            }
        });
    }
    logIn(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { estatus, info } = yield this.usuarioRepo.getUserData(usuario);
                switch (estatus) {
                    case 2: return { estatus, info };
                    case 1:
                        {
                            const checkPass = yield this.checkPasswords(usuario.getPass(), info.data[0].contrasena);
                            if (checkPass.estatus == 1) {
                                return {
                                    estatus,
                                    info: {
                                        userNumber: cryptr.encrypt(info.data[0].id.toString()),
                                        name: `${info.data[0].nombre} ${info.data[0].apellido}`
                                    }
                                };
                            }
                            return {
                                estatus: 2,
                                info: {}
                            };
                        }
                        ;
                    default: return { estatus, info };
                }
            }
            catch (error) {
                console.log(error);
                return {
                    estatus: 0,
                    info: {
                        message: "Ha ocurrido un error: " + error,
                        contrasena: ""
                    }
                };
            }
        });
    }
}
exports.default = AuthService;

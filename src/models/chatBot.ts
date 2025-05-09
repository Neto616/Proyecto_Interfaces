import { Usuario, UsuarioRepository } from "./usuarios";

class ChatBot {
    constructor (private idUser: number) {}
}

class ChatBotRepository {
    constructor(public chatBot: ChatBot){}
}

export default ChatBot
from pydantic import BaseModel
from fastapi import APIRouter
from model.bd import DB
from model.bot import ChatBot, ChatBotService
app = APIRouter()
connection: DB = DB()

class Response_Chat(BaseModel):
    message: str
    correo: str

@app.get("/")
async def root():
    return {"estatus": 1, "message": "Hello World"}

@app.post("/chat_bot")
async def  talkToChatBot(password: str, response: Response_Chat):
    if password == "chatBotRealizadoParaLaMaterIaDeIntERFACESinteligentes2025EQUIPO1":
        chat: ChatBot = ChatBot(response.message, response.correo)
        services: ChatBotService = ChatBotService(connection)
        resultado = services.send_message(chat)
        print(f"El resultado es: {resultado}")
        return {"estatus": 1, "result": {"respuesta_bot": resultado}}
    else:
        return {"estatus": 0, "result": {"respuesta_bot": ""}}
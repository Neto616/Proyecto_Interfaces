#Servidor que actuara de Bot
from fastapi import FastAPI
from routes import chat_route

app = FastAPI()
app.include_router(chat_route.app)


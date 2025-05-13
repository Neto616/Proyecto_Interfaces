import re
try:
    from model.bd import DB
except ImportError:
    from bd import DB
#Clase que decidira las acciones que tenga nuestro chatbot

class ChatBot:
    INTENT_PATTERNS = {
        "gastos": [
            r"(?i).*cu[aá]les.*gastos.*",
            r"(?i).*dame.*gastos.*",
            r"(?i).*ver.*gastos.*",
            r"(?i).*mis.*gastos.*",
        ],
        "saldo": [
            r"(?i).*mi.*saldo.*",
            r"(?i).*cu[aá]nto.*saldo.*",
            r"(?i).*ver.*saldo.*",
        ],
        "categorias": [
            r"(?i).*categor[ií]as.*",
            r"(?i).*ver.*categor[ií]as.*",
            r"(?i).*cu[aá]les.*categor[ií]as.*",
        ],
        "agregar_gasto": [
            r"(?i).*agrega.*gasto.*",
            r"(?i).*añade.*gasto.*",
            r"(?i).*quiero.*agregar.*gasto.*",
            r"(?i).*registrar.*gasto.*",
        ],
        "eliminar_gasto": [
            r"(?i).*elimina.*gasto.*",
            r"(?i).*borra.*gasto.*",
            r"(?i).*quiero.*eliminar.*gasto.*",
        ],
        "inicio": [
            r"^$",
            r"hola.*"
        ],
        "ayuda": {
            r"ayuda",
            r"ayuda^$"
        }
    }

    def __init__(self, message: str, correo: str):
        self.message = message
        self.correo = correo
        self.intencion = self.detectar_intencion(message= message)
    
    @classmethod
    def detectar_intencion(cls, message: str) -> str :
        for elemento, valor in cls.INTENT_PATTERNS.items():
            for regex in valor:
                if re.search(regex, message.lower()): 
                    print("La intencion es: ", elemento)
                    return elemento
        print("No se encontro una intencion valida")
        return ""

class ChatBotService: 
    def __init__(self, db: DB):
        self.conexion = db
    
    def send_message(self, bot: ChatBot):
        if bot.intencion == "gastos":
            return self.gastos_from_message(bot= bot)
        elif bot.intencion == "saldo":
            return self.saldo_from_message(bot= bot)
        elif bot.intencion == "categorias":
            return self.categorias_from_message()
        elif bot.intencion == "agregar_gasto":
            print("La persona quiere agregar un gasto")
            return
        elif bot.intencion == "eliminar gasto":
            print("La persona quiere eliminar un gasto")
            return
        elif bot.intencion == "inicio":
            return self.start()
        else: return "Una disculpa no entendi el mensaje :( podrias mandarlo nuevamente."
        
    def start(self):
        return "¡Hola! Bienvenido a tu asistente de finanzas personales. Escribe 'ayuda' para darte la lista de comandos que puedes ejecutar"
    
    def gastos_from_message(self, bot: ChatBot):
        if not bot.correo: return "Falta el correo del usuario"
        
        cursor = self.conexion.db.cursor()
        cursor.execute("""
                       SELECT g.cantidad, g.fecha_alta
                        FROM gastos g
                        JOIN usuarios u ON g.usuario = u.id
                        WHERE u.correo = %s
                        ORDER BY g.fecha_alta DESC
                        LIMIT 5;
                       """, (bot.correo,))
        resultados = cursor.fetchall()
        cursor.close()
        if not resultados:
            return "Todavia no has realizado ningun gasto."
        
        mensaje = "Tus últimos gastos:\n\n"
        for cantidad, fecha in resultados:
            mensaje += f"- {cantidad} MXN el {fecha.strftime('%d/%m/%Y %H:%M:%S')}\n"
        return mensaje
    
        pass
    
    def agregar_gasto_cmd(self):
        pass
    
    def agregar_gasto_from_message(self):
        pass
    
    def eliminar_gasto(self): 
        pass
    
    def eliminar_gasto_from_message(self):
        pass
        pass
    
    def categorias_from_message(self) -> str:
        cursor = self.conexion.db.cursor()
        cursor.execute("""SELECT id, titulo FROM categorias""")
        resultado = cursor.fetchall()
        cursor.close()
        
        mensaje = "Categorías de gastos:\n\n"
        for categoria_id, titulo in resultado:
            mensaje += f"- {titulo} (ID: {categoria_id})\n"
        return mensaje
    
    def saldo_from_message(self, bot: ChatBot) -> str:
        if not bot.correo: return "Falta el correo del usuario"
        
        cursor = self.conexion.db.cursor()
        cursor.execute("""
                       SELECT SUM(g.cantidad) 
                        FROM gastos g
                        JOIN usuarios u ON g.usuario = u.id
                        WHERE u.correo = %s
                       """, (bot.correo,))
        resultado = cursor.fetchone()
        cursor.close()
        
        return f"Tu saldo total es: {resultado[0] if resultado[0] else '0.00'} MXN" 

if __name__ == "__main__":
    db: DB = DB()
    chat1: ChatBot = ChatBot("quiero ver mis saldo", "basn160603@gmail.com")
    chat2: ChatBotService = ChatBotService(db= db)
    print(chat2.start())
    chat2.send_message(chat1)
    print(chat2.send_message(chat1))
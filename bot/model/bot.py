from google import genai
from google.genai import types
import re
import os
import markdown
from dotenv import load_dotenv
load_dotenv()
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
            r"(?i).*ingresos"
        ],
        "categorias": [
            r"(?i).*categor[ií]as.*",
            r"(?i).*ver.*categor[ií]as.*",
            r"(?i).*cu[aá]les.*categor[ií]as.*",
        ],
        # "agregar_gasto": [
        #     r"(?i).*agrega.*gasto.*",
        #     r"(?i).*añade.*gasto.*",
        #     r"(?i).*quiero.*agregar.*gasto.*",
        #     r"(?i).*registrar.*gasto.*",
        # ],
        # "eliminar_gasto": [
        #     r"(?i).*elimina.*gasto.*",
        #     r"(?i).*borra.*gasto.*",
        #     r"(?i).*quiero.*eliminar.*gasto.*",
        # ],
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
        self._check_correo()
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

    def _check_correo(self):
        if not self.correo: raise ValueError("Necesitamos de un correo")

class ChatBotService: 
    def __init__(self, db: DB):
        self.conexion = db
    
    def send_message(self, bot: ChatBot):
        if bot.intencion == "gastos":
            gasto: Gasto = Gasto(bot.correo, self.conexion)
            return gasto.obtener()
        
        elif bot.intencion == "saldo":
            saldo: Saldo = Saldo(bot.correo, self.conexion)
            return saldo.obtener()
        
        elif bot.intencion == "categorias":
            categoria: Categorias = Categorias(bot.correo, self.conexion)
            return categoria.obtener()
        
        elif bot.intencion == "inicio":
            return self.start()
        
        elif bot.intencion == "ayuda":
            return self.ayuda()
        
        else:
            gemini: Gemini = Gemini(bot.message)
            response = gemini.peticion()
            return response
        
    def start(self):
        return "¡Hola! ^.^ Bienvenido a tu asistente de finanzas personales. Escribe 'ayuda' para darte la lista de comandos que puedes ejecutar"
        cursor = self.conexion.db.cursor()
        cursor.execute("""SELECT id, titulo FROM categorias""")
        resultado = cursor.fetchall()
        cursor.close()
        
        mensaje = "Categorías de gastos:\n\n"
        for categoria_id, titulo in resultado:
            mensaje += f"- {titulo} (ID: {categoria_id})\n"
        return mensaje
    
    def ayuda(self):
        return f"""Con mucho gusto aquí te mando una lista de posibles mensajes que puedes enviar: 
    > Muestrame mis gastos
    > Muestrame mi saldo
    > Quiero ver mis categorias
    
    Tambien puedes realizar preguntas sobre temas financieros y te respondere con mucho gusto 😊"""    
class Saldo:
    def __init__(self, correo, conexion: DB):
        self.correo = correo
        self.conexion = conexion
    
    def obtener(self):
        cursor = self.conexion.db.cursor()
        cursor.execute("""
            select
                i.id,
                format(i.cantidad, 2) as ingreso_formateado
            from ingresos i
            inner join usuarios u on u.id = i.id_usuario
            where u.correo = %s
            order by i.id desc
            limit 5;
        """, (self.correo,))
        resultado = cursor.fetchall()
        cursor.close()
        mensaje = "Listado de los ultimos cinco ingresos: \n"
        for id, cantidad in resultado:
            mensaje += f"> ${cantidad}\n"

        return mensaje
    
class Gasto:
    def __init__(self, correo, conexion: DB):
        self.correo = correo
        self.conexion = conexion
        
    def obtener(self):
        cursor = self.conexion.db.cursor()
        cursor.execute("""
            SELECT g.cantidad, g.fecha_alta
            FROM gastos g
            JOIN usuarios u ON g.usuario = u.id
            WHERE u.correo = %s
            ORDER BY g.fecha_alta DESC
            LIMIT 5;
        """, (self.correo,))
        
        resultado = cursor.fetchall()
        cursor.close()
        
        mensaje = "Tus últimos gastos:\n"
        
        for cantidad, fecha in resultado:
            mensaje += f"> {cantidad} MXN el {fecha.strftime('%d/%m/%Y %H:%M:%S')}\n"
        return mensaje

    def agregar(self, dinero):
        try:
            if not dinero: return "Favor de seleccionar la cantidad a ingresar en el gasto y su categoria"
            cursor = self.conexion.db.cursor()
            cursor.execute("select id from usuarios where correo = %s", (self.correo, ))
            id = cursor.fetchone()
            
            if not id: return "Usuario no existente"
            
            
            
            print("Sin pedos")
        except Exception as e:
            print(f"Ha ocurrido un error: {e}")

class Categorias:
    def __init__(self, correo, conexion: DB):
        self.correo = correo
        self.conexion = conexion
        
    def obtener(self):
        cursor = self.conexion.db.cursor()
        cursor.execute("""SELECT id, titulo FROM categorias""")
        resultados = cursor.fetchall()
        cursor.close()

        mensaje = "Categorías de gastos:\n\n"
        for categoria_id, titulo in resultados:
            mensaje += f"> {titulo} (ID: {categoria_id})\n"
        return mensaje
    
    def obtener_personalizados(self):
        cursor = self.conexion.db.cursor()
        cursor.execute("""
            select id, titulo 
            from categoria_personalizada cp
            inner join usuarios u on u.id = cp.usuario
            where u.correo = %s
        """, (self.correo, ))
        resultados = cursor.fetchall()
        cursor.close()
        
        mensaje = "Categorías personalizadas:\n\n"
        for categoria_id, titulo in resultados:
            mensaje += f"> {titulo} (ID: {categoria_id})\n"
    
class Gemini:
    def __init__(self, promp: str):
        self.promp = promp
    
    def peticion(self):
        client = genai.Client(api_key = os.getenv("GEMINI"))
        
        response = client.models.generate_content(
             model="gemini-1.5-flash", 
             config= types.GenerateContentConfig(
               system_instruction="You only going to answer questions about money, if is other topic you going to say 'Lo siento pero fui programado para responder solo preguntas financieras'"  
             ),
             contents= [self.promp]
        )
        html_content = markdown.markdown(response.text)

        return html_content

if __name__ == "__main__":
    db: DB = DB()
    gemini: Gemini = Gemini("Cuantos dinosaurios hemos enconrtado")
    
    gemini.peticion()
    
    chat1: ChatBot = ChatBot("quiero ver mis saldo", "basn160603@gmail.com")
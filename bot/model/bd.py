import mysql.connector
import os
from dotenv import load_dotenv
load_dotenv()

class DB:
    def __init__(self):
        self.db = self._connect()
    
    def _connect(self, intento = 1):
        try:
            print(f"Intento: {intento} || Realizando conexion")
            if intento == 3: return None
            return mysql.connector.connect(
                host=os.getenv('DB_HOST'),
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD'),
                database=os.getenv('DB_NAME')
            )
        except mysql.connector.Error as err:
            if intento <= 3:
                return self._connect(intento + 1)
            else:
                print("No se pudo establecer conexión con la base de datos tras 3 intentos")
                return None 
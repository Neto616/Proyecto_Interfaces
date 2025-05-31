# INSTALACIÓN Y EJECUCIÓN DEL PROYECTO

## Requisitos

* Node JS (versión recomendada 23.5.0 minimo)
* Python (3.12.x ó 3.13.x)

## Instalación
Para instalar las librerías de Node JS nos posicionamos:
>📂 PROJECT
>>📂src

Una vez dentro abrimos una consola y escribiremos
``npm install ó npm i``
Este comando de Node nos empezará a descargar todas las librerias necesarias entre las que se encuentra:
* Pixi
* React 
* React-router-dom
* Express

Y demás, para las libreria de Python requerimos estar en la ruta:
>📂 PROJECT
>>📂 bot

Una vez dentro abrimo una consola y escribimos:
``pip install -r requirements.txt``
quien se encargará de instalar las librerias como:
* fastapi
* pydantic

## Correr lo proyectos

### NodeJS

Para poder correr el proyecto node necesitamos crear un archivo _.env_ con los siguintes datos:

```
HOST = ""
USER = ""
DB = ""
PASS = ""
SECRET = ""
REDIS_USER = ""
REDIS_PASS = ""
REDIS_HOST = ""
REDIS_PORT = ""
API_PASS = ""
```

Una vez se tiene el archivo corremos el comando `npm run local`

### Python

Necesitamos crear un archiv _.env_ dentro de la carpeta con los siguientes datos:
```
DB_HOST= ""
DB_USER= ""
DB_PASSWORD= ""
DB_NAME= ""
GEMINI = ""
```

Una vez se creo el archivo con sus respectivos valores escribimos en consola
`fastapi dev .\main.py`

Para ejecutar el programa principal 

### Notas

Ambos servidores deben estar corriendo para la correcta funcionalidad del proyecto
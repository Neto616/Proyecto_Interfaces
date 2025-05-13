import logging
import os
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from queries import obtener_gastos_usuario, obtener_categorias, agregar_gasto, eliminar_gasto, obtener_saldo_total

load_dotenv()

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')
print(f"TOKEN: {TELEGRAM_TOKEN}")

INTENT_PATTERNS = {
    "gastos": [
        r"(?i).*cu[aá]les.*gastos.*",
        r"(?i).*dame.*gastos.*",
        r"(?i).*ver.*gastos.*",
        r"(?i).*mis.*gastos.*",
    ],
    # otros intents después...
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

}


# Comando /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('¡Hola! Bienvenido a tu asistente de finanzas personales. Usa /gastos para ver tus últimos gastos y otros comandos para más funciones.')
    
import re

async def gastos_from_message(update: Update):
    message = update.message.text

    # Buscar el correo en el mensaje
    correo_match = re.search(r"[\w\.-]+@[\w\.-]+", message)
    correo = correo_match.group() if correo_match else None

    if not correo:
        await update.message.reply_text('Por favor incluye tu correo. Ejemplo: "dame mis gastos para tu@correo.com"')
        return

    # Obtener gastos
    gastos = obtener_gastos_usuario(correo)
    if not gastos:
        await update.message.reply_text('No se encontraron gastos asociados a ese correo.')
        return

    # Formatear respuesta
    mensaje = "Tus últimos gastos:\n\n"
    for cantidad, fecha in gastos:
        mensaje += f"- {cantidad} MXN el {fecha.strftime('%d/%m/%Y %H:%M:%S')}\n"

    await update.message.reply_text(mensaje)

# Comando /gastos
async def gastos(update: Update, context: ContextTypes.DEFAULT_TYPE):
    correo = update.message.text.split(' ')[1] if len(update.message.text.split(' ')) > 1 else None
    
    if not correo:
        await update.message.reply_text('Por favor proporciona tu correo registrado. Ejemplo: /gastos tu@correo.com')
        return

    gastos = obtener_gastos_usuario(correo)

    if not gastos:
        await update.message.reply_text('No se encontraron gastos asociados a ese correo.')
        return

    mensaje = "Tus últimos gastos:\n\n"
    for cantidad, fecha in gastos:
        mensaje += f"- {cantidad} MXN el {fecha.strftime('%d/%m/%Y %H:%M:%S')}\n"

    await update.message.reply_text(mensaje)

# Comando /categorias
async def categorias(update: Update, context: ContextTypes.DEFAULT_TYPE):
    categorias = obtener_categorias()

    if not categorias:
        await update.message.reply_text('No se encontraron categorías.')
        return

    mensaje = "Categorías de gastos:\n\n"
    for categoria_id, titulo in categorias:
        mensaje += f"- {titulo} (ID: {categoria_id})\n"

    await update.message.reply_text(mensaje)

async def categorias_from_message(update: Update):
    categorias = obtener_categorias()

    if not categorias:
        await update.message.reply_text('No se encontraron categorías.')
        return

    mensaje = "Categorías de gastos:\n\n"
    for categoria_id, titulo in categorias:
        mensaje += f"- {titulo} (ID: {categoria_id})\n"

    await update.message.reply_text(mensaje)

# Comando /agregar_gasto
async def agregar_gasto_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        correo = context.args[0]
        cantidad = float(context.args[1])
        categoria_id = int(context.args[2])

        agregar_gasto(cantidad, correo, categoria_id)
        await update.message.reply_text(f"Gasto de {cantidad} MXN agregado correctamente para {correo} en la categoría {categoria_id}.")
    except (IndexError, ValueError):
        await update.message.reply_text('Formato incorrecto. Usa: /agregar_gasto correo cantidad categoria_id')


async def agregar_gasto_from_message(update: Update):
    text = update.message.text

    # Regex to extract: email, amount, and category
    match = re.search(r'([\w\.-]+@[\w\.-]+)', text)
    correo = match.group(1) if match else None

    cantidad_match = re.search(r'(\d+(?:\.\d+)?)', text)
    cantidad = float(cantidad_match.group(1)) if cantidad_match else None

    categoria_match = re.search(r'categor[ií]a\s+(\d+)', text, re.IGNORECASE)
    categoria_id = int(categoria_match.group(1)) if categoria_match else None

    if not correo or not cantidad or not categoria_id:
        await update.message.reply_text(
            "Formato no reconocido. Asegúrate de incluir el correo, cantidad y categoría. Ejemplo:\n"
            "\"Agrega un gasto de 100 en la categoría 1 para correo@ejemplo.com\""
        )
        return

    agregar_gasto(cantidad, correo, categoria_id)
    await update.message.reply_text(
        f"Gasto de {cantidad} MXN agregado correctamente para {correo} en la categoría {categoria_id}."
    )

# Comando /eliminar_gasto
async def eliminar_gasto(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if len(context.args) < 2:
        await update.message.reply_text('Por favor proporciona el correo y el ID del gasto. Ejemplo: /eliminar_gasto tu@correo.com 1')
        return

    correo = context.args[0]
    id_gasto = context.args[1]

    if not id_gasto.isdigit():
        await update.message.reply_text('El ID del gasto debe ser un número.')
        return

    id_gasto = int(id_gasto)

    exito = eliminar_gasto(id_gasto, correo)

    if exito:
        await update.message.reply_text(f'El gasto con ID {id_gasto} ha sido eliminado correctamente.')
    else:
        await update.message.reply_text('No se pudo eliminar el gasto. Asegúrate de que el correo y el ID sean correctos.')

async def eliminar_gasto_from_message(update: Update):
    text = update.message.text

    correo_match = re.search(r'([\w\.-]+@[\w\.-]+)', text)
    id_match = re.search(r'gasto.*?(\d+)', text, re.IGNORECASE)

    correo = correo_match.group(1) if correo_match else None
    id_gasto = int(id_match.group(1)) if id_match else None

    if not correo or not id_gasto:
        await update.message.reply_text(
            "Por favor indica el correo y el ID del gasto a eliminar. Ejemplo:\n"
            "\"Elimina el gasto 5 para correo@ejemplo.com\""
        )
        return

    exito = eliminar_gasto(id_gasto, correo)

    if exito:
        await update.message.reply_text(f'El gasto con ID {id_gasto} ha sido eliminado correctamente.')
    else:
        await update.message.reply_text('No se pudo eliminar el gasto. Asegúrate de que el correo y el ID sean correctos.')


# Comando /saldo
async def saldo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    correo = context.args[0] if context.args else None

    if not correo:
        await update.message.reply_text('Por favor proporciona tu correo registrado. Ejemplo: /saldo tu@correo.com')
        return

    saldo = obtener_saldo_total(correo)

    await update.message.reply_text(f"Tu saldo total es: {saldo} MXN.")
    
from telegram.ext import MessageHandler, filters

async def process_intent(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message = update.message.text
    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if re.match(pattern, message):
                if intent == "gastos":
                    return await gastos_from_message(update)
                elif intent == "saldo":
                    return await saldo_from_message(update)
                elif intent == "categorias":
                    return await categorias_from_message(update)
                elif intent == "agregar_gasto":
                    return await agregar_gasto_from_message(update)
                elif intent == "eliminar_gasto":
                    return await eliminar_gasto_from_message(update)


    await update.message.reply_text("No entendí tu solicitud. ¿Puedes reformularla o usar un comando?")


async def saldo_from_message(update: Update):
    message = update.message.text

    # Buscar correo en el texto
    correo_match = re.search(r"[\w\.-]+@[\w\.-]+", message)
    correo = correo_match.group() if correo_match else None

    if not correo:
        await update.message.reply_text('Por favor incluye tu correo. Ejemplo: "cuál es mi saldo para tu@correo.com"')
        return

    saldo = obtener_saldo_total(correo)
    await update.message.reply_text(f"Tu saldo total es: {saldo} MXN.")


# Inicialización del bot
def main():
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    # Dentro de main()
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, process_intent))


    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("gastos", gastos))
    app.add_handler(CommandHandler("categorias", categorias))
    app.add_handler(CommandHandler("agregar_gasto", agregar_gasto_cmd))
    app.add_handler(CommandHandler("eliminar_gasto", eliminar_gasto))
    app.add_handler(CommandHandler("saldo", saldo))

    print("Bot corriendo...")
    app.run_polling()

if __name__ == '__main__':
    main()
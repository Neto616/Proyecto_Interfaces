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

# Comando /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('¡Hola! Bienvenido a tu asistente de finanzas personales. Usa /gastos para ver tus últimos gastos y otros comandos para más funciones.')

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

# Comando /agregar_gasto
async def agregar_gasto_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        correo = context.args[0]
        cantidad = float(context.args[1])
        categoria_id = int(context.args[2])

        agregar_gasto(cantidad, correo, categoria_id)
        await update.message.reply_text(f"Gasto de {cantidad} MXN agregado correctamente para {correo} en la categoría {categoria_id}.")
    except (IndexError, ValueError):
        await update.message.reply_text('Formato incorrecto. Usa: /agregar_gasto correo cantidad categoria_id')

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


# Comando /saldo
async def saldo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    correo = context.args[0] if context.args else None

    if not correo:
        await update.message.reply_text('Por favor proporciona tu correo registrado. Ejemplo: /saldo tu@correo.com')
        return

    saldo = obtener_saldo_total(correo)

    await update.message.reply_text(f"Tu saldo total es: {saldo} MXN.")

# Inicialización del bot
def main():
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()

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
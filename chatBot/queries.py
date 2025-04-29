from db import get_connection

# Obtener los últimos gastos de un usuario
def obtener_gastos_usuario(correo):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    SELECT g.cantidad, g.fecha_alta
    FROM gastos g
    JOIN usuarios u ON g.usuario = u.id
    WHERE u.correo = %s
    ORDER BY g.fecha_alta DESC
    LIMIT 5;
    """

    cursor.execute(query, (correo,))
    resultados = cursor.fetchall()

    cursor.close()
    conn.close()

    return resultados 

# Obtener las categorías de gastos del usuario
def obtener_categorias():
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT id, titulo FROM categorias"
    cursor.execute(query)
    categorias = cursor.fetchall()

    cursor.close()
    conn.close()

    return categorias

# Agregar un nuevo gasto
def agregar_gasto(cantidad, correo, categoria_id):
    conn = get_connection()
    cursor = conn.cursor()

    # Obtener el ID del usuario por correo
    query_usuario = "SELECT id FROM usuarios WHERE correo = %s"
    cursor.execute(query_usuario, (correo,))
    usuario_id = cursor.fetchone()

    if usuario_id:
        # Insertar el nuevo gasto
        query_gasto = """
        INSERT INTO gastos (cantidad, fecha_alta, usuario)
        VALUES (%s, NOW(), %s);
        """
        cursor.execute(query_gasto, (cantidad, usuario_id[0]))
        gasto_id = cursor.lastrowid

        # Asociar el gasto con la categoría
        query_categoria = """
        INSERT INTO gastos_categorias_r (id_gasto, id_categoria)
        VALUES (%s, %s);
        """
        cursor.execute(query_categoria, (gasto_id, categoria_id))

        conn.commit()

    cursor.close()
    conn.close()

# Eliminar un gasto por ID
def eliminar_gasto(gasto_id):
    conn = get_connection()
    cursor = conn.cursor()

    # Primero eliminar la relación en gastos_categorias_r
    query_relacion = "DELETE FROM gastos_categorias_r WHERE id_gasto = %s"
    cursor.execute(query_relacion, (gasto_id,))

    # Luego eliminar el gasto
    query_gasto = "DELETE FROM gastos WHERE id = %s"
    cursor.execute(query_gasto, (gasto_id,))

    conn.commit()
    cursor.close()
    conn.close()


# Obtener el saldo total del usuario
def obtener_saldo_total(correo):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    SELECT SUM(g.cantidad) 
    FROM gastos g
    JOIN usuarios u ON g.usuario = u.id
    WHERE u.correo = %s
    """
    cursor.execute(query, (correo,))
    saldo = cursor.fetchone()

    cursor.close()
    conn.close()

    return saldo[0] if saldo[0] else 0

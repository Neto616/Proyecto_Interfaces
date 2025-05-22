import React from "react";
import "../../styles/style.css"

// Corrected prop destructuring for optionList
function NewCategoria ({ closeModal, optionList }) {
// Ensure optionList and its properties are safely accessed,
// providing default empty arrays if they are undefined.
    const categorias = optionList?.categorias || [];
    const categorias_personalizadas = optionList?.categorias_personalizadas || [];
    
    return (
    <div id="modal-categoria" className="modal" style={{paddingRight: "10%"}}>
        <div className="modal-contenido" >
            <span className="cerrar" id="cerrar-modal" onClick={closeModal}>&times;</span>
            <h2>Agregar Categoría</h2>
            <form id="form-categoria">
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required style={{width: "95%"}} />
                <label htmlFor="icono">Seleccione un icono:</label>
                <select id="icono" name="icono" required>
                    <option value="">---Selecciona una opción---</option>
                    { categorias.length > 0 ? categorias.map(categoria =>
                    <option key={`cat-${categoria.id}`} value={categoria.id}>{categoria.titulo}</option>
                    ) : null }
                    { categorias_personalizadas.length > 0 ? categorias_personalizadas.map(categoria =><option key={`pers-cat-${categoria.id}`} value={categoria.id}>{categoria.titulo}</option>
                    ) : null }
                </select>
                <button type="submit" className="btn-guardar">Guardar</button>
            </form>
        </div>
    </div>
    );
}

export default NewCategoria;
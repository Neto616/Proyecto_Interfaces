import React from "react";
import "../../styles/style.css"
function NewCategoria ({ closeModal }) {
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
            </select>
            <button type="submit" className="btn-guardar">Guardar</button>
        </form>
        </div>
    </div>
    );
}

export default NewCategoria;
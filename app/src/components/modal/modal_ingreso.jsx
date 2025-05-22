import React from "react";
import "../../styles/style.css";

function NewIngreso ({ closeModal }) {
    return (
        <div id="modal-ingreso" className="modal">
            <div className="modal-contenido">
                <span className="cerrar" id="cerrar-modal-ingreso" onClick={closeModal}>&times;</span>
                <h2>Registrar Ingreso</h2>
                <form id="form-ingreso">
                    <label htmlFor="monto">Monto:</label>
                    <input type="number" id="monto" name="monto" min="0" step="0.01" required style={{width: "95%"}}/>
                    <button type="submit" className="btn-guardar">Guardar</button>
                </form>
            </div>
        </div>
    );
}

export default NewIngreso;
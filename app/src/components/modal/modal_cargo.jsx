import React from "react";

function NewCargo ({ closeModal }) {
    return (
        <div id="modal-cargo" className="modal">
            <div className="modal-contenido">
                <span className="cerrar" id="cerrar-modal-cargo" onClick={closeModal}>&times;</span>
                <h2>Registrar Cargo</h2>
                
                <form id="form-cargo">
                    <label htmlFor="monto">Monto:</label>
                    <input type="number" id="monto" name="monto" min="0" step="0.01" required style={{width: "95%"}}/>
                    <label for="categoria">Categoria:</label>
                    
                    <select id="categoria" name="categoria" required>
                        <option value="">Selecciona uno</option>
                        <option value="Ingreso">Comida</option>
                        <option value="Cargo">Renta</option>
                    </select> 
                    
                    <button type="submit" className="btn-guardar">Guardar</button>
                </form>
            </div>
        </div>
    );
}

export default NewCargo
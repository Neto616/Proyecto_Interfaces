import React, { useState } from "react";

function NewCargo ({ closeModal, categoriaList, alertFunction, getGasto }) {
    const categorias = categoriaList?.categorias || [];
    const categorias_personalizadas = categoriaList?.categorias_personalizadas || [];

    const createCargo = async (e) => {
        try {
            e.preventDefault();
            const formData = new FormData(document.getElementById("form-cargo"));
            const resultado = await fetch("http://localhost:3001/gasto", {
                method: "POST",
                body: formData
            });
            const data = await resultado.json();
            console.log(data)
            if(data.estatus == 1){
                e.target.reset();
                alertFunction("success", "Proceso exitoso", "Se ha generado el cargo a su cuenta", false);
                getGasto();
                closeModal();
                return;
            }
            if(data.estatus == 2) return alertFunction("info", "Faltan datos", "Favor de ingresar todos los datos a los campos del formulario", false);
            alertFunction("info", "El proceso ha fallado", "Ha pasado algo favor de intentar de nuevo", false);
            return;
        } catch (error) {
            console.log("Ha ocurrido un error: ", error)
        }
    }

    return (
        <div id="modal-cargo" className="modal">
            <div className="modal-contenido">
                <span className="cerrar" id="cerrar-modal-cargo" onClick={closeModal}>&times;</span>
                <h2>Registrar Cargo</h2>
                
                <form id="form-cargo" onSubmit={event => createCargo(event)}>
                    <label htmlFor="cantidad">Monto:</label>
                    <input type="number" id="cantidad" name="cantidad" min="0" step="0.01" required style={{width: "95%"}}/>
                    <label htmlFor="categoria">Categoria:</label>
                    
                    <select id="categoria" name="categoria" required>
                        <option value="">---Selecciona una opción---</option>
                        { categorias_personalizadas.length > 0 ? categorias_personalizadas.map(categoria =><option key={`pers-cat-${categoria.id}`} value={`pers-cat-${categoria.id}`}>{categoria.titulo}</option>
                        ) : null }
                        { categorias.length > 0 ? categorias.map(categoria =>
                        <option key={`cat-${categoria.id}`} value={`cat-${categoria.id}`}>{categoria.titulo}</option>
                        ) : null }
                    </select> 
                    
                    <button type="submit" className="btn-guardar">Guardar</button>
                </form>
            </div>
        </div>
    );
}

export default NewCargo
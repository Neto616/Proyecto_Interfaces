import React from "react";
import "../../styles/style.css";

function NewIngreso ({ closeModal, alert, getIngresos }) {
    const crearIngreso = async (e) => {
        try {
            e.preventDefault();
            const formData = new FormData(document.getElementById("form-ingreso"));
            const peticion = await fetch("http://localhost:3001/ingreso", {
                method: "POST",
                body: formData
            });

            const resultado = await peticion.json();
            console.log(resultado)
            if(resultado.estatus == 1){
                alert("success", "Proceso exitoso", "Se ha guardado el nuevo ingreso", false);
                getIngresos();
                closeModal();
            }
            else{
                alert("info", "El proceso ha fallado", "Ha pasado algo de favor de intentarlo de nuevo", false);
            }

        } catch (error) {
            console.error("Ha ocurrido un error: ", error);
        }
    }
    return (
        <div id="modal-ingreso" className="modal">
            <div className="modal-contenido">
                <span className="cerrar" id="cerrar-modal-ingreso" onClick={closeModal}>&times;</span>
                <h2>Registrar Ingreso</h2>
                <form id="form-ingreso" onSubmit={(e) => crearIngreso(e)}>
                    <label htmlFor="monto">Monto:</label>
                    <input type="number" id="monto" name="cantidad" min="0" step="0.01" required style={{width: "95%"}}/>
                    <button type="submit" className="btn-guardar">Guardar</button>
                </form>
            </div>
        </div>
    );
}

export default NewIngreso;
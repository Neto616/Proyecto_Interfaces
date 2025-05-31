import React from "react";
import Select from "react-select";
import "../../styles/style.css";

// NO necesitas importar los iconos uno por uno aquí si vienen de la DB como URL.
// Comenta o elimina estas líneas si ya no las usas.
// import iconoAlimentacion from "../../img/iconos/Alimentacion.png"
// ... (todos los demás imports de iconos)

function NewCategoria ({ alert, closeModal, optionList }) {
    const categorias = optionList?.categorias || [];
    const categorias_personalizadas = optionList?.categorias_personalizadas || [];

    const createCategoria = async (e) => {
        try {
            e.preventDefault();
            const formData = new FormData(document.getElementById("form-categoria"));
            const peticion = await fetch("http://localhost:3001/crear-categoria", {method: "POST", body: formData});
            const resultado = await peticion.json();

            if(resultado.estatus === 2) return alert("info", "Categoria existente", "La categoria que intentas crear ya existe", false);
            if(resultado.estatus === 0) return alert("info", "Oopss...", "Favor de intentarlo nuevamente", false);
            e.target.reset();
            alert("success", "Categoria creada", "La categoria se ha creado con exito", false);
            closeModal();
            return 
        } catch (error) {
            console.log("Ha ocurrido un error: ", error);
        }
    }

    const ICON_BASE_URL = "http://localhost:3001/icono/"; 

    let options = [];

    if (categorias.length) {
        categorias.forEach(categoria => { 
            options.push({
                value: categoria.icono,
                label: categoria.titulo,
                icon: ICON_BASE_URL + categoria.icono
            });
        });
    }
    if (categorias_personalizadas.length) {
        categorias_personalizadas.forEach(categoria => {
            options.push({
                value: categoria.icono,
                label: categoria.titulo,
                icon: ICON_BASE_URL + categoria.icono
            });
        });
    }
    

    return (
        <div id="modal-categoria" className="modal" style={{paddingRight: "10%"}}>
            <div className="modal-contenido" >
                <span className="cerrar" id="cerrar-modal" onClick={closeModal}>&times;</span>
                <h2>Agregar Categoría</h2>
                <form id="form-categoria" onSubmit={(e) => createCategoria(e)}>
                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required style={{width: "95%"}} />
                    <label htmlFor="icono">Seleccione un icono:</label>
                    <Select name="icono"
                        options={options}
                        formatOptionLabel={option => (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {option.icon && ( 
                                    <img
                                        src={option.icon} 
                                        alt={option.label}
                                        style={{ marginRight: '10px', width: '24px', height: '24px' }} 
                                    />
                                )}
                                <span>{option.label}</span>
                            </div>
                        )}
                        placeholder="---Selecciona una opción---"
                    />
                    <button type="submit" className="btn-guardar">Guardar</button>
                </form>
            </div>
        </div>
    );
}

export default NewCategoria;
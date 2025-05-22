import React from "react";
import Select from "react-select";
import "../../styles/style.css"
// import iconoAlimentacion from "../../img/iconos/Alimentacion.png"
// import iconoCompras from "../../img/iconos/Compras.png"
// import iconoDeporte from "../../img/iconos/Deporte.png"
// import iconoDonaciones from "../../img/iconos/Donaciones.png"
// import iconoEducacion from "../../img/iconos/Educacion.png"
// import iconoEntrenamiento from "../../img/iconos/Entrenamiento.png"
// import iconoFinanzas from "../../img/iconos/Finanzas.png"
// import iconoHogas from "../../img/iconos/Hogar.png"
// import iconoImprevisto from "../../img/iconos/Imprevisto.png"
// import iconoImpuestos from "../../img/iconos/Impuestos.png"
// import iconoMascotas from "../../img/iconos/Mascotas.png"
// import iconoNiños from "../../img/iconos/Niños.png"
// import iconoRegalos from "../../img/iconos/Regalos.png"
// import iconoSalud from "../../img/iconos/Salud.png"
// import iconoTecnologia from "../../img/iconos/Tecnologia.png"
// import iconoTransporte from "../../img/iconos/Transporte.png"
// import iconoViajes from "../../img/iconos/Viajes.png"
// Corrected prop destructuring for optionList
function NewCategoria ({ closeModal, optionList }) {
    const categorias = optionList?.categorias || [];
    const categorias_personalizadas = optionList?.categorias_personalizadas || [];
    let options = []
    console.log(`Categorias: ${categorias}\nCategorias Personalizadas: ${categorias_personalizadas}`)
    if (categorias.length){
        categorias.map(categoria => {
            options.push({ value: categoria.id, label: categoria.titulo, icon: categoria.icono })
        });
    }if (categorias_personalizadas.length){
        categorias_personalizadas.map(categoria => {
            options.push({ value: categoria.id, label: categoria.titulo, icon: categoria.icono })
        });
    }
    
    return (
    <div id="modal-categoria" className="modal" style={{paddingRight: "10%"}}>
        <div className="modal-contenido" >
            <span className="cerrar" id="cerrar-modal" onClick={closeModal}>&times;</span>
            <h2>Agregar Categoría</h2>
            <form id="form-categoria">
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required style={{width: "95%"}} />
                <label htmlFor="icono">Seleccione un icono:</label>
                <Select options={options}/>
                {/* <select id="icono" name="icono" required>
                    <option value="">---Selecciona una opción---</option>
                    { categorias.length > 0 ? categorias.map(categoria =>
                    <option key={`cat-${categoria.id}`} value={categoria.id}>{categoria.titulo} <img src={categoria.icono} alt="" /></option>
                    ) : null }
                    { categorias_personalizadas.length > 0 ? categorias_personalizadas.map(categoria =><option key={`pers-cat-${categoria.id}`} value={categoria.id}>{categoria.titulo}</option>
                    ) : null }
                </select> */}
                <button type="submit" className="btn-guardar">Guardar</button>
            </form>
        </div>
    </div>
    );
}

export default NewCategoria;
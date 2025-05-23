import React from "react";
import "../styles/style.css";

function IngresosRecientes({number, titulo, cantidad, alerta, getIngresos}){
    const deleteIngreso = async (e) => {
        try {
            e.preventDefault();
            const resultado = await fetch(`http://localhost:3001/ingreso?numero=${e.target.id}`, {method: "DELETE", headers: {"Content-Type": "application/json"}});
            const data = await resultado.json();
            console.log(data)
            if(data.estatus == 1){
                alerta("success", "Proceso exitoso", "EL ingreso se ha eliminado exitosamente", false);
                getIngresos();
            }
            else {
                alerta("info", "Ha ocurrido algo", "Favor de intentar de nuevo más tarde", false);
            }
        } catch (error) {
            console.error("Ha ocurrido un error en el fetch: ", error);
        }
    }
    return (
        <>
            <div className="card" style={{
                padding: "0.5px", 
                paddingLeft: "20px", 
                paddingRight: "20px",
                backgroundColor: "#e1d0d6"}}
                id={number}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ marginBottom: "10px" }}>{number}.- {titulo}</h3>
                        <p style={{ color: "black", margin: 0 }}>${cantidad}</p>
                        <button className="delete-button" id={number} onClick={(e) => deleteIngreso(e)}>🗑️ Eliminar</button>
                    </div>
            </div>
        </>
    )
}

export default IngresosRecientes
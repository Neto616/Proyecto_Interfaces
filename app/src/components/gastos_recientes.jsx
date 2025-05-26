import React from "react";
import "../styles/style.css";

function GastosRecientes({number, titulo, cantidad, alerta, getGastos}){
    const deleteGasto = async (e) => {
        try {
            e.preventDefault();
            const resultado = await fetch(`http://localhost:3001/gasto?gasto=${e.target.id}`, {method: "DELETE", headers: {"Content-Type": "application/json"}});
            const data = await resultado.json();
            console.log(data)
            if(data.estatus == 1){
                alerta("success", "Proceso exitoso", "EL gasto se ha eliminado exitosamente", false);
                getGastos();
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
                padding: "12px 20px", 
                backgroundColor: "#e1d0d6"}}
                id={number}>
                    <h3 style={{ marginBottom: "4px" }}>{number}.- {titulo}</h3> 
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{color: "black", fontWeight: "bold", margin: 0,}}>${cantidad}</p>
                        <button className="delete-button" id={number} onClick={(e) => deleteGasto(e)}>🗑️ Eliminar</button>
                    </div>
            </div>
        </>
    )
}

export default GastosRecientes
import React from "react";
import "../styles/style.css";

function GastosRecientes({number, titulo, cantidad}){
    return (
        <>
            <div className="card" style={{
                padding: "0.5px", 
                paddingLeft: "20px", 
                backgroundColor: "#e1d0d6"}}
                id={number}>
                    <h3>{number}.- {titulo}</h3>
                    <p style={{color:"black"}}>${cantidad}</p>
            </div>
        </>
    )
}

export default GastosRecientes
import React from "react";
import "../styles/style.css"

function MensajeBot({ userTurn, msj }) {
    return (
        <>
        <div className={ userTurn 
            ? "mensaje enviado" 
            : "mensaje recibido"}>{msj}</div>
        </>
    );
}

export default MensajeBot;
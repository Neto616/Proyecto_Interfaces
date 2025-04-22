import React from "react";
import { Link } from "react-router-dom"
import "../styles/style.css";

function RegistroUsuario(){
    return (
        <>
        <div className="card" style=
        {{position: "fixed", left: "35%", 
        right: "35%", top: "7%", bottom: "7%", 
        padding: "40px", paddingTop: "25px"}}>
            <h2 style={{
                textAlign: "center", color: "#fdf7f9"}}>Registro</h2>
            <form style={{marginTop: "5%"}}>
                <input style={{margin: "6px 0", maxHeight: "2%"}} type="text" placeholder="Nombre" className="input-moderno" required/>
                <input style={{margin: "6px 0", maxHeight: "2%"}} type="text" placeholder="Apellido" className="input-moderno" required/>
                <input style={{margin: "6px 0", maxHeight: "2%"}} type="email" placeholder="Correo electrónico" className="input-moderno" required/>
                <input style={{margin: "6px 0", maxHeight: "2%"}} type="password" placeholder="Contraseña" className="input-moderno" required/>
                <button type="submit" className="btn-pilar" style={{backgroundColor: "#d72667", borderRadius: "20px", width: "100%", marginTop: "5%"}}>Registrarse</button>
                <button type="button" className="btn-pilar" style={{backgroundColor: "#d72667", borderRadius: "20px", width: "100%", marginTop: "1%"}}><Link to="/iniciar-sesion" style={{color: "white"}}>¿Ya tienes una cuenta?</Link></button>
            </form>
        </div>
        </>
    );
}

export default RegistroUsuario;
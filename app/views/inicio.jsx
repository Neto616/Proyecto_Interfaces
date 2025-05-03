import React from "react";
import { Link } from "react-router-dom"
import "../styles/style.css";

function Login() {
    return (
        <>
            <div
            className="card"
            style={{
                position: "fixed",
                left: "35%",
                right: "35%",
                top: "10%",
                bottom: "10%",
                padding: "40px"
            }}>
                <h2 style={{textAlign: "center", 
                    color: "#fdf7f9"}}>Inicio de Sesion</h2>
                <form style={{marginTop: "15%"}}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="input-moderno"
                        required/>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="input-moderno"
                        required/>
                    <button
                        type="submit"
                        className="btn-pilar"
                        style= {{backgroundColor: "#d72667",
                            borderRadius: "20px",
                            width: "100%",
                            marginTop: "10%"}}
                        >Iniciar sesion</button>
                    <button
                        type="button"
                        className="btn-pilar"
                        style={{backgroundColor: "#d72667",
                            borderRadius: "20px",
                            width: "100%",
                            marginTop: "5%"}}
                        ><Link to="/crear-cuenta" style={{color: "white"}}>¿No tienes una cuenta?</Link></button>
            </form>
            </div>
        </>
    )
}

export default Login
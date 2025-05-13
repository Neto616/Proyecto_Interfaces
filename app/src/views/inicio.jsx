import React, { useState } from "react";
import { data, Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import "../styles/style.css";


function Login({ alert }) {
    const [dataLogin, setDataLogin] = useState({
        correo: "",
        contrasena: ""
    });

    const navigate = useNavigate();

    const showSwal = (icon, title, text, showConfirmButton) => {
        alert.fire({
          position: "top-end",
          icon,
          title,
          text,
          showConfirmButton,
          timer: 1500
        })
    }

    const takeData = async (e) => {
        console.log(e.target)
        const { name, value } = e.target;
        setDataLogin({...dataLogin, [name]: value})
    }

    const functionLogin = async (e) => {
        try {
            e.preventDefault();
            sessionStorage.clear();
            console.log("Data Login: ", dataLogin)
            const result = await fetch("http://localhost:3001/iniciar-sesion",{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dataLogin)
            });
            const { estatus , info } = await result.json();

            if( estatus == 1 ){
                console.log(estatus, info);
                showSwal("success", "Bienvenido", info.name, false);
                setTimeout(() => navigate("/"), 1500);
                
                return ;
            }

            let text = "Favor de intentarlo otra vez";
            if( estatus == -1 ) text = "Favor de escribir un correo correct";
            if( estatus == 2 ) text = "Correo o contraseñas incorrectos";

            showSwal("info", "Oops...", text, false);
        } catch (error) {
            console.log(error);
        }
    }

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
                <form style={{marginTop: "15%"}} onSubmit={(e)=> functionLogin(e)}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        name="correo"
                        value={dataLogin.correo}
                        onChange={(e) => takeData(e)}
                        className="input-moderno"
                        required/>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        name="contrasena"
                        value={dataLogin.contrasena}
                        onChange={(e) => takeData(e)}
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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import "../styles/style.css";

function RegistroUsuario({ alert }){
    const [data, setData] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
        confirmar: ""
    });

    const navigate = useNavigate();

    const takeData = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value= e.target.value
        })
    }

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

    const fetchConnection = async (e) => {
        try {
            e.preventDefault();
            const result = await fetch("/crear-usuario",{ 
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data) 
            });

            const { estatus, info }= await result.json();
            if( estatus == -1 ) return showSwal("info", "Favor de ingresar un correo", "", false);
            if( estatus == -2 ) return showSwal("info", "Las contraseñas deben ser iguales", "", false);
            if( estatus == 2 ) return showSwal("info", "El correo ya esta ocupado por un usuario", "", false);
            if ( estatus == 0) return showSwal("info", "Oops...", "Favor de intentarlo nuevamente", false);
            setTimeout(()=>{ }, 1500)
            navigate("/iniciar-sesion")
            return showSwal("success", "Usuario creado", `Bienvenido ${info.usuario}`, false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        <div className="card" style=
        {{position: "fixed", left: "35%", 
        right: "35%", top: "7%", bottom: "7%", 
        padding: "40px", paddingTop: "25px"}}>
            <h2 style={{
                textAlign: "center", color: "#fdf7f9"}}>Registro</h2>
            <form style={{marginTop: "5%"}} onSubmit={(e)=> fetchConnection(e)}>
                <input style={{margin: "6px 0", maxHeight: "2%"}} type="text" 
                name="nombre" onChange={(e)=> takeData(e)}
                placeholder="Nombre" className="input-moderno" required/>
                <input style={{margin: "6px 0", maxHeight: "2%"}} type="text" 
                name="apellido" onChange={(e)=> takeData(e)}
                placeholder="Apellido" className="input-moderno" required/>
                <input style={{margin: "6px 0", maxHeight: "2%"}} type="email" 
                name="correo" onChange={(e)=> takeData(e)}
                placeholder="Correo electrónico" className="input-moderno" required/>
                <input style={{margin: "6px 0", maxHeight: "2%"}} type="password" 
                name="contrasena" onChange={(e)=> takeData(e)}
                placeholder="Contraseña" className="input-moderno" required/>
                <input style={{margin: "6px 0", maxHeight: "2%"}} type="password"  
                name="confirmar" onChange={(e)=> takeData(e)}
                placeholder="Confirmar contraseña" className="input-moderno" required/>
                <button type="submit" className="btn-pilar" style={{backgroundColor: "#d72667", borderRadius: "20px", width: "100%", marginTop: "5%"}}>Registrarse</button>
                <button type="button" className="btn-pilar" style={{backgroundColor: "#d72667", borderRadius: "20px", width: "100%", marginTop: "1%"}}>
                    <Link to="/iniciar-sesion" style={{color: "white"}}>¿Ya tienes una cuenta?</Link>
                </button>
            </form>
        </div>
        </>
    );
}

export default RegistroUsuario;
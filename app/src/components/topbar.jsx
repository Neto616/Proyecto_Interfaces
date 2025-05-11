import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import userIcon from "../img/6522581.png";


function TopBar() {
    const navigate = useNavigate();
    const [seccion, setSeccion] = useState("");
    const [data, setData] = useState({
        nombre: (sessionStorage.getItem("nombre") || "...")
    });

    function seccionName () {
        if(location.pathname == "/chatito") setSeccion("Habla con Chatito");
        else setSeccion("Dashboard principal");
    }

    function moveToLogin() {
        navigate("/iniciar-sesion")
    }

    useEffect( ()=> {
        async function fetchUserData (){
            if(data.nombre == "..."){
                const result = await fetch("http://localhost:3001/user-info", {method: "GET"})
                const data = await result.json();
                console.log("FetchUserData", data)
                if(data.estatus == 1){
                    sessionStorage.setItem("nombre", `${data["info"]["data"].nombre} ${data["info"]["data"].apellido}`)
                    setData({...data, nombre: `${data["info"]["data"].nombre} ${data["info"]["data"].apellido}`});
                }
            }
        };
        seccionName();
        fetchUserData();
    }, [])
    return (
        <div className="card" style={{
            padding: "20px",
            height: "fit-content",
            backgroundColor: "#f4e9ed",
            position: "fixed", 
            top: "0px", 
            right: "-10px", 
            left: "-10px"}}>
            <h2 style={{
                textAlign: "left", 
                paddingLeft: "15%"}}>{seccion}</h2>
            <h3 style={{
                position: "fixed",
                right: "115px",
                top: "25px"}}>Hola! {data?.nombre}</h3>
            <button className="btn-usuario" id="btnMyAccount" style={{
                position: "fixed", 
                right: "20px", 
                top: "20px"}}
                onClick={ ()=> moveToLogin()}>
                <img src={userIcon} style={{
                    width: "50px", 
                    height: "50px"}} alt="icono" />
            </button>
        </div>
    );
}

export default TopBar;
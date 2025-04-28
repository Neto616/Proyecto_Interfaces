import React from "react";
import "../styles/style.css";
import logo from "../img/2640804.png"

function SideBar() {
    function openChatito() {
        window.open("https://t.me/chachit0_bot", '_blank')
    }

    return (
        <div className="card" style={{
            width: "215px", position: "fixed", left: "-15px", 
            top: "0px", bottom: "-10px", width: "14%"}}>
            <img src={logo} style={{paddingLeft: "18%", marginTop: "30px", width: "70%"}}/>
            <p style={{paddingLeft: "10px"}}>Proyecto Finanzas</p>
            <button className="btn-pilar" style={{
                marginTop: "100px", paddingLeft: "40px", width: "100%"
                }}>Dashboard</button>
            <button className="btn-pilar" style={{
                paddingLeft: "40px", width: "100%"
                }} onClick={()=> openChatito()}>Habla con Chachito</button>
            <button className="btn-pilar"style={{
                paddingLeft: "40px", width: "100%"
                }}>Cerrar Sesión</button>
        </div>
    );
}

export default SideBar;
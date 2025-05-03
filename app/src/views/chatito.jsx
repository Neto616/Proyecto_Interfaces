import React, { useState } from "react";
import TopBar from "../components/topbar";
import SideBar from "../components/sidebar";
import imgEnviar from "../img/enviar.png";
import imgAdjuntar from "../img/adjuntar.png";

function ChatBot() {
    const [message, setMessage] = useState("");
    const [botTurn, setBotTurn] = useState(false);
    const [userTurn, setUserTurn] = useState(false);
    const [mensajes, setMensajes] = useState([<div key="0" className="mensaje recibido">Hola papu</div>]);

    function warnMessage (userTurn, botTurn) {
        if(userTurn && !botTurn) return <div className="escribiendo" id="escribiendo-usuario">Tú estás escribiendo...</div>;
        if(botTurn && !userTurn) return <div className="escribiendo" id="escribiendo-chatito">Chatito está escribiendo...</div>;
        return null;
    }

    function botMessage(){
        setBotTurn(true);
        setTimeout(()=>{
            setMensajes(prev => [...prev, <div key={prev.length + 1} className="mensaje recibido">Esta será una respuesta</div>])
            setBotTurn(false);
        }, 1000 * 3);
    }

    function sendMessage (msj) {
        setMensajes([...mensajes, <div key={mensajes.length + 1} className="mensaje enviado">{msj}</div>]);
        setMessage("");
        setUserTurn(false);
        botMessage()
    }

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ height: "80px", flexShrink: 0 }}>
                <TopBar />
            </div>

            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                <div style={{ width: "14%", flexShrink: 0 }}>
                    <SideBar />
                </div>

                <div style={{
                    flex: 1,
                    backgroundColor: "#fdf7f9",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <div className="chat-container" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <div className="mensajes" style={{ flex: 1, overflowY: "auto" }}>
                            {mensajes.map((e, i) => (e))}
                        </div>

                        {/* Indicadores justo arriba del área de entrada */}
                        <div>{warnMessage(userTurn, botTurn)}</div>

                        <div className="input-area">
                            <input
                                type="text"
                                className="input-moderno"
                                placeholder="Escribe tu mensaje..."
                                value={message}
                                onChange={e => {
                                    const newMesage = e.target.value
                                    setMessage(newMesage);
                                    setUserTurn(newMesage.length > 0);
                                }}
                            />
                            <button className="btn-icono" type="button" onClick={() => sendMessage(message)}>
                                <img src={imgEnviar} alt="Enviar" />
                            </button>
                            <button className="btn-icono" type="button">
                                <img src={imgAdjuntar} alt="Adjuntar" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatBot;

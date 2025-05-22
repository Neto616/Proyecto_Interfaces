import React, { useEffect, useState } from "react";
import "../styles/style.css";
import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";
import Graph from "../components/graphs";
import GastosRecientes from "../components/gastos_recientes";

function DashBorad() {
    const [gasto, setGasto] = useState([]);

    useEffect(() => {
        async function fetchGetGasto() {
            try {
                const result = await fetch("http://localhost:3001/get-gastos", { method: "GET" });
                const data = await result.json();
                setGasto(data.info.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchGetGasto();
    }, []);

    return (
        <div>
            <TopBar />
            <SideBar />

            {/* Contenedor principal con scroll si el contenido crece */}
            <div style={{
                marginLeft: "14%", // espacio para el sidebar
                marginTop: "120px", // espacio para el topbar
                padding: "20px",
                height: "calc(100vh - 120px)",
                overflowY: "auto",
                backgroundColor: "#1f71a3",
                display: "flex",
                justifyContent: "space-between"
            }}>
                
                {/* Columna izquierda */}
                <div style={{ width: "48%" }}>
                    <div className="card" style={{
                        padding: "20px",
                        backgroundColor: "#e1d0d6",
                        marginBottom: "30px"
                    }}>
                        <h3 style={{ paddingLeft: "5px" }}>División de Gastos:</h3>
                        <Graph width={"400px"} height={"500px"} typeGraph="doughnut" />
                        <button className="btn-pilar" style={{
                            fontSize: "14px",
                            borderRadius: "20px"
                        }}>Añadir Categorias</button>
                    </div>

                    <div className="card" style={{
                        padding: "10px",
                        backgroundColor: "#e1d0d6"
                    }}>
                        <h3 style={{ paddingLeft: "20px" }}>Gráfico:</h3>
                        <Graph width={"400px"} height={"500px"} />
                    </div>
                </div>

                {/* Columna derecha */}
                <div style={{ width: "48%" }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "20px"
                    }}>
                        <h4 style={{
                            color: "#ad2959",
                            paddingLeft: "10px",
                            width: "35%"
                        }}>Recientes:</h4>

                        <button className="btn-pilar" style={{
                            fontSize: "14px",
                            borderRadius: "20px",
                            width: "30%"
                        }}>Nuevo Cargo</button>

                        <button className="btn-pilar" style={{
                            fontSize: "14px",
                            borderRadius: "20px",
                            width: "30%"
                        }}>Nuevo Ingreso</button>
                    </div>

                    {gasto.length > 0 ? (gasto.map((e, i) => {
                        if (e.categoria_titulo || e.categoria_personalizada_titulo) {
                            return <GastosRecientes
                                key={e.id}
                                number={e.id}
                                titulo={e.categoria_titulo ?? e.categoria_personalizada_titulo}
                                cantidad={e.cantidad} />
                        }
                        return null;
                    })) : (
                        <div className="card" style={{
                            padding: "0.5px",
                            paddingLeft: "20px",
                            backgroundColor: "#e1d0d6"
                        }}>
                            <h3>👇🏾Ingresa tu primer cargo </h3>
                        </div>
                    )}

                    <div className="card" style={{
                        marginTop: "12px",
                        padding: "10px",
                        backgroundColor: "#e1d0d6"
                    }}>
                        <h3 style={{ paddingLeft: "20px" }}>Gráfico:</h3>
                        <Graph width={"400px"} height={"500px"} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBorad;

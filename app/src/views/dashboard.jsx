import React, { useEffect, useState } from "react";
import "../styles/style.css"
import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";
import Graph from "../components/graphs";
import GastosRecientes from "../components/gastos_recientes";

function DashBorad (){
    const [gasto, setGasto] = useState([]);

    useEffect(()=>{
        async function fetchGetGasto () {
            try {
                const result = await fetch("http://localhost:3001/get-gastos", {method: "GET"});
                const data = await result.json();
                console.log(data);
                setGasto(data.info.data)
            } catch (error) {
                console.log(error);
            }
        }

        fetchGetGasto()
    }, [])

    return (
        <div>
            <TopBar />
            <SideBar/>
            <div style={{
                width: "max-content", 
                backgroundColor: "#1f71a3"}}>
                <div style={{
                    position: "fixed", 
                    top: "130px", 
                    bottom: "30px", 
                    width: "40%",  
                    maxWidth: "40%", 
                    left: "15%"}}>
                    <div className="card" style={{
                        height: "max-content",
                        padding: "20px", 
                        backgroundColor: "#e1d0d6"}}>
                        <h3 style={{paddingLeft: "5px"}}>División de Gastos:</h3>
                        <Graph width={"400px"} height={"500px"} typeGraph="doughnut" />
                        <button className="btn-pilar" style={{
                            fontSize: "14px", 
                            borderRadius: "20px"}}>Añadir Categorias</button>
                    </div>
                    <div className="card" style={{
                        marginTop: "30px", 
                        height: "max-content", 
                        padding: "10px", 
                        backgroundColor: "#e1d0d6"}}>
                        <h3 style={{paddingLeft: "20px"}}>Gráfico:</h3>
                        <Graph width={"400px"} height={"500px"} />
                    </div>
                </div>
                <div style={{
                    position: "fixed",
                    top: "100px", 
                    right: "30px",
                    width: "40%",
                    maxWidth: "40%"}}>
                    <h4 style={{
                        color: "#ad2959", 
                        paddingLeft: "10px"}}>Recientes:</h4>
                    {gasto.length > 0 ? (gasto.map((e,i) => {
                        if(e.categoria_titulo || e.categoria_personalizada_titulo){
                            return <GastosRecientes 
                                key= {e.id}
                                number= {e.id}
                                titulo= {e.categoria_titulo ?? e.categoria_personalizada_titulo} 
                                cantidad= {e.cantidad}/>
                        }
                    })) : (<div className="card" style={{
                        padding: "0.5px", 
                        paddingLeft: "20px", 
                        backgroundColor: "#e1d0d6"}}
                        >
                            <h3>👇🏾Ingresa tu primer cargo </h3>
                    </div>)}
                    
                    <button className="btn-pilar" style={{
                        fontSize: "14px", borderRadius: "20px"
                    }}>Nuevo Cargo</button>
                    <button className="btn-pilar" style={{
                        fontSize: "14px", borderRadius: "20px"
                        }}>Nuevo Ingreso</button>
            
                    <div className="card" style={{
                        marginTop: "12px", height: "max-content", padding: "10px",
                        backgroundColor: "#e1d0d6"}}>
                        <h3 style={{paddingLeft: "20px"}}>Gráfico:</h3>
                        <Graph width={"400px"} height={"500px"} />
                    </div>
                </div>
            </div>
        </div>
    );
}


export default DashBorad;
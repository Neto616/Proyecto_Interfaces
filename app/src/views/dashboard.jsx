import React, { useEffect, useState } from "react";
import "../styles/style.css"
//Componentes
import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";
import Graph from "../components/graphs";
import GastosRecientes from "../components/gastos_recientes";
import NewCategoria from "../components/modal/modal_categoria";
import NewIngreso from "../components/modal/modal_ingreso";
import NewCargo from "../components/modal/modal_cargo";

function DashBorad (){
    const [gasto, setGasto] = useState([]);
    const [isOpenCategoria, setIsOpenCategoria] = useState(false);
    const [isOpenIngreso, setIsOpenIngreso] = useState(false);
    const [isOpenCargo, setIsOpenCargo] = useState(false);

    const openModalCategoria  = () => setIsOpenCategoria(true);
    const closeModalCategoria = () => setIsOpenCategoria(false);
    const openModalIngreso    = () => setIsOpenIngreso(true);
    const closeModalIngreso   = () => setIsOpenIngreso(false);
    const openModalCargo    = () => setIsOpenCargo(true);
    const closeModalCargo   = () => setIsOpenCargo(false);

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
            {isOpenCategoria ? <NewCategoria closeModal={closeModalCategoria} /> : null}
            {isOpenIngreso ? <NewIngreso closeModal={closeModalIngreso} /> : null}
            {isOpenCargo ? <NewCargo closeModal={closeModalCargo} /> : null}
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
                            borderRadius: "20px"}} onClick={openModalCategoria}>Añadir Categorias</button>
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
                    maxWidth: "40%"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        height: "15%",
                        maxHeight: "15%"
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
                        }} onClick={openModalCargo}>Nuevo Cargo</button>

                        <button className="btn-pilar" style={{
                            fontSize: "14px",
                            borderRadius: "20px",
                            width: "30%"
                        }} onClick={openModalIngreso}>Nuevo Ingreso</button>
                    </div>
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
                            <h3>Ingresa tu primer cargo </h3>
                    </div>)}
            
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
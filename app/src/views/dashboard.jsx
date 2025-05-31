import React, { useEffect, useState, useRef } from "react";
import "../styles/style.css";
//Pixi
import PixiRetiro from "../components/PixiRetiro";
import PixiAbonar from '../components/PixiAbonar';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom/client';
//Componentes
import GraphLoader from "../components/graph_loader";
import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";
import Graph from "../components/graphs";
import GastosRecientes from "../components/gastos_recientes";
import IngresosRecientes from "../components/ingresos_recientes";
import NewCategoria from "../components/modal/modal_categoria";
import NewIngreso from "../components/modal/modal_ingreso";
import NewCargo from "../components/modal/modal_cargo";

function DashBorad({ alert }) {
    const [loadingGraphCategoria, setloadingGraphCategoria] = useState(true);
    const [loadingGraphGastoIngreso, setloadingGraphGastoIngreso] = useState(true);
    const [loadingGraphGasto, setloadingGraphGasto] = useState(true);

    const [isOpenCategoria, setIsOpenCategoria] = useState(false);
    const [isOpenIngreso, setIsOpenIngreso] = useState(false);
    const [isOpenCargo, setIsOpenCargo] = useState(false);
    const [gasto, setGasto] = useState([]);
    const [showIngresos, setShowIngresos] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [ingresos, setIngresos] = useState([]);
    const [divGastos, setDivGastos] = useState({});
    const [gastosIngresos, setgastosIngresos] = useState({});
    const [gastoSemanal, setGastoSemanal] = useState({});

    const openModalCategoria  = () => setIsOpenCategoria(true);
    const closeModalCategoria = () => setIsOpenCategoria(false);
    const openModalIngreso    = () => setIsOpenIngreso(true);
    const closeModalIngreso   = () => setIsOpenIngreso(false);
    const openModalCargo    = () => setIsOpenCargo(true);
    const closeModalCargo   = () => setIsOpenCargo(false);
    const changeIngresos = () => setShowIngresos(!showIngresos);

    const pixiContainerRef = useRef(null);
    
    const mostrarAnimacion = () => {
        Swal.fire({
            html: `
                <div id="pixi-popup-container"
                    style="width: 100%; height: 400px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                </div>
            `,
            showConfirmButton: false,
            customClass: {
                popup: 'swal-grande'
            },
            willOpen: () => {
            const container = document.getElementById('pixi-popup-container');
            if (container) {
                const root = ReactDOM.createRoot(container);
                root.render(<PixiRetiro containerRef={{ current: container }} />);
            }
            }
        });
    };

    const mostrarAnimacionAbono = () => {
        Swal.fire({
            html: `
            <div id="pixi-popup-abonar"
                style="width: 100%; height: 400px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            </div>
            `,
            showConfirmButton: false,
            customClass: {
            popup: 'swal-grande'  // Usa tu clase personalizada de estilo
            },
            willOpen: () => {
            const container = document.getElementById('pixi-popup-abonar');
            if (container) {
                const root = ReactDOM.createRoot(container);
                root.render(<PixiAbonar containerRef={{ current: container }} />);
            }
            }
        });
    };

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

    const fetchGetGasto = async () => {
        try {
            const result = await fetch("http://localhost:3001/get-gastos", {method: "GET"});
            const data = await result.json();
            console.log(data);
            setGasto(data.info.data);
            fetchGastoCategoria();
            fetchGastoIngresos();
            fetchGastoSemanal();
        } catch (error) {
            console.log(error);
        }
    }

    const fetchGetIngresos = async () => {
        try {
            const result = await fetch("http://localhost:3001/ingresos", {method: "GET"});
            const data = await result.json();
            console.log(data);
            setIngresos(data.info.data);
            fetchGastoIngresos();
        } catch (error) {
            console.log(error);
        }
    }
    
    const fetchCategorias = async () => {
        try {
            const result = await fetch("http://localhost:3001/categorias", {method: "GET"});
            const data = await result.json();
            console.log(data);
            setCategorias(data.info.data);
        } catch (error) {
            console.log("Ha ocurrido un error :c :", error);
        }
    }

    const fetchGastoCategoria = async () => {
        try {
            const result = await fetch("http://localhost:3001/gastos_categorias", {method: "GET"});
            const data = await result.json();
            console.log("Gasto por categorias: ", data);
            setDivGastos(data.info.data.data)
        } catch (error) {
            console.error("Ha ocurrido un error: "+error);
        } finally {
            setloadingGraphCategoria(false);
        }
    }

    const fetchGastoIngresos = async () => {
        try {
            const result = await fetch("http://localhost:3001/gastos_ingresos", {method: "GET"});
            const data = await result.json();
            console.log("GASTOS/INGRESOS: ", data);
            setgastosIngresos(data.info.data.data)
        } catch (error) {
            console.error("Ha ocurrido un error: "+error);
        } finally {
            setloadingGraphGastoIngreso(false);
        }
    }

    const fetchGastoSemanal = async () => {
        try {
            const result = await fetch("http://localhost:3001/gastos_semanales", {method: "GET"});
            const data = await result.json();
            console.log("GASTOS semanales: ", data);
            if(data.estatus == 0) return;
            setGastoSemanal(data.info.data);
        } catch (error) {
            console.log("Ha ocurrido un error: ", error);
        } finally {
            setloadingGraphGasto(false);
        }
    }

    useEffect(() => {
        fetchCategorias();
        fetchGetGasto();
        fetchGetIngresos();
        fetchGastoCategoria();
        fetchGastoIngresos();
        fetchGastoSemanal();
    }, []);

    return (
        <div>
            <TopBar />
            <SideBar />
            {isOpenCategoria ? <NewCategoria alert={showSwal} closeModal={closeModalCategoria} optionList={categorias} /> : null}
            {isOpenCargo ? <NewCargo showAnimation={mostrarAnimacion} closeModal={closeModalCargo} categoriaList={categorias} alertFunction={showSwal} getGasto={fetchGetGasto}/> : null}
            {isOpenIngreso ? <NewIngreso showAnimation={mostrarAnimacionAbono} closeModal={closeModalIngreso} alert={showSwal} getIngresos={fetchGetIngresos}/> : null}
            {/* Contenedor principal con scroll si el contenido crece */}
            <div style={{
                marginLeft: "14%", // espacio para el sidebar
                marginTop: "120px", // espacio para el topbar
                padding: "20px",
                height: "calc(100vh - 120px)",
                overflowY: "auto",
                backgroundColor: "#f4e9ed",
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
                        {loadingGraphCategoria ? (<GraphLoader type="pie" height="250px" width="300px" />) : (<Graph width={"400px"} height={"500px"} typeGraph="doughnut" info={divGastos} />)}
                        
                        <button className="btn-pilar" style={{
                            fontSize: "14px",
                            borderRadius: "20px"
                        }} onClick={openModalCategoria}>Añadir Categorias</button>
                    </div>

                    <div className="card" style={{
                        padding: "10px",
                        backgroundColor: "#e1d0d6"
                    }}>
                        <h3 style={{ paddingLeft: "20px" }}>Gráfico:</h3>
                        {loadingGraphGastoIngreso ? (<GraphLoader type="pie" height="250px" width="300px" />) : (<Graph width={"400px"} height={"500px"} typeGraph="doughnut" info={gastosIngresos}/>)}
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

                        <label className="switch">
                            <input type="checkbox" onChange={changeIngresos}/>
                            <span className="slider round"></span>
                        </label>

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

                    {showIngresos ? ingresos.length > 0 ? (ingresos.map((e, i) => {
                        return <IngresosRecientes
                            key={e.id}
                            number={e.id}
                            titulo=""
                            cantidad={e.cantidad}
                            alerta={showSwal}
                            getIngresos={fetchGetIngresos} />
                    })) : (
                        <div className="card" style={{
                            padding: "0.5px",
                            paddingLeft: "20px",
                            backgroundColor: "#e1d0d6"
                        }}>
                            <h3>Aun no tienes un ingreso realiza uno ☝🏾 </h3>
                        </div>
                    ) : gasto.length > 0 ? (gasto.map((e, i) => {
                        if (e.categoria_titulo || e.categoria_personalizada_titulo) {
                            return <GastosRecientes
                                key={e.id}
                                number={e.id}
                                titulo={e.categoria_titulo ?? e.categoria_personalizada_titulo}
                                cantidad={e.cantidad}
                                alerta={showSwal}
                                getGastos={fetchGetGasto} />
                        }
                        return null;
                    })) : (
                        <div className="card" style={{
                            padding: "0.5px",
                            paddingLeft: "20px",
                            backgroundColor: "#e1d0d6"
                        }}>
                            <h3>Ingresa tu primer cargo ☝🏾</h3>
                        </div>
                    )}

                    <div className="card" style={{
                        marginTop: "12px",
                        padding: "10px",
                        backgroundColor: "#e1d0d6"
                    }}>
                        <h3 style={{ paddingLeft: "20px" }}>Gráfico:</h3>
                        {loadingGraphGasto ? (<GraphLoader type="bar" height="250px" width="300px" />) : (<Graph width={"400px"} height={"500px"} info={gastoSemanal}/>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBorad;

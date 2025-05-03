import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DashBorad from "./views/dashboard";
import Login from "./views/inicio";
import RegistroUsuario from "./views/registro";


function Index (){
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element= {<DashBorad />}></Route>
                    <Route path="/iniciar-sesion" element= {<Login />}></Route>
                    <Route path="/crear-cuenta" element= {<RegistroUsuario />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}


export default Index;
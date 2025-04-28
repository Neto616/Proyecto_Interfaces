import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
const DashBorad = lazy(() => import("./views/dashboard"));
const Login = lazy(() => import ("./views/inicio"));
const RegistroUsuario = lazy(() => import ("./views/registro"));



function Index (){
    return (
        <div>
            <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}/>
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
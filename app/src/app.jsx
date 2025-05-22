import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const DashBorad = lazy(() => import("./views/dashboard"));
const Login = lazy(() => import ("./views/inicio"));
const RegistroUsuario = lazy(() => import ("./views/registro"));
const ChatBot = lazy(() => import("./views/chatito"));



function Index (){
    const MySwal = withReactContent(Swal);

    return (
        <div>
            <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}/>
                <Routes>
                    <Route path="/" element= {<DashBorad alert={MySwal} />}></Route>
                    <Route path="/iniciar-sesion" element= {<Login alert={MySwal} />}></Route>
                    <Route path="/crear-cuenta" element= {<RegistroUsuario alert={MySwal} />}></Route>
                    <Route path="/chatito" element= {<ChatBot />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}


export default Index;
import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DashBorad from "./views/dashboard";
import SideBar from "./components/sidebar";
import TopBar from "./components/topbar";


function Index (){
    return (
        <div>
            <BrowserRouter>
                <TopBar />
                <SideBar/>
                <Routes>
                    <Route path="/" element= {<DashBorad />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}


export default Index;
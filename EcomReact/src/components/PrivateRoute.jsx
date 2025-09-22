import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({publicPage = false}) =>{
    let user = null;
    if(localStorage.getItem("auth") !== null){
        user = JSON.parse(localStorage.getItem("auth"))
    }

    if (publicPage) {
        return user ? <Navigate to="/profile" /> : <Outlet/>
    }
    return  user ? <Outlet/> : <Navigate to="/login"/>;
}

export default PrivateRoute
import React, { useEffect } from "react";
import {useNavigate, useRoutes} from 'react-router-dom'


import Dashboard from "./dashboard/Dashboard.jsx";
import Profile from "./user/Profile";
import Login from "./auth/Login";
import Signup from "./auth/Signin";
import Create from "./Create";
import Repo from "./Repo";
import Update from "./Update";
// Auth Context
import { useAuth } from "./AuthContext";

const ProjectRoutes = ()=>{
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        if(!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname))
        {
            navigate("/auth");
        }

        if(userIdFromStorage && window.location.pathname=='/auth'){
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let element = useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
            path:"/create",
            element:<Create/>
        },
        {
            path:"/repo/:id",
            element:<Repo/>
        },
        {
            path:"/update/:id",
            element:<Update/>
        }
    ]);

    return element;
}

export default ProjectRoutes;
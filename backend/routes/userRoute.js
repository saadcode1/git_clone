import express, { Router } from 'express';

const userRouter=Router();

import {signup,login,getAllUser,getUserProfile,deleteUserProfile,updateUserProfile} from '../controllers/userController.js';


userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.get("/getAllUser",getAllUser);
userRouter.get("/getUserProfile/:id",getUserProfile);
userRouter.delete("/delete/:id",deleteUserProfile);
userRouter.put("/update/:id",updateUserProfile);


export {userRouter};
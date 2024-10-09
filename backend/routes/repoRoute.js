
import express, { Router } from 'express';
import { createRepo,getAllRepo,fetchRepoById,fetchRepoByName,fetchRepositryCurrentUser,updateRepoById,toggleVisibilityById,deleteRepoById } from '../controllers/repoController.js';
const repoRouter=Router();

repoRouter.post("/repo/create",createRepo);
repoRouter.get("/repo/all",getAllRepo);
repoRouter.get("/repo/:id",fetchRepoById);
repoRouter.get("/repo/name/:name", fetchRepoByName);
repoRouter.get("/repo/user/:userID", fetchRepositryCurrentUser);
repoRouter.post("/repo/update/:id", updateRepoById);
repoRouter.get("/repo/delete/:id",deleteRepoById);
repoRouter.patch("/repo/toggle/:id",toggleVisibilityById);

export default repoRouter;
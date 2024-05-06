import { Router } from "express";
import UsersController from "../controllers/users-controller";

const usersRouter = Router();

usersRouter.get("/auth", UsersController.verifyToken);
usersRouter.post("/auth", UsersController.auth);

export default usersRouter;

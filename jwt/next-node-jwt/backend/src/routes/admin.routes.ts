import Express from "express";
import { adminDashboard } from "../controllers/user.controller";
import { adminOnly } from "../middleware/auth/adminOnly.middleware";

const routes = Express.Router();

routes.get("/dashboard", adminOnly, adminDashboard);

export default routes;

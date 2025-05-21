import Express from "express";
import { userProfile } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth/requireAuth.middleware";

const routes = Express.Router();

routes.get("/profile", requireAuth, userProfile);

export default routes;

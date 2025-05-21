import express from "express";
import {
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user.controller";
import { userValidator } from "../middleware/validator/user.validator.midleware";
import { requireAuth } from "../middleware/auth/requireAuth.middleware";

const router = express.Router();

router.post("/register", userValidator, userRegister);
router.post("/login", userLogin);
router.post("/logout", requireAuth, userLogout);

export default router;

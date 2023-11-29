import { Router } from "express";
import { saveUserLog } from "../controllers/userLog";

const router = Router();

router.post("/userlog", saveUserLog);

export default router;

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import doctorsRouter from "./doctors";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(doctorsRouter);
router.use(aiRouter);

export default router;

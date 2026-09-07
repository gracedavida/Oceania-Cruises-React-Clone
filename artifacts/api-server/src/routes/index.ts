import { Router, type IRouter } from "express";
import careersRouter from "./careers";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use(careersRouter);

export default router;

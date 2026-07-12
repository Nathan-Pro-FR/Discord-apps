import { Router, type IRouter } from "express";
import healthRouter from "./health";
import discordRouter from "./discord";

const router: IRouter = Router();

router.use(healthRouter);
router.use(discordRouter);

export default router;

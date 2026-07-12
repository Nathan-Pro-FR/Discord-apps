import { Router, type IRouter } from "express";
import healthRouter from "./health";
import discordRouter from "./discord";
import reportRouter from "./report";

const router: IRouter = Router();

router.use(healthRouter);
router.use(discordRouter);
router.use(reportRouter);

export default router;

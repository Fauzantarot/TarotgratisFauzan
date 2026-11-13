import { Router } from "express";
import { chartRouter } from "./chart";
import { connectionRouter } from "./connection";
import { transitsRouter } from "./transits";
import { referenceRouter } from "./reference";
import { metaRouter } from "./meta";

export const v1Router = Router();

v1Router.use(chartRouter);
v1Router.use(connectionRouter);
v1Router.use(transitsRouter);
v1Router.use(referenceRouter);
v1Router.use(metaRouter);

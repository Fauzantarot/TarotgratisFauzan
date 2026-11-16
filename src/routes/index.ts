import { Router } from "express";
import { chartRouter } from "./chart";
import { connectionRouter } from "./connection";
import { transitsRouter } from "./transits";
import { referenceRouter } from "./reference";
import { metaRouter } from "./meta";

export const v1Router = Router();

v1Router.use("/chart", chartRouter);
v1Router.use("/connection", connectionRouter);
v1Router.use("/transits", transitsRouter);
v1Router.use("/reference", referenceRouter);
v1Router.use("/meta", metaRouter);

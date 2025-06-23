import express, { Router } from "express";
import { borrowBook, summary } from "../controllers/borrow.controller";

const borrowRouter: Router = express.Router();

borrowRouter.post("/", borrowBook);

borrowRouter.get("/", summary);

export default borrowRouter;

import express, { Application, NextFunction, Request, Response } from "express";
import bookRouter from "./routes/books.route";

const app: Application = express();

// middleware
app.use(express.json()); //for body parser

// routes
app.use("/books", bookRouter);

// root path
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to library management app");
});

// 404 route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Path not found.");
});

export default app;

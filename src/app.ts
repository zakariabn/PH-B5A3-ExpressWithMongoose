import express, { Application, NextFunction, Request, Response } from "express";
import bookRouter from "./routes/books.route";
import borrowRouter from "./routes/borrow.route";

const app: Application = express();

// middleware
app.use(express.json()); //for body parser

// routes
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

// root path
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to library management app");
});

// 404 route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Path not found.");
  next();
});

export default app;

import express, { Application, NextFunction, Request, Response } from "express";
import errorHandler from "./app/middleware/errorHandler";
import cors from "cors";
import { router } from "./app/routes";

const app: Application = express();

//for body parser
app.use(express.json());
app.use(
  cors({
    origin: [
      // Local frontend during development
      "http://localhost:5173",

      // Production frontend
      "https://library-management-client-silk.vercel.app",
    ],
    // credentials: true,
  })
);

// routes
app.use("/api", router);

// root path
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to library management app",
  });
});

// global error handler
app.use(errorHandler);

// 404 route
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(404).json({
      success: false,
      message: `Your request path doesn't exist.`,
      path: req.originalUrl,
    });
  } catch (error) {
    console.log("Something went wrong");
    res.status(500).json({
      success: false,
      message: `Something went wrong`,
      error,
    });
  } finally {
    next();
  }
});

export default app;

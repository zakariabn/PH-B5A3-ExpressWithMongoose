import { Router } from "express";
import bookRouter from "./books.route";
import borrowRouter from "./borrow.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/books",
    route: bookRouter,
  },
  {
    path: "/borrow",
    route: borrowRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

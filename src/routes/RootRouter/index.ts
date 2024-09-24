import { Request, Response } from "express";
import BaseRouter from "../BaseRouter";

class RootRouter extends BaseRouter {
  public routers(): void {
    this.route.get("/", (req: Request, res: Response) => {
      return res.status(200).json({
        status: 200,
        message: "Welcome to simple api by nodejs and typescript",
      });
    });
  }
}

export default new RootRouter().route;

import BaseRouter from "../BaseRouter";
import AuthController from "../../controllers/AuthController";
import { valLogin } from "../../validations/AuthValidation";
import { VerifyToken } from "../../middleware";

class AuthRouter extends BaseRouter {
  public routers(): void {
    this.route.post("/login", valLogin, AuthController.login);
    this.route.get("/me", VerifyToken, AuthController.me);
  }
}

export default new AuthRouter().route;

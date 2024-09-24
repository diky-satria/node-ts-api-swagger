import BaseRouter from "../BaseRouter";
import ProductController from "../../controllers/ProductController";
import { VerifyToken } from "../../middleware";
import {
  valProductCreate,
  valProductUpdate,
} from "../../validations/ProductValidation";

class ProductRouter extends BaseRouter {
  public routers(): void {
    this.route.get("/product", VerifyToken, ProductController.index);
    this.route.post(
      "/product",
      VerifyToken,
      valProductCreate,
      ProductController.create
    );
    this.route.get("/product/:id", VerifyToken, ProductController.show);
    this.route.patch(
      "/product/:id",
      VerifyToken,
      valProductUpdate,
      ProductController.update
    );
    this.route.delete("/product/:id", VerifyToken, ProductController.delete);
  }
}

export default new ProductRouter().route;

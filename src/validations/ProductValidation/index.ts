import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../config/logging";

export const valProductCreate = [
  body("name").notEmpty().withMessage("Name harus di isi"),
  body("qty")
    .notEmpty()
    .withMessage("Qty harus di isi")
    .isNumeric()
    .withMessage("Qty harus angka"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = {
        status: 422,
        message: "validation error",
        errors: {
          param: errors.array()[0].param,
          message: errors.array()[0].msg,
        },
      };

      logger.log({
        level: "info",
        label: "Req product create",
        message: JSON.stringify(response),
      });
      return res.status(422).json(response);
    }
    next();
  },
];

export const valProductUpdate = [
  body("name").notEmpty().withMessage("Name harus di isi"),
  body("qty")
    .notEmpty()
    .withMessage("Qty harus di isi")
    .isNumeric()
    .withMessage("Qty harus angka"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = {
        status: 422,
        message: "validation error",
        errors: {
          param: errors.array()[0].param,
          message: errors.array()[0].msg,
        },
      };

      logger.log({
        level: "info",
        label: "Req product update",
        message: JSON.stringify(response),
      });
      return res.status(422).json(response);
    }
    next();
  },
];

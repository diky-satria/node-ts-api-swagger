import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../config/logging";
// @ts-ignore
import { sequelize } from "../../database/models";
import { QueryTypes } from "sequelize";

export const valLogin = [
  body("username")
    .notEmpty()
    .withMessage("Username harus di isi")
    .custom(async (username) => {
      const cek = await sequelize.query(
        `SELECT * FROM users WHERE username = '${username}'`,
        { type: QueryTypes.SELECT }
      );
      if (cek.length < 1) {
        throw new Error("Username tidak terdaftar");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password harus di isi")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
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
        label: "Req login",
        message: JSON.stringify(response),
      });
      return res.status(422).json(response);
    }
    next();
  },
];

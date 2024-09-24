import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
// @ts-ignore
import { sequelize } from "../database/models";
import { QueryTypes } from "sequelize";

export const VerifyToken = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const getToken = req.headers["authorization"];
  if (!getToken) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
    });
  }
  const token = getToken.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    async (err: any, user: any) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          message: "Invalid token",
        });
      } else {
        // cek user nya
        const getUser = await sequelize.query(
          `SELECT * FROM users WHERE id = '${user.id}'`,
          { type: QueryTypes.SELECT }
        );

        // set user nya
        req.userLogin = getUser[0];

        next();
      }
    }
  );
};

import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../../config/logging";
// @ts-ignore
import { sequelize } from "../../database/models";
// @ts-ignore
import { sequelize2 } from "../../database/models";
const Models = require("../../database/models/index.js");

class AuthController {
  /**
   * @swagger
   * /api/v1/login:
   *   post:
   *     summary: User login
   *     description: Authenticates a user and returns a JWT token.
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 example: api
   *               password:
   *                 type: string
   *                 example: password
   *     responses:
   *       200:
   *         description: Login successful, JWT token returned
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: login berhasil
   *                 token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR...
   *       422:
   *         description: Validation error (username or password is incorrect)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 422
   *                 message:
   *                   type: string
   *                   example: validation error
   *                 errors:
   *                   type: object
   *                   properties:
   *                     param:
   *                       type: string
   *                       example: username
   *                     message:
   *                       type: string
   *                       example: Username tidak terdaftar
   *       400:
   *         description: Invalid payload
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: invalid payload
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: Internal server error
   */
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username, password } = req.body;

      // CEK USER BERDASARKAN USERNAME YANG DI INPUT
      const user = await sequelize.query(
        `SELECT * FROM users WHERE username='${username}'`,
        { type: QueryTypes.SELECT }
      );

      if (user.length > 0) {
        const pass_bcrypt = await bcrypt.compare(password, user[0].password);

        if (pass_bcrypt) {
          const token = jwt.sign(
            { id: user[0].id },
            process.env.JWT_SECRET as string,
            {
              expiresIn: "1hr",
            }
          );

          let response = {
            status: 200,
            message: "login berhasil",
            token: token,
          };

          //   logger.log({
          //     level: "info",
          //     label: "Req login",
          //     message: JSON.stringify(response),
          //   });
          return res.status(200).json(response);
        } else {
          let response = {
            status: 422,
            message: "validation error",
            errors: {
              param: "password",
              message: "Password salah",
            },
          };

          logger.log({
            level: "info",
            label: "Req login",
            message: JSON.stringify(response),
          });
          return res.status(422).json(response);
        }
      } else {
        let response = {
          status: 422,
          message: "validation error",
          errors: {
            param: "username",
            message: "Username tidak terdaftar",
          },
        };

        logger.log({
          level: "info",
          label: "Req login",
          message: JSON.stringify(response),
        });
        return res.status(422).json(response);
      }
    } catch (error: any) {
      logger.log({ level: "error", label: "Req login", message: error });
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/me:
   *   get:
   *     summary: Get logged-in user details
   *     description: Returns the details (id, username) of the currently authenticated user.
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []  # Assuming you're using Bearer JWT authentication
   *     responses:
   *       200:
   *         description: User details successfully retrieved
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: User details
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     username:
   *                       type: string
   *                       example: johndoe
   *       401:
   *         description: Unauthorized, token missing or invalid
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 401
   *                 message:
   *                   type: string
   *                   example: Unauthorized
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: Internal server error
   */
  me = async (req: Request | any, res: Response): Promise<Response> => {
    try {
      const user = await sequelize.query(
        `SELECT id, username FROM users WHERE id = '${req.userLogin.id}'`,
        { type: QueryTypes.SELECT }
      );

      await sequelize2.models.users.update(
        {
          username: "seq2 updated",
        },
        {
          where: {
            id: 5,
          },
        }
      );

      const user2 = await sequelize2.query(`SELECT * FROM users limit 5`, {
        type: QueryTypes.SELECT,
      });

      return res.status(200).json({
        status: 200,
        message: "User details",
        user2: user2,
        data: user[0],
      });
    } catch (error: any) {
      logger.log({
        level: "error",
        label: "Req login",
        message: error,
      });
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  };
}

export default new AuthController();

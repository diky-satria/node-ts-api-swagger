import HAutoNumbering from "../../helpers/HAutoNumbering";
import { Request, Response } from "express";
import IController from "../IController";
// @ts-ignore
import { sequelize } from "../../database/models";
import { QueryTypes } from "sequelize";
import logger from "../../config/logging";
const Models = require("../../database/models/index.js");

class ProductController implements IController {
  /**
   * @swagger
   * /api/v1/product:
   *   get:
   *     summary: Get list of products
   *     description: Retrieve a paginated list of products with optional search functionality.
   *     tags:
   *       - Products
   *     security:
   *       - bearerAuth: []  # Assuming you're using Bearer JWT authentication
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: The page number for pagination (must be greater than 0).
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: The number of products per page (must be greater than 0).
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *           example: ''
   *         description: A search query to filter products by `code`, `name`, or `qty`.
   *     responses:
   *       200:
   *         description: Successful retrieval of product data
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
   *                   example: Data product
   *                 data:
   *                   type: object
   *                   properties:
   *                     rows:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: integer
   *                             example: 1
   *                           code:
   *                             type: string
   *                             example: PRD001
   *                           name:
   *                             type: string
   *                             example: Product Name
   *                           qty:
   *                             type: integer
   *                             example: 100
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 10
   *                     total_rows:
   *                       type: integer
   *                       example: 50
   *                     total_page:
   *                       type: integer
   *                       example: 5
   *       400:
   *         description: Bad request, invalid parameters (e.g., page or limit < 1)
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
   *                   example: page must be greater than 0
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
   *                   example: Server error
   */
  index = async (req: Request, res: Response): Promise<Response> => {
    try {
      let page: number = Number(req.query.page) || 0;
      if (page < 1)
        return res
          .status(400)
          .json({ status: 400, message: "page must be greater than 0" });

      let limit: number = Number(req.query.limit) || 0;
      if (limit < 1)
        return res
          .status(400)
          .json({ status: 400, message: "limit must be greater than 0" });

      let search: any = req.query.search || "";
      let search_db: string = search
        ? `WHERE code LIKE '%${search}%' OR name LIKE '%${search}%' OR qty LIKE '%${search}%'`
        : "";
      let offset: number = (page - 1) * limit;

      let total = await sequelize.query(
        `SELECT count(*) as total FROM products ${search_db}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      let total_page: number = Math.ceil(total[0].total / limit);

      let data = await sequelize.query(
        `SELECT id, code, name, qty FROM products ${search_db}
         order by id desc limit ${offset},${limit}`,
        { type: QueryTypes.SELECT }
      );

      return res.status(200).json({
        status: 200,
        messsage: "Data product",
        data: {
          rows: data,
          page: page,
          limit: limit,
          total_rows: total[0].total,
          total_page: total_page,
        },
      });
    } catch (error: any) {
      logger.log({ level: "error", label: "Req Product all", message: error });
      return res.status(500).json({
        status: 500,
        messsage: "Server error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/product:
   *   post:
   *     summary: Create a new product
   *     description: Adds a new product with auto-generated code.
   *     tags:
   *       - Products
   *     security:
   *       - bearerAuth: []  # Assuming you're using Bearer JWT authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - qty
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Product Name"
   *                 description: "Name of the product"
   *               qty:
   *                 type: number
   *                 example: 100
   *                 description: "Quantity of the product"
   *     responses:
   *       200:
   *         description: Product successfully created
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
   *                   example: "Product berhasil ditambahkan"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     code:
   *                       type: string
   *                       example: "NODETS2409240354006"
   *                     name:
   *                       type: string
   *                       example: "baju"
   *                     qty:
   *                       type: number
   *                       example: 100
   *                     createdAt:
   *                       type: datetime
   *                       example: "2024-09-23T20:54:06.767Z"
   *                     updatedAt:
   *                       type: datetime
   *                       example: "2024-09-23T20:54:06.767Z"
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
   *       422:
   *         description: Validation error product
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
   *                       example: name
   *                     message:
   *                       type: string
   *                       example: name harus di isi
   *       400:
   *         description: Error request
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
   *                   example: Maksimal 20 data per hari
   *       500:
   *         description: Server error
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
   *                   example: "Server error"
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, qty } = req.body;

      // CEK 1 HARI TIDAK BOLEH LEBIH DARI 20 DATA YANG MASUK
      let isHAutoNumbering = new HAutoNumbering();
      const isToday = await sequelize.query(
        `SELECT * FROM counter_numbers WHERE code = '${isHAutoNumbering.prefix}' AND day = ${isHAutoNumbering.day} AND month = ${isHAutoNumbering.month} AND year = ${isHAutoNumbering.yearFull} AND sub_year = ${isHAutoNumbering.year}`,
        { type: QueryTypes.SELECT }
      );
      if (isToday.length > 0 && isToday[0].number >= 20) {
        return res.status(400).json({
          status: 400,
          message: "Maksimal 20 data per hari",
        });
      }

      let autoNumber = await isHAutoNumbering.autoNumbering();
      let data = await Models.products.create({
        code: autoNumber,
        name: name,
        qty: qty,
      });
      return res.status(200).json({
        status: 200,
        message: "Product berhasil ditambahkan",
        data: data,
      });
    } catch (error: any) {
      logger.log({
        level: "error",
        label: "Req Product create",
        message: error,
      });
      return res.status(500).json({
        status: 500,
        messsage: "Server error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/product/{id}:
   *   get:
   *     summary: Get details of a specific product
   *     description: Retrieves the details of a product using the product's unique ID.
   *     tags:
   *       - Products
   *     security:
   *       - bearerAuth: []  # Assuming you're using Bearer JWT authentication
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Unique ID of the product
   *     responses:
   *       200:
   *         description: Product details retrieved successfully
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
   *                   example: Product details
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     code:
   *                       type: string
   *                       example: NODETS2409240340002
   *                     name:
   *                       type: string
   *                       example: Product A
   *                     qty:
   *                       type: integer
   *                       example: 100
   *       400:
   *         description: Product not found
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
   *                   example: Product tidak ditemukan
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
  show = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const product = await sequelize.query(
        `SELECT id, code, name, qty FROM products WHERE id = '${id}'`,
        { type: QueryTypes.SELECT }
      );
      if (product.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "Product tidak ditemukan",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Product details",
        data: product[0],
      });
    } catch (error: any) {
      logger.log({
        level: "error",
        label: "Req product detail",
        message: error,
      });
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/product/{id}:
   *   patch:
   *     summary: Update a specific product
   *     description: Updates a product using the product's unique ID.
   *     tags:
   *       - Products
   *     security:
   *       - bearerAuth: []  # Assuming you're using Bearer JWT authentication
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Unique ID of the product to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - qty
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Product Name"
   *                 description: "Name of the product"
   *               qty:
   *                 type: number
   *                 example: 100
   *                 description: "Quantity of the product"
   *     responses:
   *       200:
   *         description: Product successfully updated
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
   *                   example: Product berhasil diupdate
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     code:
   *                       type: string
   *                       example: NODETS2409240447008
   *                     name:
   *                       type: string
   *                       example: Updated Product Name
   *                     qty:
   *                       type: integer
   *                       example: 150
   *       400:
   *         description: Product not found
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
   *                   example: Product tidak ditemukan
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
   *       422:
   *         description: Validation error product
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
   *                       example: name
   *                     message:
   *                       type: string
   *                       example: name harus di isi
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
  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, qty } = req.body;
      const { id } = req.params;
      const product = await sequelize.query(
        `SELECT id, code, name, qty FROM products WHERE id = '${id}'`,
        { type: QueryTypes.SELECT }
      );
      if (product.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "Product tidak ditemukan",
        });
      }

      await Models.products.update(
        {
          name: name,
          qty: qty,
        },
        {
          where: {
            id: id,
          },
        }
      );

      const productUpdate = await sequelize.query(
        `SELECT * FROM products WHERE id = '${id}'`,
        { type: QueryTypes.SELECT }
      );

      return res.status(200).json({
        status: 200,
        message: "Product berhasil diupdate",
        data: productUpdate[0],
      });
    } catch (error: any) {
      logger.log({
        level: "error",
        label: "Req product update",
        message: error,
      });
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/product/{id}:
   *   delete:
   *     summary: Delete a specific product
   *     description: Deletes a product using the product's unique ID.
   *     tags:
   *       - Products
   *     security:
   *       - bearerAuth: []  # Assuming you're using Bearer JWT authentication
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Unique ID of the product to delete
   *     responses:
   *       200:
   *         description: Product successfully deleted
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
   *                   example: Product berhasil dihapus
   *       400:
   *         description: Product not found
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
   *                   example: Product tidak ditemukan
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
  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const product = await sequelize.query(
        `SELECT id, code, name, qty FROM products WHERE id = '${id}'`,
        { type: QueryTypes.SELECT }
      );
      if (product.length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "Product tidak ditemukan",
        });
      }

      await Models.products.destroy({
        where: {
          id: id,
        },
      });
      return res.status(200).json({
        status: 200,
        message: "Product berhasil dihapus",
      });
    } catch (error: any) {
      logger.log({
        level: "error",
        label: "Req product delete",
        message: error,
      });
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  };
}

export default new ProductController();

import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

// SWAGGER
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// ROUTE IMPORT
import RootRouter from "./routes/RootRouter";
import AuthRouter from "./routes/AuthRouter";
import ProductRouter from "./routes/ProductRouter";

const app: Application = express();
const port = process.env.PORT;

// BODY PARSER
app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }));

// CORS
app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// HANDLE PAYLOAD BODY INCORRECT
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      status: 400,
      message: "Invalid payload",
    });
  }
  next();
});

// SWAGGER
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API BY NODE-EXPRESS AND TYPESCRIPT",
      version: "1.0.0",
    },
    servers: [
      {
        url: process.env.SERVER_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/**/*.ts", "./controllers/*/*.js"],
};
const swaggerDocument = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ROUTES
app.use("/", RootRouter);
app.use("/api/v1", AuthRouter);
app.use("/api/v1", ProductRouter);

// LISTENER
app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

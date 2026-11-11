import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { booksRouter } from "./routes/books.js";
import { logger } from "./middlewares/logger.js";
import { HttpError, errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (_req, res) => res.status(200).json({
  message: "Welcome to MiniBooks API!",
  version: "1.0.0"
}));

app.use("/api/v1/books", booksRouter);

// 404ルートはエラーハンドラより前、エラーハンドラは必ず最後
app.use((_req, _res, next) => next(new HttpError(404, "NOT_FOUND", "route not found")));
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`[${config.NODE_ENV}] MiniBooks API listening on http://localhost:${config.PORT}`);
});

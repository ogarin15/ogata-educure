import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { pool } from "./db/pool.js";
import { booksRouter } from "./routes/books.js";
import { logger } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api/v1/books", booksRouter);
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Welcome to MiniBooks API!", version: "1.0.0" });
});
app.use((_req, res) => {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "route not found" } });
});
app.use(errorHandler);

async function main(): Promise<void> {
  // 1. Confirm that PostgreSQL is reachable before opening the HTTP port.
  await pool.query("SELECT 1");

  // 2. Start the HTTP server and keep its handle for graceful shutdown.
  const server = app.listen(config.PORT, () => {
    console.log(`[${config.NODE_ENV}] MiniBooks API listening on http://localhost:${config.PORT}`);
  });

  // 3. Stop accepting requests, then close all PostgreSQL pool connections.
  let shuttingDown = false;
  const shutdown = (): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log("[shutdown] closing server and pool");

    server.close(async (serverError) => {
      try {
        await pool.end();
        if (serverError) {
          console.error("[shutdown] server close failed:", serverError);
          process.exitCode = 1;
          return;
        }
        console.log("[shutdown] done");
        process.exitCode = 0;
      } catch (poolError) {
        console.error("[shutdown] pool close failed:", poolError);
        process.exitCode = 1;
      }
    });
  };

  // 4. Support both Ctrl+C and container termination.
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch(async (err: unknown) => {
  console.error("failed to start:", err);
  // Also release any connections if startup failed part-way through.
  try {
    await pool.end();
  } catch (closeError) {
    console.error("failed to close database pool:", closeError);
  }
  process.exitCode = 1;
});

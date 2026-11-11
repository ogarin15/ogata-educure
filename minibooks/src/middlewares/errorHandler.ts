import type { ErrorRequestHandler } from "express";

export class HttpError extends Error {
  constructor(public statusCode: number, public code: string, message: string, public details?: unknown) {
    super(message);
    this.name = "HttpError";
  }
}
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: {
      code: err.code, message: err.message,
      ...(err.details === undefined ? {} : { details: err.details })
    }});
    return;
  }
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "internal server error" } });
};

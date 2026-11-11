import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { HttpError } from "./errorHandler.js";

export function validate(schema: ZodTypeAny): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse({ body: req.body ?? {}, params: req.params, query: req.query });
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        (fieldErrors[key] ??= []).push(issue.message);
      }
      next(new HttpError(422, "VALIDATION_ERROR", "invalid request", { fieldErrors, formErrors: [] }));
      return;
    }
    res.locals.validated = parsed.data;
    next();
  };
}

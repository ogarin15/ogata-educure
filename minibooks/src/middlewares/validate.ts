import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

type RequestParts = { body: unknown; params: unknown; query: unknown };
export function validate(schema: ZodTypeAny): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse({ body: req.body ?? {}, params: req.params ?? {}, query: req.query ?? {} });
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".") || "request";
        fieldErrors[path] ??= [];
        fieldErrors[path].push(issue.message);
      }
      res.status(422).json({ error: { code: "VALIDATION_ERROR", message: "invalid request", details: { fieldErrors } } });
      return;
    }
    const data = parsed.data as RequestParts;
    req.body = data.body;
    req.params = data.params as typeof req.params;
    Object.defineProperty(req, "query", { value: data.query, writable: true, configurable: true });
    next();
  };
}

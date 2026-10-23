import type { Request, Response } from "express";
import { bookService } from "../services/bookService.js";
import type { CreateBookInput } from "../services/bookService.js";
import type { CreateBookBody } from "../schemas/bookSchema.js";
import { HttpError } from "../middlewares/errorHandler.js";

type ListQuery = { author?: string; limit?: number };
export const bookController = {
  list(req: Request, res: Response): void {
    const query = req.query as unknown as ListQuery;
    res.status(200).json(bookService.list(query.author, query.limit));
  },
  show(req: Request, res: Response): void {
    const book = bookService.findById(req.params.id);
    if (!book) throw new HttpError(404, "NOT_FOUND", "book not found");
    res.status(200).json(book);
  },
  create(req: Request<Record<string, never>, unknown, CreateBookBody>, res: Response): void {
    const input: CreateBookInput = { title: req.body.title, author: req.body.author, publishedYear: req.body.publishedYear };
    res.status(201).json(bookService.create(input));
  },
  remove(req: Request, res: Response): void {
    if (!bookService.remove(req.params.id)) throw new HttpError(404, "NOT_FOUND", "book not found");
    res.status(204).end();
  },
  replace(req: Request, res: Response): void {
    const replaced = bookService.replace(req.params.id, req.body as CreateBookInput);
    if (!replaced) throw new HttpError(404, "NOT_FOUND", "book not found");
    res.status(200).json(replaced);
  },
  update(req: Request, res: Response): void {
    const updated = bookService.update(req.params.id, req.body as Partial<CreateBookInput>);
    if (!updated) throw new HttpError(404, "NOT_FOUND", "book not found");
    res.status(200).json(updated);
  },
};

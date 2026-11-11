import type { Request, Response } from "express";
import { bookService } from "../services/bookService.js";
import type { CreateBookBody, ListBooksQuery, ReplaceBookBody, UpdateBookBody } from "../schemas/bookSchema.js";
import { HttpError } from "../middlewares/errorHandler.js";

type IdParams = { id: string };
export const bookController = {
  list(_req: Request, res: Response): void {
    const query = res.locals.validated.query as ListBooksQuery;
    res.status(200).json(bookService.list(query.author, query.limit));
  },
  show(_req: Request<IdParams>, res: Response): void {
    const { id } = res.locals.validated.params as IdParams;
    const book = bookService.findById(id);
    if (!book) throw new HttpError(404, "NOT_FOUND", "book not found");
    res.status(200).json(book);
  },
  create(_req: Request, res: Response): void {
    const input = res.locals.validated.body as CreateBookBody;
    res.status(201).json(bookService.create(input));
  },
  replace(_req: Request<IdParams>, res: Response): void {
    const { id } = res.locals.validated.params as IdParams;
    const input = res.locals.validated.body as ReplaceBookBody;
    const book = bookService.replace(id, input);
    if (!book) throw new HttpError(404, "NOT_FOUND", "book not found");
    res.status(200).json(book);
  },
  update(_req: Request<IdParams>, res: Response): void {
    const { id } = res.locals.validated.params as IdParams;
    const partial = res.locals.validated.body as UpdateBookBody;
    const book = bookService.update(id, partial);
    if (!book) throw new HttpError(404, "NOT_FOUND", "book not found");
    res.status(200).json(book);
  },
  remove(_req: Request<IdParams>, res: Response): void {
    const { id } = res.locals.validated.params as IdParams;
    if (!bookService.remove(id)) throw new HttpError(404, "NOT_FOUND", "book not found");
    res.status(204).end();
  }
};

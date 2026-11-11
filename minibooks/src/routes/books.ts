import { Router } from "express";
import { bookController } from "../controllers/bookController.js";
import { validate } from "../middlewares/validate.js";
import { wrap } from "../middlewares/wrap.js";
import { BookIdSchema, CreateBookSchema, ListBooksSchema, ReplaceBookSchema, UpdateBookSchema } from "../schemas/bookSchema.js";

export const booksRouter = Router();

// async例外の伝播を確認するためのテスト専用ルート
booksRouter.get("/_throw", wrap(async () => { throw new Error("intentional test error"); }));

booksRouter.get("/", validate(ListBooksSchema), bookController.list);
booksRouter.get("/:id/reviews", validate(BookIdSchema), (_req, res) => res.status(200).json([]));
booksRouter.get("/:id", validate(BookIdSchema), bookController.show);
booksRouter.post("/", validate(CreateBookSchema), bookController.create);
booksRouter.put("/:id", validate(ReplaceBookSchema.extend({ params: BookIdSchema.shape.params })), bookController.replace);
booksRouter.patch("/:id", validate(UpdateBookSchema), bookController.update);
booksRouter.delete("/:id", validate(BookIdSchema), bookController.remove);

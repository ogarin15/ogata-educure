import { Router } from "express";
import { bookController } from "../controllers/bookController.js";
import { validate } from "../middlewares/validate.js";
import { wrap } from "../middlewares/wrap.js";
import { BookIdSchema, CreateBookSchema, ListBooksSchema, ReplaceBookSchema, UpdateBookSchema } from "../schemas/bookSchema.js";

export const booksRouter = Router();
// _throwは /:id より前に登録する（エラー集約の動作確認用）
booksRouter.get("/_throw", wrap(async () => { throw new Error("boom!"); }));
booksRouter.get("/:id/reviews", validate(BookIdSchema), (_req, res) => res.status(200).json([]));
booksRouter.get("/", validate(ListBooksSchema), bookController.list);
booksRouter.post("/", validate(CreateBookSchema), bookController.create);
booksRouter.put("/:id", validate(ReplaceBookSchema), bookController.replace);
booksRouter.patch("/:id", validate(UpdateBookSchema), bookController.update);
booksRouter.delete("/:id", validate(BookIdSchema), bookController.remove);
booksRouter.get("/:id", validate(BookIdSchema), bookController.show);

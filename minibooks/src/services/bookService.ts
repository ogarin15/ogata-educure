import { randomUUID } from "node:crypto";

export type Book = { id: string; title: string; author: string; publishedYear: number };
export type CreateBookInput = Omit<Book, "id">;

const books = new Map<string, Book>([
  ["1", { id: "1", title: "Le Petit Prince", author: "Saint-Exupery", publishedYear: 1943 }],
  ["2", { id: "2", title: "1984", author: "Orwell", publishedYear: 1949 }],
  ["3", { id: "3", title: "Norwegian Wood", author: "Murakami", publishedYear: 1987 }],
]);

export const bookService = {
  list(author?: string, limit?: number): Book[] {
    let result = Array.from(books.values());
    if (author) result = result.filter((book) => book.author === author);
    if (limit !== undefined) result = result.slice(0, limit);
    return result;
  },
  findById(id: string): Book | null { return books.get(id) ?? null; },
  create(input: CreateBookInput): Book {
    const book: Book = { id: randomUUID(), ...input };
    books.set(book.id, book);
    return book;
  },
  remove(id: string): boolean { return books.delete(id); },
  replace(id: string, input: CreateBookInput): Book | null {
    if (!books.has(id)) return null;
    const book: Book = { id, ...input };
    books.set(id, book);
    return book;
  },
  update(id: string, partial: Partial<CreateBookInput>): Book | null {
    const existing = books.get(id);
    if (!existing) return null;
    const updated: Book = { ...existing, ...partial, id };
    books.set(id, updated);
    return updated;
  },
};

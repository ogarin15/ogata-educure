import { randomUUID } from "node:crypto";

export type Book = { id: string; title: string; author: string; publishedYear: number };
export type CreateBookInput = Omit<Book, "id">;

const books: Book[] = [
  { id: "1", title: "Le Petit Prince", author: "Saint-Exupery", publishedYear: 1943 },
  { id: "2", title: "1984", author: "Orwell", publishedYear: 1949 },
  { id: "3", title: "Norwegian Wood", author: "Murakami", publishedYear: 1987 }
];

export const bookService = {
  list(author?: string, limit?: number): Book[] {
    let result = [...books];
    if (author) result = result.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
    if (limit !== undefined) result = result.slice(0, limit);
    return result;
  },
  findById(id: string): Book | null {
    return books.find(b => b.id === id) ?? null;
  },
  create(input: CreateBookInput): Book {
    const book: Book = { id: randomUUID(), ...input };
    books.push(book);
    return book;
  },
  remove(id: string): boolean {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
  },
  replace(id: string, input: CreateBookInput): Book | null {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return null;
    const updated: Book = { id, ...input };
    books[index] = updated;
    return updated;
  },
  update(id: string, partial: Partial<CreateBookInput>): Book | null {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return null;
    const updated: Book = { ...books[index]!, ...partial, id };
    books[index] = updated;
    return updated;
  }
};

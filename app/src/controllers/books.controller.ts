import { environmentDev } from '../../environments/environment.dev';
import { DbConnection } from '../utils/dc-connection';

export class BooksController extends DbConnection {

    public async getAllBooks() {
        const query = `
            SELECT books.*, authors.name AS author_name
            FROM books
            JOIN authors ON books.author_id = authors.id
            ORDER BY books.created_at DESC;
        `;
        return this.executeQuery(environmentDev.dbUrl, query);
    }

    public async createBook(title: string, authorId: number) {
        const query = `
            INSERT INTO books (title, author_id, created_at)
            VALUES ($1, $2, NOW())
            RETURNING *;
        `;
        return this.executeQuery(environmentDev.dbUrl, query, [title, authorId]);
    }

    public async updateBook(id: number, title: string, authorId: number) {
        const query = `
            UPDATE books
            SET title = $1, author_id = $2
            WHERE id = $3
            RETURNING *;
        `;
        return this.executeQuery(environmentDev.dbUrl, query, [title, authorId, id]);
    }

    public async deleteBook(id: number) {
        const query = `DELETE FROM books WHERE id = $1 RETURNING *;`;
        return this.executeQuery(environmentDev.dbUrl, query, [id]);
    }
}

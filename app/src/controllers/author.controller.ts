import { environmentDev } from '../../environments/environment.dev';
import { DbConnection } from '../utils/dc-connection';

export class AuthorController extends DbConnection {

    public async getAllAuthors() {
        const query = `SELECT * FROM authors ORDER BY created_at DESC`;
        return this.executeQuery(environmentDev.dbUrl, query);
    }

    public async createAuthor(name: string) {
        const query = `
            INSERT INTO authors (name, created_at)
            VALUES ($1, NOW())
            RETURNING *;
        `;
        return this.executeQuery(environmentDev.dbUrl, query, [name]);
    }

    public async updateAuthor(id: number, name: string) {
        const query = `
            UPDATE authors
            SET name = $1
            WHERE id = $2
            RETURNING *;
        `;
        return this.executeQuery(environmentDev.dbUrl, query, [name, id]);
    }

    public async deleteAuthor(id: number) {
        const query = `DELETE FROM authors WHERE id = $1 RETURNING *;`;
        return this.executeQuery(environmentDev.dbUrl, query, [id]);
    }
}

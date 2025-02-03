
import {Pool} from 'pg';
import colors from 'colors';


const poolCache = new Map<string,Pool>();
export class DbConnection {
    public async initConnection(dbUrl:string,dbName:string) {
        const pool = this.getPool(dbUrl);
       
        try {
            const client = await pool.connect();
            console.log(colors.magenta('DB Connected Successfully'));
    
        } catch (error) {
            console.error('Error connecting to the database:', error);
        }
       
    }

    public getPool(dbUrl: string): Pool {
        if (!poolCache.has(dbUrl)) {
            const pool = new Pool({
                connectionString: dbUrl,
            });
    
            pool.on('connect', () => {
                console.log(colors.magenta(`New client connected to the pool for database: ${dbUrl}`));
            });
    
            pool.on('error', (err) => {
                console.error(`Pool error for database ${dbUrl}:`, err);
            });
    
            poolCache.set(dbUrl, pool);
        }
    
        return poolCache.get(dbUrl)!;
    }

    public async executeQuery(dbUrl: string, query: string, params?: any[]) {
        const pool = this.getPool(dbUrl);
        try {
            const client = await pool.connect();
            const result = await client.query(query, params);
            client.release();
            return result.rows; // Return the rows of the query
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }
}
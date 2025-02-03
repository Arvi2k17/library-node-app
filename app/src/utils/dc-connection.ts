
import {Pool} from 'pg';


const PG_CONSTANTS = {
	db: {},
};


const poolCache = new Map<string,Pool>();
export class DbConnection {
    public async initConnection(dbUrl:string,dbName:string,query?:string) {

        const pool = new Pool({
            connectionString : dbUrl
        })

        console.log(pool);

        try {
            const client = await pool.connect()

            console.log('DB Connected Successfully');
    
            // const dbQuery = query || 'SELECT * FROM authors';
            // const res = await client.query(dbQuery);
            // console.log(res);
        } catch (error) {
            console.error('Error connecting to the database:', error);
        }
       
    }

    public getDBConnection(dbName:string){
        return PG_CONSTANTS.db[dbName];
    }
}
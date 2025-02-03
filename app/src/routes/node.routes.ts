import { Application, Request, Response } from "express";
import { DbConnection } from "../utils/dc-connection";
import { environmentDev } from '../../environments/environment.dev';



export class NodeRoutes {
    public async routes(app:Application){
        
        app.get('/', (req:Request,res:Response) => {
            res.status(200).json({
                message: `Welcome to Library Node App!`,
            })
        })

        app.get('/register', (req:Request,res:Response) => {
            res.status(200).json({
                message: `Welcome to Library Node App Registration!`,
            })
        })

        this.validateRequest(app);

        const dbConnection:DbConnection = new DbConnection();
        await dbConnection.initConnection(environmentDev.dbString,'DEV_DB');
    }

    private validateRequest(app: Application) {
		// app.use((req: Request, res: Response, next) => {
		// 	try {
		// 		const urlInfo = startupMain.processRequest(serverConfig, req.path);

		// 		if (urlInfo && urlInfo.isNoAction) {
		// 			if (urlInfo.isNext) {
		// 				next();
		// 			}
		// 			return;
		// 		}

		// 		startupMain.security(req, res, next, serverConfig);
		// 	} catch (error) {
		// 		startupMain.throwError(res, error.message);
		// 	}
		// });
	}


}
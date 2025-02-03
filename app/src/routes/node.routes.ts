import { Application, NextFunction, Request, Response } from "express";
import { DbConnection } from "../utils/dc-connection";
import { environmentDev } from '../../environments/environment.dev';
import { UserController } from "../controllers/user.controller";
import jwt from "jsonwebtoken";
import { BookRoutes } from "./books.routes";


export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number,
        role: string
    }
}


export class NodeRoutes {
    public async routes(app: Application) {

        app.get('/', (req: Request, res: Response) => {
            res.status(200).json({
                message: `Welcome to Library Node App!`,
            })
        })

        const userController: UserController = new UserController()

        app.post('/register', (req: Request, res: Response) => userController.registerUser(req, res));

        app.post('/login', (req: Request, res: Response) => userController.loginUser(req, res));

        app.use((req: AuthenticatedRequest, res: Response, next) => {
            this.authenticateToken(req, res, next);
        })

        app.get('/check', (req:Request,res:Response)=>{
            res.status(200).json({
                message: `Welcome to Library Node App after authentication!`,
            })
        })

        const bookRoutes:BookRoutes = new BookRoutes();
        bookRoutes.init(app);

        const dbConnection: DbConnection = new DbConnection();
        await dbConnection.initConnection(environmentDev.dbUrl, 'DEV_DB');
    }

    private async authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token not provided' });
        }

        try {
            const secret = 'Hello-World-21'; //Harcoding Here TO-DO : can be fetched from ENV
            const decodedToken: any = jwt.verify(token, secret);

            const userController: UserController = new UserController();
            const user = await userController.getUser(decodedToken.userId);

            if (user) {
                req.user = {
                    userId: decodedToken.userId,
                    role: decodedToken.role,
                };
                next();
            } else res.send("Invalid User");
        } catch (error) {
            console.error('Error validating token:', error);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
    };



}
import { environmentDev } from "../../environments/environment.dev";
import { DbConnection } from "../utils/dc-connection";
import { compare, hash } from 'bcrypt';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

export class UserController extends DbConnection {

    public registerUser(req: Request, res: Response) {
        const userDetail = req.body;
        this._registerUser(userDetail).then((data) => {
            res.status(200).json(data);
        })
    }

    public loginUser(req: Request, res: Response) {
        const userDetail = req.body;
        this._loginUser(userDetail).then((data) => {
            res.status(200).json(data);
        })
    }

    public async getUser(userId:number){
        try {
            if(userId){
                const query = `SELECT * FROM users WHERE id = $1`;

                const params = [userId];
                const result = await this.executeQuery(environmentDev.dbUrl, query, params);

                if (result.length === 0) {
                    throw new Error('User Not Registered in App');
                }

                 const user = result[0];

                 const { password: _, ...userWithoutPassword } = user;
                 return userWithoutPassword;

            }else{
                throw new Error('Invalid User!');
            }
        } catch (error) {
            console.error('Error retrieving user:',error)
            return null;
        }
        
    }
    private async _registerUser(user: any) {
        try {
            const hashedPassword = await hash(user.password, 10);

            const query = `
                INSERT INTO users (username, email, password, created_at)
                VALUES ($1, $2, $3, NOW())
                RETURNING *;
            `;
            const params = [user.username, user.email, hashedPassword];

            const result = await this.executeQuery(environmentDev.dbUrl, query, params);

            const { password: _, ...userWithoutPassword } = result[0];
            return userWithoutPassword;

        } catch (error: any) {
            console.error('Error registering user:', error);
            return error;
        }
    }

    public async _loginUser(userDetail: any) {
        try {
            const query = `SELECT * FROM users WHERE email = $1`;
            const params = [userDetail.email];
            const result = await this.executeQuery(environmentDev.dbUrl, query, params);

            if (result.length === 0) {
                throw new Error('Invalid email or password');
            }

            const user = result[0];

            const isPasswordValid = await compare(userDetail.password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    userName:user.username,
                    emailId:user.email,
                    role: user.role,
                },
                'Hello-World-21',
                { expiresIn: '1h' }
            );

            const { password: _, ...userWithoutPassword } = user;
            return { token, user: userWithoutPassword };

        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }



}
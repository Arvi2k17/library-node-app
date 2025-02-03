import bodyParser from 'body-parser';
import express, { Request, Response, Application } from 'express';
import { createServer, Server } from 'http';
import colors from 'colors';
import { NodeRoutes } from './routes/node.routes';

const port = 3000;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello from TypeScript server!');
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

export class ServerApp {

  private app: Application;
  private server: Server;

  constructor() {
    this.initServer();
  }

  public getApp():Application{
    return this.app;
  }

  private initServer(){
    this.createExpressServer();
    this.addRoutes();
  }

  private createExpressServer() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.server = createServer(this.app);
  }

  private addRoutes(){
    const nodeRoutes:NodeRoutes = new NodeRoutes();
    const app = this.getApp();
    nodeRoutes.routes(app).then((errors:any) => {
      if(errors){
        console.log(colors.red(errors));
      }
      this.listen(3500);
    })
  }


  private listen(port:number): void {
		this.server.listen(port, () => {
			console.log(colors.green(`Running server on port ${port}`));
		});
	}


}
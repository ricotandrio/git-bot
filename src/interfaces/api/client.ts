import express, { Request, Response } from 'express';


export async function startServer(
  port: number
) {
  const app = express();

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

}
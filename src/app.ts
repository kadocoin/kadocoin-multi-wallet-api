/*
 * # Kadocoin License
 *
 * Copyright (c) 2021 Adamu Muhammad Dankore
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or <http://www.opensource.org/licenses/mit-license.php>
 */
import express, { Application, Request, Response, Router } from 'express';

class App {
  public app: Application;
  public router: Router;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.bootstrap();
  }

  bootstrap() {
    this.app.get('/', (_: Request, res: Response) => {
      res.send('Welcome to Kadocoin API. Visit https://kadocoin.org');
    });
  }
}

export default new App().app;

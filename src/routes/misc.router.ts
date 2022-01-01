/*
 * # Kadocoin License
 *
 * Copyright (c) 2021 Adamu Muhammad Dankore
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or <http://www.opensource.org/licenses/mit-license.php>
 */
import { Application } from 'express';
import Blockchain from '../blockchain';
import MiscController from '../controllers/misc.controller';
import { blockchainMiddleWare, leveldbMiddleWare } from '../middleware/cryptoMiddleWare';
import LevelDB from '../db';

export default class MiscRouter {
  private app: Application;
  private MiscController: MiscController;
  private blockchain: Blockchain;
  private leveldb: LevelDB;

  constructor(app: Application, blockchain: Blockchain, leveldb: LevelDB) {
    this.app = app;
    this.blockchain = blockchain;
    this.leveldb = leveldb;
    this.MiscController = new MiscController();
    this.initRoute();
  }

  initRoute(): void {
    this.app.get(
      '/address/:address',
      blockchainMiddleWare(this.blockchain),
      this.MiscController.addressInfo
    );

    this.app.post('/balance', leveldbMiddleWare(this.leveldb), this.MiscController.balance);
  }
}
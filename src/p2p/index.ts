/*
 * # Kadocoin License
 *
 * Copyright (c) 2021 Adamu Muhammad Dankore
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or <http://www.opensource.org/licenses/mit-license.php>
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from 'request';
import fs from 'fs';
import { IHost, incomingObj } from '../types';
import Transaction from '../wallet/transaction';
import Blockchain from '../blockchain';
import TransactionPool from '../wallet/transaction-pool';
import { hardCodedPeers, P2P_PORT, peersStorageFile, REQUEST_TIMEOUT } from '../settings';
import Block from '../blockchain/block';
import appendToFile from '../util/appendToFile';
import isEmptyObject from '../util/is-empty-object';
import getFileContentLineByLine from '../util/get-file-content-line-by-line';
import logger from '../util/logger';
import { KADOCOIN_VERSION } from '../settings';
import LevelDB from '../db';

class P2P {
  private peer: any; // PEER LIBRARY IS NOT TYPED THAT IS WHY IT IS `any`
  private transactionPool: TransactionPool;
  private ip_address: string;
  private leveldb: LevelDB;
  private blockchain: Blockchain;
  private remoteBestHeights: Record<string, IHost>;

  constructor({
    blockchain,
    transactionPool,
    peer,
    ip_address,
    leveldb,
  }: {
    blockchain: Blockchain;
    transactionPool: TransactionPool;
    peer: any;
    ip_address: string;
    leveldb: LevelDB;
  }) {
    this.peer = peer;
    this.transactionPool = transactionPool;
    this.blockchain = blockchain;
    this.leveldb = leveldb;
    this.remoteBestHeights = {};
    this.ip_address = ip_address;
    this.receiveTransactions();
    this.receiveBlock();
    this.onSyncReceiveRequestingPeerInfo();
    this.onSyncReceiveBlockHeight();
    this.respondToGetBlock();
  }
  /************************************
   *          TRANSACTIONS            *
   ************************************/

  private receiveTransactions(): void {
    this.peer.handle.receiveTransactions = async (payload: any, done: any) => {
      if (payload.data.message) {
        logger.info('INCOMING TRANSACTION', payload.data.message);

        // CHECK FOR EXISTING TRANSACTION
        const existingTransaction = this.transactionPool.existingTransactionPool({
          inputAddress: payload.data.message.transaction.input.address,
        });

        // SAVE TRANSACTION TO MEMORY
        this.transactionPool.setTransaction(payload.data.message.transaction);

        // CHECK FOR DUPLICATE TRANSACTION IN MEMORY
        if (existingTransaction) {
          if (
            existingTransaction.input.timestamp == payload.data.message.transaction.input.timestamp
          ) {
            logger.info("I already have this transaction. I'M NOT FORWARDING IT.");
            return;
          }
        }

        /**
         * NO DUPLICATES - FORWARD TRANSACTION TO PEERS
         */

        this.forwardTransactionToPeers(
          payload.data.message.transaction,
          payload.data.message.info.sender
        );

        // ADD SENDER TO PEERS ON FILE
        const localPeers = await this.getPeers();
        const incomingPeers: IHost[] = payload.data.message.info.senderPeers;
        const sender = {
          host: payload.data.message.info.sender.host,
          port: payload.data.message.info.sender.port,
        };

        // ADD SENDER DETAILS
        incomingPeers.push(sender);

        // REMOVE PEERS FROM INCOMING PEERS THAT ARE ALREADY PRESENT LOCALLY
        const peersNotPresentInLocal = this.removeDuplicatePeers({
          peersThatNeedDupsRemoved: incomingPeers,
          currentPeers: localPeers,
        });

        // ADD PEER TO MEMORY'S WELLKNOWN PEER
        this.addToWellKnownPeers(peersNotPresentInLocal);

        // SAVE PEER TO FILE
        appendToFile(peersNotPresentInLocal, peersStorageFile);

        return done(null, 'txn-200');
      }

      return done(new Error('Invalid txn'));
    };
  }

  public async sendTransactions(transaction: Transaction): Promise<void> {
    const aboutThisPeer = this.peerInfo();
    const localPeers = await this.getPeers();

    /** FOR EACH PEER */
    hardCodedPeers.forEach(peer => {
      if (peer.host !== this.ip_address) {
        logger.info('Sending txn to: ', { peer });

        const message = {
          type: 'TRANSACTION',
          message: {
            transaction,
            info: {
              sender: {
                host: aboutThisPeer.host,
                port: aboutThisPeer.port,
                id: aboutThisPeer.id,
                timestamp: new Date().getTime(),
              },
              senderPeers: localPeers,
            },
          },
        };

        this.peer
          .remote({
            host: peer.host,
            port: peer.port,
          })
          .run('handle/receiveTransactions', { data: message }, (err: any, result: any) => {
            if (result == 'txn-200') logger.info('Success sending txn to: ', { peer });

            if (err) logger.error('Error sending txn to: ', { peer });
          });
      }
    });
  }

  private async forwardTransactionToPeers(
    transaction: Transaction,
    sender: { host: string; port: number; id: string }
  ): Promise<void> {
    const localPeers = await this.getPeers();

    // FOR EACH PEER FORWARD THE TRANSACTION
    if (localPeers.length) {
      localPeers.forEach((peer: IHost) => {
        // DO NOT SEND THIS TXS TO THE SENDER OR TO THIS PEER
        if (sender.host != peer.host && peer.host != this.ip_address) {
          logger.info('FORWARDING TRANSACTION TO:', { peer });

          const message = {
            type: 'TRANSACTION',
            message: {
              transaction,
              info: {
                sender: sender,
                senderPeers: localPeers,
              },
            },
          };

          this.peer
            .remote({
              host: peer.host,
              port: peer.port,
            })
            .run('handle/receiveTransactions', { data: message }, (forwarding_err: Error) => {
              if (forwarding_err) {
                logger.warn('Failed to send txn to', { peer });
              }
            });
        }
      });
    }
  }

  /************************************
   *          BLOCKS                  *
   ************************************/

  private receiveBlock(): void {
    this.peer.handle.receiveBlockFromPeers = async (payload: any, done: any) => {
      if (payload.data.message.block) {
        try {
          logger.info('INCOMING BLOCK', payload.data.message);

          // CHECK FOR EXISTING BLOCK
          const data = await this.leveldb.getValue(
            `${payload.data.message.block.blockchainHeight}`,
            this.leveldb.blocksDB
          );

          const isExistingBlock = isEmptyObject(data.message) ? false : true;

          if (!isExistingBlock) {
            await this.blockchain.addBlockFromPeerToLocal(payload.data.message, true, async () => {
              // REMOVE ALL THE TRANSACTIONS ON THIS PEER THAT ARE CONTAINED IN THE NEW SENT BLOCK
              this.transactionPool.clearBlockchainTransactions({
                chain: [payload.data.message.block],
              });

              // SAVE TRANSACTIONS BALANCES IN TO DB
              await this.leveldb.addOrUpdateBal([payload.data.message.block]);

              return done(null, 'blk-200');
            });

            /**
             * NO DUPLICATES - FORWARD TRANSACTION TO PEERS
             */
            this.forwardBlockToPeers(payload.data.message);
          }

          if (isExistingBlock) logger.info("I have this BLOCK. I'M NOT FORWARDING IT.");
          return;
        } catch (error) {
          console.log('250', { error });
          return done(new Error('blk-500'));
        }
      }
      return done(new Error('blk-500'));
    };
  }

  public async sendBlockToPeers({ block }: { block: Block }): Promise<void> {
    const aboutThisPeer = this.peerInfo();
    const localPeers = await this.getPeers();
    const combinedPeers = hardCodedPeers.concat(localPeers);
    const localHighestBlockchainHeight = await this.leveldb.getBestBlockchainHeight();

    /** FOR EACH PEER */
    combinedPeers.forEach(peer => {
      if (peer.host !== this.ip_address) {
        const info = {
          KADOCOIN_VERSION,
          height: localHighestBlockchainHeight,
          sender: {
            host: aboutThisPeer.host,
            port: aboutThisPeer.port,
            id: aboutThisPeer.id,
            timestamp: new Date().getTime(),
          },
        };

        const message = {
          type: 'BLOCK',
          message: {
            block,
            info,
          },
        };

        this.peer
          .remote({
            host: peer.host,
            port: peer.port,
          })
          .run('handle/receiveBlockFromPeers', { data: message }, (err: any, result: any) => {
            console.log('sendBlockToPeers', { err, result });
            if (result == 'blk-200') logger.info('Success sending block to:', { peer });

            if (err) logger.warn('Error sending block to:', { peer });
          });
      }
    });
  }

  private async forwardBlockToPeers(incomingObj: incomingObj): Promise<void> {
    const peers = await this.getPeers();

    // FOR EACH PEER FORWARD THE RECENTLY MINED BLOCK
    if (peers.length) {
      peers.forEach((peer: IHost) => {
        if (incomingObj.info.sender.host != peer.host && peer.host != this.ip_address) {
          logger.info(`FORWARDING BLOCK TO`, { peer });

          const message = {
            type: 'BLOCK',
            message: {
              block: incomingObj.block,
              info: incomingObj.info,
            },
          };

          this.peer
            .remote({
              host: peer.host,
              port: peer.port,
            })
            .run('handle/receiveBlockFromPeers', { data: message }, (forwarding_blk_err: Error) => {
              if (forwarding_blk_err) logger.warn('Failed to send new blk to', { peer });
            });
        }
      });
    }
  }

  /************************************
   *          ON SYNC BLOCKS    *
   ************************************/

  /**
   * SENDS A REQUEST TO REMOTE PEERS TO FIND A BLOCK.
   *
   * @param peersAndHeights  blockHeights: number[], peers: IHost[]
   * @return FALSE -> I DID NOT GET THE BLOCK
   * @return TRUE -> I GOT THE BLOCK
   */
  public async syncPeerWithHistoricalBlockchain(
    peersAndHeights: Record<string, number[] | IHost[]>
  ): Promise<boolean> {
    for (let i = 0; i < peersAndHeights.blockHeights.length; i++) {
      const height = peersAndHeights.blockHeights[i] as number;

      const status = await this.loopThroughPeers(peersAndHeights.peers as IHost[], height);

      if (!status) return false; //exit and restart - block height not found in all peers

      // IT HAS FOUND BLOCK NUMBER `i` FROM ONE OF THE PEERS
      if (status) logger.info(`Done`);
    }

    return true;
  }

  public async loopThroughPeers(peers: Array<IHost>, height: number): Promise<boolean> {
    for await (const peer of peers) {
      if (peer.host !== this.ip_address) {
        logger.info(`Attempting to get block #${height} from ${peer.host}`);

        const status = await new Promise(async resolve =>
          resolve(await this.getBlock({ peer, height }))
        );

        if (status) return true;

        logger.info(`${peer.host} didn't respond`);
      }
    }

    // END OF LOOP NO PEER RESPONDED
    return false;
  }

  private async getBlock({ peer, height }: { peer: IHost; height: number }): Promise<boolean> {
    return await new Promise(resolve => {
      try {
        this.peer
          .remote({
            host: peer.host,
            port: peer.port,
          })
          .run(
            '/handle/getBlock',
            { data: { height } },
            async (err: Error, data: { type: string; message: Block }) => {
              if (!err) {
                if (data.type === 'success') {
                  // MESSAGE PARAM CARRYING BLOCK IS EMPTY...

                  if (isEmptyObject(data.message)) return resolve(false);

                  //...NOT EMPTY - ADD TO DB
                  const response = await new Promise(
                    async (resolve: (value: { type: string; message: string }) => void) =>
                      resolve(await this.leveldb.addBlocksToDB({ blocks: [data.message] }))
                  );

                  if (response.type == 'error') return resolve(false);

                  return resolve(true);
                }

                resolve(false);
              } else {
                logger.warn(`${peer.host}:${peer.port}/handle/getBlock - ${err}`);
                resolve(false);
              }
            }
          );
      } catch (err) {
        resolve(false);
      }
    });
  }

  private respondToGetBlock(): void {
    this.peer.handle.getBlock = async (
      payload: { data: { height: number } },
      done: (err: Error, result: { type: string; message: Block }) => void
    ) => {
      try {
        // GET THE REQUESTED BLOCK USING THE SENT HEIGHT
        const response = await this.leveldb.getValue(
          `${payload.data.height}`,
          this.leveldb.blocksDB
        );

        return done(null, response);
      } catch (err) {
        return done(null, err);
      }
    };
  }

  /************************************
   *          ON SYNC - PEERS                 *
   ************************************/

  private onSyncGetPeers(peer: IHost): Promise<boolean> {
    return new Promise(resolve => {
      try {
        this.peer
          .remote({
            host: peer.host,
            port: peer.port,
          })
          .run(
            '/handle/sendPeersToRequesterAndRequesterInfoToSupplier',
            { data: JSON.stringify([{ host: this.ip_address, port: P2P_PORT }]) },
            async (err: Error, incomingPeers: IHost[]) => {
              if (!err && incomingPeers) {
                if (incomingPeers.length) {
                  // SAVE PEERS TO FILE AND ADD TO WELLKNOWN PEERS IN MEMORY
                  await this.savePeersToFileAndAddToWellKnownPeers({
                    incomingPeers: JSON.stringify(incomingPeers),
                  });
                }
                resolve(true);
              } else {
                logger.warn(
                  `${peer.host}:${peer.port}/handle/sendPeersToRequesterAndRequesterInfoToSupplier- ${err}`
                );
                resolve(false);
              }
            }
          );
      } catch (error) {
        resolve(false);
      }
    });
  }

  private onSyncReceiveRequestingPeerInfo(): void {
    this.peer.handle.sendPeersToRequesterAndRequesterInfoToSupplier = async (
      payload: { data: any },
      done: (err: Error, result: string) => void
    ) => {
      // SAVE PEERS TO FILE AND ADD TO WELLKNOWN PEERS IN MEMORY
      const localPeers = await this.savePeersToFileAndAddToWellKnownPeers({
        incomingPeers: payload.data,
      });

      // SEND THE REQUESTING PEER MY LOCAL PEERS
      return done(null, JSON.stringify(localPeers));
    };
  }

  private async savePeersToFileAndAddToWellKnownPeers({
    incomingPeers,
  }: {
    incomingPeers: string;
  }): Promise<IHost[]> {
    try {
      /** GET LOCAL PEERS */
      const localPeers = await this.getPeers();
      const peersNotPresentInLocal = this.removeDuplicatePeers({
        peersThatNeedDupsRemoved: JSON.parse(incomingPeers),
        currentPeers: localPeers,
      });

      if (peersNotPresentInLocal.length) {
        logger.info(`Found ${peersNotPresentInLocal.length}(s) incoming peers`);
        logger.info('Adding remote peer to file');

        // ADD PEER TO MEMORY'S WELLKNOWN PEER
        this.addToWellKnownPeers(peersNotPresentInLocal);

        // SAVE PEER TO FILE
        appendToFile(peersNotPresentInLocal, peersStorageFile);

        logger.info(`Added ${peersNotPresentInLocal.length} remote peer(s) to file`);

        return localPeers;
      }
    } catch (error) {
      console.log('Error adding peers to local file.', error);
      return [];
    }
  }

  /************************************
   *          ON SYNC - TRANSACTIONS    *
   ************************************/

  private onSyncGetTransactions(peer: IHost): Promise<boolean> {
    return new Promise(resolve => {
      request(
        { url: `http://${peer.host}:2000/transaction-pool`, timeout: REQUEST_TIMEOUT },
        (error, response, body) => {
          if (!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body).message;

            // NO TRANSACTIONS TO ADD TO THIS PEER
            if (isEmptyObject(rootTransactionPoolMap))
              logger.info('No new transaction coming in from the network');

            // YES TRANSACTIONS TO ADD TO THIS PEER
            if (!isEmptyObject(rootTransactionPoolMap))
              this.transactionPool.onSyncAddTransactions(rootTransactionPoolMap);

            resolve(true);
          } else {
            resolve(false);
            logger.warn(`${peer.host}:2000/transaction-pool - ${error}`);
          }
        }
      );
    });
  }

  /************************************
   *          ON SYNC - BEST HEIGHTS    *
   ************************************/

  async onSynGetBestHeightsFromPeers(): Promise<Record<string, IHost>> {
    try {
      const combinedPeers = await this.getLocalAndHardcodedPeers();

      for await (const peer of combinedPeers) {
        if (peer.host !== this.ip_address) {
          logger.info('Attempting to connect to', { host: peer.host, port: peer.port });

          await new Promise(async resolve => resolve(this.onSyncGetBestHeight(peer)));
        }
      }

      return this.remoteBestHeights;
    } catch (err) {
      logger.error('Error at getBestHeightsFromPeers', err);
      return {};
    }
  }

  public async onSyncConstructHeadersAndPeers(
    heightsAndPeers: Record<string, IHost>
  ): Promise<Record<string, number[] | IHost[]>> {
    try {
      // GET THE BEST HEIGHT FROM REMOTES HEIGHTS
      const remotesBestHeight = Object.keys(heightsAndPeers).sort(
        (a, b) => Number(b) - Number(a)
      )[0];

      const localBestHeight = await this.leveldb.getBestBlockchainHeight();

      if (Number(remotesBestHeight) > localBestHeight) {
        const blockHeights = [];

        // CREATE AN ARRAY OF NUMBERS STARTING AFTER THIS PEER'S BEST HEIGHT AND THE REMOTES' HIGHEST BEST HEIGHT
        for (let i = localBestHeight + 1; i <= Number(remotesBestHeight); i++) {
          blockHeights.push(i);
        }

        return {
          blockHeights,
          peers: Object.values(heightsAndPeers),
        };
      }

      return {};
    } catch (err) {
      logger.error('Error at onSyncConstructHeadersAndPeers ', err);
      return {};
    }
  }

  private onSyncReceiveBlockHeight(): void {
    this.peer.handle.sendBestBlockHeight = async (
      payload: { data: { version: string } },
      done: (
        err: Error,
        result: { height: number; status: 'compatible' | 'not-compatible' }
      ) => void
    ) => {
      // CHECK VERSION
      const bestHeight = await this.leveldb.getBestBlockchainHeight();

      if (this.compareVersion(payload.data.version)) {
        // SEND THE REQUESTING PEER MY LOCAL PEERS
        return done(null, { height: bestHeight, status: 'compatible' });
      }

      return done(null, { height: bestHeight, status: 'not-compatible' });
    };
  }

  private async onSyncGetBestHeight(peer: IHost): Promise<boolean> {
    return await new Promise(resolve => {
      try {
        this.peer
          .remote({
            host: peer.host,
            port: peer.port,
          })
          .run(
            '/handle/sendBestBlockHeight',
            { data: { version: KADOCOIN_VERSION } },
            async (err: Error, data: { height: number; status: string }) => {
              if (!err) {
                // KEEP TRACK OF HEIGHT IN THE FORM HEIGHT => PEER
                if (data.status === 'compatible') {
                  this.remoteBestHeights[data.height] = peer;

                  resolve(true);
                }
              } else {
                logger.warn(`${peer.host}:${peer.port}/handle/sendBestBlockHeight - ${err}`);
                resolve(false);
              }
            }
          );
      } catch (err) {
        resolve(false);
      }
    });
  }

  /************************************
   *          HELPERS    *
   ************************************/

  public compareVersion(incomingVersion: string): boolean {
    return incomingVersion == KADOCOIN_VERSION;
  }

  private removeDuplicatePeers({
    peersThatNeedDupsRemoved,
    currentPeers,
  }: {
    peersThatNeedDupsRemoved: Array<IHost>;
    currentPeers: Array<IHost>;
  }) {
    const peersNotPresentInLocal = [];
    const localHosts = new Map();

    for (let j = 0; j < currentPeers.length; j++) {
      localHosts.set(currentPeers[j].host, currentPeers[j].port);
    }

    for (let i = 0; i < peersThatNeedDupsRemoved.length; i++) {
      const peer = peersThatNeedDupsRemoved[i];

      if (!localHosts.has(peer.host) && peer.host != this.ip_address)
        peersNotPresentInLocal.push(peer);
    }

    return peersNotPresentInLocal;
  }

  private peerInfo(): { host: string; port: number; id: string } {
    return {
      host: this.ip_address,
      port: this.peer.self.port,
      id: this.peer.self.id,
    };
  }

  public async getPeers(): Promise<Array<IHost>> {
    if (fs.existsSync(peersStorageFile)) {
      return getFileContentLineByLine(peersStorageFile);
    }
    return [];
  }

  private addToWellKnownPeers(peersToAdd: IHost[]): void {
    const currentWellKnownPeers = this.peer.wellKnownPeers.get();
    const dupsPeersRemoved = this.removeDuplicatePeers({
      peersThatNeedDupsRemoved: peersToAdd,
      currentPeers: currentWellKnownPeers,
    });

    for (let i = 0; i < dupsPeersRemoved.length; i++) {
      this.peer.wellKnownPeers.add(dupsPeersRemoved[i]);
    }
  }

  public onSyncPopulateWellKnownPeers(peersToAdd: IHost[]): void {
    for (let i = 0; i < peersToAdd.length; i++) {
      this.peer.wellKnownPeers.add(peersToAdd[i]);
    }
  }

  private async getLocalAndHardcodedPeers(): Promise<IHost[]> {
    return new Promise((resolve, reject) => {
      try {
        this.getPeers().then(localPeers => resolve(hardCodedPeers.concat(localPeers)));
      } catch (err) {
        logger.error('Error at getLocalAndHardcodedPeers', err);
        reject(err);
      }
    });
  }
}

export default P2P;

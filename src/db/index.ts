import level from 'level'; // SOURCE => https://github.com/Level/level
import Block from '../blockchain/block';
import { balancesStorageFolder } from '../config/constants';
import logger from '../util/logger';

class LevelDB {
  balancesDB: level.LevelDB<any, any>;

  constructor() {
    this.balancesDB = level(balancesStorageFolder, { valueEncoding: 'json' });
  }

  public getBal = (address: string): Promise<{ type: string; message: string }> =>
    new Promise(resolve => {
      this.balancesDB.get(
        address.trim(),
        (err: { notFound: any }, value: { bal: string; height: number; timestamp: number }) => {
          if (err) {
            if (err.notFound) return resolve({ type: 'success', message: (0).toFixed(8) });

            return resolve({ type: 'error', message: 'Error getting balance. Please try again.' });
          } else {
            return resolve({ type: 'success', message: value.bal });
          }
        }
      );
    });

  public getAllKeysAndValues(): void {
    this.balancesDB
      .createReadStream()
      .on('data', (data: { key: string; value: any }) => logger.info('BalancesDB', { data }));
  }

  public addOrUpdateBal(blocks: Array<Block>): void {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const transactions = blocks[i]['transactions'];

      for (let j = 0; j < transactions.length; j++) {
        const transaction = transactions[j];

        if (Object.values(transaction['output']).length === 1) {
          /**
           * REWARD TRANSACTION
           */
          for (const address in transaction['output']) {
            if (Object.prototype.hasOwnProperty.call(transaction['output'], address)) {
              const newly_received_coins = transaction['output'][address] as string;

              // SAVE TO DB
              this.incrementBal({ block, address, newly_received_coins });
            }
          }
        } else {
          /**
           * REGULAR TRANSACTION
           */
          Object.entries(transaction['output']).forEach(async ([address, coins], index) => {
            const newly_received_coins = coins as string;
            if (index === 0) {
              /*** THIS IS THE SENDER */

              if (Number(newly_received_coins) === 0) {
                // REMOVE FROM DB IF THE SENDER HAS NO BALANCE LEFT
                await this.balancesDB.del(address);
              } else {
                // SENDER HAS BALANCE. OVERRIDE THE OLD BALANCE IT WITH THE NEW BALANCE
                await this.balancesDB.put(address, this.valueToSave(block, newly_received_coins));
              }
            } else {
              /*** THIS IS THE RECEIVER */
              this.incrementBal({ block, address, newly_received_coins });
            }
          });
        }
      }
    }
  }

  private incrementBal({
    block,
    address,
    newly_received_coins,
  }: {
    block: Block;
    address: string;
    newly_received_coins: string;
  }): void {
    this.balancesDB.get(
      address,
      async (err: { notFound: any }, value: { bal: string; height: number; timestamp: number }) => {
        if (err && err.notFound) {
          await this.balancesDB.put(address, this.valueToSave(block, newly_received_coins));
        } else {
          const new_total_balance = Number(value.bal) + Number(newly_received_coins);

          await this.balancesDB.put(address, this.valueToSave(block, new_total_balance.toFixed(8)));
        }
      }
    );
  }

  private valueToSave(
    block: Block,
    newly_received_coins: string
  ): { bal: string; height: number; timestamp: number } {
    return {
      bal: newly_received_coins,
      height: block.blockchainHeight,
      timestamp: block.timestamp,
    };
  }
}

export default LevelDB;

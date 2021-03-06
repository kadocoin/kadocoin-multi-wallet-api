/*
 * # Kadocoin License
 *
 * Copyright (c) 2021 Adamu Muhammad Dankore
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or <http://www.opensource.org/licenses/mit-license.php>
 */
import { sampleDataForTests } from '../settings';
import cryptoHash from '../util/crypto-hash';
import Block from './block';
import Blockchain from '.';
import Wallet from '../wallet';
import Transaction from '../wallet/transaction';
import { IChain } from '../types';

describe('Blockchain', () => {
  let blockchain: Blockchain,
    newChain: Blockchain,
    originalChain: IChain,
    sampleData: Transaction,
    errorMock: jest.Mock<any, any>;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    sampleData = new Transaction({
      id: sampleDataForTests.id,
      output: sampleDataForTests.output,
      input: sampleDataForTests.input,
    });
    errorMock = jest.fn();
    originalChain = blockchain.chain;
    global.console.error = errorMock;
  });

  it('contains a `chain` array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block to the chain', () => {
    const newData = [sampleData];
    blockchain.addBlock({ transactions: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].transactions).toEqual(newData);
  });

  describe('isValidChain()', () => {
    describe('when the chain does not start with the genesis block', () => {
      it('returns false', () => {
        blockchain.chain[0] = {
          timestamp: 2,
          lastHash: 'lastHash',
          hash: 'hash-one',
          transactions: [],
          nonce: 2,
          difficulty: 1,
          blockSize: '999',
          transactionVolume: '999',
          blockReward: (50).toFixed(8),
          feeReward: (5).toFixed(8),
          blockchainHeight: newChain.chain.length,
          hashOfAllHashes: cryptoHash('hash-one'),
        };

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe('when the chain starts with the genesis block and has multiple blocks', () => {
      beforeEach(() => {
        blockchain.addBlock({ transactions: [sampleData] });
        blockchain.addBlock({ transactions: [sampleData] });
        blockchain.addBlock({ transactions: [sampleData] });
      });

      describe('and a lastHash reference has changed.', () => {
        it('returns false', () => {
          blockchain.chain[2].lastHash = 'broken-lastHash';

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain contains a block with an invalid field', () => {
        it('returns false', () => {
          sampleData.id = 'bad id';
          blockchain.chain[2].transactions = [sampleData];

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain contains a block with a jumped difficulty', () => {
        it('returns false', () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const transactions: Array<Transaction> = [];
          const difficulty = lastBlock.difficulty - 3;
          const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, transactions);
          const badBlock = new Block({
            timestamp,
            lastHash,
            hash,
            nonce,
            difficulty,
            transactions,
            blockSize: '999',
            transactionVolume: '999',
            blockReward: (50).toFixed(8),
            feeReward: (5).toFixed(8),
            blockchainHeight: newChain.chain.length,
            hashOfAllHashes: cryptoHash(hash),
          });

          blockchain.chain.push(badBlock);

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain does not contain any invalid blocks', () => {
        it('returns true', () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
      // END starts with the genesis block and has multiple blocks
    });

    // END isValidChain()
  });

  describe('replaceChain()', () => {
    let logMock: jest.Mock<any, any>;

    beforeEach(() => {
      logMock = jest.fn();
      global.console.log = logMock;
    });

    describe('when the new chain is not longer', () => {
      beforeEach(() => {
        newChain.chain[0] = {
          timestamp: 1,
          lastHash: '0xC6d23c6703f33F5ad74E6E4fc17C1CE9397D4AAD',
          hash: '0x86045b56bfeb1A35C6818081130BA0F789dc27c9',
          transactions: [],
          nonce: 0,
          difficulty: 3,
          blockSize: '999',
          transactionVolume: '999',
          blockReward: (50).toFixed(8),
          feeReward: (5).toFixed(8),
          blockchainHeight: newChain.chain.length,
          hashOfAllHashes: cryptoHash('0x86045b56bfeb1A35C6818081130BA0F789dc27c9'),
        };

        blockchain.replaceChain(newChain.chain);
      });

      it('does not replace the chain', () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it('logs an error', () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('when the chain is longer', () => {
      beforeEach(() => {
        newChain.addBlock({ transactions: [sampleData] });
        newChain.addBlock({ transactions: [sampleData] });
        newChain.addBlock({ transactions: [sampleData] });
      });
      describe('and the chain is invalid', () => {
        beforeEach(() => {
          newChain.chain[2].hash = 'invalid hash';
          blockchain.replaceChain(newChain.chain);
        });

        it('does not replace the chain', () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it('logs an error', () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe('and the chain is valid', () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });
        it('replaces the chain', () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });
        it('logs about the chain replacement', () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('isValidTransactionData()', () => {
    let transaction: Transaction, rewardTransaction: Transaction, wallet: Wallet, message: string;

    beforeEach(() => {
      wallet = new Wallet();
      message = 'Muhammad Bello Dankore Dec 10, 2018 - Rest in Aljannatul Firdaus';

      transaction = wallet.createTransaction({
        recipient: '0xC6d23c6703f33F5ad74E6E4fc17C1CE9397D4AAD',
        amount: 65,
        address: wallet.address,
        publicKey: wallet.publicKey,
        localWallet: wallet,
        message,
      });

      rewardTransaction = Transaction.rewardTransaction({
        minerAddress: wallet.address,
        message: '',
        blockchainLen: 10,
        feeReward: '0',
      });
    });

    describe('and transaction transactions is valid', () => {
      it('returns true', async () => {
        const newlyMinedBlock = await newChain.addBlock({
          transactions: [transaction, rewardTransaction],
        });

        expect(blockchain.isValidTransactionData({ block: newlyMinedBlock })).toBe(true);
        expect(errorMock).not.toHaveBeenCalled();
      });
    });

    describe('and the transaction transactions has multiple rewards', () => {
      it('returns false and logs and error', async () => {
        const newlyMinedBlock = await newChain.addBlock({
          transactions: [transaction, rewardTransaction, rewardTransaction],
        });
        expect(blockchain.isValidTransactionData({ block: newlyMinedBlock })).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('and the transaction transactions has at least one malformed output', () => {
      describe('and the transaction is not a reward transaction', () => {
        it('returns false and logs and error', async () => {
          transaction.output[wallet.address] = (999999).toFixed(8);

          const newlyMinedBlock = await newChain.addBlock({
            transactions: [transaction, rewardTransaction],
          });

          expect(blockchain.isValidTransactionData({ block: newlyMinedBlock })).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe('and the transaction is a reward transaction', () => {
        it('returns false and logs and error', async () => {
          rewardTransaction.output[wallet.address] = '999999';

          const newlyMinedBlock = await newChain.addBlock({
            transactions: [transaction, rewardTransaction],
          });

          expect(blockchain.isValidTransactionData({ block: newlyMinedBlock })).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });

    describe('and a block contains multiple identical transaction', () => {
      it('returns false and logs an error', async () => {
        const newlyMinedBlock = await newChain.addBlock({
          transactions: [transaction, transaction, transaction],
        });

        expect(blockchain.isValidTransactionData({ block: newlyMinedBlock })).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });
  });
});

/*
 * # Kadocoin License
 *
 * Copyright (c) 2021 Adamu Muhammad Dankore
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or <http://www.opensource.org/licenses/mit-license.php>
 */
import Transaction from './transaction';
import { NOT_ENOUGH, STARTING_BALANCE, walletsStorageFile } from '../config/constants';
import newEc from '../util/secp256k1';
import cryptoHash from '../util/crypto-hash';
import { pubKeyToAddress } from '../util/pubkey-to-address';
import { IChain, ICOutput_R, ICreateTransactionParams, IWalletFormattedForStorage } from '../types';
import fs from 'fs';
import appendToFile from '../util/appendToFile';
import getFileContentLineByLine from '../util/get-file-content-line-by-line';

class Wallet {
  public balance: string;
  public keyPair: any;
  public publicKey: string;
  public address: string;
  privateHex: string;
  keyPairHex: string;

  constructor(
    balance?: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    keyPair?: any,
    publicKey?: string,
    address?: string,
    keyPairHex?: string
  ) {
    this.balance = balance || STARTING_BALANCE.toFixed(8);
    this.keyPair = keyPair || newEc.genKeyPair();
    this.publicKey = publicKey || this.keyPair.getPublic().encode('hex');
    this.address = address || pubKeyToAddress(this.publicKey);
    this.keyPairHex = keyPairHex || this.keyPair.getPrivate('hex');
  }

  static keyPairFromHex(keyPairHexValue: string): any {
    return newEc.keyFromPrivate(keyPairHexValue, 'hex');
  }

  async loadWalletsFromFileOrCreateNew({ chain }: { chain: IChain }): Promise<Wallet> {
    // GET ALL THE WALLETS FROM STORAGE
    const wallets = await this.formatWalletAfterRetrievingFromStorage({ chain });

    // ONLY RETURN ONE OF THE WALLETS
    if (wallets.length) return wallets[0];

    // IF NO WALLETS EXIST, CREATE ONE
    const newWallet = new Wallet();

    // SAVE IT TO FILE
    appendToFile([this.formatWalletInfoBeforeStoring(newWallet)], walletsStorageFile);

    // RETURN THE NEW WALLET
    return newWallet;
  }

  async formatWalletAfterRetrievingFromStorage({
    chain,
  }: {
    chain: IChain;
  }): Promise<Array<Wallet>> {
    const results: Array<Wallet> = [];

    if (fs.existsSync(walletsStorageFile)) {
      const wallets = await getFileContentLineByLine(walletsStorageFile);

      if (wallets.length) {
        for (let i = 0; i < wallets.length; i++) {
          let wallet = wallets[i];

          wallet = new Wallet(
            Wallet.calculateBalance({ chain, address: wallet.address }),
            Wallet.keyPairFromHex(wallet.keyPairHex),
            wallet.publicKey,
            wallet.address,
            wallet.keyPairHex
          );

          results.push(wallet);
        }
      }
    }
    return results;
  }

  formatWalletInfoBeforeStoring(wallet: Wallet): IWalletFormattedForStorage {
    return {
      publicKey: wallet.publicKey,
      address: wallet.address,
      keyPairHex: wallet.keyPairHex,
    };
  }

  sign(output: ICOutput_R): string {
    return this.keyPair.sign(cryptoHash(output));
  }

  createTransaction({
    recipient,
    amount,
    balance,
    localWallet,
    address,
    message,
    sendFee,
  }: ICreateTransactionParams): Transaction {
    const send_fee = sendFee ? Number(sendFee) : 0;
    const totalAmount = send_fee + amount;

    // IF BALANCE IS INCLUDED
    if (balance) this.balance = balance;

    // CHECK TO MAKE SURE SENDER HAS ENOUGH COINS
    if (totalAmount > Number(this.balance)) throw new Error(NOT_ENOUGH);

    return new Transaction({
      recipient,
      address,
      amount,
      balance: this.balance,
      localWallet,
      message,
      sendFee,
    });
  }

  static calculateBalance({ chain, address }: { chain: IChain; address: string }): string {
    let hasConductedTransaction = false;
    let outputsTotal = 0;

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];

      for (const transaction of block.transactions) {
        if (transaction.input.address === address) hasConductedTransaction = true;

        const addressOutput = Number(transaction.output[address]);

        if (addressOutput) outputsTotal += addressOutput;
      }

      if (hasConductedTransaction) break;
    }

    return hasConductedTransaction
      ? outputsTotal.toFixed(8)
      : (STARTING_BALANCE + outputsTotal).toFixed(8);
  }
  static calculateTotalSentAndReceived({ chain, address }: { chain: IChain; address: string }): {
    numTransactionsInitiated: number;
    totalSent: string;
    totalReceived: string;
    totalFeesPaid: string;
    balance: string;
    address: string;
  } {
    let numTransactionsInitiated = 0,
      totalSent = 0,
      totalReceived = 0,
      totalFeesPaid = 0;

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];

      for (const transaction of block.transactions) {
        // TOTAL SENT
        if (transaction.input.address === address) {
          numTransactionsInitiated += 1;

          const amountSent = Number(transaction.input.amount) - Number(transaction.output[address]);
          const feesPaid = Number(transaction.input.sendFee);

          totalSent += amountSent;
          totalFeesPaid += feesPaid;
        }
        // TOTAL RECEIVED
        const outputAddresses = Object.keys(transaction.output);

        for (let i = 0; i < outputAddresses.length; i++) {
          if (transaction.input.address != '' && transaction.input.address !== outputAddresses[i]) {
            address == outputAddresses[i] &&
              (totalReceived += Number(transaction.output[outputAddresses[i]]));
          }
          if (transaction.input.address == '' && transaction.input.recipient == address) {
            totalReceived += Number(transaction.output[outputAddresses[i]]);
          }
        }
      }
    }

    return {
      numTransactionsInitiated: numTransactionsInitiated,
      totalSent: totalSent.toFixed(8),
      totalFeesPaid: totalFeesPaid.toFixed(8),
      totalReceived: totalReceived.toFixed(8),
      balance: Wallet.calculateBalance({ chain, address }),
      address,
    };
  }

  // END CLASS
}

export default Wallet;

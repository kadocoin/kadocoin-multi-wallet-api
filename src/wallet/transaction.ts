// Copyright (c) 2009-2010 Adamu Muhammad Dankore
import { v1 as uuidv1 } from 'uuid';
import { NOT_ENOUGH, REWARD_INPUT } from '../config/constants';
import verifySignature from '../util/verifySignature';
import { isValidChecksumAddress } from '../util/pubKeyToAddress';
import {
  ICInput,
  ICInput_R,
  ICOutput,
  ICOutput_R,
  ITransaction,
  IUpdate,
  TTransactionChild,
} from '../types';
import Mining_Reward from '../util/coin-supply_&_mining-reward';
import costOfMessage from '../util/text-2-coins';
import { filterAddress } from '../util/address-filter';

class Transaction {
  public id: string;
  input: ICInput_R;
  output: ICOutput_R;

  constructor({
    publicKey,
    address,
    recipient,
    amount,
    output,
    input,
    balance,
    localWallet,
    message,
  }: ITransaction) {
    this.id = uuidv1();
    this.output = output || this.createOutputMap({ address, recipient, amount, balance, message });
    this.input =
      input ||
      this.createInput({ publicKey, address, balance, localWallet, output: this.output, message });
  }

  createInput({ publicKey, balance, address, localWallet, output, message }: ICInput): ICInput_R {
    return {
      timestamp: Date.now(),
      amount: balance,
      address,
      publicKey,
      localPublicKey: localWallet.publicKey,
      signature: localWallet.sign(output),
      message,
    };
  }

  createOutputMap({ address, recipient, amount, balance, message }: ICOutput): ICOutput_R {
    const output: ICOutput_R = {} as ICOutput_R;
    const msg_fee = costOfMessage({ message });
    const totalAmount = amount + msg_fee;

    output[address] = (Number(balance) - totalAmount).toFixed(8);
    output[recipient] = amount.toFixed(8);
    if (message) output[`msg-fee-${address}`] = msg_fee;

    return output;
  }

  static validTransaction(transaction: TTransactionChild): boolean {
    const {
      input: { address, publicKey, amount, signature, localPublicKey },
      output,
    } = transaction;

    let outputTotal = Object.values(output).reduce(
      (total: any, outputAmount: any) => Number(total) + Number(outputAmount),
      0
    );

    // CONVERT THE SUM TO 8 DECIMAL PLACES
    if (typeof outputTotal == 'number') outputTotal = outputTotal.toFixed(8);

    // CHECK THAT THE SENDER STARTING BALANCE IS EQUAL TO THE TOTAL SENT AND REMAINING
    if (Number(amount) !== Number(outputTotal)) {
      console.error(`Invalid transaction from ${address} ${publicKey}`);
      return false;
    }

    // CHECK FOR ADDRESS VALIDITY VIA CHECKSUM
    Object.keys(output).map((address: string): boolean => {
      if (address.length == 42) {
        if (!isValidChecksumAddress(address)) {
          console.error(`Invalid address => ${address}`);
          return false;
        }
      } else if (address.length > 42) {
        if (!isValidChecksumAddress(filterAddress(address))) {
          console.error(`Invalid address => ${address}`);
          return false;
        }
      } else {
        return false;
      }
    });

    // VERIFY THAT THE SENDER CORRECTLY SIGNED THE TRANSACTION
    if (!verifySignature({ publicKey: localPublicKey, transactions: output, signature })) {
      console.error(`Invalid signature from ${localPublicKey}`);

      return false;
    }

    return true;
  }

  update({ publicKey, recipient, amount, balance, address, localWallet, message }: IUpdate): void {
    console.log({ message });
    const totalAmount = amount + costOfMessage({ message });

    if (totalAmount > Number(this.output[address])) throw new Error(NOT_ENOUGH);

    // MAKE SURE TO CONVERT THE NUMBERS BACK TO THEIR STRING FORM
    if (!this.output[recipient]) {
      this.output[recipient] = amount.toFixed(8);
    } else {
      this.output[recipient] = (Number(this.output[recipient]) + amount).toFixed(8);
    }

    if (message) {
      const msg_fee = costOfMessage({ message });

      if (this.output[`msg-fee-${address}`]) {
        const value = this.output[`msg-fee-${address}`];

        if (msg_fee < value) {
          console.log('refund');
          const refund = Number(value) - msg_fee;
          this.output[address] = (Number(this.output[address]) + refund - amount).toFixed(8);
        } else if (msg_fee === value) {
          console.log('no change in message');
          this.output[address] = (Number(this.output[address]) - amount).toFixed(8);
        } else {
          console.log('excess');
          const remove = msg_fee - Number(value);
          this.output[address] = (Number(this.output[address]) - remove - amount).toFixed(8);
        }
      } else {
        this.output[address] = (Number(this.output[address]) - msg_fee - amount).toFixed(8);
      }

      this.output[`msg-fee-${address}`] = msg_fee.toFixed(8);
    } else {
      this.output[address] = (Number(this.output[address]) - amount).toFixed(8);
    }

    this.input = this.createInput({
      publicKey,
      address,
      balance,
      localWallet,
      output: this.output,
      ...(message ? { message } : { message: this.input['message'] }),
    });
  }

  static rewardTransaction({
    minerPublicKey,
    message,
    chainLength,
  }: {
    minerPublicKey: string;
    message: string;
    chainLength: number;
  }): Transaction {
    const { MINING_REWARD } = new Mining_Reward({ chainLength });

    REWARD_INPUT.recipient = minerPublicKey;
    REWARD_INPUT.message = message;
    REWARD_INPUT.amount = MINING_REWARD;

    return new Transaction({
      input: REWARD_INPUT,
      output: { [minerPublicKey]: MINING_REWARD },
    });
  }

  // END CLASS
}

export default Transaction;

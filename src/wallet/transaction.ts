import { v1 as uuidv1 } from 'uuid';
import { NOT_ENOUGH, REWARD_INPUT } from '../settings';
import verifySignature from '../util/verify-signature';
import { isValidChecksumAddress } from '../util/pubkey-to-address';
import { ICInput, ICInput_R, ICOutput, ICOutput_R, ITransaction, IUpdate } from '../types';
import { calcOutputTotal } from '../util/transaction-metrics';
import Mining_Reward from '../util/supply_reward';

class Transaction {
  public id: string;
  public input: ICInput_R;
  public output: ICOutput_R;

  constructor({
    address,
    recipient,
    amount,
    output,
    input,
    balance,
    message,
    localWallet,
    sendFee,
    id,
  }: ITransaction) {
    this.id = id || uuidv1();
    this.output = output || this.createOutputMap({ address, recipient, amount, balance, sendFee });
    this.input =
      input ||
      this.createInput({
        address,
        balance,
        localWallet,
        output: this.output,
        message,
        sendFee,
      });
  }

  createInput({ balance, address, localWallet, output, message, sendFee }: ICInput): ICInput_R {
    const send_fee = sendFee ? Number(sendFee) : 0;

    return {
      timestamp: Date.now(),
      amount: (Number(balance) - send_fee).toFixed(8),
      ...(sendFee && { sendFee: Number(sendFee).toFixed(8) }),
      address,
      publicKey: localWallet.publicKey,
      signature: localWallet.sign(output),
      ...(message && { message }),
    };
  }

  createOutputMap({ address, recipient, amount, balance, sendFee }: ICOutput): ICOutput_R {
    const output: ICOutput_R = {} as ICOutput_R;
    const send_fee = sendFee ? Number(sendFee) : 0;

    output[address] = (Number(balance) - amount - send_fee).toFixed(8);
    output[recipient] = amount.toFixed(8);

    return output;
  }

  update({ recipient, amount, balance, address, localWallet, message, sendFee }: IUpdate): void {
    const send_fee = sendFee ? Number(sendFee) : 0;
    const totalAmount = amount + send_fee;

    if (totalAmount > Number(this.output[address])) throw new Error(NOT_ENOUGH);

    if (!sendFee) {
      if (!this.input['sendFee']) {
        this.output[address] = (Number(this.output[address]) - amount).toFixed(8);
      } else {
        const prev_sendFee = Number(this.input['sendFee']);
        this.output[address] = (Number(this.output[address]) + prev_sendFee - amount).toFixed(8);
      }
    } else {
      const prev_sendFee = this.input['sendFee'] ? Number(this.input['sendFee']) : 0;
      const current_sendFee = Number(sendFee);

      if (prev_sendFee < current_sendFee) {
        this.output[address] = (Number(this.output[address]) - totalAmount + prev_sendFee).toFixed(
          8
        );
      }

      if (prev_sendFee > current_sendFee) {
        this.output[address] = (Number(this.output[address]) - totalAmount + prev_sendFee).toFixed(
          8
        );
      }

      if (prev_sendFee === current_sendFee) {
        this.output[address] = (Number(this.output[address]) - amount).toFixed(8);
      }
    }

    if (!this.output[recipient]) {
      this.output[recipient] = amount.toFixed(8);
    } else {
      this.output[recipient] = (Number(this.output[recipient]) + amount).toFixed(8);
    }

    this.input = this.createInput({
      address,
      balance,
      localWallet,
      output: this.output,
      ...(message && { message }),
      ...(sendFee && { sendFee: Number(sendFee).toFixed(8) }),
    });
  }

  static validTransaction(transaction: Transaction): boolean {
    const {
      input: { address, amount, signature, publicKey },
      output,
    } = transaction;

    console.log({ amount: Number(amount), calcTotal: Number(calcOutputTotal(output)) });

    // CHECK THAT THE SENDER STARTING BALANCE IS EQUAL TO THE TOTAL SENT AND REMAINING
    if (Number(amount) !== Number(calcOutputTotal(output))) {
      console.error(`Invalid transaction from ${address} `);
      return false;
    }

    // CHECK FOR ADDRESS VALIDITY VIA CHECKSUM
    Object.keys(output).map((address: string): boolean => {
      if (!isValidChecksumAddress(address)) {
        console.error(`Invalid address => ${address}`);
        return false;
      }
    });

    // VERIFY THAT THE SENDER CORRECTLY SIGNED THE TRANSACTION
    if (!verifySignature({ publicKey: publicKey, output, signature })) {
      console.error(`Invalid signature from ${publicKey}`);

      return false;
    }

    return true;
  }

  static rewardTransaction({
    minerAddress,
    message,
    height,
    feeReward,
  }: {
    minerAddress: string;
    message?: string;
    feeReward?: string;
    height: number;
  }): Transaction {
    REWARD_INPUT.address = minerAddress;
    REWARD_INPUT.timestamp = Date.now();
    message && (REWARD_INPUT.message = message);
    const { MINING_REWARD } = new Mining_Reward().calc({ chainLength: height });
    const rewardTotal = Number(MINING_REWARD) + Number(feeReward);

    return new Transaction({
      input: REWARD_INPUT,
      output: { [minerAddress]: rewardTotal.toFixed(8) },
    });
  }

  // END CLASS
}

export default Transaction;

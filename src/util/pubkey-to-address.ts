/*
 * # Kadocoin License
 *
 * Copyright (c) 2021 Adamu Muhammad Dankore
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or <http://www.opensource.org/licenses/mit-license.php>
 */
import Web3 from 'web3';

const web3 = new Web3();

export function pubKeyToAddress(publicKey: string): string {
  const address = trimFirst12Bytes(web3.utils.keccak256(publicKey));
  return web3.utils.toChecksumAddress(address);
}

function trimFirst12Bytes(hexString: string): string {
  return '0x'.concat(hexString.substr(hexString.length - 40));
}

export function isValidChecksumAddress(address: string): boolean {
  return Web3.utils.isAddress(address);
}

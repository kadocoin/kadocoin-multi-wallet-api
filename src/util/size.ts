/*
 * # Kadocoin License
 *
 * Copyright (c) 2021 Adamu Muhammad Dankore
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or <http://www.opensource.org/licenses/mit-license.php>
 */
export default function size(...inputs: any[]): string {
  const chainLength = JSON.stringify(inputs).replace(/[\[\]\,\"{}]/g, '').length;

  return chainLength.toLocaleString('en-US');
}

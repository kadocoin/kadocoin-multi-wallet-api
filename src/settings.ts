/*
 * # Kadocoin License
 *
 * Copyright (c) 2021 Adamu Muhammad Dankore
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or <http://www.opensource.org/licenses/mit-license.php>
 */
import { REWARD_INPUT } from './types';
import cryptoHash from './util/crypto-hash';
import size from './util/size';
import Transaction from './wallet/transaction';
import createFolderOrFile from './util/create-folder-or-file';

export const ENVIRONMENT = process.env.NODE_ENV || 'development';
export const prod = ENVIRONMENT === 'production';

const INITIAL_DIFFICULTY = 10;
export const MINE_RATE = 5000;

const transactions: Array<Transaction> = [];
const hash = '*None*';
const GENESIS_DATA = {
  timestamp: 1626071497054,
  lastHash: '*None*',
  hash,
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  transactions,
  blockSize: '',
  transactionVolume: '',
  blockReward: '',
  feeReward: '',
  hashOfAllHashes: cryptoHash(hash),
  blockchainHeight: 1,
};

const genesisBlockSize = size(GENESIS_DATA);

GENESIS_DATA.blockSize = genesisBlockSize;

export { GENESIS_DATA };

export const STARTING_BALANCE = 1000;
const REWARD_INPUT: REWARD_INPUT = {
  timestamp: 0,
  amount: '',
  address: '',
  publicKey: '',
  signature: '',
};

export { REWARD_INPUT };
export const COINS_IN_CIRCULATION = 0;
export const NOT_ENOUGH = 'Insufficient balance';

// FILES
export const blockchainStorageFile = 'blocks/blockchain.dat'; // REMOVE
export const blockchainStorageFolder = 'blocks';
export const balancesStorageFolder = 'balances';
export const logFile = 'debug.log';
export const peersStorageFile = 'peers.dat';
export const walletsStorageFile = 'wallets/wallets.dat';
export const lastBlockStorageFolder = 'blocks/latestBlock';
export const blocksIndexFolder = 'blocks/index';

/** CREATE FOLDERS */
createFolderOrFile('blocks', 'folder');
createFolderOrFile('wallets', 'folder');

export const REQUEST_TIMEOUT = 5000;
export const KADOCOIN_VERSION = '1.0.0';
export const MAX_WEIGHT_TXN = 1.5 * 1024 * 1024; // 1.5 MB
export const P2P_PORT = prod ? 5346 : 15346;
export const hardCodedPeers = prod
  ? [{ host: '173.16.164.35', port: P2P_PORT }]
  : [
      // { host: '192.168.0.155', port: P2P_PORT }, // ABUJA
      { host: '192.168.0.2', port: P2P_PORT }, // MAC
      { host: '192.168.0.147', port: P2P_PORT }, // ABUJA
    ];

/**
 * PORT
 */
export const DEFAULT_PORT = 2000;
let DEV_PEER_PORT = 0;

if (process.env.GENERATE_DEV_PEER_PORT === 'true')
  DEV_PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);

export const PORT = DEV_PEER_PORT || DEFAULT_PORT;

// SAMPLE SEED DATA
export const sampleDataForTests = {
  id: '2d5791f0-d9af-11eb-ac13-099d1d20fcfc',
  output: {
    '0xC6d23c6703f33F5ad74E6E4fc17C1CE9397D4AAD': '770.00000000',
    '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '230.00000000',
  },
  input: {
    timestamp: 1625063196815,
    amount: '1000.00000000',
    address: '0xC6d23c6703f33F5ad74E6E4fc17C1CE9397D4AAD',
    publicKey:
      '0460eeaa6a2393801ca90356bab01b6d206b9a431d8475f3ebff6999eef7199ad0b0f98e2aa354b24386b072553071dfe100574667584c11b518ea1e36ba959bb4',
    signature: '7fd13c4a4175fda39615766a5f0bfce40c0aeccd1d38c5f9e2ab7f8744ac26e2',
  },
};

export const sampleBlocks = [
  {
    timestamp: 1626071497054,
    lastHash: '*None*',
    hash: '*None*',
    transactions: [],
    nonce: 0,
    difficulty: 10,
    blockSize: '230',
    transactionVolume: '',
    blockReward: '',
    feeReward: '',
    blockchainHeight: 1,
    hashOfAllHashes: '91d7da959863806d9256aa7c48ddaf497fd3156825459fa0f754930320db9a69',
  },
  {
    timestamp: 1630978190500,
    lastHash: '*None*',
    hash: '006184d4751c4880ef0d732b76f8d46a17d395fbc9f0488a41f64f48b1468918',
    transactions: [
      {
        id: '1784b590-0f7b-11ec-968e-09008debbed9',
        output: {
          '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db': '960.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '40.00000000',
        },
        input: {
          timestamp: 1630978189162,
          amount: '1000.00000000',
          address: '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db',
          publicKey:
            '04903a1dfd7d49ebb3d6f69968da1da9a267dea75a303eada48985cddd4197547ae706e45dd389be0f3a22fbf962a7420a902cc97877e52d84e73c18aa23990e05',
          signature: {
            r: 'da0f4b658758032fa567e753d5202491caaacc285af17c83c3d2bb4407ac02a9',
            s: '187c538ddcd3fb647fc065e7d95cc0653bcecaa6862f28d6ce77d714078b67ec',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '184e4720-0f7b-11ec-968e-09008debbed9',
        output: {
          '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db': '50.00000000',
        },
        input: {
          timestamp: 1630978215295,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db',
          signature: '',
        },
      },
    ],
    nonce: 775,
    difficulty: 9,
    blockSize: '1,078',
    transactionVolume: '90.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 2,
    hashOfAllHashes: 'c8013ff364db13877c33be317e437c31d07841bc52be28dc5a7a256d54cb0359',
  },
  {
    timestamp: 1630978198123,
    lastHash: '006184d4751c4880ef0d732b76f8d46a17d395fbc9f0488a41f64f48b1468918',
    hash: '00d62f8d1f23049cfd68ef1507f811e9593ce7ba525772ceeb0ed5476d75071e',
    transactions: [
      {
        id: '1c681520-0f7b-11ec-968e-09008debbed9',
        output: {
          '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db': '609.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '401.00000000',
        },
        input: {
          timestamp: 1630978197362,
          amount: '1010.00000000',
          address: '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db',
          publicKey:
            '04d4d9b0a09853a8d886360ae13bf5a25208e8c666982b5a0d3a80c2e91fb7fe6ec0c737cfeadac1ab8cdf67f5da723db7e124c45ccef07f10d53fe0b2103cb69f',
          signature: {
            r: '59ffb668d278c5f08be5faa1932c7ceccdfdd738c26e4140862b2839dcaefb28',
            s: '55a6d08a2ae010491e408c527383a82a7c607217b119621748942afcf517a8e7',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '1cda37e0-0f7b-11ec-968e-09008debbed9',
        output: {
          '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db': '50.00000000',
        },
        input: {
          timestamp: 1630978215295,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db',
          signature: '',
        },
      },
    ],
    nonce: 713,
    difficulty: 8,
    blockSize: '1,137',
    transactionVolume: '451.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 3,
    hashOfAllHashes: 'cb68c6919b47540b9bd486acb98157c1def50c3892cd7ac38681af61d9e0aca2',
  },
  {
    timestamp: 1630978209324,
    lastHash: '00d62f8d1f23049cfd68ef1507f811e9593ce7ba525772ceeb0ed5476d75071e',
    hash: '00728fe9b45d40a6a4d75187853291f729ff8047d7b68744d5a5378b6de29850',
    transactions: [
      {
        id: '23016210-0f7b-11ec-968e-09008debbed9',
        output: {
          '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db': '657.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '2.00000000',
        },
        input: {
          timestamp: 1630978208433,
          amount: '659.00000000',
          address: '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db',
          publicKey:
            '04d4d9b0a09853a8d886360ae13bf5a25208e8c666982b5a0d3a80c2e91fb7fe6ec0c737cfeadac1ab8cdf67f5da723db7e124c45ccef07f10d53fe0b2103cb69f',
          signature: {
            r: 'b7406825e88766806ee2f4c7bb240e0ecaaa9ddf45ef90f0e817ce98cd5c7d4f',
            s: '8931f137e1e09d58c68a572b5fc629d80c1d6edddc9f671fe1c63b1fa321252a',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '23892fb0-0f7b-11ec-968e-09008debbed9',
        output: {
          '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db': '50.00000000',
        },
        input: {
          timestamp: 1630978215295,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db',
          signature: '',
        },
      },
    ],
    nonce: 64,
    difficulty: 7,
    blockSize: '1,133',
    transactionVolume: '52.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 4,
    hashOfAllHashes: 'f2c2a3f535f5f454de471efe35ef031c4ec1790e3bab9ad1fd7d3ea582588c23',
  },
  {
    timestamp: 1630978215296,
    lastHash: '00728fe9b45d40a6a4d75187853291f729ff8047d7b68744d5a5378b6de29850',
    hash: '01bd05b3afc7331be50c77adf25ed8a159f8aee52efc93134703c5373f296d7c',
    transactions: [
      {
        id: '26ca50f0-0f7b-11ec-968e-09008debbed9',
        output: {
          '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db': '704.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '3.00000000',
        },
        input: {
          timestamp: 1630978214783,
          amount: '707.00000000',
          address: '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db',
          publicKey:
            '04d4d9b0a09853a8d886360ae13bf5a25208e8c666982b5a0d3a80c2e91fb7fe6ec0c737cfeadac1ab8cdf67f5da723db7e124c45ccef07f10d53fe0b2103cb69f',
          signature: {
            r: '539141f01b52623a89c1a6fb56764d2917ba9fedf92373f58d1484d6fc42d5be',
            s: '100101e7ca5b5faf0d0037ee95c51d2deb270ed38f3d303f737399145052f364',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '271870f0-0f7b-11ec-968e-09008debbed9',
        output: {
          '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db': '50.00000000',
        },
        input: {
          timestamp: 1630978215295,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x1dcc99E8Da20FF2455461B6b4Afd7283E554A2Db',
          signature: '',
        },
      },
    ],
    nonce: 22,
    difficulty: 6,
    blockSize: '1,133',
    transactionVolume: '53.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 5,
    hashOfAllHashes: 'd78e916cfa852700cc0a16cbcddb11b27d473c289e1a45f4f54a600457a22909',
  },
];

export const sampleBlocks2: any = [
  {
    timestamp: 1626071497054,
    lastHash: '*None*',
    hash: '*None*',
    transactions: [],
    nonce: 0,
    difficulty: 10,
    blockSize: '230',
    transactionVolume: '',
    blockReward: '',
    feeReward: '',
    blockchainHeight: 1,
    hashOfAllHashes: '91d7da959863806d9256aa7c48ddaf497fd3156825459fa0f754930320db9a69',
  },
  {
    timestamp: 1639529004803,
    lastHash: '*None*',
    hash: '003a728ebd0eb5102bfb26f8097fa05c595b4129fe2e0d70eb510edddc1eb6b8',
    transactions: [
      {
        id: '01fc8820-5d40-11ec-a377-d1fb9d5079b4',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '997.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '3.00000000',
        },
        input: {
          timestamp: 1639529003426,
          amount: '1000.00000000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'aeaed0133f11212bf84d65ffef015d65db6a8a6ee84a8783a51fb82848e2fb56',
            s: '553c26fb54e4e2aa3b89b20546747fe6c7e1e7824e2118c89ec748ce0ba9c3da',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '02ce3000-5d40-11ec-a377-d1fb9d5079b4',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639529004800,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 143,
    difficulty: 9,
    blockSize: '917',
    transactionVolume: '53.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 2,
    hashOfAllHashes: 'e441fa5b8596b8aa5f56533f9ecd80d9de98fe697895323e321f824c8cb4cab6',
  },
  {
    timestamp: 1639529009447,
    lastHash: '003a728ebd0eb5102bfb26f8097fa05c595b4129fe2e0d70eb510edddc1eb6b8',
    hash: '00062eb6bcfc47d01e11fa6bcb35b91acba1fb08a4a1dcf1b1027d19231faaa1',
    transactions: [
      {
        id: '0501fff0-5d40-11ec-a377-d1fb9d5079b4',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1044.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '3.00000000',
        },
        input: {
          timestamp: 1639529008495,
          amount: '1047.00000000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'a6c60f22ab0d0ef9da19b357fdec3a2ab6e0e0eeba659f373e85a407f219d3a4',
            s: '10ca3f5dfa3a8a57bd0aafb6c214104024db4723d03166b41e3c7255a915eb88',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '058dec40-5d40-11ec-a377-d1fb9d5079b4',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639529009412,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 2596,
    difficulty: 10,
    blockSize: '978',
    transactionVolume: '53.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 3,
    hashOfAllHashes: '85d6147d386b399f3c6cc7b78bf80438510cdc921bd65023683aa9841c65e0db',
  },
  {
    timestamp: 1639529012501,
    lastHash: '00062eb6bcfc47d01e11fa6bcb35b91acba1fb08a4a1dcf1b1027d19231faaa1',
    hash: '0018bc8b1a97561e83087339c92d0afc2ffc7b36e43289d127e9cd9e2a0783c1',
    transactions: [
      {
        id: '07433d60-5d40-11ec-a377-d1fb9d5079b4',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1091.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '3.00000000',
        },
        input: {
          timestamp: 1639529012278,
          amount: '1094.00000000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '755acfe81214683540d338b724a11925657d9361e43e2fd68e8288c1302ebf6c',
            s: 'ac7b3f79c58fc5f20f957b7c12f01d9f7ba7fb4549db4d111a3c036cd7ff3c58',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '076125a0-5d40-11ec-a377-d1fb9d5079b4',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639529012474,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 2635,
    difficulty: 11,
    blockSize: '978',
    transactionVolume: '53.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 4,
    hashOfAllHashes: '269d5606429251137c051a17816144cec5a790fe54439e3f8b23fa3de9a3ddbb',
  },
  {
    timestamp: 1639541605816,
    lastHash: '0018bc8b1a97561e83087339c92d0afc2ffc7b36e43289d127e9cd9e2a0783c1',
    hash: '001cbea15c20062c76ba4e43bbad1f43cbdf5f6ebcaf2d568926621e153cb352',
    transactions: [
      {
        id: '4ede0e80-5d5d-11ec-a377-d1fb9d5079b4',
        output: {
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '1007.00000000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '2.00000000',
        },
        input: {
          timestamp: 1639541587818,
          amount: '1009.00000000',
          address: '0x86045b56bfeb1A35C6818081130BA0F789dc27c9',
          publicKey:
            '04e612c45e19259c6465a7a8cbc31645630d8a0472dc866dd682754d11937b2f4812f2da382aea22ac757dce4fa1b578f8f65ec5cde31ffbc67baeb7b9730a2ad8',
          signature: {
            r: '5d058e2e92ea93bedd6d05ce4b6cccf7cef9b1207fe26329f3b4405d7a15f567',
            s: '19a8ef1da26f85fc494393e0369b19703e8395e6e0737270b49dd9b4d49e770d',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '59982e50-5d5d-11ec-a377-d1fb9d5079b4',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639541605813,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 17,
    difficulty: 10,
    blockSize: '976',
    transactionVolume: '52.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 5,
    hashOfAllHashes: 'f91d2ab43ecdda891551462f51075f0be0a1ad19c947df9d980496f77929131e',
  },
  {
    timestamp: 1639541715898,
    lastHash: '001cbea15c20062c76ba4e43bbad1f43cbdf5f6ebcaf2d568926621e153cb352',
    hash: '001359480886860eb95d1c6a05cdb621573da2f4ae95fd2e96d862c314367853',
    transactions: [
      {
        id: '9ab61a50-5d5d-11ec-a377-d1fb9d5079b4',
        output: {
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '964.00000000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '40.00000000',
        },
        input: {
          timestamp: 1639541715061,
          amount: '1004.00000000',
          sendFee: '3.00000000',
          address: '0x86045b56bfeb1A35C6818081130BA0F789dc27c9',
          publicKey:
            '04e612c45e19259c6465a7a8cbc31645630d8a0472dc866dd682754d11937b2f4812f2da382aea22ac757dce4fa1b578f8f65ec5cde31ffbc67baeb7b9730a2ad8',
          signature: {
            r: '7e5ba85893c3635d69b4d38f7045da87150cb0de0bedc4dd2fb6cf82885e055d',
            s: 'e70bfe6386b278740802eda06d85102d1525b0dca4c6155a68b44a02f9b6151f',
            recoveryParam: 0,
          },
          message: 'fatima',
        },
      },
      {
        id: '9b347210-5d5d-11ec-a377-d1fb9d5079b4',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '53.00000000' },
        input: {
          timestamp: 1639541715889,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 399,
    difficulty: 9,
    blockSize: '1,008',
    transactionVolume: '93.00000000',
    blockReward: '50.00000000',
    feeReward: '3.00000000',
    blockchainHeight: 6,
    hashOfAllHashes: 'b850041b42dbc5e00330e036f6739befc24539c6e723c2d5569253bc4f050fac',
  },
  {
    timestamp: 1639621295390,
    lastHash: '001359480886860eb95d1c6a05cdb621573da2f4ae95fd2e96d862c314367853',
    hash: '00acbbc3c851f205c33e095cbcd3ce21fa3f02a95d526a94885becf6d0565b0d',
    transactions: [
      {
        id: '720c4160-5e16-11ec-8a76-f511b266fed2',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1160.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '80.00000000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '4.00000000',
        },
        input: {
          timestamp: 1639621250302,
          amount: '1244.00000000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '22a2811775f5f42eec536baf4501f5f679dbd53cb8ac752e36dd497683077a4b',
            s: 'c3ba972db5d68a46acb14f64b90389685dc418befc5d42194a5ebc3136d323f',
            recoveryParam: 1,
          },
        },
      },
      {
        id: 'e4487cd0-5e16-11ec-927d-190b383b6501',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639621295388,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 43,
    difficulty: 8,
    blockSize: '1,028',
    transactionVolume: '134.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 7,
    hashOfAllHashes: '33d9f5c670c07662f42176755212b33212c35b0e1275388afe1784da765d8034',
  },
  {
    timestamp: 1639848142758,
    lastHash: '00acbbc3c851f205c33e095cbcd3ce21fa3f02a95d526a94885becf6d0565b0d',
    hash: '00faba01e52b7dcdb4687e0653c05961c2803a10102b795e114309e852820ac6',
    transactions: [
      {
        id: 'b40fed60-6022-11ec-acf5-d7e53c3c74ee',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1090.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '120.00000000',
        },
        input: {
          timestamp: 1639848131685,
          amount: '1210.00000000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '9d42313893cb71d5e376aada378621ef4a2928d43f15438f2c7779e7de8a3211',
            s: '7aa6c97506bf3babc32aba24332971097011eb1c623d8a524ad3c66533f166b5',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '0fd9dd50-6027-11ec-8493-7b780cb7353c',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639848142756,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 24,
    difficulty: 7,
    blockSize: '977',
    transactionVolume: '170.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 8,
    hashOfAllHashes: '5225fd2438cbc794cb169daffc68bd1e633389f4d4a132895c3607d07a522e8e',
  },
  {
    timestamp: 1639848311742,
    lastHash: '00faba01e52b7dcdb4687e0653c05961c2803a10102b795e114309e852820ac6',
    hash: '02026aa5eef3053554c1c606eeef3645d0fc8cf0589e8d352f11c3ccccc35036',
    transactions: [
      {
        id: '744c47f0-6027-11ec-aafc-41cf3e864c10',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1098.11000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '41.89000000',
        },
        input: {
          timestamp: 1639848311280,
          amount: '1140.00000000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '56bf1179b02da15782fb3e3a9fc0907dae2d0b6e18832c2fdd3258f7a757864d',
            s: '387997b67086662a9613d637522f094a09a92c18a9cf2330971bef7e70e65961',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '74929fc0-6027-11ec-aafc-41cf3e864c10',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639848311740,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 69,
    difficulty: 6,
    blockSize: '976',
    transactionVolume: '91.89000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 9,
    hashOfAllHashes: '43d2547bba11c4492232328a585e71b9144058b3f464d738d94403e682a374af',
  },
  {
    timestamp: 1639866688222,
    lastHash: '02026aa5eef3053554c1c606eeef3645d0fc8cf0589e8d352f11c3ccccc35036',
    hash: '03fd89be43287f25f9758881626649fbad91ac6beb622046adf6a6b931e75742',
    transactions: [
      {
        id: '37c5a540-6051-11ec-a364-f33f299f85c2',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1148.10998000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '0.00002000',
        },
        input: {
          timestamp: 1639866248597,
          amount: '1148.11000000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'e0b1b5a4c3daf7dc0a6af707e5114517f46620004fadeb3f1fd067ca7d090640',
            s: '6c2d6d3b02158ea79bff2dc09e1c8ec399427548323c4e8da2bba1f7120d719d',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '3dcef1c0-6052-11ec-ae29-917c67b63f89',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639866688220,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 45,
    difficulty: 5,
    blockSize: '975',
    transactionVolume: '50.00002000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 10,
    hashOfAllHashes: 'f00db677d98d089a641bbd5744c34f9a6ac212872f2c3524da169ee89e4678e7',
  },
  {
    timestamp: 1639866987507,
    lastHash: '03fd89be43287f25f9758881626649fbad91ac6beb622046adf6a6b931e75742',
    hash: '065f5ae5583ad63af8e03bfca56a3807801fcf058fe052427d5671e37cad7836',
    transactions: [
      {
        id: 'ef950bb0-6052-11ec-93a9-497a34660188',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1198.10996000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '0.00002000',
        },
        input: {
          timestamp: 1639866986476,
          amount: '1198.10998000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'f904f5681bb0c479c6d1505e624ea1b0fc6278fe0a70135d9a8886f51ceb2647',
            s: '8da2f665927d8e5d7f7ecbc5b21afba4f399b1bd9b9dd06c03c87635562d0f95',
            recoveryParam: 1,
          },
        },
      },
      {
        id: 'f0325d20-6052-11ec-93a9-497a34660188',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639866987506,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 14,
    difficulty: 4,
    blockSize: '975',
    transactionVolume: '50.00002000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 11,
    hashOfAllHashes: '91624ed4d94f9004cb6337b1d7470fd5bd26f7179e9ab6ba279915f836080f67',
  },
  {
    timestamp: 1639867089470,
    lastHash: '065f5ae5583ad63af8e03bfca56a3807801fcf058fe052427d5671e37cad7836',
    hash: '1b2b348b959a383a0db7ef5da5ea4a7d251bfa18608c0898de0bf414fa834988',
    transactions: [
      {
        id: '2c93d280-6053-11ec-93a9-497a34660188',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1248.10994000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '0.00002000',
        },
        input: {
          timestamp: 1639867088808,
          amount: '1248.10996000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'c9f7774d1c0df38ca3fe6256807472d0d167a66b9f8bd0bb1eeb89f5d34f982c',
            s: '14f48ba3dd611f77e87226c4a79661187dc3d5fa62c7ac2ce610235380a03185',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '2cf8d5e0-6053-11ec-93a9-497a34660188',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639867089470,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 3,
    difficulty: 3,
    blockSize: '974',
    transactionVolume: '50.00002000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 12,
    hashOfAllHashes: '1150fd9c4b4c2b6c16f3e721e57298fe9852f2f406296711fafe16576db4916d',
  },
  {
    timestamp: 1639867147470,
    lastHash: '1b2b348b959a383a0db7ef5da5ea4a7d251bfa18608c0898de0bf414fa834988',
    hash: '257e86d0e453db41d461476e01022ce9bff8b70837df15ca55d30914536e46df',
    transactions: [
      {
        id: '4efda300-6053-11ec-afc6-8975c5973985',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1298.10992000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '0.00002000',
        },
        input: {
          timestamp: 1639867146544,
          amount: '1298.10994000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '5790bb26507925ae9b09f453364a8a316aad9c5abde7f2b5d2f0b7333394d006',
            s: 'c83fd9804f0bef5d0a1d4911e3bdf29141aa669f68da797f8c090576d5de5091',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '4f8aeee0-6053-11ec-afc6-8975c5973985',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639867147470,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 2,
    blockSize: '974',
    transactionVolume: '50.00002000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 13,
    hashOfAllHashes: 'a18a45b99e9b17be1880eb72327bf1d0bd94d651ad1c0a380865ddafcdadb733',
  },
  {
    timestamp: 1639867208270,
    lastHash: '257e86d0e453db41d461476e01022ce9bff8b70837df15ca55d30914536e46df',
    hash: '4da7eeb22f1550d30df0431cf5803af323a92d63da133673ccf7fbdbd5c6e6b2',
    transactions: [
      {
        id: '73c16910-6053-11ec-a157-5f2b5f0536c4',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1348.10990000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '0.00002000',
        },
        input: {
          timestamp: 1639867208226,
          amount: '1348.10992000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '65defaa64dfbd413f853169fcc30cf83c9e0877ad6652e0c64857156fe380def',
            s: '171ca77319ce5976d160fab29071419292d0fb0569b575445b0f3d7965501cf9',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '73c81fd0-6053-11ec-a157-5f2b5f0536c4',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639867208269,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 4,
    difficulty: 1,
    blockSize: '974',
    transactionVolume: '50.00002000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 14,
    hashOfAllHashes: '504c997dfd4b79fd0f52ae94860c5ef622d48a2efaa954dad2d3b34c78ceedbb',
  },
  {
    timestamp: 1639867275405,
    lastHash: '4da7eeb22f1550d30df0431cf5803af323a92d63da133673ccf7fbdbd5c6e6b2',
    hash: 'f5f49f2081adf86b936a462fc8112592bb900bf8dce9fe16e287bf50156e8022',
    transactions: [
      {
        id: '9b4d4fd0-6053-11ec-86b0-93e6023d45ee',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1398.10988000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '0.00002000',
        },
        input: {
          timestamp: 1639867274574,
          amount: '1398.10990000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '464685ae142f3a122df74f6ec38f061aeb41a4e9e58ae5554a1e9873c2dd4095',
            s: 'd9487dfbb220e7317deb34a8a32fd43ab53f1d81fd8943782930ba8e632b063e',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '9bcc43d0-6053-11ec-86b0-93e6023d45ee',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639867275405,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '974',
    transactionVolume: '50.00002000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 15,
    hashOfAllHashes: '4638ababa5f43a5b726ce1e28b7fcee4fac4d266c19e9a5f702ba4116413ff21',
  },
  {
    timestamp: 1639867649217,
    lastHash: 'f5f49f2081adf86b936a462fc8112592bb900bf8dce9fe16e287bf50156e8022',
    hash: '4126c3498266d949a301aa1275fa01d6157ae0162f54382aff7fedd419069a14',
    transactions: [
      {
        id: '6fd03c40-6054-11ec-9ae1-0f1a56719446',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1448.10986000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '0.00002000',
        },
        input: {
          timestamp: 1639867631108,
          amount: '1448.10988000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '44fe24109c9e534afd3689ae2ee629fd1b3a5180a3f75d3c1cc1619cff7183a5',
            s: '2ec94f611ffe3c589076cd4754b46501cfdfd2e57303bbefd066136552370009',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '7a9b7310-6054-11ec-9ae1-0f1a56719446',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639867649217,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 3,
    difficulty: 1,
    blockSize: '974',
    transactionVolume: '50.00002000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 16,
    hashOfAllHashes: '0904f46b8aa07e341b331fbbcbd2ca4a817c6f3e5c9160f5594b9bf90008ac65',
  },
  {
    timestamp: 1639868081353,
    lastHash: '4126c3498266d949a301aa1275fa01d6157ae0162f54382aff7fedd419069a14',
    hash: 'e162e5f40b35ed8851f573f707e1486a629dd22bd54170f300df6ddb08442ba2',
    transactions: [
      {
        id: '78876ab0-6055-11ec-8dc5-bffadb84f786',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1496.10986000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '2.00000000',
        },
        input: {
          timestamp: 1639868075227,
          amount: '1498.10986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '52d1b8b4ea4744f523b565c23f56d6107be413c94e9c773ae199bdd8f07a5f07',
            s: 'f4b73656b313a74d21ebbab671d971a875034156de1464de2a0b4a47ef61246a',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '7c2e2b90-6055-11ec-8dc5-bffadb84f786',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639868081353,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '974',
    transactionVolume: '52.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 17,
    hashOfAllHashes: '0994460b872fb29b419e76f4202a42d9be32f85e7e0a9ea8dc2733c31148e9af',
  },
  {
    timestamp: 1639871056968,
    lastHash: 'e162e5f40b35ed8851f573f707e1486a629dd22bd54170f300df6ddb08442ba2',
    hash: '792e1bb756bbf5a6db2c9509521cc13d2f5390b64b16d5c539e6a34dd32803f2',
    transactions: [
      {
        id: '7eca7290-605b-11ec-9b33-e9332cc82407',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1542.10986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '4.00000000',
        },
        input: {
          timestamp: 1639871050713,
          amount: '1546.10986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '58d9f125792028651cc7cfc99af708e2cec5000a32fe07d93ece7284c6807f26',
            s: '9895dc39da47e10e109e64a00f27f759ff064727292641ba865587c0d751a69a',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '69c8fc80-605c-11ec-83a1-65de50f93d4d',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639871056967,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 1,
    blockSize: '974',
    transactionVolume: '54.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 18,
    hashOfAllHashes: '719b783735682a91fc81959de2df93e59e50a14667bd65c174ee2f256e967d4d',
  },
  {
    timestamp: 1639871234313,
    lastHash: '792e1bb756bbf5a6db2c9509521cc13d2f5390b64b16d5c539e6a34dd32803f2',
    hash: '09e99872a503aea4bea36b22ca06c036d83ba548e8f3c37094cfcbce99c67afe',
    transactions: [
      {
        id: 'd1448870-605c-11ec-93bd-d7de99f8f593',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1590.10986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '2.00000000',
        },
        input: {
          timestamp: 1639871230583,
          amount: '1592.10986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '39d0a1aff552e337464b3c14c959e9682208aab04a3ae63a36efb6be964786fb',
            s: '36c341a06b636f0bbfa5aa84a2b997c7728f0928e265af7c786980de26dda03d',
            recoveryParam: 0,
          },
        },
      },
      {
        id: 'd37daf90-605c-11ec-93bd-d7de99f8f593',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639871234313,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '974',
    transactionVolume: '52.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 19,
    hashOfAllHashes: 'dec3543b57b7a3d8fab1aa05f9041ae3f301d80f0c8a6ca173295c84a58f9ece',
  },
  {
    timestamp: 1639871906823,
    lastHash: '09e99872a503aea4bea36b22ca06c036d83ba548e8f3c37094cfcbce99c67afe',
    hash: '213035f1c313c2de31e8050f4614024ac79e4ec2831af431d587dd5ebfffa187',
    transactions: [
      {
        id: '5c460dd0-605e-11ec-a969-958fa22a4fd2',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1638.10986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '2.00000000',
        },
        input: {
          timestamp: 1639871893293,
          amount: '1640.10986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'f2c1e9c46d436c9a64e82ea36a4dbbae5a630ad9dd00893d1c05bd093b1e36e6',
            s: 'e5ff600a5c6cf9c69800e65f3ffb0d0b5db8a5e268dd29895b81810121d9f782',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '64569170-605e-11ec-a969-958fa22a4fd2',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639871906823,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 1,
    blockSize: '974',
    transactionVolume: '52.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 20,
    hashOfAllHashes: 'b31da582016bcb22afb0f7dfc73eb7e2588c0602875998fa8d59a754292caadb',
  },
  {
    timestamp: 1639871919688,
    lastHash: '213035f1c313c2de31e8050f4614024ac79e4ec2831af431d587dd5ebfffa187',
    hash: '31689834033c77e40970db3172577a5f408f7bbc9507b64bfd68fb3aa42969b5',
    transactions: [
      {
        id: '6b895f40-605e-11ec-a969-958fa22a4fd2',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1686.10986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '2.00000000',
        },
        input: {
          timestamp: 1639871918900,
          amount: '1688.10986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'b4e2b7ea108cd0897adcf20b934d1779f4b340d4f8bc0a38894f9b7752d029bb',
            s: '45a1479b0db3120aac9ce72a414cee9838f8099bceadfadf2328c89856859ba4',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '6c019c80-605e-11ec-a969-958fa22a4fd2',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1639871919688,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '974',
    transactionVolume: '52.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 21,
    hashOfAllHashes: '79faa70d58061708cf2e82d1a424f218523832d1be0cb13ef85afb7fe33b03ec',
  },
  {
    timestamp: 1639871925412,
    lastHash: '31689834033c77e40970db3172577a5f408f7bbc9507b64bfd68fb3aa42969b5',
    hash: '0bef17631a265a091cae05c0e22df52973526fb488566ce68a1ff36f54b68ae3',
    transactions: [
      {
        id: '6f047c40-605e-11ec-a969-958fa22a4fd2',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1725.10986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '2.00000000',
        },
        input: {
          timestamp: 1639871924740,
          amount: '1727.10986000',
          sendFee: '9.00000000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'ad0481e261be55c36f279655c6e770dadc04cd3d29f0c61ba6e81d4801826461',
            s: '2fdf14ecd4c57b3939143f8093b48b89dee069f9fe3fd6cc626dcf97a419566a',
            recoveryParam: 1,
          },
          message: 'New home page',
        },
      },
      {
        id: '6f6b0640-605e-11ec-a969-958fa22a4fd2',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '59.00000000' },
        input: {
          timestamp: 1639871925412,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 1,
    blockSize: '1,013',
    transactionVolume: '61.00000000',
    blockReward: '50.00000000',
    feeReward: '9.00000000',
    blockchainHeight: 22,
    hashOfAllHashes: '21c98a8e989435a96f398bd065076db3a70bd790d18699ae2340f5ebd31b95ed',
  },
  {
    timestamp: 1639871931587,
    lastHash: '0bef17631a265a091cae05c0e22df52973526fb488566ce68a1ff36f54b68ae3',
    hash: '9d2fc61ce3c059732f4cbb477331d1a0d8e0b811ca69a23f3392b2a8d65e7615',
    transactions: [
      {
        id: '72cd4410-605e-11ec-a969-958fa22a4fd2',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1773.10986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '2.00000000',
        },
        input: {
          timestamp: 1639871931089,
          amount: '1775.10986000',
          sendFee: '9.00000000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'cf2f2549659b0d815ef4b29cefea65dfc66933d85760675b51c93236b01b70f8',
            s: 'a5e91ff8280d49d3532dfbc87461a0fbf0fb6435512d246efeef323c83b3a523',
            recoveryParam: 0,
          },
          message: 'New home page',
        },
      },
      {
        id: '73194130-605e-11ec-a969-958fa22a4fd2',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '59.00000000' },
        input: {
          timestamp: 1639871931587,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '1,013',
    transactionVolume: '61.00000000',
    blockReward: '50.00000000',
    feeReward: '9.00000000',
    blockchainHeight: 23,
    hashOfAllHashes: 'ad4c8f71fa2b9d1a7874685aacc1989dfc8ad78d2c5a51b9fc884937c0af61e4',
  },
  {
    timestamp: 1640118785708,
    lastHash: '9d2fc61ce3c059732f4cbb477331d1a0d8e0b811ca69a23f3392b2a8d65e7615',
    hash: '486bd12598ba4bc148e3259ad452a6e3ced14c8d052b0631b064dd8eaa55b58f',
    transactions: [
      {
        id: 'c8231190-607e-11ec-af95-1f32513a53e3',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1824.10981000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '6.00000000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '2.00000000',
        },
        input: {
          timestamp: 1640115538758,
          amount: '1832.10981000',
          sendFee: '0.00005000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '8dbfd37b47be2b2d19b976166b507db3367930c9b65c564efdb5220b9a3713c0',
            s: 'ac14d4e393a986f9e94cb3e27e56f81c21abea0bc5545838e9f3fd1b65093dce',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '339eb7b0-629d-11ec-8ad1-8d19cdd50b87',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00005000' },
        input: {
          timestamp: 1640118785706,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 1,
    blockSize: '1,045',
    transactionVolume: '58.00005000',
    blockReward: '50.00000000',
    feeReward: '0.00005000',
    blockchainHeight: 24,
    hashOfAllHashes: 'fdbcd1e92b97a750a2bb2d890df0476e6109ee1b16cb73f2a2284d28f0631019',
  },
  {
    timestamp: 1640215598241,
    lastHash: '486bd12598ba4bc148e3259ad452a6e3ced14c8d052b0631b064dd8eaa55b58f',
    hash: 'c18d1dcc496840ce790a4be3c0d5ab12e692741deef1ef30411ec7bbe0617f77',
    transactions: [
      {
        id: '45522a10-6332-11ec-8ad1-8d19cdd50b87',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1858.10986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '12.00000000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '4.00000000',
        },
        input: {
          timestamp: 1640200676008,
          amount: '1874.10986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '33580c0203c9d7ad27d248d0f0e540b03ad46fa819c5a4f006d1595a8fdd706d',
            s: '9222a036dc1fdaf06263c9ee148a8145f4b03b81b7c8bb2b7919ebed3680a2f8',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '9c62ea00-637e-11ec-a8d2-1ffefc560854',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640215598239,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '1,028',
    transactionVolume: '66.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 25,
    hashOfAllHashes: 'f315d167f9d1251b9a2283856517753f3b0aff7b611e7a045676055f2ac36eb0',
  },
  {
    timestamp: 1640216200370,
    lastHash: 'c18d1dcc496840ce790a4be3c0d5ab12e692741deef1ef30411ec7bbe0617f77',
    hash: '70826e5e5058cc7b4829d9d7c08d33ed35121e267fb9d8fcef350e2a07e4f3bf',
    transactions: [
      {
        id: '00437f70-6380-11ec-823f-dd1972fe6941',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1866.21986000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '41.89000000',
        },
        input: {
          timestamp: 1640216195304,
          amount: '1908.10986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '60d467a7857cd468eacf4669ee20c484699eba5fef09f2c2d9b1dac89e5ba4e0',
            s: 'fe45d4f9466862483f745046489c51f32a73e39a904454954971d6d13491f37c',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '03488210-6380-11ec-823f-dd1972fe6941',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640216200369,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 1,
    blockSize: '975',
    transactionVolume: '91.89000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 26,
    hashOfAllHashes: '442432024482b26573a977ad8ceed635bc862f63b0edafb395cc2e92c0645c83',
  },
  {
    timestamp: 1640216569943,
    lastHash: '70826e5e5058cc7b4829d9d7c08d33ed35121e267fb9d8fcef350e2a07e4f3bf',
    hash: 'e3ea763aeb31eef4aae57a03afe9db4c4379652fad7115b3056a388da2f68c0b',
    transactions: [
      {
        id: 'df8594c0-6380-11ec-846d-678617222eaa',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1716.21986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '200.00000000',
        },
        input: {
          timestamp: 1640216569868,
          amount: '1916.21986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'a5f44b1435a6bb355b1816b3882fcf149e773155629e46caac0e47df91b89cc1',
            s: 'b2f600b03887667a2390a490f55d8460273e9a1aa19e00b00df3b12acf4472ef',
            recoveryParam: 0,
          },
        },
      },
      {
        id: 'df90df60-6380-11ec-846d-678617222eaa',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640216569942,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '976',
    transactionVolume: '250.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 27,
    hashOfAllHashes: 'edb9b2024e91138422cab4b3b47a55e22ce621828b15e506a33248a35b66009f',
  },
  {
    timestamp: 1640216879385,
    lastHash: 'e3ea763aeb31eef4aae57a03afe9db4c4379652fad7115b3056a388da2f68c0b',
    hash: '6c38708db85aff479206fd99bcb0f628d033b041a1b0f4b7d1f070895ff5937c',
    transactions: [
      {
        id: '8f08c390-6381-11ec-bfd8-3329967069cf',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1566.21986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '200.00000000',
        },
        input: {
          timestamp: 1640216864329,
          amount: '1766.21986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '4e712345fa4c5f337fc7a0ccaff199d07d5f9e2a706f9b682bf096bca0860c4f',
            s: '2f81adc838c0124e8f39aba4cb0879774208e7623d8fe7f03497ece1f28b4ef1',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '9801f980-6381-11ec-bfd8-3329967069cf',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640216879384,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 2,
    difficulty: 1,
    blockSize: '976',
    transactionVolume: '250.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 28,
    hashOfAllHashes: 'd943fd302bf322d60f2c1dad7f8bf101ef7fd64c610a93a51566d139f1292ca9',
  },
  {
    timestamp: 1640216920166,
    lastHash: '6c38708db85aff479206fd99bcb0f628d033b041a1b0f4b7d1f070895ff5937c',
    hash: 'cb9e91fa87b33547008e3880fb8282e184d372ad76a28accf9bf02f0f622e0a4',
    transactions: [
      {
        id: 'afb15c10-6381-11ec-bfd8-3329967069cf',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1416.21986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '200.00000000',
        },
        input: {
          timestamp: 1640216919121,
          amount: '1616.21986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'f074b02bd42e9dd31b42661cfcd24038e2a91bffb3c8eb9a111b38bd63a42313',
            s: 'b70e8c0c323c3d4d31126f9bfb5804d7f3ecf3d5cf3069a9462a9ba1d040047d',
            recoveryParam: 0,
          },
        },
      },
      {
        id: 'b050d060-6381-11ec-bfd8-3329967069cf',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640216920166,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '976',
    transactionVolume: '250.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 29,
    hashOfAllHashes: 'ff43e1572ae35999413fd6fadced75b00b4a6a7b61a11b48848dfa248a3a56c2',
  },
  {
    timestamp: 1640256206197,
    lastHash: 'cb9e91fa87b33547008e3880fb8282e184d372ad76a28accf9bf02f0f622e0a4',
    hash: '53df301753435a3ef58e8fe7bbc7f95e3ce0e74e454522065eaaee1c6063bffa',
    transactions: [
      {
        id: '27ebf4a0-63dd-11ec-9910-bd4e8b19c058',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1433.21986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '33.00000000',
        },
        input: {
          timestamp: 1640256205034,
          amount: '1466.21986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '7f609f60360f946b2c1aecf13d8e9fac47b8b3542ad9675aa8c52fc1592f7f0d',
            s: 'e6ac4c08b41237d1ff04a308e15378fce2a2ac62af2834cc5b4f8b1938dd53a6',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '289d6a50-63dd-11ec-9910-bd4e8b19c058',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640256206197,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 1,
    blockSize: '975',
    transactionVolume: '83.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 30,
    hashOfAllHashes: '0748c1764acef9248527f2b78a9e034fa09c9e37c04535f5e8ddfeae54f9117e',
  },
  {
    timestamp: 1640256388379,
    lastHash: '53df301753435a3ef58e8fe7bbc7f95e3ce0e74e454522065eaaee1c6063bffa',
    hash: 'e096d25a26d848b06d1998fc4fead130adf56b9a1703962e23945e93cf6d690a',
    transactions: [
      {
        id: '94cb33b0-63dd-11ec-9910-bd4e8b19c058',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1480.21986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '3.00000000',
        },
        input: {
          timestamp: 1640256387691,
          amount: '1483.21986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'a3b6eeada7ec3376629b8ae61e9211e0ba4b92510ddb70d4a7089edf64a78661',
            s: '202bcd6175ce8ba9b53475387aba7fdc251f207f6f5ee30cf3c5aa154fe8fe7a',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '95342eb0-63dd-11ec-9910-bd4e8b19c058',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640256388379,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '974',
    transactionVolume: '53.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 31,
    hashOfAllHashes: '6189b3946c940ca6b8bc2704d2b25ed99f1f5a8582d11e61da87ecdc83f750a8',
  },
  {
    timestamp: 1640256466333,
    lastHash: 'e096d25a26d848b06d1998fc4fead130adf56b9a1703962e23945e93cf6d690a',
    hash: '7fdffe51ef27905d22f788db877692a914ac7dea47e72e36e9d13cf2f8e35337',
    transactions: [
      {
        id: 'c2b50c10-63dd-11ec-a0a0-1907b2a2b868',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1490.21986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '40.00000000',
        },
        input: {
          timestamp: 1640256464722,
          amount: '1530.21986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'd6ad19a6adbaf5ea5fcbed41d5ac4e50200be6745d3580ce96b6d6c5dfdc582c',
            s: '86a1d2b0b9e667b75d168fec42c77c930063a5f3b415ff480335a0c065cd03ce',
            recoveryParam: 1,
          },
        },
      },
      {
        id: 'c3ab04d0-63dd-11ec-9910-bd4e8b19c058',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640256466333,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 2,
    difficulty: 1,
    blockSize: '975',
    transactionVolume: '90.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 32,
    hashOfAllHashes: '705c1999fe4840ef5fdde32d5c2b2de39e8ef12d388b92b1ce28eb08b8c051e2',
  },
  {
    timestamp: 1640256774795,
    lastHash: '7fdffe51ef27905d22f788db877692a914ac7dea47e72e36e9d13cf2f8e35337',
    hash: '9d7343ec93f0cb05cc82ce32fb03d4b985c6c41a632339c297b393ce60e6c1ef',
    transactions: [
      {
        id: 'd92e1180-63dd-11ec-a0a0-1907b2a2b868',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1458.21986000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '42.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '40.00000000',
        },
        input: {
          timestamp: 1640256725453,
          amount: '1540.21986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'b435a6950659bb903ee25c30dc44be892f8696ffdb22c095d1ccc6add861241d',
            s: 'b2af2640f6ebcd1818653d1512db3dd8f90b8fd298378f5ed78b40ce288dcfd',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '7b8695b0-63de-11ec-a0a0-1907b2a2b868',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640256774795,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '1,028',
    transactionVolume: '132.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 33,
    hashOfAllHashes: '6fcacc60632f85d6c5ce252ff3a7a3745e5c3e3cb665a264b9890682179b5c0f',
  },
  {
    timestamp: 1640834304955,
    lastHash: '9d7343ec93f0cb05cc82ce32fb03d4b985c6c41a632339c297b393ce60e6c1ef',
    hash: '47ff74b42b9960de8a70b177cf4ad23c4c55d4818df9c0b67989fcbc82087d86',
    transactions: [
      {
        id: '1a927030-691f-11ec-a626-dba2329d2eba',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1552.21986000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '40.00000000',
        },
        input: {
          timestamp: 1640834285235,
          amount: '1592.21986000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'c1133df61b79249002287730f3a8cd3f8f253ff537db51f41f378b08eb00f913',
            s: '5d6c422c28ae4b90ae96f6f5174a751aaa0348e60bd430f280ff2b0dbb5f3930',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '265378b0-691f-11ec-a626-dba2329d2eba',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640834304955,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 5,
    difficulty: 1,
    blockSize: '975',
    transactionVolume: '90.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 34,
    hashOfAllHashes: '361e28197dcbc7249911c5b50de1bd2e4a1a441dbe6863e232605f2aba3d9833',
  },
  {
    timestamp: 1640926487760,
    lastHash: '47ff74b42b9960de8a70b177cf4ad23c4c55d4818df9c0b67989fcbc82087d86',
    hash: '9f298a9ed216c4482fc7e49922ff733581614fa7ca1f0ea04586a744ba3903c7',
    transactions: [
      {
        id: '47d9d3b0-69f3-11ec-85da-ddec7fa79d80',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '6444.00020000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '200.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '40.00000000',
        },
        input: {
          timestamp: 1640925426698,
          amount: '6684.00020000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '20245087d1221ff17f95e601365c38d52e0363cd3f9608c2948522c7d3ee3c13',
            s: '98b0b94a5f3f5726b66c80b84167afc12a7fdfeb5b954e1baf0e25a9c335057f',
            recoveryParam: 0,
          },
        },
      },
      {
        id: 'c78f3d00-69f5-11ec-9f26-ef7d9fb48c45',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640926487760,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '1,030',
    transactionVolume: '290.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 35,
    hashOfAllHashes: '736508fc87954616f922f602ca57a106737837f1e4d5b3741a24b844c362d54a',
  },
  {
    timestamp: 1640977466232,
    lastHash: '9f298a9ed216c4482fc7e49922ff733581614fa7ca1f0ea04586a744ba3903c7',
    hash: '0fb7ad7f8cbd6dbc7293b5d4546c04b39cf316740c9563d11d4d4ea84d32193b',
    transactions: [
      {
        id: '710862f0-6a6c-11ec-bdaa-7736d614a5b6',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1700.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '21.00005000',
        },
        input: {
          timestamp: 1640977452704,
          amount: '1721.00005000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '1e998051ce560a5da579bde03927bc5b5c6d0cf736bbbed833824e149ffc9420',
            s: '7db8034414ec12c5914b3889cfea69e6ebc90380533daaedc5504f3dcb0b8c4d',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '79189870-6a6c-11ec-bdaa-7736d614a5b6',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640977466231,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 3,
    difficulty: 1,
    blockSize: '975',
    transactionVolume: '71.00005000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 36,
    hashOfAllHashes: 'edfe6b2e1e706cbe63efedc47ba2aea12f1fefe3e19e76f4a34b3ce54ee9744c',
  },
  {
    timestamp: 1640977503689,
    lastHash: '0fb7ad7f8cbd6dbc7293b5d4546c04b39cf316740c9563d11d4d4ea84d32193b',
    hash: 'cf88263700b2d20d6e5da5d644903e806a483ab67c62490d2728dedcd8b18d28',
    transactions: [
      {
        id: '8cebf950-6a6c-11ec-bdaa-7736d614a5b6',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1700.00000000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '71.00005000',
        },
        input: {
          timestamp: 1640977499493,
          amount: '1771.00005000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'aaa9b8984c610921592d421d2ddf9a9a464c137ccc53b78384fea6ec0558ff0c',
            s: '39ba2ad6a5c75f2aab91d8d7089150afcbb5b9c1c57d375d05fdfa9a05fdfad8',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '8f6c3b90-6a6c-11ec-bdaa-7736d614a5b6',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640977503689,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '975',
    transactionVolume: '121.00005000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 37,
    hashOfAllHashes: 'a89b8993256254f86e47b0e8e3a4b4dab352d3c0ecac3d8daf402af21704226e',
  },
  {
    timestamp: 1640977941340,
    lastHash: 'cf88263700b2d20d6e5da5d644903e806a483ab67c62490d2728dedcd8b18d28',
    hash: '3937b2dc9563c7bd3f9f9d98f305007e5bd61df9d5f6b78d3addf37b68a33661',
    transactions: [
      {
        id: '91b5e800-6a6d-11ec-bbe7-775d95ac1892',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1781.00005000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '40.00000000',
        },
        input: {
          timestamp: 1640977937024,
          amount: '1821.00005000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'ea8c275659e804955aafb373fb6c9110d89b24cec237fc51dab635a2e1def679',
            s: '63923096ece2108d2e438890f2109c95df6db71e2e44b67980b9998b6c64ac73',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '944879c0-6a6d-11ec-bbe7-775d95ac1892',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640977941340,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 1,
    blockSize: '975',
    transactionVolume: '90.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 38,
    hashOfAllHashes: '8d8bdc0bdf2a28da85710e70224124be8abef7b66f04c853c15f52427b55229c',
  },
  {
    timestamp: 1640978094523,
    lastHash: '3937b2dc9563c7bd3f9f9d98f305007e5bd61df9d5f6b78d3addf37b68a33661',
    hash: 'd913e1fb21e4aed4c94c4e476fc27a47019a694c863db03250f14a5469c78b9b',
    transactions: [
      {
        id: 'e9c64f30-6a6d-11ec-80ec-e192aed31638',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1771.00005000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '100.00000000',
        },
        input: {
          timestamp: 1640978084771,
          amount: '1871.00005000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'e7e7140bb395896acfbfd607eb2f62a2a31fd055fea7a5f08f5268253eda5b9d',
            s: 'f4733290f6e76b5bb567d732402190e956d8678f57220d41096828cd1d39630e',
            recoveryParam: 0,
          },
        },
      },
      {
        id: 'ef9631a0-6a6d-11ec-80ec-e192aed31638',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640978094522,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '976',
    transactionVolume: '150.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 39,
    hashOfAllHashes: 'bfec8250e15549e4f0d615f6aa3d99bab5686ef22a44e258d6289a9992abf039',
  },
  {
    timestamp: 1640978356004,
    lastHash: 'd913e1fb21e4aed4c94c4e476fc27a47019a694c863db03250f14a5469c78b9b',
    hash: '497f0b4968571cd8740b22fe10db06855c7b5cd6f1385960cca8eb3d041a4370',
    transactions: [
      {
        id: '867fc4f0-6a6e-11ec-85ad-c5ed34918b88',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1881.00005000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '40.00000000',
        },
        input: {
          timestamp: 1640978347711,
          amount: '1921.00005000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '4fe2c69f24a2f32a2e905cabf765a89252f9361cee5c5520dd24c137e6ba66ab',
            s: '1ac0e550a8186332e29f00d3d612257b3198f60346465caf2f13c675313fdc7d',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '8b710730-6a6e-11ec-85ad-c5ed34918b88',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640978356003,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 3,
    difficulty: 1,
    blockSize: '975',
    transactionVolume: '90.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 40,
    hashOfAllHashes: 'ad8178ca01f247af4846bd3f5c21ea0610f72f4a408c0600854c658abf2ce40d',
  },
  {
    timestamp: 1640978679807,
    lastHash: '497f0b4968571cd8740b22fe10db06855c7b5cd6f1385960cca8eb3d041a4370',
    hash: 'ec4156706d34cf5fdbb70f2ee61246b6a88d644eb5c73181629fa28a44ea5e35',
    transactions: [
      {
        id: '4a654e30-6a6f-11ec-90dd-c3d86a1cbfec',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1931.00005000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '40.00000000',
        },
        input: {
          timestamp: 1640978676372,
          amount: '1971.00005000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'f067df69baf0907d2a1ac8578606ff80dc93775a4a0188969b8e3e4776b16ed9',
            s: 'c564fea1a950049a870b42c0c16a73f3d6fc6c4476b6d5391885f85d0a36cecf',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '4c7171e0-6a6f-11ec-90dd-c3d86a1cbfec',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640978679806,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '975',
    transactionVolume: '90.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 41,
    hashOfAllHashes: 'cad241b42847cbdebc9fe6c5c45e88cc6e56f9642fda081bb6076e54af5b3c37',
  },
  {
    timestamp: 1640978952371,
    lastHash: 'ec4156706d34cf5fdbb70f2ee61246b6a88d644eb5c73181629fa28a44ea5e35',
    hash: '31c1198a10b83fd16890fc578d87c1c1c6e1624f9b1b81cc6f0b6e5f7975b191',
    transactions: [
      {
        id: 'ec118cd0-6a6f-11ec-8f05-2d77e7380dd1',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1981.00005000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '40.00000000',
        },
        input: {
          timestamp: 1640978947613,
          amount: '2021.00005000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '56fe3477b95439bf361698adb1facd5d609827ccce694640527eb17b4086026f',
            s: '145094d8a6af05cf0bf5c69e9ea76643841f32478d0d884d1a2298dc24a3faea',
            recoveryParam: 0,
          },
        },
      },
      {
        id: 'eee76920-6a6f-11ec-8f05-2d77e7380dd1',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640978952370,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 1,
    blockSize: '975',
    transactionVolume: '90.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 42,
    hashOfAllHashes: '471a608e34fd5303018fb488fda79e0175c378c3ba985247884281a2c91ae671',
  },
  {
    timestamp: 1640979152063,
    lastHash: '31c1198a10b83fd16890fc578d87c1c1c6e1624f9b1b81cc6f0b6e5f7975b191',
    hash: '1787e58ace3d7c6d62c19522ebea94082343ef1bb41196b1b87466ec34bf95d1',
    transactions: [
      {
        id: '63e42420-6a70-11ec-8915-51d23f1d72fe',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '2031.00005000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '40.00000000',
        },
        input: {
          timestamp: 1640979148642,
          amount: '2071.00005000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: 'aa4ddd9214d943eadf99a32dcdd1573342bfedc5e9db87b5004fe73cd4462dec',
            s: 'c4469f92ebb8850c7ab72bfe76f4d4f1a3bc481571e5bdbcb4071fdbd89f1225',
            recoveryParam: 0,
          },
        },
      },
      {
        id: '65ee24f0-6a70-11ec-8915-51d23f1d72fe',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640979152063,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '975',
    transactionVolume: '90.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 43,
    hashOfAllHashes: 'b794c5c8ac701413d633ae814eeb4b900c93dd1b10a7991a7e3d6b7504614804',
  },
  {
    timestamp: 1640992998789,
    lastHash: '1787e58ace3d7c6d62c19522ebea94082343ef1bb41196b1b87466ec34bf95d1',
    hash: '00e4c4ac998af0a7aabfce260692488f62b5676ab05d615a62effe0067bfba9b',
    transactions: [
      {
        id: 'a07eeb70-6a90-11ec-a15e-ed807ffc45f7',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '2000.00000000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '81.00005000',
        },
        input: {
          timestamp: 1640992994215,
          amount: '2081.00005000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '6785a61291437a7e669fdd3535b239d12096fdf11ee92cbb065a12cfd2c50cb3',
            s: 'b776a4de36bf25603cd1b9a2fdb0de60f745f98f1071e1f7134c1537ef610c7f',
            recoveryParam: 0,
          },
        },
      },
      {
        id: 'a338b440-6a90-11ec-a15e-ed807ffc45f7',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640992998788,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 3,
    difficulty: 1,
    blockSize: '975',
    transactionVolume: '131.00005000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 44,
    hashOfAllHashes: '27f2583d224f5cf4b1e81234313c9e38264fa8420a7271f02bd7c0fde559f5db',
  },
  {
    timestamp: 1640993091426,
    lastHash: '00e4c4ac998af0a7aabfce260692488f62b5676ab05d615a62effe0067bfba9b',
    hash: 'eae4e6e5842acc291d8b60dc4e6caa5c0324dd0a49b166bc952cb4c7377dc6a3',
    transactions: [
      {
        id: 'd40cb440-6a90-11ec-a15e-ed807ffc45f7',
        output: {
          '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '1850.00000000',
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '200.00000000',
        },
        input: {
          timestamp: 1640993080708,
          amount: '2050.00000000',
          address: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          publicKey:
            '041adef30a4544272c81cf9589d5a1abd2770c9982114d7d3ccc6a712882372aefc6dc09e17ac56294e17cb78c893b0fcde35507ddcd7b718178016c5fb69b465b',
          signature: {
            r: '8df69298fd53b51d052b7240cfc125248fdd1b924f11f6bda4a06897458919c3',
            s: '2b144eaadb0c5ffbd23b935cc97b2deed6de8d68a23c0c44d8e21efca97d6846',
            recoveryParam: 1,
          },
        },
      },
      {
        id: 'da702420-6a90-11ec-a15e-ed807ffc45f7',
        output: { '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a': '50.00000000' },
        input: {
          timestamp: 1640993091426,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x4Ff299F604391989b36d13D24Ce4247b0EC7964a',
          signature: '',
        },
      },
    ],
    nonce: 1,
    difficulty: 0,
    blockSize: '976',
    transactionVolume: '250.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 45,
    hashOfAllHashes: 'e946bafd6e0d39208435f853501ff433ac4c44c38066921846e80b01679e0c69',
  },
  {
    timestamp: 1641054653241,
    lastHash: 'eae4e6e5842acc291d8b60dc4e6caa5c0324dd0a49b166bc952cb4c7377dc6a3',
    hash: '601534c5e08ccb1a06478752c14d224bb45808cbfea0b1daed9cee2362daeed2',
    transactions: [
      {
        id: '5ad99590-6b1f-11ec-8a64-55b207ae686d',
        output: {
          '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '197.00000000',
          '0x44635Ac2a88569F5F2015fC0e95aCC7b78E180c7': '3.00000000',
        },
        input: {
          timestamp: 1641054295401,
          amount: '200.00000000',
          address: '0x86045b56bfeb1A35C6818081130BA0F789dc27c9',
          publicKey:
            '04e7671286dda2270c8164a768b18115226b2074f9b6720ea4637bac708a7a95590a27fc7ead7c305f0c06a6373e3ac7eb5c417757462a461f24f7c3fcfcf2e6ea',
          signature: {
            r: 'bd18d72a72fc8012c6d0a60ac8618b2ee453732445cbe5b1d536ab050d1b1ee3',
            s: 'a5ce18905f9a6b7c59433fe58a4cc8d173327ac3778403d7caaf3acc9dcfd184',
            recoveryParam: 1,
          },
        },
      },
      {
        id: '3023a290-6b20-11ec-87b1-d3c574b14b2f',
        output: { '0x86045b56bfeb1A35C6818081130BA0F789dc27c9': '50.00000000' },
        input: {
          timestamp: 1641054653241,
          amount: '',
          address: '',
          publicKey: '',
          recipient: '0x86045b56bfeb1A35C6818081130BA0F789dc27c9',
          signature: '',
        },
      },
    ],
    nonce: 2,
    difficulty: 1,
    blockSize: '972',
    transactionVolume: '53.00000000',
    blockReward: '50.00000000',
    feeReward: '0.00000000',
    blockchainHeight: 46,
    hashOfAllHashes: '9d8ca3c8f4077fa8eaf3293e94b6743f0ebc8229d7ab2582422992804489eadc',
  },
];

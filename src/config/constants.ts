const INITIAL_DIFFICULTY = 3;
export const MINE_RATE = 1000;
export const DEFAULT_MESSAGE =
  "Welcome to Kadocoin API. Visit https://kadocoin.com";
export const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "____",
  hash: "hash-one",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: [],
};

export const STARTING_BALANCE = 1000;
export const MINING_REWARD = 50;
export const REWARD_INPUT = {
  address: "*authorized-reward*",
  recipient: "___",
  amount: MINING_REWARD,
  timestamp: 83838383838,
  signature: "*authorized-signature*",
  localPublicKey: "*authorized-localPublicKey*",
  publicKey: "*authorized-publicKey*",
};
export const COINS_IN_CIRCULATION = 0;

const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;
const STARTING_BALANCE = 1000;

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "foo-hash",
  hash: "bar-hash",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: ["mohammad"],
};

module.exports = {
  GENESIS_DATA,
  INITIAL_DIFFICULTY,
  MINE_RATE,
  STARTING_BALANCE,
};

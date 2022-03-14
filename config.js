const INITIAL_DIFFICALTY = 3;

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "foo-hash",
  hash: "bar-hash",
  difficalty: INITIAL_DIFFICALTY,
  nonce: 0,
  data: ["mohammad"],
};

module.exports = { GENESIS_DATA, INITIAL_DIFFICALTY };

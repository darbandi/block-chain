const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
  constructor({ timestamp, lastHash, hash, data, difficulty, nonce }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }

  static genesis() {
    return new Block(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    let hash, timestamp;
    const { difficulty, hash: lastHash } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new Block({
      timestamp,
      lastHash,
      data,
      difficulty,
      nonce,
      hash,
    });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;
    return difficulty + 1;
  }
}

module.exports = Block;

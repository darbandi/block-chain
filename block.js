const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
  constructor({ timestamp, lastHash, hash, data, difficalty, nonce }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.difficalty = difficalty;
    this.nonce = nonce;
  }

  static genesis() {
    return new Block(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    let hash, timestamp;
    const { difficalty, hash: lastHash } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficalty);
    } while (hash.substring(0, difficalty) !== "0".repeat(difficalty));

    return new Block({
      timestamp,
      lastHash,
      data,
      difficalty,
      nonce,
      hash,
    });
  }
}

module.exports = Block;

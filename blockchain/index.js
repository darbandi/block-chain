const Block = require("./block");
const { cryptoHash } = require("../util");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newBlock);
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const actualLastHash = chain[i - 1].hash;
      const lastDifficalty = chain[i - 1].difficulty;
      const { timestamp, lastHash, hash, data, difficulty, nonce } = block;

      if (lastHash !== actualLastHash) return false;
      if (Math.abs(lastDifficalty - difficulty) > 1) return false;
      if (hash !== cryptoHash(timestamp, lastHash, data, nonce, difficulty))
        return false;
    }

    return true;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("the incomming chain must be longer");
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("the incomming chain must be valid");
      return;
    }
    console.log("replacing chain with:", chain);
    this.chain = chain;
  }
}

module.exports = Blockchain;

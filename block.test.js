const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");
const hexToBinary = require("hex-to-binary");

describe("block", () => {
  const timestamp = 2000;
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["Mohammad", "darbandi"];
  const difficulty = 1;
  const nonce = 1;

  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    difficulty,
    nonce,
  });

  it("has a timestamp, lastHash, hash, data", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.difficulty).toEqual(difficulty);
    expect(block.nonce).toEqual(nonce);
  });

  describe("genesis()", () => {
    const genesisBlock = Block.genesis();
    it("returns a block instance", () => {
      expect(genesisBlock instanceof Block).toEqual(true);
    });

    it("returns the genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("minBlock()", () => {
    const lastBlock = Block.genesis();
    const data = "mine data";
    const mineBlock = Block.mineBlock({ lastBlock, data });

    it("returns a block instance", () => {
      expect(mineBlock instanceof Block).toEqual(true);
    });

    it("sets a `lastHash` to the `hash` of the lastBlock", () => {
      expect(mineBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("sets a `data`", () => {
      expect(mineBlock.data).toEqual(data);
    });

    it("sets a `timestamp`", () => {
      expect(mineBlock.timestamp).not.toEqual(undefined);
    });

    it("creates a SHA-256 `hash` based on the proper inputs", () => {
      expect(mineBlock.hash).toEqual(
        cryptoHash(
          mineBlock.timestamp,
          mineBlock.difficulty,
          mineBlock.nonce,
          lastBlock.hash,
          data
        )
      );
    });

    it("sets a `hash` that maches the difficulty criteria", () => {
      expect(hexToBinary(mineBlock.hash).substring(0, mineBlock.difficulty)).toEqual(
        "0".repeat(mineBlock.difficulty)
      );
    });

    it("adjust the difficulty", () => {
      const possibleResult = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ];
      expect(possibleResult.includes(mineBlock.difficulty)).toBe(true);
    });
  });

  describe("adjustDifficulty()", () => {
    it("raises the difficulty for a quickly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1);
    });

    it("lowers the difficulty for a slowly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    });

    it("has a lowwer limit of 1", () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });
  });
});

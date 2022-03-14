const Block = require("./block");
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

describe("block", () => {
  const timestamp = "123456";
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["Mohammad", "darbandi"];
  const difficalty = 1;
  const nonce = 1;

  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    difficalty,
    nonce,
  });

  it("has a timestamp, lastHash, hash, data", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.difficalty).toEqual(difficalty);
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
          mineBlock.difficalty,
          mineBlock.nonce,
          lastBlock.hash,
          data
        )
      );
    });

    it("sets a `hash` that maches the difficalty criteria", () => {
      expect(mineBlock.hash.substring(0, mineBlock.difficalty)).toEqual(
        "0".repeat(mineBlock.difficalty)
      );
    });
  });
});

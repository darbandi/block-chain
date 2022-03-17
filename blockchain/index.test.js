const Block = require("./block");
const Blockchain = require("./index");
const cryptoHash = require("../util/crypto-hash");

describe("Blockchain", () => {
  let blockchain, newChain, orginalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    orginalChain = blockchain.chain;
  });

  it("contains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block to the chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("when the chain does not start with genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain does start with genesis block and has multiple block", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "one" });
        blockchain.addBlock({ data: "two" });
        blockchain.addBlock({ data: "three" });
      });

      describe("and a lastHash refrence has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "changed-data";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain dos not contain any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });

      describe("and the chain contains a block with a jumped difficalty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficalty = lastBlock.difficalty - 3;
          const hash = cryptoHash(lastHash, timestamp, nonce, data, difficalty);

          const badBlock = new Block({
            lastHash,
            timestamp,
            nonce,
            data,
            difficalty,
            hash,
          });

          blockchain.chain.push(badBlock);

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    let errorMock, logMock;
    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock;
    });

    describe("when the new chain not longer", () => {
      beforeEach(() => {
        newChain[0] = { data: "fake-data" };
        blockchain.replaceChain(newChain.chain);
      });

      it("dose not replace the chain", () => {
        expect(blockchain.chain).toEqual(orginalChain);
      });

      it("log and error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });
    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "one" });
        newChain.addBlock({ data: "two" });
        newChain.addBlock({ data: "three" });
      });

      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "fake-hash";
          blockchain.replaceChain(newChain.chain);
        });

        it("dose not replace the chain", () => {
          expect(blockchain.chain).toEqual(orginalChain);
        });

        it("log and error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("and the chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });

        it("dose replace the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        it("log and error", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});

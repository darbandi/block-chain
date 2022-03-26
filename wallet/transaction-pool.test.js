const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require(".");

describe("TransactionPool", () => {
  let transactionPool, transaction, senderWallet;

  beforeEach(() => {
    senderWallet = new Wallet();
    transactionPool = new TransactionPool();
    transaction = new Transaction({
      senderWallet,
      recipient: "test-recipient",
      amount: 50,
    });
  });

  describe("setTransaction", () => {
    it("add a transaction", () => {
      transactionPool.setTransaction(transaction);
      expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
    });
  });

  describe("existingTransaction()", () => {
    it("returns an existing transaction given a n input address", () => {
      transactionPool.setTransaction(transaction);
      expect(
        transactionPool.existingTransaction({
          inputAddress: senderWallet.publicKey,
        })
      ).toBe(transaction);
    });
  });
});

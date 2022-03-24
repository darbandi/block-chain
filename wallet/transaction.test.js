const Wallet = require(".");
const { verifySignature } = require("../util");
const Transaction = require("./transaction");

describe("Transaction", () => {
  let transaction, senderWallet, recipient, amount;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "recipient-public-key";
    amount = 50;
    transaction = new Transaction({ senderWallet, recipient, amount });
  });

  it("has an `id`", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", () => {
    it("has an `outputMap`", () => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it("outputs the amount to the recipient", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it("outputs the remaining balance for the `senderWallet`", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      );
    });
  });

  describe("input", () => {
    it("has an `input`", () => {
      expect(transaction).toHaveProperty("input");
    });

    it("has a `timestamp` in the input", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });

    it("sets the amount to the `senderWallet` balance", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it("sets the `address` to the `senderWallet` publicKey", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it("signe the input", () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });

  describe("validTransaction()", () => {
    let errorMock, logMock;
    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock;
    });

    describe("when the transaction is valid", () => {
      it("returns true", () => {
        expect(Transaction.validTransaction(transaction)).toBe(true);
      });
    });

    describe("when the transaction is invalid", () => {
      describe("and a transaction outputMap value is invalid", () => {
        it("returns true", () => {
          transaction.outputMap[senderWallet.publicKey] = 9999999;
          expect(Transaction.validTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and a transaction input signature is invalid", () => {
        it("returns true", () => {
          transaction.input.signature = new Wallet().sign("data");
          expect(Transaction.validTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe("update()", () => {
    let originalSignature, originalSenderOutput, nextRecipient, nexAmount;

    beforeEach(() => {
      originalSignature = transaction.input.signature;
      originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
      nextRecipient = "next-recipient";
      nexAmount = 50;

      transaction.update({
        senderWallet,
        recipient: nextRecipient,
        amount: nexAmount,
      });
    });

    it("outputs the amount to the next recipient", () => {
      expect(transaction.outputMap[nextRecipient]).toEqual(nexAmount);
    });

    it("subtract the  amount from the original sender output amount", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        originalSenderOutput - nexAmount
      );
    });

    it("maintains a total output that matches the input amount", () => {
      expect(
        Object.values(transaction.outputMap).reduce((acc, curr) => acc + curr)
      ).toEqual(transaction.input.amount);
    });

    it("re-sign the transaction", () => {
      expect(transaction.input.signature).not.toEqual(originalSignature);
    });
  });
});

const Transaction = require("../wallet/transaction");

class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }
  mineTransactions() {
    // get the transaction pool's valid transactions
    const validTransactions = this.transactionPool.validTransactions();

    // generate the miner's reward
    const rewardTransaction = Transaction.rewardTransaction({
      minerWallet: this.wallet,
    });
    validTransactions.push(rewardTransaction);

    // add a block consisting of these transactions to blockchain
    this.blockchain.addBlock({ data: validTransactions });

    // broadcast the updated blockchain
    this.pubsub.broadcastChain();

    // clear the pool
    this.transactionPool.clear();
  }
}

module.exports = TransactionMiner;

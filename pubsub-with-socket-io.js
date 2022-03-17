const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const tcpPortUsed = require("tcp-port-used");

class PubSub {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.socket;
    let PORT = 3005;
    tcpPortUsed.check(3005, "127.0.0.1").then((inUse) => {
      if (inUse) {
        PORT = Math.ceil(Math.random() * 1000);
      }
      server.listen(PORT, () => {
        console.log("listening on *:" + PORT);
      });
      io.on("connection", (socket) => {
        console.log("connection ");
        this.socket = socket;
      });

    });
  }

  publish({ channel, message }) {
    console.log(message);
    this.socket.broadcast.emit(channel, { channel, message });
    this.socket.emit(channel, { channel, message });
  }

  broadcastChain() {
    this.publish({
      channel: "blockchain",
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  handleMessgae(channel, message) {
    if (channel === "blockchain") {
      const parsedMessage = JSON.parse(message);
      this.blockchain.replaceChain(parsedMessage);
    }
  }
}

module.exports = PubSub;

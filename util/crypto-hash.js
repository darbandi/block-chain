const cripto = require("crypto");

const cryptoHash = (...inputs) => {
  const hash = cripto.createHash("sha256");
  hash.update(
    inputs
      .map((input) => JSON.stringify(input))
      .sort()
      .join(" ")
  );
  return hash.digest("hex");
};

module.exports = cryptoHash;

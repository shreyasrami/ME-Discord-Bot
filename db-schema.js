const mongoose = require("mongoose");

const walletSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    wallet_addresses: {
        type: Array,
        required: true,
        default: []
    },
    
  }
);

module.exports = mongoose.model("Wallets", walletSchema);
const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user: {
      id: mongoose.Types.ObjectId,
      name: String,
      email: String,
      mobile: String,
    },
    cart: [
      {
        name: { type: String, require: true },
        avatar: { type: String, require: true },
        size: { type: String, require: true },
        price: { type: Number, require: true },
        qty: { type: Number, require: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

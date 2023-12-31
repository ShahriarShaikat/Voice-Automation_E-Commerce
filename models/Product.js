const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    product_details: { type: String },
    category: [
      {
        type: String,
      },
    ],
    brand: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5 },
    price: { type: Number, min: 0 },
    avatar: [
      {
        type: String,
      },
    ],
    featured: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

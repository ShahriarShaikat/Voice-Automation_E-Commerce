// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { Error } = require("mongoose");

// get login page
function getCartPage(req, res) {
  res.render("cart");
}

// add to cart
async function addToCart(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product?._id) {
      throw new Error("No product found!");
    }

    const getdetails = await Cart.find({
      "user.id": req.user.userid,
    });
    const cartdetails = getdetails[0];

    if (cartdetails?.user) {
      let updateCart = cartdetails.cart.map((p) => ({
        _id: p._id,
        name: p.name,
        avatar: p.avatar,
        size: p.size,
        price: p.price,
        qty: p.qty,
      }));

      if (updateCart.find((p) => p.name == product.name)?.name) {
        updateCart = updateCart.map((p) =>
          p.name == product.name
            ? {
                ...p,
                qty: p.qty + 1,
              }
            : p
        );
      } else {
        updateCart = [
          ...updateCart,
          {
            _id: product._id,
            name: product.name,
            avatar: product.avatar[0],
            size: "Small",
            price: product.price,
            qty: 1,
          },
        ];
      }
      await Cart.updateOne(
        { "user.id": req.user.userid },
        {
          $set: {
            cart: updateCart,
          },
        }
      );

      res.status(200).json({
        message: "Product added to the cart!",
      });
    } else {
      const newCart = new Cart({
        user: {
          id: req.user.userid,
          name: req.user.username,
          email: req.user.email,
          mobile: req.user.mobile,
        },
        cart: [
          {
            _id: product._id,
            name: product.name,
            avatar: product.avatar[0],
            size: "Small",
            price: product.price,
            qty: 1,
          },
        ],
      });
      const result = await newCart.save();
      if (result._id) {
        res.status(200).json({
          message: "Product added to the cart!",
        });
      } else {
        res.status(500).json({
          status: false,
          message: "failed to add product to the cart!",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}

//get cart count
async function getCartCount(req, res) {
  try {
    const getdetails = await Cart.find({
      "user.id": req.user.userid,
    });
    const cartdetails = getdetails[0];
    res.status(200).json({
      status: true,
      count: cartdetails?.cart?.reduce((rs, p) => rs + p.qty, 0) || 0,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}

//get cart details
async function getCartDetails(req, res) {
  try {
    const getdetails = await Cart.find({
      "user.id": req.user.userid,
    });
    const cartdetails = getdetails[0] || [];
    res.status(200).json({
      cart: cartdetails?.cart || [],
      user: cartdetails?.user || {},
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}

//remove product from the cart
async function removeProductFromCart(req, res) {
  try {
    const getdetails = await Cart.find({
      "user.id": req.user.userid,
    });
    const cartdetails = getdetails[0];

    if (cartdetails?.user) {
      let updateCart = cartdetails.cart.map((p) => ({
        _id: p._id,
        name: p.name,
        avatar: p.avatar,
        size: p.size,
        price: p.price,
        qty: p.qty,
      }));
      const isExist = updateCart.find((p) => p._id == req.params.product_id);
      if (isExist?._id) {
        updateCart = updateCart.filter((p) => p._id != req.params.product_id);
        await Cart.updateOne(
          { "user.id": req.user.userid },
          {
            $set: {
              cart: updateCart,
            },
          }
        );
        res.status(200).json({
          message: "Product remove from the cart!",
        });
      } else {
        res.status(404).json({
          status: false,
          message: "The product you are trying to remove, isn't in the cart!",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}

// increase or decrease cart quantity
async function increaseDecreaseCartQTY(req, res) {
  try {
    const product_id = req.params.id;
    const product_qty = req.params.qty;

    const getdetails = await Cart.find({
      "user.id": req.user.userid,
    });
    const cartdetails = getdetails[0];

    if (
      cartdetails?.user &&
      cartdetails.cart.find((p) => p._id == product_id)?._id
    ) {
      let updateCart = cartdetails.cart.map((p) => ({
        _id: p._id,
        name: p.name,
        avatar: p.avatar,
        size: p.size,
        price: p.price,
        qty: p.qty,
      }));

      if (product_qty == "+") {
        updateCart = updateCart.map((p) => ({
          ...p,
          qty: p._id == product_id ? p.qty + 1 : p.qty,
        }));
      } else if (product_qty == "-") {
        updateCart = updateCart.map((p) => ({
          ...p,
          qty: p._id == product_id ? p.qty - 1 : p.qty,
        }));
      } else {
        updateCart = updateCart.map((p) => ({
          ...p,
          qty: Number(product_qty),
        }));
      }

      updateCart = updateCart.filter((p) => p.qty > 0);

      await Cart.updateOne(
        { "user.id": req.user.userid },
        {
          $set: {
            cart: updateCart,
          },
        }
      );

      res.status(200).json({
        message: "Cart updated!",
      });
    } else {
      res.status(404).json({
        status: false,
        message:
          "The product quantity you are trying to update isn't found in the cart!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}

//remove all the product from the cart
async function makeCartEmpty(req, res) {
  try {
    const getdetails = await Cart.find({
      "user.id": req.user.userid,
    });
    const cartdetails = getdetails[0];

    if (cartdetails?.user) {
      await Cart.updateOne(
        { "user.id": req.user.userid },
        {
          $set: {
            cart: [],
          },
        }
      );

      res.status(200).json({
        message: "Cart has been Destroyed!",
      });
    } else {
      res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}

//get product details
async function getProductDetails(req, res) {
  try {
    const regex = new RegExp(req.params.product_name, "i");

    const products = await Product.find({
      name: { $regex: regex },
    });

    const product = products?.length > 0 ? products[0] : {};
    if (product._id) {
      res.status(200).json({
        status: true,
        product,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "No Product Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}
module.exports = {
  increaseDecreaseCartQTY,
  makeCartEmpty,
  removeProductFromCart,
  getCartDetails,
  getProductDetails,
  getCartPage,
  addToCart,
  getCartCount,
};

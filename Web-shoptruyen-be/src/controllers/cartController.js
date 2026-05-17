const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

function buildCartItemResponse(cartItem) {
  return {
    _id: cartItem._id,
    user: cartItem.user,
    product: cartItem.product?._id || cartItem.product,
    quantity: cartItem.quantity,
    selected: cartItem.selected,
    createdAt: cartItem.createdAt,
    updatedAt: cartItem.updatedAt,
    productInfo: cartItem.product
      ? {
          _id: cartItem.product._id,
          code: cartItem.product.code,
          name: cartItem.product.name,
          price: cartItem.product.price,
          image: cartItem.product.image,
          stock: cartItem.product.stock,
          status: cartItem.product.status,
          category: cartItem.product.category,
          description: cartItem.product.description,
        }
      : null,
  };
}

async function getCart(req, res) {
  const cartItems = await CartItem.find({
    user: req.user._id,
  })
    .populate("product")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    message: "Get cart successfully.",
    count: cartItems.length,
    cartItems: cartItems.map(buildCartItemResponse),
  });
}

async function addToCart(req, res) {
  const { productId, quantity = 1, selected } = req.body || {};

  if (!productId) {
    return res.status(400).json({
      message: "productId is required.",
    });
  }

  const normalizedQuantity = Number(quantity);

  if (!Number.isInteger(normalizedQuantity) || normalizedQuantity < 1) {
    return res.status(400).json({
      message: "quantity must be an integer greater than 0.",
    });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  const existingCartItems = await CartItem.find({
    user: req.user._id,
  }).populate("product");

  const duplicatedCartItem = existingCartItems.find(
    (cartItem) => cartItem.product?.code === product.code
  );

  if (duplicatedCartItem) {
    return res.status(409).json({
      message: "Sản phẩm đã có trong giỏ hàng.",
    });
  }

  const cartItem = await CartItem.create({
    user: req.user._id,
    product: productId,
    quantity: normalizedQuantity,
    selected: typeof selected === "boolean" ? selected : false,
  });

  const populatedCartItem = await CartItem.findById(cartItem._id)
    .populate("product")
    .populate("user", "-password");

  return res.status(201).json({
    message: "Add to cart successfully.",
    cartItem: buildCartItemResponse(populatedCartItem),
  });
}

async function updateCartItem(req, res) {
  const { cartItemId } = req.params;
  const { quantity, selected } = req.body || {};

  const cartItem = await CartItem.findOne({
    _id: cartItemId,
    user: req.user._id,
  }).populate("product");

  if (!cartItem) {
    return res.status(404).json({
      message: "Cart item not found.",
    });
  }

  if (quantity !== undefined) {
    const normalizedQuantity = Number(quantity);

    if (!Number.isInteger(normalizedQuantity) || normalizedQuantity < 1) {
      return res.status(400).json({
        message: "quantity must be an integer greater than 0.",
      });
    }

    cartItem.quantity = normalizedQuantity;
  }

  if (selected !== undefined) {
    if (typeof selected !== "boolean") {
      return res.status(400).json({
        message: "selected must be a boolean.",
      });
    }

    cartItem.selected = selected;
  }

  await cartItem.save();

  const populatedCartItem = await CartItem.findById(cartItem._id).populate("product");

  return res.status(200).json({
    message: "Update cart item successfully.",
    cartItem: buildCartItemResponse(populatedCartItem),
  });
}

async function deleteCartItem(req, res) {
  const { cartItemId } = req.params;

  const cartItem = await CartItem.findOne({
    _id: cartItemId,
    user: req.user._id,
  });

  if (!cartItem) {
    return res.status(404).json({
      message: "Cart item not found.",
    });
  }

  await CartItem.deleteOne({ _id: cartItem._id });

  return res.status(200).json({
    message: "Delete cart item successfully.",
  });
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
};

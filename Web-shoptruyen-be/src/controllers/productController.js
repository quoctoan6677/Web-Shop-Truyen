const Product = require("../models/Product");

function buildProductFilter(query = {}) {
  const { category, q, status } = query;
  const filter = {};

  if (
    category &&
    category !== "Tat ca" &&
    category !== "Tất cả" &&
    category !== "Tất cả thể loại"
  ) {
    filter.category = category;
  }

  if (status && status !== "Tất cả trạng thái") {
    filter.status = status;
  }

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { code: { $regex: q, $options: "i" } },
    ];
  }

  return filter;
}

function normalizeProductStatus(stock) {
  return Number(stock) > 0 ? "Còn hàng" : "Hết hàng";
}

function validateProductPayload(payload) {
  const trimmedName = payload.name?.trim();
  const trimmedCategory = payload.category?.trim();
  const trimmedImage = payload.image?.trim() || "";
  const trimmedDescription = payload.description?.trim() || "";
  const price = Number(payload.price);
  const stock = Number(payload.stock);

  if (!trimmedName || !trimmedCategory) {
    return {
      error: "Name and category are required.",
    };
  }

  if (!Number.isFinite(price) || price < 0) {
    return {
      error: "Price must be a number greater than or equal to 0.",
    };
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return {
      error: "Stock must be an integer greater than or equal to 0.",
    };
  }

  return {
    data: {
      name: trimmedName,
      category: trimmedCategory,
      price,
      stock,
      image: trimmedImage,
      description: trimmedDescription,
      status: normalizeProductStatus(stock),
    },
  };
}

async function generateNextProductCode() {
  const products = await Product.find().select("code").lean();
  const maxCodeNumber = products.reduce((currentMax, product) => {
    const matchedNumber = Number(String(product.code || "").replace(/^SP/i, ""));
    return Number.isFinite(matchedNumber)
      ? Math.max(currentMax, matchedNumber)
      : currentMax;
  }, 0);

  return `SP${String(maxCodeNumber + 1).padStart(3, "0")}`;
}

async function getProducts(req, res) {
  const products = await Product.find(buildProductFilter(req.query)).sort({ createdAt: -1 });

  return res.status(200).json({
    message: "Get products successfully.",
    count: products.length,
    products,
  });
}

async function getProductById(req, res) {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  return res.status(200).json({
    message: "Get product detail successfully.",
    product,
  });
}

async function getAdminProducts(req, res) {
  const products = await Product.find(buildProductFilter(req.query)).sort({ createdAt: -1 });

  return res.status(200).json({
    message: "Get admin products successfully.",
    count: products.length,
    products,
  });
}

async function createProduct(req, res) {
  const validation = validateProductPayload(req.body || {});

  if (validation.error) {
    return res.status(400).json({
      message: validation.error,
    });
  }

  const code = await generateNextProductCode();
  const product = await Product.create({
    code,
    ...validation.data,
  });

  return res.status(201).json({
    message: "Create product successfully.",
    product,
  });
}

async function updateProduct(req, res) {
  const validation = validateProductPayload(req.body || {});

  if (validation.error) {
    return res.status(400).json({
      message: validation.error,
    });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  product.name = validation.data.name;
  product.category = validation.data.category;
  product.price = validation.data.price;
  product.stock = validation.data.stock;
  product.image = validation.data.image;
  product.description = validation.data.description;
  product.status = validation.data.status;

  await product.save();

  return res.status(200).json({
    message: "Update product successfully.",
    product,
  });
}

async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  await product.deleteOne();

  return res.status(200).json({
    message: "Delete product successfully.",
  });
}

module.exports = {
  getProducts,
  getProductById,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

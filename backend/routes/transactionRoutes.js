const express = require("express");
const Transaction = require("../models/Transaction");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

function validateAndFormatTransaction({ title, amount, category, type }) {
  const normalizedTitle = typeof title === "string" ? title.trim() : "";
  const normalizedCategory = typeof category === "string" ? category.trim() : "";
  const normalizedType = typeof type === "string" ? type : "";
  const numericAmount = Number(amount);

  if (!normalizedTitle) {
    return { error: "A transaction title is required." };
  }

  if (normalizedTitle.length > 100) {
    return { error: "The title must be 100 characters or fewer." };
  }

  if (!Number.isFinite(numericAmount) || numericAmount === 0) {
    return { error: "The amount must be a non-zero number." };
  }

  if (!normalizedCategory) {
    return { error: "A category is required." };
  }

  if (normalizedCategory.length > 50) {
    return { error: "The category must be 50 characters or fewer." };
  }

  if (!["income", "expense"].includes(normalizedType)) {
    return { error: "Type must be either income or expense." };
  }

  return {
    value: {
      title: normalizedTitle,
      amount:
        normalizedType === "expense"
          ? -Math.abs(numericAmount)
          : Math.abs(numericAmount),
      category: normalizedCategory,
      type: normalizedType,
    },
  };
}

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({ date: -1 });

    return res.json(transactions);
  } catch {
    return res.status(500).json({
      message: "Unable to load transactions. Please try again.",
    });
  }
});

router.post("/", async (req, res) => {
  const validation = validateAndFormatTransaction(req.body);

  if (validation.error) {
    return res.status(400).json({ message: validation.error });
  }

  try {
    const transaction = await Transaction.create({
      ...validation.value,
      user: req.user._id,
    });

    return res.status(201).json(transaction);
  } catch {
    return res.status(400).json({
      message: "Unable to add this transaction. Please try again.",
    });
  }
});

router.put("/:id", async (req, res) => {
  const validation = validateAndFormatTransaction(req.body);

  if (validation.error) {
    return res.status(400).json({ message: validation.error });
  }

  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      validation.value,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    return res.json(updatedTransaction);
  } catch {
    return res.status(400).json({
      message: "Unable to update this transaction. Please try again.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedTransaction) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    return res.status(204).send();
  } catch {
    return res.status(400).json({
      message: "Unable to delete this transaction. Please try again.",
    });
  }
});

module.exports = router;
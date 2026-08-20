const express = require("express");
const Transaction = require("../models/Transaction");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

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
  try {
    const transaction = await Transaction.create({
      title: req.body.title,
      amount: req.body.amount,
      category: req.body.category,
      type: req.body.type,
      user: req.user._id,
    });

    return res.status(201).json(transaction);
  } catch {
    return res.status(400).json({
      message: "Unable to add this transaction. Check the information and try again.",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        type: req.body.type,
      },
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
      message: "Unable to update this transaction. Check the information and try again.",
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
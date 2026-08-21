const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "A transaction title is required."],
      trim: true,
      minlength: [1, "The title cannot be empty."],
      maxlength: [100, "The title must be 100 characters or fewer."],
    },
    amount: {
      type: Number,
      required: [true, "An amount is required."],
      validate: {
        validator: (value) => Number.isFinite(value) && value !== 0,
        message: "The amount must be a non-zero number.",
      },
    },
    category: {
      type: String,
      required: [true, "A category is required."],
      trim: true,
      minlength: [1, "The category cannot be empty."],
      maxlength: [50, "The category must be 50 characters or fewer."],
    },
    type: {
      type: String,
      enum: {
        values: ["income", "expense"],
        message: "Type must be either income or expense.",
      },
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionForm from "./TransactionForm";

function createProps(overrides = {}) {
  return {
    title: "Monthly rent",
    setTitle: vi.fn(),
    amount: "1200",
    setAmount: vi.fn(),
    date: "2026-08-20",
    setDate: vi.fn(),
    category: "Rent",
    setCategory: vi.fn(),
    type: "expense",
    setType: vi.fn(),
    addTransaction: vi.fn(),
    editingId: null,
    onCancelEditing: vi.fn(),
    isSaving: false,
    ...overrides,
  };
}

describe("TransactionForm", () => {
  it("calls addTransaction when the form is submitted", () => {
    const addTransaction = vi.fn();
    render(<TransactionForm {...createProps({ addTransaction })} />);

    fireEvent.submit(screen.getByRole("button", { name: "Add transaction" }));

    expect(addTransaction).toHaveBeenCalledTimes(1);
  });

  it("shows update and cancel actions while editing", () => {
    const onCancelEditing = vi.fn();
    render(
      <TransactionForm
        {...createProps({ editingId: "transaction-id", onCancelEditing })}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.getByRole("button", { name: "Update transaction" })
    ).toBeInTheDocument();
    expect(onCancelEditing).toHaveBeenCalledTimes(1);
  });

  it("disables actions while a transaction is saving", () => {
    render(<TransactionForm {...createProps({ isSaving: true })} />);

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
  });
});

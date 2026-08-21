import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatMonthLabel,
  formatTransactionDate,
} from "./formatters";

describe("formatters", () => {
  it("formats currency with two decimal places", () => {
    expect(formatCurrency(25000)).toBe("$25,000.00");
    expect(formatCurrency(-2898)).toBe("-$2,898.00");
  });

  it("formats a saved transaction date for the dashboard", () => {
    expect(formatTransactionDate("2026-08-20T12:00:00.000Z")).toBe(
      "Aug 20, 2026"
    );
  });

  it("formats a month key for the chart", () => {
    expect(formatMonthLabel("2026-08")).toBe("Aug 2026");
  });
});

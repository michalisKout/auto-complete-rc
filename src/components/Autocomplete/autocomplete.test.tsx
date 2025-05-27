import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Autocomplete } from "./autocomplete";
import type { AutocompleteProps } from "./types";

describe("Autocomplete", () => {
  const defaultProps: AutocompleteProps = {
    onInputChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Autocomplete {...defaultProps} />);

      const input = screen.getByTestId("autocomplete-input-test-id");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("placeholder", "Search...");
      expect(input).toHaveValue("");
      expect(input).not.toBeDisabled();
    });

    it("renders with custom placeholder", () => {
      const placeholder = "Type to search...";
      render(<Autocomplete {...defaultProps} placeholder={placeholder} />);

      const input = screen.getByTestId("autocomplete-input-test-id");
      expect(input).toHaveAttribute("placeholder", placeholder);
    });

    it("renders with custom className", () => {
      const className = "custom-autocomplete";
      render(<Autocomplete {...defaultProps} className={className} />);

      const container = screen.getByTestId("autocomplete-input-test-id").parentElement;
      expect(container).toHaveClass("autocomplete", className);
    });
  });

  describe("Disabled State", () => {
    it("does not accept input when disabled", async () => {
      const mockOnInputChange = vi.fn();
      const user = userEvent.setup();

      render(<Autocomplete {...defaultProps} disabled={true} onInputChange={mockOnInputChange} />);

      const input = screen.getByTestId("autocomplete-input-test-id");
      await user.type(input, "test");

      expect(input).toHaveValue("");
      expect(mockOnInputChange).not.toHaveBeenCalled();
    });
  });
});

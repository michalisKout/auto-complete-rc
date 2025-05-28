import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockData } from "../../../mockData";
import { Autocomplete } from "./autocomplete";
import type { AutocompleteItem, AutocompleteProps } from "./autocomplete.types";

describe("Autocomplete", () => {
  const defaultProps: AutocompleteProps = {
    onInputChange: vi.fn(),
    defaultItems: [],
    filterItems: vi.fn(),
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

  describe("Async Filtering", () => {
    it("calls filterItems function when user types more than minimum characters", async () => {
      const mockFilterItems = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      render(<Autocomplete {...defaultProps} filterItems={mockFilterItems} />);

      const input = screen.getByTestId("autocomplete-input-test-id");
      await user.type(input, "ap");

      await waitFor(() => {
        expect(mockFilterItems).toHaveBeenCalledWith("ap", expect.any(AbortSignal));
      });
    });

    it("displays filtered results from async filterItems function", async () => {
      const filteredResults: AutocompleteItem[] = [
        { id: 1, label: "Apple", value: "apple" },
        { id: 27, label: "Apricot", value: "apricot" },
      ];
      const mockFilterItems = vi.fn().mockResolvedValue(filteredResults);
      const user = userEvent.setup();

      render(<Autocomplete {...defaultProps} filterItems={mockFilterItems} />);

      const input = screen.getByTestId("autocomplete-input-test-id");
      await user.type(input, "ap");

      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
        expect(screen.getByText("Apricot")).toBeInTheDocument();
      });

      const dropdown = screen.getByTestId("autocomplete-dropdown-test-id");
      expect(dropdown).toBeInTheDocument();
    });

    it("allows item selection from async filtered results", async () => {
      const filteredResults: AutocompleteItem[] = [
        { id: 1, label: "Apple", value: "apple" },
        { id: 27, label: "Apricot", value: "apricot" },
      ];
      const mockFilterItems = vi.fn().mockResolvedValue(filteredResults);
      const mockOnSelect = vi.fn();
      const user = userEvent.setup();

      render(
        <Autocomplete {...defaultProps} filterItems={mockFilterItems} onSelect={mockOnSelect} />,
      );

      const input = screen.getByTestId("autocomplete-input-test-id");
      await user.type(input, "ap");

      // Wait for results to appear
      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });

      // Click on an item
      const appleItem = screen.getByText("Apple");
      await user.click(appleItem);

      expect(mockOnSelect).toHaveBeenCalledWith({
        id: 1,
        label: "Apple",
        value: "apple",
      });

      // Input should be updated with selected item
      expect(input).toHaveValue("Apple");

      // Dropdown should close
      expect(screen.queryByTestId("autocomplete-dropdown-test-id")).not.toBeInTheDocument();
    });

    it("works with synchronous filterItems function", async () => {
      const syncFilterItems = vi.fn().mockImplementation((query: string) => {
        return mockData.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
      });
      const user = userEvent.setup();

      render(<Autocomplete {...defaultProps} filterItems={syncFilterItems} />);

      const input = screen.getByTestId("autocomplete-input-test-id");
      await user.type(input, "ap");

      await waitFor(() => {
        expect(syncFilterItems).toHaveBeenCalledWith("ap", expect.any(AbortSignal));
        expect(screen.getByText("Apple")).toBeInTheDocument();
        expect(screen.getByText("Apricot")).toBeInTheDocument();
        expect(screen.getByText("Grape")).toBeInTheDocument();
        expect(screen.getByText("Grapefruit")).toBeInTheDocument();
        expect(screen.getByText("Pineapple")).toBeInTheDocument();
      });
    });

    it("displays no results message when search returns empty results", async () => {
      const mockFilterItems = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      render(<Autocomplete {...defaultProps} filterItems={mockFilterItems} />);

      const input = screen.getByTestId("autocomplete-input-test-id");
      await user.type(input, "no results");

      await waitFor(() => {
        expect(mockFilterItems).toHaveBeenCalledWith("no results", expect.any(AbortSignal));
      });

      const dropdown = screen.getByTestId("autocomplete-dropdown-test-id");
      expect(dropdown).toBeInTheDocument();
      expect(dropdown).toContainElement(screen.getByText("No results found"));
    });

    it("displays error message when search fails", async () => {
      const errorMessage = "API request failed";
      const mockFilterItems = vi.fn().mockRejectedValue(new Error(errorMessage));
      const user = userEvent.setup();

      render(<Autocomplete {...defaultProps} filterItems={mockFilterItems} />);

      const input = screen.getByTestId("autocomplete-input-test-id");
      await user.type(input, "test");

      await waitFor(() => {
        expect(mockFilterItems).toHaveBeenCalledWith("test", expect.any(AbortSignal));
      });

      const dropdown = screen.getByTestId("autocomplete-dropdown-test-id");
      expect(dropdown).toBeInTheDocument();
      expect(dropdown).toContainElement(screen.getByText(errorMessage));
      expect(screen.queryByText('No results found for "test"')).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(<Autocomplete {...defaultProps} />);

      const input = screen.getByTestId("autocomplete-input-test-id");

      expect(input).toHaveAttribute("role", "combobox");
      expect(input).toHaveAttribute("aria-expanded", "false");
      expect(input).toHaveAttribute("aria-haspopup", "listbox");
      expect(input).toHaveAttribute("autoComplete", "off");
    });

    it("scrolls focused item into view when navigating with arrow keys", async () => {
      const mockScrollIntoView = vi.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;

      const items: AutocompleteItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        label: `Item ${i}`,
        value: `item-${i}`,
      }));

      const mockFilterItems = vi.fn().mockResolvedValue(items);
      const user = userEvent.setup();

      render(<Autocomplete {...defaultProps} filterItems={mockFilterItems} />);

      const input = screen.getByTestId("autocomplete-input-test-id");
      await user.type(input, "test");

      await waitFor(() => {
        expect(screen.getByText("Item 0")).toBeInTheDocument();
      });

      await user.keyboard("{ArrowDown}");

      await waitFor(
        () => {
          expect(mockScrollIntoView).toHaveBeenCalledWith({
            behavior: "smooth",
            block: "nearest",
          });
        },
        { timeout: 100 },
      );

      vi.restoreAllMocks();
    });
  });
});

# Autocomplete Component

A production-ready, accessible autocomplete component built with React and TypeScript. No external dependencies except React.

## Features

🚀 **Performance Optimized**
- Debounced search to reduce API calls
- Request cancellation to prevent race conditions
- AbortController support for cancelling in-flight requests

🎯 **Accessibility (A11Y)**
- ARIA attributes for screen readers
- Proper focus management
- Keyboard navigation support
- Semantic HTML structure
- Click-outside to close functionality


⌨️ **Keyboard Navigation**
- Arrow keys (↑/↓) to navigate through results
- Enter to select highlighted item
- Escape to close dropdown
- Tab to close dropdown and move to next element

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher) - Suggested v23.5.0
- npm or yarn

### Getting Started

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd auto-complete-rc
nvm use
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check for linting issues
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Check code formatting
- `npm run format:fix` - Fix formatting automatically
- `npm run check` - Run both linting and formatting checks
- `npm run check:fix` - Fix both linting and formatting issues
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once

## Component API

### Autocomplete Props

```typescript
interface AutocompleteProps {
  onInputChange?: (value: string) => void;     // Callback when input changes
  onSelect?: (item: AutocompleteItem) => void; // Callback when item is selected
  placeholder?: string;                        // Input placeholder text
  className?: string;                          // Additional CSS class
  testId?: string;                            // Test ID for testing
  defaultItems: AutocompleteItem[];           // Default items to show
  disabled?: boolean;                         // Disable the component
  filterItems: FilterItemsOperator;           // Function to filter/fetch items
  minChars?: number;                          // Minimum characters before searching
  noResultsText?: string;                     // Text when no results found
  loadingText?: string;                       // Text during loading
  debounceMs?: number;                        // Debounce delay in milliseconds
}
```

### FilterItemsOperator Function

```typescript
type FilterItemsOperator = (
  searchQuery: string,
  abortSignal?: AbortSignal,
) => Promise<AutocompleteItem[]> | AutocompleteItem[];
```

### AutocompleteItem Type

```typescript
type AutocompleteItem {
  id: string | number;    // Unique identifier
  label: string;          // Display text
  value: string;          // Value for selection
}
```

## Usage Examples

### Basic Usage with Static Data

```tsx
import { Autocomplete } from './components/Autocomplete';
import { mockData } from './mockData';

function App() {
  const handleSelect = (item) => {
    console.log('Selected:', item);
  };

  const filterItems = (query: string) => {
    return mockData.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <Autocomplete
      defaultItems={[]}
      filterItems={filterItems}
      onSelect={handleSelect}
      placeholder="Search fruits..."
    />
  );
}
```

### Advanced Configuration with Async Data

```tsx
import { Autocomplete } from './components/Autocomplete';
import type { AutocompleteItem } from './components/Autocomplete/types';

function App() {
  const [inputValue, setInputValue] = useState("");

  const handleSelect = (item: AutocompleteItem) => {
    console.log('Selected:', item);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const filterItems = async (
    searchQuery: string,
    abortSignal?: AbortSignal
  ): Promise<AutocompleteItem[]> => {
    const response = await fetch(
      `https://api.example.com/search?q=${searchQuery}`,
      { signal: abortSignal }
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    
    const data = await response.json();
    return data.results.map(item => ({
      id: item.id,
      label: item.name,
      value: item.value
    }));
  };

  return (
    <Autocomplete
      defaultItems={[]}
      filterItems={filterItems}
      onSelect={handleSelect}
      onInputChange={handleInputChange}
      placeholder="Search..."
      minChars={2}
      debounceMs={300}
      noResultsText="No matches found"
      loadingText="Searching..."
      className="my-autocomplete"
    />
  );
}
```

### Star Wars API Example

```tsx
import { Autocomplete } from './components/Autocomplete';
import type { AutocompleteItem } from './components/Autocomplete/types';
import type { ApiResponse } from './star-wars-api-types';

function StarWarsSearch() {
  const filterItems = async (
    searchQuery: string,
    abortSignal?: AbortSignal,
  ): Promise<AutocompleteItem[]> => {
    const results = await fetch(
      `https://www.swapi.tech/api/people/?name=${searchQuery}`, 
      { signal: abortSignal }
    );

    if (!results.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = (await results.json()) as ApiResponse;
    return data.result.map((item) => ({
      id: item.uid,
      value: item.uid,
      label: item.properties.name,
    }));
  };

  return (
    <Autocomplete
      defaultItems={[]}
      filterItems={filterItems}
      placeholder="Search Star Wars characters..."
      onSelect={(item) => console.log("Selected character:", item)}
    />
  );
}
```

### Using Axios for HTTP Requests

```tsx
import axios from 'axios';
import { Autocomplete } from './components/Autocomplete';
import type { AutocompleteItem } from './components/Autocomplete/types';

function AxiosExample() {
  const filterItems = async (
    searchQuery: string,
    abortSignal?: AbortSignal
  ): Promise<AutocompleteItem[]> => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users?name_like=${searchQuery}`,
        {
          signal: abortSignal,
          timeout: 5000,
        }
      );

      return response.data.map((user: any) => ({
        id: user.id,
        label: user.name,
        value: user.username,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  };

  return (
    <Autocomplete
      defaultItems={[]}
      filterItems={filterItems}
      placeholder="Search users with Axios..."
      minChars={1}
      debounceMs={400}
      onSelect={(item) => console.log("Selected user:", item)}
    />
  );
}
```

## Testing

Run tests with:
```bash
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:ui     # With UI interface
```

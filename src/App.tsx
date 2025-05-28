import { useState } from "react";
import { mockData } from "../mockData";
import "./App.css";
import { Autocomplete } from "./components/Autocomplete";
import type { AutocompleteItem } from "./components/Autocomplete/autocomplete.types";
import type { ApiResponse } from "./star-wars-api-types";

function App() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const filterItems = async (
    searchQuery: string,
    abortSignal?: AbortSignal,
  ): Promise<AutocompleteItem[]> => {
    const results = await fetch(`https://www.swapi.tech/api/people/?name=${searchQuery}`, {
      signal: abortSignal,
    });

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

  const filterItemsWithError = async (): Promise<AutocompleteItem[]> => {
    throw new Error("Failed to fetch data");
  };

  return (
    <div className="app">
      <main className="app__main">
        <h1 className="app__title">React Autocomplete Assignment</h1>
        <div className="app__content">
          <section className="app__section">
            <h2>Basic example</h2>
            <Autocomplete
              onInputChange={handleInputChange}
              placeholder="Basic input"
              defaultItems={[]}
              filterItems={filterItems}
              onSelect={(item) => console.log("Selected item:", item)}
            />
            <span>Value: {inputValue}</span>
          </section>
          <section className="app__section">
            <h2>Static example</h2>
            <Autocomplete
              placeholder="Static input"
              defaultItems={mockData}
              debounceMs={0}
              filterItems={(query) => {
                return mockData.filter((item) =>
                  item.label.toLowerCase().includes(query.toLowerCase()),
                );
              }}
            />
          </section>
          <section className="app__section">
            <h2>Error example</h2>
            <Autocomplete
              placeholder="Error input"
              defaultItems={[]}
              filterItems={filterItemsWithError}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;

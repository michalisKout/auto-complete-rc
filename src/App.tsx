import { useEffect, useState } from "react";
import "./App.css";
import { Autocomplete } from "./components/Autocomplete";
import { mockData } from "./components/Autocomplete/mockData";
import type { AutocompleteItem } from "./components/Autocomplete/types";
import type { ApiResponse } from "./star-wars-api-types";

type StarWarsHero = {
  uid: string;
  name: string;
  url: string;
};

function App() {
  const [inputValue, setInputValue] = useState("");
  const [starWarsHeroes, setStarWarsHeroes] = useState<AutocompleteItem[]>([]);

  useEffect(() => {
    const fetchStarWarsHeroes = async () => {
      try {
        const response = await fetch("https://www.swapi.tech/api/people");
        const data = await response.json();
        const heroes = data.results.map((hero: StarWarsHero) => ({
          id: hero.uid,
          label: hero.name,
        }));
        setStarWarsHeroes(heroes);
      } catch (error) {
        console.error("Error fetching Star Wars heroes:", error);
      }
    };
    fetchStarWarsHeroes();
  }, []);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const filterItems = async (searchQuery: string): Promise<AutocompleteItem[]> => {
    const results = await fetch(`https://www.swapi.tech/api/people/?name=${searchQuery}`);

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
    <div className="app">
      <main className="app__main">
        <h1 className="app__title">React Autocomplete Assignment</h1>
        <div className="app__content">
          <section className="app__section">
            <h2>Basic example</h2>
            <Autocomplete
              onInputChange={handleInputChange}
              placeholder="Basic input"
              defaultItems={starWarsHeroes}
              filterItems={filterItems}
              onSelect={(item) => console.log("Selected item:", item)}
            />
            <span>Value: {inputValue}</span>
          </section>
          <section className="app__section">
            <h2>Disabled example</h2>
            <Autocomplete
              placeholder="Disabled input"
              defaultItems={mockData}
              filterItems={(query) => {
                return mockData.filter((item) =>
                  item.label.toLowerCase().includes(query.toLowerCase()),
                );
              }}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;

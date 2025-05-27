import { useState } from "react";
import "./App.css";
import { Autocomplete } from "./components/Autocomplete";

function App() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="app">
      <main className="app__main">
        <h1 className="app__title">React Autocomplete Assignment</h1>
        <div className="app__content">
          <section className="app__section">
            <h2>Basic example</h2>
            <Autocomplete onInputChange={handleInputChange} placeholder="Basic input" />
            <span>Value: {inputValue}</span>
          </section>
          <section className="app__section">
            <h2>Disabled example</h2>
            <Autocomplete disabled placeholder="Disabled input" />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;

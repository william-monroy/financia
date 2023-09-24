import "../public/styles/searchBar.css";

// components/SearchBar.tsx
import { useState } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "./ui/button";

// Define las propiedades que el componente SearchBar espera recibir
interface SearchBarProps {
  onSearch: (query: string) => void;
}

// Define el componente SearchBar
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState(""); // Inicializa el estado para la consulta de búsqueda

  // Maneja los cambios en el campo de entrada de la búsqueda
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // Actualiza el estado con el valor actual del campo de entrada
    onSearch(e.target.value); // Llama a la función onSearch pasada como propiedad para manejar la búsqueda
  };

  // Renderiza el componente
  return (
    <div className="flex items-center justify-center gap-4">
      <Input
        type="search"
        variant="bordered"
        id="default-search"
        placeholder="Ingrese el nombre o matricula del alumno"
        label="Buscar Alumno"
        required
        value={query}
        onChange={handleInputChange}
        onSubmit={(e) => e.preventDefault()}
      />
      <Button
        type="button"
        onClick={() => {
          setQuery("");
          onSearch("");
          document.getElementById("default-search")?.focus();
        }}
      >
        Limpiar
      </Button>
    </div>
  );
};

export default SearchBar;

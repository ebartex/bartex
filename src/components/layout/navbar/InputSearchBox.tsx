import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Zależy, czy masz ten komponent w swoim projekcie
import Image from "next/image"; // Dodaj import Image

// Define the type for the result structure
interface SearchResult {
  nazwa: string; // Assuming 'nazwa' is a string, adjust if it's different
}

export default function InputSearchBox() {
  const [inputFocused, setInputFocused] = useState(false); // Stan do śledzenia, czy input jest aktywny
  const [results, setResults] = useState<SearchResult[]>([]); // Wyniki wyszukiwania z typem SearchResult[]
  const [loading, setLoading] = useState(false); // Flaga ładowania
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null); // Timer dla debouncingu

  const inputRef = useRef<HTMLInputElement | null>(null); // Ref dla inputa
  const divRef = useRef<HTMLDivElement | null>(null); // Ref dla div'a z wynikami

  const handleFocus = () => {
    setInputFocused(true); // Aktywacja tła wokół inputa
  };

  // Funkcja do obsługi zmiany tekstu w polu wyszukiwania
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    // Jeśli zapytanie ma więcej niż 2 znaki, zaczynamy wyszukiwanie
    if (query.length > 2) {
      setResults([]); // Reset wyników podczas wyszukiwania
      setLoading(true); // Ustawiamy ładowanie
      if (debounceTimer) {
        clearTimeout(debounceTimer); // Zatrzymanie poprzedniego debouncingu
      }

      // Nowy debouncing: zaczynaj wyszukiwanie po 500 ms
      const timer = setTimeout(() => {
        fetchResults(query);
      }, 500);
      setDebounceTimer(timer);
    } else {
      setResults([]); // Resetuj wyniki, jeśli zapytanie jest krótkie
      setLoading(false); // Zakończ ładowanie
    }
  };

  // Funkcja do pobierania wyników z API
  const fetchResults = async (query: string) => {
    try {
      const response = await fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-nazwa=?${query}?`);
      const data: SearchResult[] = await response.json(); // Typowanie odpowiedzi jako SearchResult[]
      setResults(data); // Zaktualizuj wyniki
    } catch (error) {
      console.error("Błąd podczas pobierania wyników:", error);
      setResults([]);
    } finally {
      setLoading(false); // Zakończ ładowanie
    }
  };

  // Funkcja do sprawdzania kliknięć poza inputem i divem
  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      divRef.current &&
      !divRef.current.contains(event.target as Node)
    ) {
      setInputFocused(false); // Zamyka modal, gdy klikniemy poza inputem i divem
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Przyciemnione tło wokół inputa */}
      {inputFocused && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 z-10"
          style={{ top: "0", left: "0", width: "100%", height: "100%" }}
        />
      )}

      {/* Input Search Box */}
      <div className="relative w-full z-20">
        <input
          ref={inputRef} // Dodajemy ref do inputa
          type="text"
          id="hs-floating-input-email"
          className={`
            peer p-4 pl-10 block w-full
            rounded-lg
            sm:text-sm placeholder:text-transparent
            focus:border-2 focus:border-orange-300 focus:ring-0 focus:outline-none
            disabled:opacity-50 disabled:pointer-events-none
            border border-2 border-orange-300
            focus:pt-6 focus:pb-2
            not-placeholder-shown:pt-6 not-placeholder-shown:pb-2
            autofill:pt-6 autofill:pb-2
            ${inputFocused ? "bg-white" : "bg-transparent"}
          `}
          placeholder="you@email.com"
          onClick={handleFocus} // Ustawia stan, kiedy input zyskuje fokus
          onChange={handleSearchChange} // Obsługuje zmiany tekstu
        />
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={20}
        />
        <label
          htmlFor="hs-floating-input-email"
          className="
            absolute top-0 start-0 p-4 pl-11 h-full
            sm:text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent
            text-slate-400
            origin-[0_0]
            peer-disabled:opacity-50
            peer-disabled:pointer-events-none
            peer-focus:scale-90
            peer-focus:translate-x-0.5
            peer-focus:-translate-y-1.5
            peer-focus:text-slate-400
            dark:peer-focus:text-neutral-500
            peer-not-placeholder-shown:scale-90
            peer-not-placeholder-shown:translate-x-0.5
            peer-not-placeholder-shown:-translate-y-1.5
            peer-not-placeholder-shown:text-gray-500
            dark:peer-not-placeholder-shown:text-neutral-500
            dark:text-neutral-500"
        >
          Nazwa produktu, kod kreskowy, numer seryjny
        </label>

        {/* Div pod inputem, który nie wpływa na pozycję inputa */}
        {inputFocused && (
          <div
            ref={divRef} // Dodajemy ref do div'a
            className="h-100 absolute top-full left-0 w-full bg-white border border-gray-300 mt-2 p-4 rounded-md z-10"
            style={{ overflowY: "auto" }} // Stała wysokość z przewijaniem
          >
            {/* Dodatkowa zawartość, np. podpowiedzi */}
            {loading ? (
              // Wyświetlanie skeletonu podczas ładowania
              [...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-12 mb-2 bg-slate-100" />
              ))              
           
            ) : results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="flex items-center space-x-4 hover:bg-slate-200 p-2 rounded-md cursor-pointer">
                  <span>
                    <Image src="/products_thumbs.png" alt="logo" width={30} height={30} />
                  </span>
                  <span>{result.nazwa}</span> {/* Zaktualizuj pole, jeśli struktura danych jest inna */}
                </div>
              ))
            ) : (
              <p>Brak wyników</p>
            )}
    
          </div>
        )}
      </div>
    </>
  );
}

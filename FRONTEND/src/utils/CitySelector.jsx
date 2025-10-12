import { useEffect, useState } from "react";

const CitySelector = ({ setLocation, setOpen }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(localStorage.getItem("location") || "");

    // 🔹 Fetch suggestions from Nominatim API
    const fetchCities = async (value) => {
        if (value.length < 3) return; // kam se kam 3 chars likhe
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&limit=5`
            );
            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error("Error fetching cities:", err);
        }
    };

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSelect = (city) => {
        setLocation(city)
        setSelected(city);
        setQuery("");
        setResults([]);
        setOpen(false)
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query !== "") {
                fetchCities(query);
            } else {
                setResults([])
            }
        }, 500);
        return () => {
            clearTimeout(timeout)
        }
    }, [query])


    return (
        <div className="w-full my-3 mx-auto relative">
            {/* Input Box */}
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={selected || "Type your city..."}
                className="w-full mx-auto border text-base border-amber-700 text-amber-950 focus:outline-none focus:border-2  px-3 py-1 rounded-lg shadow-sm" />

            {/* Dropdown results */}
            {results?.length > 0 && (
                <ul id="categoryscroll" className="absolute mt-2 w-full bg-amber-50 border border-amber-900 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {results.map((item, i) => (
                        <li key={i} onClick={() => {
                            handleSelect(item.display_name.split(",")[0] + ", " + (item.address.state || item.address.country))
                        }}
                            className="px-3 py-1 hover:bg-amber-100 text-amber-900 cursor-pointer">
                            {item.display_name}
                        </li>
                    ))}
                </ul>
            )}
            {selected && (
                <p className="mt-2 text-sm text-green-600">
                    ✅ Selected: <span className="font-medium">{selected}</span>
                </p>
            )}
        </div>
    );
};

export default CitySelector;

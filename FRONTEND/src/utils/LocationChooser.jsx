import { useEffect, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowRoundDown } from "react-icons/io";
import { IoArrowDown, IoChevronDown, IoLocateOutline, IoLocateSharp, IoLocation } from "react-icons/io5";
import { Md16Mp, MdLocalActivity, MdLocalShipping, MdLocationSearching, MdSendAndArchive } from "react-icons/md";
import CitySelector from "./CitySelector";

const LocationChooser = () => {
    const [location, setLocation] = useState(localStorage.getItem("location") || "");
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const cities = ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai"];

    // 🔹 Auto Detect Location
    const detectLocation = () => {
        if (navigator.geolocation) {
            setLocation("Searching...")
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        // Free API (OpenStreetMap - Nominatim)
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                        const data = await response.json();
                        const cityName =
                            data.address.city ||
                            data.address.town ||
                            data.address.state ||
                            data.address.country;
                        setLocation(cityName + ", " + "india");
                        localStorage.setItem("location", cityName + ", " + "india");
                        setOpen(false)
                    } catch (err) {
                        setError("Failed to fetch city name.");
                    }
                },
                (err) => {
                    setError("Permission denied");
                }
            );
        } else {
            setError("Geolocation not supported.");
        }
    };

    // 🔹 Save manual selection
    const handleSelect = (city) => {
        setLocation(city + ", " + "india");
        localStorage.setItem("location", city + ", " + "india");
        setOpen(false);
    };

    // 🔹 Auto detect if nothing saved
    useEffect(() => {
        if (!location) {
            detectLocation()
        }
    }, []);

    return (
        <div className="w-full lg:max-w-3/4 max-w-xs relative px-4 pt-4 md:pt-0">
            {/* Label */}
            <p className="text-amber-950/60 text-sm lg:text-base font-semibold pl-2">Location</p>
            {/* Location Row */}
            <div className="flex items-center gap-2 cursor-pointer rounded-lg  hover:shadow-xs transition"
                onClick={() => setOpen(!open)}>
                <MdLocalShipping className="h-5 w-5 text-orange-600" />
                <span className="font-semibold md:text-sm leading-none lg:text-base text-amber-950">
                    {location || error || "Searching..."}
                </span>
                <IoChevronDown className="h-5 w-5 font-semibold text-gray-500" />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute mt-1 border px-2 border-amber-800 rounded-lg bg-amber-50 shadow-lg w-full z-50">
                    {/* Auto Detect option */}
                    <div
                        onClick={detectLocation}
                        className=" pt-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-blue-600 font-medium">
                        <IoLocation className="text-red-500" /> <span>Detect My Location</span>
                    </div>
                    <CitySelector setLocation={handleSelect} setOpen={setOpen} />
                    <h1 className="font-semibold px-2 text-amber-950/60 pb-1">Popular Cites.</h1>
                    {/* Manual Cities */}
                    {cities.map((city, i) => (
                        <div
                            key={i}
                            onClick={() => handleSelect(city)}
                            className="px-3 py-1 hover:bg-gray-100 text-amber-950 font-semibold cursor-pointer">
                            {city}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationChooser;

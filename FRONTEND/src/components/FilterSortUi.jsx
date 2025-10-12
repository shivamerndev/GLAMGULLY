import { useEffect, useState } from 'react';
import { ChevronDown, Filter, SortAsc, Package, X } from 'lucide-react';
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import { useSearchParams } from 'react-router-dom';
import { axiosProductInstance } from '../utils/axios.instance';

const FilterSortUI = ({ totalLength, categories }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false)
    const [showSort, setshowSort] = useState(false)
    const [sortby, setSortby] = useState(searchParams.get('sort') || "a-z")
    const [range, setRange] = useState([
        Number(searchParams.get("min")) || 100,
        Number(searchParams.get("max")) || 500
    ]);
    const [Applybtn, setApplybtn] = useState(false)
    const category = searchParams.get("category")
    const availability = searchParams.get('avail')
    const rating = searchParams.get('rating')
    const [highestPrice, sethighestPrice] = useState(2000)
    const [filters, setFilters] = useState([])

    const updateSearchParam = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams, { replace: true });
    };

    useEffect(() => {
        updateSearchParam('category', category)
        axiosProductInstance.get('/highest/price').then(res => sethighestPrice(res.data)).catch(err => console.log(err))
    }, [])

    // useEffect(() => { so many repeated code 
    //     const min = searchParams.get('min');
    //     const activeFilters = [];
    //     if (availability) activeFilters.push({ label: availability === 'instock' ? 'In Stock' : 'Out of Stock' });
    //     if (min == range[0]) activeFilters.push({ label: `₹${range[0]} - ₹${range[1]}` });
    //     if (rating) activeFilters.push({ label: `${rating}+ Stars` });
    //     if (category && category !== 'all') activeFilters.push({ label: category });
    //     setFilters(activeFilters);
    // }, [searchParams]);

    useEffect(() => {
        const min = searchParams.get("min");
        const activeFilters = [
            availability && { label: availability === "instock" ? "In Stock" : "Out of Stock" },
            min == range[0] && { label: `₹${range[0]} - ₹${range[1]}` },
            rating && { label: `${rating}+ Stars` },
            category && category !== "all" && { label: category },
            searchParams.get('sort') && { label: sortOptions.find(e => (e.id === sortby)).label }].filter(Boolean);
        setFilters(activeFilters);

    }, [searchParams, sortby]);

    const sortOptions = [
        { id: 'a-z', label: 'Alphabet : A-Z' },
        { id: 'z-a', label: 'Alphabet : Z-A' },
        { id: 'newest', label: 'Date: Newest First' },
        { id: 'oldest', label: 'Date: Oldest First' },
        { id: 'low-high', label: 'Price: Low to High' },
        { id: 'high-low', label: 'Price: High to Low' },
    ];

    return (
        <div className="w-full  bg-white">
            {/* Header Section */}
            <div className="flex justify-between items-center gap-2 font-semibold">

                {/* Filter & Sort Controls */}
                <div className="flex items-center gap-2 sm:gap-3 ">
                    {/* Filter Button */}
                    <div className="relative ">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-amber-50 to-indigo-50  border border-blue-200 rounded-lg  font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                            <Filter className="w-4 h-4 text-indigo-700" />
                            <span className="text-sm sm:text-base text-indigo-900">Filter</span>
                            <ChevronDown className={`w-4 h-4 text-indigo-700 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Filter Dropdown */}
                        {showFilters && (<div
                            onClick={(e) => {
                                if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON" || e.target.tagName === "SPAN") {
                                    setTimeout(() => {
                                        setShowFilters(false)
                                    }, 100);
                                }
                            }}
                            className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-amber-50 text-amber-800 border border-gray-200 rounded-xl shadow-lg z-50 max-h-screen overflow-y-auto">
                            <div className="py-3 px-4">

                                <div className="mb-2 select-none">
                                    <h4 className="font-semibold text-amber-950  mb-2">Availability</h4>
                                    {[{ id: 'instock', label: 'Instock' }, { id: 'outstock', label: ' Out of stock' },].map((c) => < label key={c.id} className="flex items-center cursor-pointer group">
                                        <input type="checkbox" name="availability" checked={availability === c.id}
                                            onChange={(e) => updateSearchParam("avail", e.target.checked ? c.id : null)}
                                            className="w-4 h-4 border-gray-300 rounded accent-amber-900" />
                                        <span className="ml-2 text-sm  ">{c.label} ({c.id === 'instock' ? totalLength.instock : totalLength.outstock}) </span>
                                    </label>)}
                                </div>

                                {categories && <div className="mb-2">
                                    <h4 className="font-semibold text-amber-950  mb-2">Category</h4>
                                    {categories.map(cat => <label key={cat} className="flex items-center cursor-pointer group">
                                        <input type="checkbox" checked={category === cat} onChange={(e) => updateSearchParam("category", e.target.checked ? cat : null)}
                                            className="w-4 h-4  border-gray-300 rounded accent-amber-900 " />
                                        <span className="ml-2 text-sm  ">
                                            {cat}
                                        </span>
                                    </label>)}

                                </div>}

                                <div className="mb-2">
                                    <h4 className="font-semibold text-amber-950  mb-1">Price</h4>
                                    <div className="flex justify-between text-amber-950 mb-2 text-sm font-semibold ">
                                        <p className='bg-amber-200 rounded-full px-4 text-center py-1'>₹{range[0]}.00</p>
                                        <p className='bg-amber-200 rounded-full px-4 text-center py-1'>₹{range[1]}.00</p>
                                    </div>
                                    <Slider range min={50} max={highestPrice} step={10} value={range} onChange={(val) => { setApplybtn(true); setRange(val) }}
                                        trackStyle={[{ backgroundColor: "#ffa571", height: 8 }]}
                                        handleStyle={[
                                            { borderColor: "#812828", backgroundColor: "#d1d5db", marginTop: -4, height: 16, width: 16 },
                                            { borderColor: "#812828", backgroundColor: "#d1d5db", marginTop: -4, height: 16, width: 16 },
                                        ]} railStyle={{ backgroundColor: "#812828", height: 8 }} />
                                    {Applybtn && <button onClick={() => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set("min", range[0]);
                                        newParams.set("max", range[1]);
                                        setSearchParams(newParams);
                                        setApplybtn(false); // Reset apply button after updating
                                    }} className='text-sm bg-gradient-to-bl from-amber-700 to-orange-600 rounded-full pb-0.5 px-3 mt-4 mx-auto block cursor-pointer text-white '>
                                        Apply
                                    </button>}
                                </div>

                                <div className="mb-2">
                                    <h4 className="font-semibold text-amber-950  mb-2">Rating</h4>
                                    {[1, 2, 3, 4].map((r) => <div key={r} className="space-y-2">
                                        <label className="flex items-center cursor-pointer group">
                                            <input checked={r == rating} onChange={(e) => updateSearchParam("rating", e.target.checked ? r : null)}
                                                type="checkbox"
                                                className="w-4 h-4  border-gray-300 rounded accent-amber-900" />
                                            <span className="ml-2 text-sm  group-">
                                                {r}+ Stars
                                            </span>
                                        </label>
                                    </div>)}
                                </div>

                            </div>
                        </div>
                        )}
                    </div>

                    {/* Sort Button */}
                    <div className="relative">
                        <button onClick={() => setshowSort(!showSort)}
                            className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50  border border-green-200 rounded-lg  font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                            <SortAsc className="w-4 h-4 text-green-700" />
                            <span className="text-sm sm:text-base text-green-900">Sort</span>
                            <ChevronDown className={`w-4 h-4 text-green-700 transition-transform duration-200 ${showSort ? 'rotate-180' : ''}`} />
                        </button>
                        {/* Sort Dropdown */}
                        {showSort && <div className="absolute top-full text-amber-950 left-0 mt-2 w-56 bg-amber-100 border border-amber-500 rounded-xl shadow-lg z-50">
                            <div className="p-2">
                                {sortOptions.map(s => <button key={s.id} onClick={() => { setshowSort(false); setSortby(s.id); updateSearchParam("sort", s.id) }} className={` ${sortby === s.id ? "bg-green-200" : "bg-amber-50"} w-full text-left px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors duration-150`}>
                                    {s.label}
                                </button>)}

                            </div>
                        </div>}
                    </div>
                </div>

                {/* Product Count */}
                <div className="flex items-center text-sm gap-1 text-amber-950  bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                    <Package className="w-4 h-4 text-amber-600" />
                    <span className="hidden whitespace-nowrap xs:inline">Total :</span>
                    <span className="text-amber-700 pl-1">{totalLength.total}</span>
                </div>
            </div>

            {/* Active Filters */}
            {filters.length > 0 && <div className="my-2">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-medium ">Active Filters:</span>
                    <button onClick={() => {
                        setSearchParams({});
                        setRange([100, 500]);
                        setSortby('a-z')
                    }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        Clear All
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {filters.map((f, i) => <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {f.label}<X onClick={() => {
                            const newParams = new URLSearchParams(searchParams);
                            // Remove specific filter based on label
                            if (f.label.includes('₹')) {
                                // Price filter
                                newParams.delete('min');
                                newParams.delete('max');
                                setRange([100, 500]); // Reset range slider
                            } else if (f.label.includes('Stars')) {
                                newParams.delete('rating');
                            } else if (f.label === 'In Stock' || f.label === 'Out of Stock') {
                                newParams.delete('avail');
                            } else if (sortOptions.some(s => s.label === f.label)) {
                                newParams.delete('sort');
                                setSortby('a-z'); // Reset sort
                            } else {
                                // Must be category
                                newParams.delete('category');
                            }
                            setSearchParams(newParams);
                        }} className="w-3 h-3 cursor-pointer" />
                    </span>)}
                </div>
            </div>}


            {/* Current Sort Display */}
            <div className="text-sm pt-3 ">
                Sorted by: <span className="font-medium  ">{(sortOptions.find(s => s.id === sortby)).label}</span>
            </div>
        </div>
    );
};

export default FilterSortUI;
import { useContext, useEffect, useRef, useState } from 'react'
import { ProductDataContext } from '../context/ProductContext';

import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
const SearchInput = ({ search, setsearch }) => {
    const searchRef = useRef(null);
    const [inputText, setInputText] = useState('')
    const [suggest, setSuggest] = useState(null)
    const { searchProduct } = useContext(ProductDataContext)

    useEffect(() => {
        const delay = setTimeout(() => {
            if (inputText !== "") {
                searchProduct(inputText)
                    .then(res => setSuggest(res))
                    .catch(err => console.log(err));
            } else {
                setSuggest(null);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(delay); // cleanup old timeout
    }, [inputText]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && event.target.id !== "link" && !searchRef.current.contains(event.target)) {
                setsearch(false);
            }
        };
        if (search) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [search]);

    return (
        <div className=' h-18 w-full md:mt-4 relative'>
            <div ref={searchRef} className="relative">
                <input value={inputText}
                    onChange={(e) => { setInputText(e.target.value) }}
                    type="text"
                    className='outline-none text-xl font-normal bg-orange-50/30 border-2 w-full my-2 focus:border-amber-900 rounded-full px-5 py-1.5' />
                {inputText === "" && <div className="absolute left-5 top-1/2 text-xl -translate-y-1/2 flex items-center pointer-events-none text-gray-400">
                    <IoIosSearch size={25} />
                    <span>Search</span>
                </div>}
                {inputText && <span onClick={() => setInputText("")} className='absolute right-4 text-xl bg-amber-950 rounded-full top-1/2 -translate-y-1/2 cursor-pointer w-6 h-6 flex items-center justify-center text-white'>&times;</span>}
            </div>

            <div className={`bg-white/90 backdrop-blur-2xl max-h-[40vh] transition-all duration-300 ease-in-out overflow-auto rounded-md shadow-2xl text-base font-medium absolute z-50 w-10/11  left-1/2 ${suggest?.length >= 1 ? " opacity-100 " : "opacity-0 border-none"}   -translate-x-1/2  `}>
                {suggest?.map((t, i) => <Link id='link' key={i} to={`/product/${t._id}`}
                    className='hover:bg-amber-100/50 border-b-[1px] px-4  py-1.5 block text-amber-950 border-indigo-100 transition-colors duration-200'>
                    {/* <img src="s" alt="in future add" /> */}
                    {t.title}
                </Link>)}
            </div>
        </div>
    )
}

export default SearchInput
import { useContext, useEffect, useState } from 'react'
import { ProductDataContext } from '../context/ProductContext'
import { Link } from 'react-router-dom'

const CategoryPanel = () => {
    const { categoryPublic } = useContext(ProductDataContext)
    const [categories, setCategories] = useState(null)
    const [AllCategories, setAllCategories] = useState(false)
    // const categories = [...new Set(products?.map(p => p.category.trim()))] // this method is not requred for pagination logic.
    useEffect(() => {
        categoryPublic().then((data) => {
            if (data) {
                setCategories(data)
            }
        });
    }, [])

    return (categories &&
        <section className=" px-4 relative ">
            <div className='flex justify-between items-center my-5  w-full'>
                <h1 className="text-base md:text-2xl font-semibold  ">Category</h1>
                {(categories?.length > 4 && !AllCategories) ? <p onClick={() => setAllCategories(true)} className='text-blue-600 text-sm md:hidden '>See All</p> : categories.length > 4 && <span className='text-2xl text-red-500 text-center ' onClick={() => setAllCategories(false)}>&times;</span>}
            </div>
            <section id='categoryscroll' className={`   ${AllCategories ? "max-h-screen" : "xs:h-23 sm:h-28"}   md:h-fit grid grid-cols-3 overflow-x-auto xs:grid-cols-4  sm:grid-cols-6 md:flex items-center shrink-0 md:gap-4 xs:overflow-y-hidden w-full md:overflow-x-auto`}>
                {categories?.map((c, i) => {
                    return <div key={i} className="  mb-2  text-xl text-center font-semibold ">
                        <Link to={`/product/all?category=${c.name}`} className=" inline-block overflow-hidden h-18 w-18 sm:h-20 sm:w-20   rounded-full md:h-30 md:w-30 ">
                            <img className="w-full h-full object-cover object-center" src={c.image} alt="manually adding picture" />
                        </Link>
                        <h1 className="font-[PP backdrop-blur-xs text-shadow-2xs font-normal  md:text-base text-xs sm:text-sm">{c.name}</h1>
                    </div>
                })}
            </section>
        </section>
    )
}

export default CategoryPanel
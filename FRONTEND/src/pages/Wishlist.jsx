import { useContext, useEffect, useState } from 'react'
import BackTitle from '../components/BackTitle'
import FlashSale from '../components/FlashSale'
import { CustomerDataContext } from '../context/CustomerContext'

const Wishlist = () => {
    const { getWishlist } = useContext(CustomerDataContext)
    const [products, setproducts] = useState(null)
    const wishlisted = products?.map((e) => e._id) || [];
    const [remove, setRemove] = useState(null)

    useEffect(() => {
        getWishlist().then(res => {
            setproducts(res)
        }).catch(err => console.log(err.response.data))
    }, [remove])


    return (products && wishlisted &&
        <div>
            <nav className='md:hidden '>
                <BackTitle page={'My Wishlists'} />
            </nav>
            <h1 className='mt-6 hidden md:block px-4 lg:px-12 text-2xl font-semibold text-amber-900'>Wishlists</h1>
            <FlashSale allProduct={products} page={"wishlistPage"} setRemove={setRemove} profile={{ wishlist: wishlisted }} />
        </div>
    )
}

export default Wishlist

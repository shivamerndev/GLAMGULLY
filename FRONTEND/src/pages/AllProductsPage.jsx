import { useContext, useEffect, useState } from "react";
import { ProductDataContext } from "../context/ProductContext";
import InfiniteScroll from "react-infinite-scroll-component";
import FlashSale from "../components/FlashSale"
import FilterSortUI from "../components/FilterSortUi";
import SearchInput from "../components/SearchInput"
import BackTitle from "../components/BackTitle";
import ProgressLoader from "../utils/ProgressLoader";
import { data, useSearchParams } from "react-router-dom";

const AllProductsPage = () => {
    const [query, setquery] = useSearchParams()
    const { getProducts } = useContext(ProductDataContext);
    const [products, setProducts] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalLength, setTotalLength] = useState({});
    const [categories, setCategories] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setPage(1)
        setHasMore(true);
        getProducts(1, limit, query).then((data) => {
            setProducts(data.products);
            setTotalLength(data.productsLength)
            setCategories(data.categories)
            if (data.products.length >= data.productsLength.total) {
                setHasMore(false);
            }
        })
    }, [query]);

    const fetchMoreData = () => {
        getProducts(page + 1, limit, query).then((data) => {
            if (data.products.length === 0) {
                setHasMore(false);
                return;
            }
            setProducts(prev => [...prev, ...data.products]);
            setPage(prev => prev + 1);
            // Check if we've loaded all products
            if (products.length + data.products.length >= totalLength.total) {
                setHasMore(false);
            }
        });
    };

    return (products ?
        <div className="w-full min-h-screen py-2 ">
            <BackTitle page={"All Products"} icon={false} />
            <nav className="relative w-full px-4 lg:px-8">
                <div className="md:absolute md:left-[55vw] lg:left-1/2 md:-translate-x-1/2 md:-translate-y-1/3 w-full lg:w-1/2 z-10 md:w-2/5">
                    <SearchInput />
                </div>
                <FilterSortUI totalLength={totalLength} categories={categories} />
            </nav>
            <InfiniteScroll
                dataLength={products.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4 className="text-center mb-4 font-semibold text-blue-500">Loading...</h4>}
                endMessage={totalLength.total <= limit ? <p className="text-center">No more products.</p>
                    : <p className="text-center my-4 text-green-500 font-semibold">Yay! You have seen it all</p>
                }>
                <FlashSale page={"allproducts"} allProduct={products} />
            </InfiniteScroll>
        </div> : <ProgressLoader response={products} />
    )
}

export default AllProductsPage;

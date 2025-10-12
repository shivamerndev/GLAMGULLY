import { useState, useRef, useEffect, useContext } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, User } from "lucide-react";
import { CustomerDataContext } from "../context/CustomerContext";

const CustomersReviews = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);
    const [reviewImgres, setreviewImgres] = useState(null)
    const { readReviewsImg } = useContext(CustomerDataContext)


    const reviewImg = [
        {
            reviewpicture:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
            customerName: "Priya Sharma",
            rating: 5,
            review:
                "Amazing quality! Exactly what I was looking for. The fabric is soft and the fit is perfect.",
            date: "2 days ago",
        },
        {
            reviewpicture:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
            customerName: "Rahul Kumar",
            rating: 4,
            review:
                "Great product with fast delivery. Packaging was excellent and the item matches the description.",
            date: "1 week ago",
        },
        {
            reviewpicture:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
            customerName: "Vikram Singh",
            rating: 4,
            review:
                "Good value for money. The quality exceeded my expectations. Will definitely buy again.",
            date: "1 month ago",
        },
        {
            reviewpicture:
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
            customerName: "Neha Gupta",
            rating: 5,
            review:
                "Absolutely fantastic! The customer service was also very helpful. Five stars!",
            date: "2 months ago",
        },
    ];

    useEffect(() => {
        // readReviewsImg().then(res => setreviewImgres(res))
    }, [])


    const scrollToIndex = (index) => {
        setActiveIndex(index);
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.children[0]?.offsetWidth || 0;
            const gap = 16; // 1rem gap
            const scrollPosition = index * (cardWidth + gap);

            container.scrollTo({
                left: scrollPosition,
                behavior: "smooth",
            });
        }
    };

    const handlePrevious = () => {
        const newIndex = activeIndex > 0 ? activeIndex - 1 : reviewImg.length - 1;
        scrollToIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = activeIndex < reviewImg.length - 1 ? activeIndex + 1 : 0;
        scrollToIndex(newIndex);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => <Star key={index}
            className={`w-4 h-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)
    };

    if (!reviewImg || reviewImg.length === 0) return null;
    return (
        <section className="px-4 py-2 bg-gradient-to-br from-indigo-50 to-gray-50 rounded-md relative">
            {/* Header */}
            <div className="text-center mt-2">
                <h1 className="sm:text-2xl text-xl font-semibold md:text-4xl sm:font-bold text-purple-800 mb-1 animate-pulse duration-500">
                    ⬇ Customer Reviews ⬇
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                    See what our customers are saying about their experience
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="flex">{renderStars(5)}</div>
                    <span className="text-lg font-semibold text-gray-700">4.8</span>
                    <span className="text-gray-500">({reviewImg.length} reviews)</span>
                </div>
            </div>

            {/* Reviews Container */}
            <div
                ref={scrollContainerRef}
                className="flex items-end gap-2 h-65 sm:h-75 md:h-90 bg-red-30 overflow-x-auto lg:px-8 "
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {reviewImg.map((review, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`relative flex-shrink-0 cursor-pointer transition-all duration-300 ease-out group
                            ${activeIndex === index
                                ? "transform -translate-y-4 scale-105"
                                : "transform translate-y-0 scale-100 hover:-translate-y-2"
                            }
                            w-40 sm:w-50 md:w-60`}>
                        {/* Main Card */}
                        <div className="bg-white h-60 sm:h-70 md:h-80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                            {/* Image Section */}
                            <div className="relative h-1/2 overflow-hidden">
                                <img
                                    src={review.reviewpicture}
                                    alt={`Review by ${review.customerName}`}
                                    className="w-full h-full object-cover transition-transform duration-300 " />

                                {/* Rating Overlay */}
                                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-semibold">{review.rating}</span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="px-4 py-2 ">
                                {/* Customer Info */}
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xs md:text-base text-gray-800">
                                            {review.customerName}
                                        </h3>
                                        <p className="text-xs hidden sm:block text-gray-500">{review.date}</p>
                                    </div>
                                </div>

                                {/* Rating Stars */}
                                <div className="flex items-center gap-1 mb-2">
                                    {renderStars(review.rating)}
                                </div>

                                {/* Review Text */}
                                <div className="relative">
                                    <Quote className="absolute top-1 -left-1.5 w-4 h-4 text-gray-300" />
                                    <p id="categoryscroll" className="text-gray-700 h-12 mb-4 overflow-y-auto text-xs sm:text-sm leading-relaxed pl-3 italic">
                                        "{review.review}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Active Indicator */}
                        {activeIndex === index && (
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="md:flex hidden px-4 justify-between items-center w-full absolute top-1/2 left-0 my-4">
                <button
                    onClick={handlePrevious}
                    className="bg-white backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                    onClick={handleNext}
                    className="bg-white backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            <div className="flex gap-2 my-4 w-full justify-center">
                {reviewImg.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex
                            ? "bg-blue-500 scale-125"
                            : "bg-gray-300 hover:bg-gray-400"}`} />
                ))}
            </div>

            {/* View All Reviews Button */}
            {/* <div className="text-center mt-4">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    View All Reviews
                </button>
            </div> */}
        </section>
    );
};

export default CustomersReviews;

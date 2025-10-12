
import { useNavigate } from 'react-router-dom';

const BackTitle = ({ icon, page, toggleWishlist }) => {
    const navigate = useNavigate()
    return (
        <div className='bg-white/50 text-amber-950 backdrop-blur-2xl sticky top-0 z-50 w-full py-2 px-2 md:mb-4 flex justify-between items-center'>
            <h1 onClick={() => navigate(-1)} className='border cursor-pointer hover:bg-amber-200 border-amber-950/30 rounded-full h-8 w-8 pt-0.5 text-center content-center'>
                <i className="fi fi-ss-arrow-small-left text-2xl"></i>
            </h1>
            <h1 className='text-base font-semibold capitalize'>
                {page}
            </h1>
            <button style={icon ? { border: "1px solid gray " } : null} onClick={toggleWishlist}
                className=" cursor-pointer h-8 w-8 border-amber-950/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                {icon}
            </button>
        </div>
    )
}

export default BackTitle;

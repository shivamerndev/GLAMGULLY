import { FaShieldAlt, FaSmile, FaCoins, FaUndo, FaExchangeAlt, FaRupeeSign } from "react-icons/fa";

const DetailsImogi = () => {
    return (
        <div className=" text-sm tracking-tight overflow-hidden">
            <div className="grid grid-cols-3 text-amber-950 text-center whitespace-nowrap py-3 mt-2 gap-2 border-b border-t md:border-t-0  border-amber-300">
                <div className="space-y-2 hover:scale-105 transition-transform">
                    <div className="flex justify-center text-2xl text-amber-800/90">
                        <FaShieldAlt />
                    </div>
                    <p className="font-medium">Anti Tarnish</p>
                </div>
                <div className="space-y-2 hover:scale-105 transition-transform">
                    <div className="flex justify-center text-2xl text-amber-800/90">
                        <FaSmile />
                    </div>
                    <p className="font-medium">Skin Friendly</p>
                </div>
                <div className="space-y-2 hover:scale-105 transition-transform">
                    <div className="flex justify-center text-2xl text-amber-800/90 ">
                        <FaCoins />
                    </div>
                    <p className="font-medium">18k Gold Plated</p>
                </div>
                {/* <div className="space-y-2 hover:scale-105 transition-transform">
                    <div className="flex justify-center text-2xl text-amber-800 ">
                        <FaUndo />
                    </div>
                    <p className="font-medium">1 Day Return</p>
                </div>
                <div className="space-y-2 hover:scale-105 transition-transform">
                    <div className="flex justify-center text-2xl text-amber-800">
                        <FaExchangeAlt />
                    </div>
                    <p className="font-medium">1 Day Exchange</p>
                </div>
                {(p?.price) > 499 && (<div className="space-y-2 hover:scale-105 transition-transform">
                    <div className="flex justify-center text-2xl text-amber-800 ">
                        <FaRupeeSign />
                    </div>
                    <p className="font-medium">Cash On Delivery</p>
                </div>)} */}

            </div>
        </div>
    );
};

export default DetailsImogi;

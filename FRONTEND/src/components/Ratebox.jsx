import { FaStar } from "react-icons/fa";

export default function RateBox({ Starquantity, setStarquantity, setrateBox, create }) {
    return (
        <div id="outside" onClick={(e) => {
            if (e.target.id === "outside") {
                setrateBox(false);
            }

        }} className="flex flex-col text-white h-screen fixed z-10 bottom-0 left-0 w-full justify-center items-center bg-black/60 backdrop-blur-sm"> 
          
            {/* Card */}
            <div className="bg-gray-900/80 p-8 rounded-2xl shadow-lg flex flex-col items-center w-[90%] max-w-md border border-gray-700">
                <h1 className="text-2xl font-semibold">Rate this product</h1>
                <p className="text-yellow-200 mt-2 text-lg">
                    {Starquantity > 0 ? `${Starquantity} / 5` : "Select stars"}
                </p>
                {/* Stars */}
                <div className="flex gap-4 mt-4">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i}
                            onClick={() => setStarquantity(i + 1)}
                            size={45}
                            className={`cursor-pointer transition-transform hover:scale-110 ${i < Starquantity ? "text-yellow-500" : "text-gray-500"}`} />
                    ))}
                </div>
                {/* Submit Button */}
                <button
                    className="mt-6 px-6 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
                    disabled={Starquantity === 0}
                    onClick={() => {
                        setrateBox(false);
                        create();
                    }}>
                    Submit
                </button>
            </div>
            {/* Later Option */}
              <span
                onClick={() => {setrateBox(false);
                    create()}}
                className="text-white mt-3 underline text-sm cursor-pointer hover:text-red-400 transition">
                i'll do it later.
            </span>
        </div>
    );
}

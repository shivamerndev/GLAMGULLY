import { useEffect, useState } from "react"

const ProgressLoader = ({ response }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 90 ? prev + 10 : prev)); // loader progress badhta rahe
        }, 200);
        if (response) {
            setProgress(100)
        } else {
            setTimeout(() => {
                setProgress('Failed')
            }, 3000);
        }
        return () => {
            clearInterval(interval);
        }
    }, [response])

    return (
        <div className=" flex justify-center items-center h-screen w-full ">
            {/* <img className=" object-contain md:h-1/3 h-1/5 "
                src={Loader} alt="product loading..." /> */}
            <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="gray"
                        strokeWidth="6"
                        fill="transparent"
                        className="opacity-30" />
                    <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 36}
                        strokeDashoffset={2 * Math.PI * 36 - (progress / 100) * 2 * Math.PI * 36}
                        className="transition-all duration-200 ease-in-out" />
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" /> {/* amber-500 */}
                            <stop offset="100%" stopColor="#ef4444" /> {/* red-500 */}
                        </linearGradient>
                    </defs>
                </svg>
                <div className={` ${typeof progress !== "number" ? "text-red-500 font-bold" : "text-amber-950 font-semibold"} absolute inset-0 flex items-center justify-center text-base `}>
                    {progress}{typeof progress === "number" && "% "}
                </div>
            </div>
        </div>
    )
}
export default ProgressLoader

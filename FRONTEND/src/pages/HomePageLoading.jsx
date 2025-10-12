import { useEffect, useState } from "react";

const HomePageLoading = () => {
    const [scaled, setScaled] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setScaled(true), 100); // loading homepage.
        return () => {
            clearTimeout(timeout);
        }
    }, []);
    return (
        <div className=" flex flex-col  items-center justify-center h-screen w-full overflow-hidden">
            <div className="min-w-40 max-h-10/11 flex items-end justify-center overflow-hidden">
                <img className={`h-full w-full object-cover object-top transition-transform duration-1000 ease-in-out ${scaled ? 'scale-120' : 'scale-80'}`}
                    src="https://res.cloudinary.com/dgis42anh/image/upload/v1755582685/Screenshot_2025-05-25_205010_zsb3ed.png" alt="" />
            </div>
                <div className=" min-w-40 max-h-1/7 mx-auto borde flex items-center justify-center overflow-hidden ">
                    <img className=" w-full h-full object-cover object-center" src="/homeWaiting.webp" alt="loading..." />
                </div>
        </div>

    )
}

export default HomePageLoading;

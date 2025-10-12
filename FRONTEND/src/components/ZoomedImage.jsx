import React from 'react'

const ZoomedImage = ({ position, img }) => {
    return (
        <div className="fixed h-[75vmin] w-1/2 z-50 top-16 right-0 bg-white hidden md:inline-block rounded-lg overflow-hidden">
            <img src={img} alt="zoom" className="w-full h-full object-cover"
                style={{
                    transform: `scale(2) translate(-${position.x - 35}%, -${position.y - 55}%)`,
                    transformOrigin: `${position.x - 55}% ${position.y - 5}%`
                }} />
        </div>
    )
}

export default ZoomedImage

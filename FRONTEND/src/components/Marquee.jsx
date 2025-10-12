import React from 'react'

const Marquee = () => {
    return (
        <div id="marquee" className="w-full hidden md:flex overflow-hidden text-xl uppercase font-semibold text-white text-center relative h-10 my-8">
            <div className="marquee-track flex">
                <span className=" whitespace-nowrap py-1.5  px-1">Anti tarnish •  waterproof • skin friendly • Anti tarnish •  waterproof • skin friendly • Anti tarnish •  waterproof • skin friendly •</span>
                <span className=" whitespace-nowrap py-1.5  px-1">Anti tarnish •  waterproof •  skin friendly • Anti tarnish •  waterproof • skin friendly • Anti tarnish •  waterproof • skin friendly •</span>
            </div>
        </div>
    )
}

export default Marquee

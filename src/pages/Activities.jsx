import React from 'react'
import { MicIcon, SearchIcon } from '../icons'

function Activities() {
    return (
        <div className='bg-base-200 min-h-screen'>
            <div className="px-6 py-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <SearchIcon className='w-5' />
                    </div>
                    <input
                        className="w-full bg-white border-none outline-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] py-3 pl-14 pr-14 rounded-full font-sans text-lg shadow-[0_4px_24px_rgba(78,33,32,0.04)] transition-all placeholder:text-[#4e2120]/40"
                        placeholder="Search for a place"
                        type="text"
                        />
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                        <MicIcon className='w-5.5' />
                    </div>
                </div>

            </div>

            <div className="">
                <h1>Chill & Hangout</h1>

            </div>


        </div>
    )
}

export default Activities
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { LeftIcon, CameraIcon, YourLocationIcon, StarIcon } from '../../icons';
import mockActImg from '../../assets/mockPlaceImg.jpg'
import mockPfImg from '../../assets/default-profilepic.jpg'

function ActivitiesReview() {
    const navigate = useNavigate();


    const hdlGoBack = () => {
        navigate(-1);
    };


    return (
        <div className="min-h-screen bg-base-200 flex flex-col">

            <header className="w-full top-0 sticky z-40 bg-base-200 shadow-[0_8px_32px_rgba(78,33,32,0.08)] flex flex-col justify-between gap-5 px-6 py-4 relative">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={hdlGoBack}
                        className="text-[#a83100] hover:opacity-80 active:scale-95 transition-transform duration-200 relative z-10"
                    >
                        <LeftIcon className="w-8" />
                    </button>

                    <button className="text-2xl font-bold text-neutral">•••</button>
                </div>

                <div className="w-full flex items-center gap-4">
                    <div className="w-full flex flex-col gap-4">
                        <h2 className="text-[22px] font-bold text-black">Benjakitti Park</h2>

                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Benjakitti Park')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-[12px] font-medium bg-amber-200 flex justify-between items-center"
                        >
                            <span>Ratchadaphisek Rd, Khlong Toei, Bangkok 10110</span>
                            <div className="bg-base-100 w-fit rounded-full p-1.5">
                                <YourLocationIcon className='w-6' />
                            </div>
                        </a>
                    </div>
                </div>

            </header>

            {/* Review Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 overflow-y-auto px-6 pt-4 pb-8 flex flex-col gap-8"
            >

                <div className="flex flex-col gap-4">
                    <h3 className='font-bold'>Reviews (999)</h3>
                    <div className="flex gap-4">
                        <div className="w-23 h-25 rounded-[8px] overflow-hidden shadow-md flex-shrink-0 bg-white">
                            <img src={mockActImg} alt="mockIMG" className='w-full h-full object-cover' />
                        </div>
                        <div className="flex flex-col gap-2 py-2">
                            <p className="text-[12px] line-clamp-2 leading-3">
                                Easily one of the most beautiful green spaces in Bangkok. The park is very spacious, clean, and well maintained. Walking around the large 
                            </p>
                            <div className="flex items-center">
                                <StarIcon className='w-4 text-yellow-400' />
                                <p className='text-[10px]'><span className='font-bold'>4.4</span>/5 (67)</p>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <p className='text-[10px]'>manitapockpew100%</p>
                                <div className="w-7 h-7 rounded-full overflow-hidden shadow-md flex-shrink-0 bg-white">
                                    <img src={mockPfImg} alt="mockIMG" className='w-full h-full object-cover' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-23 h-25 rounded-[8px] overflow-hidden shadow-md flex-shrink-0 bg-white">
                            <img src={mockActImg} alt="mockIMG" className='w-full h-full object-cover' />
                        </div>
                        <div className="flex flex-col gap-2 py-2">
                            <p className="text-[12px] line-clamp-2 leading-3">
                                Easily one of the most beautiful green spaces in Bangkok. The park is very spacious, clean, and well maintained. Walking around the large 
                            </p>
                            <div className="flex items-center">
                                <StarIcon className='w-4 text-yellow-400' />
                                <p className='text-[10px]'><span className='font-bold'>4.4</span>/5 (67)</p>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <p className='text-[10px]'>manitapockpew100%</p>
                                <div className="w-7 h-7 rounded-full overflow-hidden shadow-md flex-shrink-0 bg-white">
                                    <img src={mockPfImg} alt="mockIMG" className='w-full h-full object-cover' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </motion.div>
        </div>
    );
}

export default ActivitiesReview;
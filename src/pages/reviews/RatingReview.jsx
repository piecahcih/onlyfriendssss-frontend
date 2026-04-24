 import { useEffect, useState } from 'react';
 import { useNavigate } from 'react-router';
 import { motion } from 'framer-motion';
 import { LeftIcon, CameraIcon, YourLocationIcon, StarIcon } from '../../icons';
 import mockActImg from '../../assets/mockPlaceImg.jpg'
 import mockPfImg from '../../assets/default-profilepic.jpg'
 import useReviewStore from '../../stores/reviewStore';
  
 function RatingReview() {
     const navigate = useNavigate();
     
     const reviews = useReviewStore((state) => state.reviews);
     const getAllReviewsMe = useReviewStore((state) => state.getAllReviewsMe);
     
     const BACKEND_URL = "http://localhost:3999";

     
     useEffect(() => {
         getAllReviewsMe();
     }, [getAllReviewsMe]);
     console.log("getAllReviewsMe",getAllReviewsMe)

     const getFullImgPath = (path) => {
         if (!path) return null;
         if (typeof path !== "string" || path.startsWith("data:") || path.startsWith("http")) {
             return path;
         }
         return `${BACKEND_URL}${path}`;
     };

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
                         <h2 className="text-[22px] font-bold text-black">Review List</h2>

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
                     <h3 className='font-bold'>Reviews ({reviews?.length || 0})</h3>


                     {reviews && reviews.length > 0 ? (
                         reviews.map((item) => (
                             <div key={item.id} className="flex gap-4">
                                 <div className="w-23 h-25 rounded-[8px] overflow-hidden shadow-md flex-shrink-0bg-white">
                                     <img
                                         src={item.activity.coverPhoto ? getFullImgPath(item.activity.coverPhoto) : mockActImg}
                                         alt="ReviewIMG"
                                         className='w-full h-full object-cover'
                                     />
                                 </div>
                                 <div className="flex flex-col gap-2 py-2 flex-1">
                                     <p className="text-[12px] line-clamp-2 leading-3">
                                         {item.comment || "No comment provided"}
                                     </p>
                                     <div className="flex items-center">
                                         <StarIcon className='w-4 text-yellow-400' />
                                         <p className='text-[10px]'><span className='font-bold'>{item.rating}</span>/5</p>
                                     </div>
                                     <div className="flex items-center justify-end gap-3">
                                         <p className='text-[10px]'>{item.reviewer?.username}</p>
                                         <div className="w-7 h-7 rounded-full overflow-hidden shadow-md flex-shrink-0 bg-white">
                                            <img
                                                src={getFullImgPath(item.reviewer?.profileImg)}
                                                 alt="reviewer"
                                                 className='w-full h-full object-cover'
                                             />
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         ))
                     ) : (
                         <div className="text-center py-10 opacity-50">No reviews found</div>
                     )}
                 </div>

             </motion.div>
         </div>
    );
 }

 export default RatingReview;
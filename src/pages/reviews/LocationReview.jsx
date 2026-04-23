import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { LeftIcon, YourLocationIcon, StarIcon } from '../../icons';
import { getAllActivitiesReviewsApi } from '../../api/mainApi';
import mockPfImg from '../../assets/default-profilepic.jpg';

function LocationReview() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const placeid = searchParams.get("placeid");

    const [reviews, setReviews] = useState([]);
    const [placeInfo, setPlaceInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avgRating, setAvgRating] = useState(0);

    console.log(reviews)

    useEffect(() => {
        const fetchReviews = async () => {
            if (!placeid) return;
            try {
                setLoading(true);
                const res = await getAllActivitiesReviewsApi();
                const allData = res.data.reviews || [];
                
                const filteredData = allData.filter(item => {
                    if (!item.activity) return false;
                    return String(item.activity.placeId) === String(placeid);
                });
                
                setReviews(filteredData);

                if (filteredData.length > 0) {
                    const total = filteredData.reduce((acc, curr) => acc + curr.rating, 0);
                    setAvgRating((total / filteredData.length).toFixed(1));
                    setPlaceInfo(filteredData[0].activity.place);
                }
            } catch (error) {
                console.error("Error fetching location reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [placeid]);

    const hdlGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full"
                    />
                    <span className="text-xs bai-jamjuree-bold text-primary/40 uppercase tracking-widest">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans pb-24 overflow-x-hidden">
            {/* --- HERO IMAGE SECTION --- */}
            <div className="relative w-full h-65 overflow-hidden">
                <img 
                    src={reviews[0]?.activity?.coverPhoto} 
                    className="w-full h-full object-cover scale-110 blur-[2px] brightness-75"
                    alt="background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#F8F9FB]"></div>
                
                {/* Back Button */}
                <button
                    onClick={hdlGoBack}
                    className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all z-50"
                >
                    <LeftIcon className="w-5 h-5" />
                </button>
            </div>

            {/* --- MAIN CONTENT (SHIFTS UP) --- */}
            <main className="flex-1 px-6 -mt-33 relative z-10">
                {/* Location Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white"
                >
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-[10px] bai-jamjuree-bold text-primary uppercase tracking-[0.2em]">Popular Destination</span>
                            <h2 className="text-3xl bai-jamjuree-bold text-neutral leading-tight italic">
                                {placeInfo?.placeName || "Location"}
                            </h2>
                            <div className="flex items-center gap-2 pt-1">
                                <YourLocationIcon className='w-4 h-4 text-primary/40' />
                                <span className="text-xs bai-jamjuree-medium text-neutral/40 truncate">
                                    {placeInfo?.address || "Address not available"}
                                </span>
                            </div>
                        </div>

                        <div className="h-[1px] w-full bg-gray-100"></div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-yellow-400/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                                    <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-lg bai-jamjuree-bold text-neutral">{reviews.length > 0 ? avgRating : "0.0"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] bai-jamjuree-bold text-neutral/30 uppercase">Based on</span>
                                    <span className="text-xs bai-jamjuree-bold text-neutral/60">{reviews.length} Experiences</span>
                                </div>
                            </div>
                            
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeInfo?.placeName + " " + (placeInfo?.address || ""))}`}
                                target="_blank"
                                className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-all"
                            >
                                <YourLocationIcon className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Reviews Section */}
                <div className="mt-10 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className='text-xl bai-jamjuree-bold text-neutral italic'>Visitor Stories</h3>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence>
                            {reviews.length === 0 ? (
                                <div className="py-20 text-center opacity-20 italic">No stories yet...</div>
                            ) : (
                                reviews.map((review, index) => (
                                    <motion.div 
                                        key={review.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-[35px] p-6 shadow-sm border border-white flex flex-col gap-5"
                                    >
                                        {/* User Info & Rating */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                                    <img 
                                                        src={review.reviewer?.profileImg || mockPfImg} 
                                                        alt="avatar" 
                                                        className='w-full h-full object-cover'
                                                        onError={(e) => e.target.src = mockPfImg}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs bai-jamjuree-bold text-neutral">@{review.reviewer?.username}</span>
                                                    <span className="text-[9px] bai-jamjuree-medium text-neutral/30 uppercase">Verified Participant</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon 
                                                        key={i} 
                                                        className={`w-2.5 h-2.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-100'}`} 
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Activity Pill */}
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                                                <img src={review.activity?.coverPhoto || mockActImg} className="w-full h-full object-cover" alt="act" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-[8px] bai-jamjuree-bold text-primary uppercase">Activity</span>
                                                <span className="text-[11px] bai-jamjuree-bold text-neutral truncate">{review.activity?.title}</span>
                                            </div>
                                        </div>

                                        {/* Comment */}
                                        {review.comment && (
                                            <p className="text-[14px] bai-jamjuree-medium text-neutral/80 leading-relaxed px-1">
                                                {review.comment}
                                            </p>
                                        )}

                                        <div className="text-[9px] bai-jamjuree-bold text-neutral/20 text-right uppercase tracking-widest">
                                            {new Date(review.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LocationReview;

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { LeftIcon, YourLocationIcon, StarIcon } from '../../icons';
import useReviewStore from '../../stores/reviewStore';
import mockPfImg from '../../assets/default-profilepic.jpg';

function LocationReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const placeid = searchParams.get("placeid");

  const getAllActivitiesReviews = useReviewStore((state) => state.getAllActivitiesReviews);
  const allReviews = useReviewStore((state) => state.reviews);

  const [reviews, setReviews] = useState([]);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!placeid) return;
      try {
        setLoading(true);
        await getAllActivitiesReviews();
      } catch (error) {
        console.error("Error fetching location reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [placeid, getAllActivitiesReviews]);

  useEffect(() => {
    if (allReviews && placeid) {
      const filteredData = allReviews.filter(item => {
        if (!item.activity) return false;
        return String(item.activity.placeId) === String(placeid);
      });

      setReviews(filteredData);

      if (filteredData.length > 0) {
        const total = filteredData.reduce((acc, curr) => acc + curr.rating, 0);
        setAvgRating((total / filteredData.length).toFixed(1));
        setPlaceInfo(filteredData[0].activity?.place);
      }
    }
  }, [allReviews, placeid]);

  const hdlGoBack = () => {
    navigate(-1);
  };

  const parseImages = (imgData) => {
    if (!imgData) return []
    try {
      const parsed = JSON.parse(imgData)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch (e) {
      return [imgData]
    }
  }

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
    <div className="min-h-screen bg-base-200 flex flex-col font-sans pb-24 overflow-x-hidden">
      <div className="relative w-full h-60 overflow-hidden">
        <img
          src={reviews[0]?.activity?.coverPhoto}
          className="w-full h-full object-cover scale-110 blur-[2px] brightness-75"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#F8F9FB]"></div>

        <button
          onClick={hdlGoBack}
          className="absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all z-50"
        >
          <LeftIcon className="w-8" />
        </button>
      </div>

      <main className="flex-1 px-6 -mt-40 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[12px] px-7 py-4 ">

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] bai-jamjuree-bold text-primary uppercase tracking-[0.2em]">Popular Destination</span>
              <h2 className="text-2xl bai-jamjuree-bold text-neutral leading-tight italic">
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
                  <span className="text-[14px] bai-jamjuree-bold text-neutral">{reviews.length > 0 ? avgRating : "0.0"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] bai-jamjuree-bold text-neutral/30 uppercase">Based on</span>
                  <span className="text-xs bai-jamjuree-bold text-neutral/60">{reviews.length} Experiences</span>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeInfo?.placeName + " " + (placeInfo?.address || ""))}`}
                target="_blank"
                className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center "
              >
                <YourLocationIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className='text-xl bai-jamjuree-bold text-neutral italic'>Visitor Stories</h3>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="w-2 h-2 rounded-full bg-primary/20"></div>
            </div>
          </div>

          <div className="space-y-2">
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
                    className="px-6 py-2 mb-2 flex flex-col gap-2"
                  >
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
                          <div className="mt-1 text-[9px] bai-jamjuree-bold text-neutral/60 uppercase tracking-widest">
                            {new Date(review.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-100'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {review.comment && (
                      <div className="relative group">
                        <p className="text-[15px] bai-jamjuree-medium text-neutral/80 leading-[1.6] tracking-tight italic">
                          {review.comment}
                        </p>
                      </div>
                    )}

                    {review.imageUrl && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {parseImages(review.imageUrl).map((imgUrl, i) => (
                          <div key={i} className="w-20 h-20 rounded-md overflow-hidden">
                            <img
                              src={imgUrl}
                              alt={`review-${i}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[10px] bai-jamjuree-bold text-neutral/60 text-right uppercase tracking-widest">
                      <p>{review.activity?.category}</p>
                    </div>

                    <div className="h-[1px] w-full bg-gray-200"></div>

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

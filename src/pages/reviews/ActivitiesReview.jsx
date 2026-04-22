import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LeftIcon } from "../../icons";
import useReviewStore from "../../stores/reviewStore";
import useActivityStore from "../../stores/activitiesStore";
import defaultActivityImg from "../../assets/mockPlaceImg.jpg";

function ActivitiesReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actid = searchParams.get("actid");

  const getActivityById = useActivityStore((state) => state.getActivityById);
  const currentActivity = useActivityStore((state) => state.currentActivity);
  const createReviewActivity = useReviewStore((state) => state.createReviewActivity);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  console.log('rating', rating)

  useEffect(() => {
    if (actid) {
      getActivityById(actid);
    }
  }, [actid, getActivityById]);

  const hdlSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    try {
      setLoading(true);
      await createReviewActivity(actid, { rating, comment });
      alert("Activity review submitted successfully!");
      navigate(`/memory-activity-details?actid=${actid}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  console.log('actid', actid)
  if (!currentActivity) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-6 text-center text-neutral">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-dots loading-lg text-primary"></span>
          <h2 className="text-xl font-bold">Loading activity info...</h2>
          <button onClick={() => navigate(-1)} className="btn btn-primary rounded-full px-8 text-white">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 text-neutral pb-10">
      <header className="w-full top-0 sticky z-40 bg-base-200/80 backdrop-blur-md flex items-center px-6 py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-primary active:scale-95 transition-all p-2 -ml-2"
        >
          <LeftIcon className="w-8 h-8" />
        </button>
        <h1 className="ml-4 text-xl font-black text-on-surface uppercase tracking-tight">Review Activity</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-10 space-y-8 font-body">
        {/* Activity Profile Card */}
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-[40px] shadow-[0_12px_32px_rgba(78,33,32,0.04)] border border-primary/5">
          <div className="relative w-full aspect-video overflow-hidden rounded-[30px] shadow-lg border-4 border-primary/10">
            <img
              src={
                currentActivity?.coverPhoto
                  ? currentActivity.coverPhoto.startsWith("http")
                    ? currentActivity.coverPhoto
                    : `http://localhost:3999${currentActivity.coverPhoto}`
                  : defaultActivityImg
              }
              className="w-full h-full object-cover"
              alt="activity"
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-on-surface">{currentActivity?.title}</h2>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-2 px-4 py-1.5 bg-primary/5 rounded-full inline-block">
              {currentActivity?.category} Trip
            </p>
          </div>
        </div>

        {/* Star Rating Section */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-primary/5 space-y-4 text-center">
          <h3 className="text-lg font-black text-on-surface">Rate your experience</h3>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-4xl transition-all active:scale-90 hover:scale-110"
              >
                {star <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>
        </div>

        {/* Comment Section */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-primary/5 space-y-4">
          <h3 className="text-lg font-black text-on-surface">Leave a comment</h3>
          <textarea
            className="textarea textarea-bordered w-full h-32 bg-base-200/50 rounded-[25px] p-5 font-medium text-on-surface focus:ring-2 focus:ring-primary/20 border-none transition-all"
            placeholder="Tell us about your experience with this activity..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          onClick={hdlSubmit}
          disabled={loading || !rating}
          className="btn btn-primary w-full h-16 rounded-[25px] text-xl font-black text-white shadow-lg shadow-primary/20 active:scale-95 transition-all border-none disabled:bg-neutral/10 disabled:text-neutral/30"
        >
          {loading ? <span className="loading loading-spinner"></span> : "Confirm Activity Review"}
        </button>
      </main>
    </div>
  );
}

export default ActivitiesReview;

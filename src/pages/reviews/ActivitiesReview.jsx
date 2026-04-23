import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LeftIcon, CameraIcon } from "../../icons";
import useReviewStore from "../../stores/reviewStore";
import useActivityStore from "../../stores/activitiesStore";
import defaultActivityImg from "../../assets/mockPlaceImg.jpg";

function ActivitiesReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actid = searchParams.get("actid");
  const fileInputRef = useRef(null);
  const getActivityById = useActivityStore((state) => state.getActivityById);
  const currentActivity = useActivityStore((state) => state.currentActivity);
  const createReviewActivity = useReviewStore((state) => state.createReviewActivity);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actid) {
      getActivityById(actid);
    }
  }, [actid, getActivityById]);

  const hdlFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...images, ...files].slice(0, 5);
      setImages(newImages);
      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  const hdlSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", comment);
      images.forEach((img) => {
        formData.append("images", img);
      });
      await createReviewActivity(actid, formData);
      alert("Activity review submitted successfully!");
      navigate(`/memory-activity-details?actid=${actid}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!currentActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-300 flex items-center justify-center p-6">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-medium opacity-70">Loading Activity...</h2>
        </div>
      </div>
    );
  }


  // console.log(currentActivity.coverPhoto)
  return (
    <div className="min-h-screen bg-base-200 text-slate-800 pb-12 font-sans">
      <header className="sticky top-0 z-50 bg-white/70  px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full transition-colors"
        >
          <LeftIcon className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-slate-800">Write a Review</h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-xl mx-auto px-6 pt-6 space-y-6">
        <div className="flex items-center gap-4 p-2">
          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
            <img
              src={currentActivity?.coverPhoto}
              alt="activity"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">{currentActivity?.title || "Activity Name"}</h2>
            <p className="text-sm text-slate-500">Share your thoughts with the community</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[16px] shadow-sm shadow-slate-200/50 border border-slate-100 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Tap to rate</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-4xl transition-all transform active:scale-75 ${star <= rating ? "scale-110" : "grayscale opacity-30"
                  }`}
              >
                {star <= rating ? "⭐️" : "⭐"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[16px] shadow-sm shadow-slate-200/50 border border-slate-100 space-y-4">
          <textarea
            className="textarea w-full min-h-[160px] bg-base-200 rounded-xl p-4 text-[16px] leading-relaxed border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            placeholder="What did you like or dislike? How was the atmosphere?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <div className="grid grid-cols-4 gap-3">
            {previews.map((src, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={src}
                  className="w-full h-full object-cover rounded-xl border border-slate-100"
                  alt="preview"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-1.5 -right-1.5 bg-black/80 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] backdrop-blur-md shadow-lg border border-white/20"
                >
                  ✕
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:bg-slate-100 hover:border-primary/30 transition-all"
              >
                <CameraIcon className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase">{previews.length}/5</span>
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={hdlFileChange}
            className="hidden"
            accept="image/*"
            multiple
          />
        </div>

        <div className="pt-4">
          <button
            onClick={hdlSubmit}
            disabled={loading || !rating}
            className={`w-full h-16 rounded-2xl text-lg font-bold shadow-xl transition-all flex items-center justify-center gap-3
              ${loading || !rating
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-primary text-white hover:brightness-110 active:scale-[0.98] shadow-primary/25"
              }`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Post Review"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default ActivitiesReview;

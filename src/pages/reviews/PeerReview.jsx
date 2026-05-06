import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LeftIcon } from "../../icons";
import useReviewStore from "../../stores/reviewStore";
import defaultProfile from "../../assets/default-profilepic.jpg";
import Swal from "sweetalert2";

function PeerReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  console.log('userId', userId)
  const actid = searchParams.get("actid");

   const getUser = useReviewStore((state) => state.getUser);
   const selectedUser = useReviewStore((state) => state.selectedUser);
   const createReviewUser = useReviewStore((state) => state.createReviewUser);

   
   


  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "http://localhost:3999";

  useEffect(() => {
    if (userId) {
      getUser(userId);
    }
  }, [userId, getUser]);



  const getFullImgPath = (path) => {
    if (!path) return defaultProfile;
    if (typeof path !== "string" || path.startsWith("data:") || path.startsWith("http")) {
      return path;
    }
    return `${BACKEND_URL}${path}`;
  };

  const hdlSubmit = async () => {
    if (rating === 0) {
        Swal.fire({
              title: '<h2 class="text-[20px] font-bold text-neutral leading-tight">Please select a rating</h2>',
              // html: '<p class="text-neutral/70">Please log in first to join this activity.</p>',
              icon: 'warning',
              confirmButtonColor: "#FC5100",
              width: '300px',
              padding: '1em',
            });
    
      return;
    }
    try {
      setLoading(true);
      await createReviewUser(actid, userId, { rating, comment });
      Swal.fire({
              title: '<h2 class="text-[20px] font-bold text-neutral leading-tight">Review submitted successfully!</h2>',
              // html: '<p class="text-neutral/70">Please log in first to join this activity.</p>',
              icon: 'success',
              confirmButtonColor: "#FC5100",
              width: '300px',
              padding: '1em',
            });
      navigate(`/memory-activity-details?actid=${actid}`);
    } catch (error) {
      console.error(error);
      Swal.fire({
              title: '<h2 class="text-[20px] font-bold text-neutral leading-tight">You already reviewed this user!</h2>',
              // html: '<p class="text-neutral/70">Please log in first to join this activity.</p>',
              icon: 'warning',
              confirmButtonColor: "#FC5100",
              width: '300px',
              padding: '1em',
            });
      
      
    } finally {
      setLoading(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold mb-4">No participant selected</h2>
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
          className="text-primary hover:opacity-80 active:scale-95 transition-all p-2 -ml-2"
        >
          <LeftIcon className="w-8 h-8" />
        </button>
        <h1 className="ml-4 text-xl font-black text-on-surface">Review Participant</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-10 space-y-8">
        {/* Participant Profile */}
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-[40px] shadow-sm border border-primary/5">
          <div className="relative">
            <img
              src={getFullImgPath(selectedUser?.profileImg)}
              className="w-32 h-32 rounded-full border-4 border-primary/10 object-cover shadow-lg"
              alt="participant"
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-on-surface">{selectedUser?.username}</h2>
            <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">Participant</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-primary/5 space-y-4">
          <h3 className="text-lg font-black text-on-surface text-center">Rate your experience</h3>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-4xl transition-all active:scale-90"
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
            className="textarea textarea-bordered w-full h-32 bg-base-200/50 rounded-3xl p-4 font-medium text-on-surface focus:outline-primary border-none"
            placeholder="Tell us about your experience with this user..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          onClick={()=>hdlSubmit()}
          disabled={loading}
          className="btn btn-primary w-full h-16 rounded-[25px] text-xl font-black text-white shadow-lg shadow-primary/20 active:scale-95 transition-all border-none"
        >
          {loading ? <span className="loading loading-spinner"></span> : "Confirm Review"}
        </button>
      </main>
    </div>
  );
}

export default PeerReview;

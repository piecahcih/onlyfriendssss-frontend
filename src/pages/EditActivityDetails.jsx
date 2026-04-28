import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LeftIcon, LocationIcon, CalendarIcon, PhotoIcon } from "../icons";
import useActivityStore from "../stores/activitiesStore";
import { format } from "date-fns";
import { DeleteSwal } from "../components/swal/DeleteAlert";
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import pointer from '../assets/pointer.svg';
import Swal from "sweetalert2";
import MapModal from "../components/map/MapModal";

function EditActivityDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actid = searchParams.get("actid");

  const currentActivity = useActivityStore((st) => st.currentActivity);
  const getActivityById = useActivityStore((st) => st.getActivityById);

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [preview, setPreview] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const categoryList = [
    { id: "HEALTH", title: "Health & Wellness", icon: "💪" },
    { id: "ENTERTAINMENT", title: "Chill & Hangout", icon: "🎭" },
    { id: "ART", title: "Creative", icon: "🎨" },
    { id: "FOOD", title: "Foodies", icon: "🍱" },
    { id: "TRAVEL", title: "Travel", icon: "✈️" },
  ];

  useEffect(() => {
    if (actid) {
      const loadData = async () => {
        setLoading(true);
        await getActivityById(actid);
        setLoading(false);
      };
      loadData();
    }
  }, [actid, getActivityById]);

  const hdlGoBack = () => {
    // navigate('/profile');
    navigate(-1)
  };

  const hdlChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setEditForm((prev) => ({ ...prev, [name]: val }));
  };

  const hdlConfirmLocation = (address) => {
    setEditForm((prev) => ({
      ...prev,
      placeName: address.placeName,
      address: address.address,
      latitude: address.latitude,
      longitude: address.longitude,
    }));
    setIsMapOpen(false);
  };

  const hdlChangeActivityImage = async (e) => {
    const selectFile = e.target.files[0];
    if (selectFile) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      const newPreviewUrl = URL.createObjectURL(selectFile);
      setEditForm((prev) => ({ ...prev, coverPhoto: selectFile }));
      setPreview(newPreviewUrl);
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    // Calculate current approved participants
    const joinedCount = currentActivity?.joinRequests?.filter(req => req.status === 'APPROVED').length || 0;
    const newMaxParticipants = parseInt(editForm.maxParticipants || currentActivity.maxParticipants);

    if (newMaxParticipants < joinedCount) {
      setIsUpdating(false);
      Swal.fire({
        icon: 'error',
        title: 'Invalid Participants Count',
        text: `Cannot set max participants to ${newMaxParticipants} because there are already ${joinedCount} people joined.`,
        confirmButtonColor: "#FC5100",
      });
      return;
    }

    console.log('start')
    try {
      const formData = new FormData();
      let hasChanges = false;

      Object.entries(editForm).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) return;

        let originalValue = currentActivity[key];
        if (["placeName", "address", "latitude", "longitude"].includes(key)) {
          originalValue = currentActivity.place?.[key];
        }

        if (key === "eventStartTime" || key === "eventEndTime") {
          const newDate = new Date(value);
          if (isNaN(newDate.getTime())) return;

          const newISO = newDate.toISOString();
          const oldISO = originalValue ? new Date(originalValue).toISOString() : null;

          if (newISO === oldISO) return;
          formData.append(key, newISO);
          hasChanges = true;
        } else if (key === "coverPhoto") {
          formData.append(key, value);
          hasChanges = true;
        } else {
          if (value.toString() === (originalValue?.toString() || "")) return;

          formData.append(key, value);
          hasChanges = true;
        }
      });

      if (!hasChanges) {
        navigate('/profile');
        return;
      }

      console.log('editFormData', [...formData.entries()])
      await useActivityStore.getState().editActivityById(actid, formData);

      Swal.fire({
        title: '<h2 class="text-[18px] font-bold text-neutral leading-tight">Activity Updated Successfully</h2>',
        confirmButtonColor: "#FC5100",
        width: '300px',
        padding: '1em',
      });
      navigate('/profile');

    } catch (error) {
      setIsUpdating(false);
      console.error("Update failed:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Something went wrong',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!currentActivity) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-neutral-content mb-4">No activities found</h2>
        <button onClick={hdlGoBack} className="btn btn-primary rounded-full px-8 text-white">
          back to profile
        </button>
      </div>
    );
  }

  const hdlCancel = () => {
    useActivityStore.getState().changeActivityStatus(actid);
    navigate('/profile');
  };

  const currentCategory = editForm.category || currentActivity.category;
  const matchedCategory = categoryList.find((cat) => cat.id === currentCategory) || categoryList[0];

  return (
    <div className="min-h-screen bg-base-200 text-neutral pb-28">
      <header className="w-full top-0 sticky z-40 bg-base-200/80 backdrop-blur-md flex items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={hdlGoBack}
          className="text-primary hover:opacity-80 active:scale-95 transition-all p-2 -ml-2"
        >
          <LeftIcon className="w-8 h-8" />
        </button>
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 tracking-[-0.02em] font-bold text-[20px] whitespace-nowrap">
          Edit Activity
        </h1>
        <div className="w-8" />
      </header>

      <form onSubmit={saveEdit}>
        <main className="max-w-2xl mx-auto px-6 space-y-6">
          <div className="flex flex-wrap gap-2.5">
            <select
              name="isPublic"
              onChange={hdlChange}
              defaultValue={currentActivity.isPublic}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm text-xs font-bold outline-none cursor-pointer"
            >
              <option value="true">🌎 Public</option>
              <option value="false">🔒 Private</option>
            </select>

            <select
              name="category"
              onChange={hdlChange}
              defaultValue={currentActivity.category}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary shadow-sm text-xs font-bold border border-primary/20 outline-none cursor-pointer"
            >
              {categoryList.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.title}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full h-40 rounded-[15px] overflow-hidden shadow-lg group">
            <img
              src={preview || currentActivity.coverPhoto}
              alt={currentActivity.title}
              className="w-full h-full object-cover"
            />
            <div
              onClick={() => document.getElementById("fileInput").click()}
              className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-black/30 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <PhotoIcon className="text-white w-10 h-10" />
              <p className="text-white font-regular text-xs">Tap to change photo</p>
            </div>
            <input type="file" id="fileInput" className="hidden" onChange={hdlChangeActivityImage} />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral/40 uppercase tracking-widest ml-1">Activity Title</label>
              <input
                type="text"
                name="title"
                defaultValue={currentActivity.title}
                onChange={hdlChange}
                placeholder="Enter title..."
                className="text-[20px] font-black text-on-surface leading-tight bg-transparent border-b border-dashed border-primary/20 focus:border-primary focus:outline-none w-full pb-1"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral/40 uppercase tracking-widest ml-1">Description</label>
              <textarea
                name="description"
                defaultValue={currentActivity.description}
                onChange={hdlChange}
                placeholder="Tell others about your activity..."
                className="text-on-surface/80 leading-relaxed font-medium bg-transparent border-b border-dashed border-primary/20 focus:border-primary focus:outline-none w-full resize-none pb-1"
                rows="3"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white p-4 rounded-[30px] shadow-sm border border-primary/5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <CalendarIcon className="w-7 h-7" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-primary uppercase block mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    name="eventStartTime"
                    defaultValue={currentActivity.eventStartTime ? format(new Date(currentActivity.eventStartTime), "yyyy-MM-dd'T'HH:mm") : ""}
                    onChange={hdlChange}
                    className="w-full text-sm font-bold text-on-surface bg-transparent focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-primary uppercase block mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    name="eventEndTime"
                    defaultValue={currentActivity.eventEndTime ? format(new Date(currentActivity.eventEndTime), "yyyy-MM-dd'T'HH:mm") : ""}
                    onChange={hdlChange}
                    className="w-full text-sm font-bold text-on-surface bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => setIsMapOpen(true)}
            className="space-y-4 bg-white p-4 rounded-[30px] shadow-sm border border-primary/5 cursor-pointer hover:border-primary/20 transition-all group"
          >
            <div className="flex items-start gap-3 px-2">
              <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                <LocationIcon className="w-6 h-6" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-neutral text-[14px] leading-tight">
                  {editForm.placeName || currentActivity.place?.placeName || "Select Location"}
                </span>
                <span className="text-[12px] text-neutral/50 font-medium line-clamp-2">
                  {editForm.address || currentActivity.place?.address || "Tap to choose a place on map"}
                </span>
              </div>
              <div className="text-primary font-bold text-xs self-center">Edit</div>
            </div>

            <div className="relative w-full h-36 rounded-[2rem] overflow-hidden ring-2 ring-primary/5 shadow-inner pointer-events-none">
              <Map
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                initialViewState={{
                  longitude: Number(editForm.longitude) || currentActivity.place?.longitude || 100.5,
                  latitude: Number(editForm.latitude) || currentActivity.place?.latitude || 13.7,
                  zoom: 15
                }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
              >
                <Marker
                  longitude={Number(editForm.longitude) || currentActivity.place?.longitude || 100.5}
                  latitude={Number(editForm.latitude) || currentActivity.place?.latitude || 13.7}
                >
                  <img className="w-10 h-10" src={pointer} alt="pointer" />
                </Marker>
              </Map>
              <div className="absolute inset-0 bg-black/5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-[30px] shadow-sm border border-primary/5 flex items-center justify-between">
            <span className="font-bold text-sm text-neutral/60">Max Participants</span>
            <input
              type="number"
              name="maxParticipants"
              defaultValue={currentActivity.maxParticipants || 0}
              onChange={hdlChange}
              className="w-20 text-right font-black text-primary bg-transparent focus:outline-none text-xl"
            />
          </div>

          <button
            type="button"
            onClick={() => DeleteSwal({ currentActivity, hdlCancel })}
            className="w-full flex items-center justify-center text-neutral/40 hover:text-error transition-colors text-sm font-medium underline"
          >
            Cancel this activity
          </button>
        </main>

        <div className="fixed bottom-0 left-0 w-full p-6 z-40 bg-gradient-to-t from-base-200 via-base-200 to-transparent">
          <button
            disabled={isUpdating}
            className={`w-full max-w-2xl mx-auto flex items-center justify-center gap-3 px-8 py-4 rounded-[25px] font-black text-xl active:scale-95 transition-all  
              ${isUpdating ? 'bg-neutral/20 text-neutral/40 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/20'}`}
          >
            {isUpdating ? 'Saving...' : 'Confirm Changes'}
            {isUpdating && <span className="loading loading-dots loading-md"></span>}
          </button>
        </div>
      </form>


      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onConfirm={hdlConfirmLocation}
      />
    </div>
  );
}

export default EditActivityDetails;

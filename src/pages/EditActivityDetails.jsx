import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LeftIcon, LocationIcon, CalendarIcon, PhotoIcon } from "../icons";
import useActivityStore from "../stores/activitiesStore";
import { format } from "date-fns";
import { DeleteSwal } from "../components/swal/DeleteAlert";
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import pointer from '../assets/pointer.svg'

function EditActivityDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actid = searchParams.get("actid");

  const currentActivity = useActivityStore((st) => st.currentActivity);
  const getActivityById = useActivityStore((st) => st.getActivityById);

  const [loading, setLoading] = useState(true);

  const categoryList = [
    { id: "HEALTH", title: "Health & Wellness", icon: "💪" },
    { id: "ENTERTAINMENT", title: "Chill & Hangout", icon: "🎭" },
    { id: "ART", title: "Creative", icon: "🎨" },
    { id: "FOOD", title: "Foodies", icon: "🍱" },
    { id: "TRAVEL", title: "Travel", icon: "✈️" },
  ];

  const matchedCategory = categoryList.find((cat) => cat.id === currentActivity.category)

  useEffect(() => {
    if (actid) {
      console.log('Current activity:', currentActivity)
      const loadData = async () => {
        setLoading(true);
        await getActivityById(actid);
        setLoading(false);
      };
      loadData();
    }
  }, [actid, getActivityById]);

  const hdlGoBack = () => {
    navigate('/profile');
    // navigate(-1);
  };

  const [isUpdating, setIsUpdating] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [input, setInput] = useState("")

  const hdlChangeInput = (e) => {
    setInput(e.target.value)
  }

  const hdlChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }


  const [preview, setPreview] = useState(null)
  const hdlChangeActivityImage = async (e) => {
    const selectFile = e.target.files[0]

    if (selectFile) {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
      const newPreviewUrl = URL.createObjectURL(selectFile);

      setEditForm((prev) => ({ ...prev, coverPhoto: selectFile }));
      setPreview(newPreviewUrl)
    }
  }

  const saveEdit = async (e) => {
    e.preventDefault();
    setIsUpdating(true)

    try {
      const formData = new FormData();

      if (editForm) {
        Object.keys(editForm).forEach((key) => {
          if (key === "eventStartTime" || key === "eventEndTime") {
            formData.append(key, new Date(editForm[key]).toISOString());
          }
          else {
            formData.append(key, editForm[key]);
          }
        });
      }

      await useActivityStore.getState().editActivityById(actid, formData)
      // console.log('formData', formData)

      navigate('/')
      Swal.fire({
        title: '<h2 class="text-[24px] font-bold text-neutral leading-tight">Activity Created Successfully</h2>',
        confirmButtonColor: "#FC5100",
        width: '300px',
        padding: '1em',
      });

    } catch (error) {
      setIsUpdating(false)
      console.error("Update failed:", error)
    }

    // try {
    //   await useActivityStore.getState().editActivityById({ [fieldName]: input })
    //   setInput("")
    //   setEditField(null)
    // } catch (error) {
    //   console.error("Update failed:", error)
    // }
  }



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
          back to activities page
        </button>
      </div>
    );
  }


  const hdlDelete = () => {
    useActivityStore.getState().deleteActivityById(actid)
    navigate('/profile')
  };

  return (
    <div className="min-h-screen bg-base-200 text-neutral pb-28">
      {/* TopAppBar */}
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

        <button className="text-2xl font-bold text-neutral">•••</button>

      </header>

      <form onSubmit={saveEdit}>

        <main className="max-w-2xl mx-auto px-6 space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm text-xs font-bold">
              {currentActivity.isPublic ? " 🌎 Public  " : " 🔒 Private "}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm text-xs font-bold">
              <span className="text-lg">📍</span>
              1km
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary shadow-sm text-xs font-bold border border-primary/20">
              <span>{matchedCategory.icon}</span>
              {currentActivity.category}
            </div>
          </div>
          {/* Cover Photo */}
          <div className="relative w-full h-40 rounded-[15px] overflow-hidden shadow-lg">
            <img
              src={preview || currentActivity.coverPhoto}
              alt={currentActivity.title}
              className="w-full h-full object-cover"
            />
            <div
              onClick={() => document.getElementById("fileInput").click()}
              className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-black/30 border-2 border-[#e09c99]/20 rounded-2xl transition-opacity duration-300"
            >
              <PhotoIcon className="text-white w-10 h-10" />
              <p className="text-white font-regular text-xs">Tap to change photo</p>
            </div>
            <input type="file" id="fileInput" className="hidden" onChange={hdlChangeActivityImage} />
          </div>


          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-on-surface leading-tight">
              {currentActivity.title}
            </h1>


            {/* Description */}
            <p className="text-on-surface/80 leading-relaxed font-medium">
              {currentActivity.description || "No description provided."}
            </p>

            <p className="text-[11px] text-on-surface/30 font-light uppercase tracking-wider">
              Created {format(new Date(currentActivity.createdAt), 'dd MMM yyyy')}
            </p>
          </div>




          {/* Time Card */}
          <div className="flex items-center gap-4 bg-white p-5 rounded-[30px] shadow-sm border border-primary/5">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <CalendarIcon className="w-7 h-7" />
            </div>
            <div className="flex items-center gap-6">
              <div>
                <h5 className="font-bold text-sm text-on-surface">
                  {currentActivity.eventStartTime ? format(new Date(currentActivity.eventStartTime), 'eee, dd MMM yyyy') : '-'}
                </h5>
                <p className="text-xs text-on-surface/50 font-medium">
                  {currentActivity.eventStartTime ? format(new Date(currentActivity.eventStartTime), 'p') : '-'}
                </p>
              </div>
              {currentActivity.eventEndTime && (
                <>
                  <p>-</p>
                  <div>
                    <h5 className="font-bold text-sm text-on-surface">
                      {format(new Date(currentActivity.eventEndTime), 'eee, dd MMM yyyy')}
                    </h5>
                    <p className="text-xs text-on-surface/50 font-medium">
                      {format(new Date(currentActivity.eventEndTime), 'p')}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>


          {/* Location Section */}
          <div className="space-y-4 mt-5 bg-white p-5 rounded-[30px] shadow-sm border border-primary/5">
            <div className="flex items-start gap-3 px-2">
              <div className="flex flex-col">
                <span className="font-bold text-neutral text-[16px] leading-tight">
                  {currentActivity?.place.placeName || "Selected Location"}
                </span>
                <span className=" text-[14px] text-neutral/50 font-medium">
                  {currentActivity?.place.address}
                </span>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${currentActivity?.place.longitude},${currentActivity?.place.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-full h-35 rounded-[2rem] overflow-hidden ring-2 ring-[#e09c99]/20 focus:ring-primary active:scale-[0.98] transition-all"
            >
              <div className="w-full h-full bg-base-300 relative pointer-events-none">
                <Map
                  mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                  initialViewState={{
                    longitude: currentActivity?.place.longitude,
                    latitude: currentActivity?.place.latitude,
                    zoom: 15
                  }}
                  interactive={false}
                  mapStyle="mapbox://styles/mapbox/streets-v12"
                >
                  <Marker
                    longitude={currentActivity?.place.longitude}
                    latitude={currentActivity?.place.latitude}
                  >
                    <img className="w-10 h-10" src={pointer} alt="pointer" />
                  </Marker>
                </Map>
                <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />

                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-primary shadow-sm uppercase tracking-wider z-10">
                  Open Google Maps ↗
                </div>
              </div>
            </a>
          </div>

          {/* maxParticipants */}
          {currentActivity.maxParticipants && (
            <div className="space-y-4 mt-5 bg-white p-5 rounded-[30px] shadow-sm border border-primary/5">
              <p className="font-light flex gap-4">
                <span className="font-bold">Max Participants</span>{currentActivity.maxParticipants && (currentActivity.maxParticipants)}
              </p>
            </div>
          )}

          <button type="button" onClick={() => DeleteSwal({ currentActivity, hdlDelete })} className="w-full flex items-center justify-center underline">
            Delete this activity</button>

        </main>

        {/* Action Footer */}
        <div className="fixed bottom-0 left-0 w-full p-6 z-40 bg-linear-to-t from-base-200 via-base-200 to-transparent">
          <button className={`w-full max-w-2xl flex items-center justify-center gap-3 px-8 py-4 rounded-[25px] font-black text-xl  active:scale-95 transition-all border-b-4
                bg-linear-to-r from-primary to-secondary text-white border-primary-focus hover:scale-[1.05]"`}>
            Confirm Edit {isUpdating && <span className="loading loading-dots loading-md"></span>}
          </button>
        </div>

      </form>


    </div>
  );
}

export default EditActivityDetails;

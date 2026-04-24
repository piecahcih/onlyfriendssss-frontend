import { useEffect, useState } from "react";
import { LeftIcon, PhotoIcon } from "../../icons";
import { useNavigate } from "react-router";
import MapModal from "../../components/map/MapModal";
import useActivityStore from "../../stores/activitiesStore";
import Swal from "sweetalert2";

function CreateActivity() {
  const navigate = useNavigate();

  const hdlGoBack = () => {
    navigate(-1);
  };

  const [groupStatus, setGroupStatus] = useState(true);
  const hdlPrivacyStatus = () => {
    setGroupStatus(!groupStatus);
  };

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const hdlConfirmLocation = (addressData) => {
    setSelectedLocation(addressData);
    setIsMapOpen(false);
  };

  const [selectedCategory, setSelectedCategory] = useState("HEALTH");
  const categoryList = [
    { id: "HEALTH", title: "Health & Wellness", icon: "💪" },
    { id: "ENTERTAINMENT", title: "Chill & Hangout", icon: "🎭" },
    { id: "ART", title: "Creative", icon: "🎨" },
    { id: "FOOD", title: "Foodies", icon: "🍱" },
    { id: "TRAVEL", title: "Travel", icon: "✈️" },
  ];

  const [title, setTitle] = useState("")
  const hdlTitle = (value) => {
    setTitle(value)
  }

  const [description, setDescription] = useState("")
  const hdlDescription = (value) => {
    setDescription(value)
  }

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const hdlActivityImage = (e) => {
    const selectFile = e.target.files[0]
    if (selectFile) {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
      const newPreviewUrl = URL.createObjectURL(selectFile);

      setFile(selectFile)
      // console.log('selectFile', selectFile)
      // console.log('File', file)
      setPreview(newPreviewUrl)
      // console.log('newPreviewUrl', newPreviewUrl)
    }
  }

  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [hasEndTime, setHasEndTime] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState(0);


  const Adata = {
    isPublic: groupStatus,
    coverPhoto: file,
    placeName: selectedLocation?.placeName,
    address: selectedLocation?.address,
    latitude: selectedLocation?.latitude,
    longitude: selectedLocation?.longitude,
    title: title,
    eventStartTime: new Date(eventStartTime),
    ...(eventEndTime && { eventEndTime: new Date(eventEndTime) }),
    ...(maxParticipants && { maxParticipants: maxParticipants }),
    category: selectedCategory,
    description: description,
    blob: preview
  };



  const hdlPreCreateActivity = (e, Adata) => {
    e.preventDefault();

    if (!Adata.title || !Adata.coverPhoto || !Adata.address || !Adata.description || !eventStartTime) {
      Swal.fire({
        title: '<h2 class="text-[20px] font-bold text-neutral leading-tight">Please input all fields</h2>',
        confirmButtonColor: "#FC5100",
        width: '300px',
        padding: '1em',
      });

      return
    }

    if (new Date(eventStartTime) < new Date()) {
      Swal.fire({
        title: '<h2 class="text-[20px] font-bold text-neutral leading-tight">Please don\'t select date before today</h2>',
        confirmButtonColor: "#FC5100",
        width: '300px',
        padding: '1em',
      });

      return
    }

    try {
      useActivityStore.getState().setCreatingActivity(Adata);
      // console.log('Adata', Adata)

      navigate("/create-showcreate");
    } catch (error) {
      console.error("Local state error:", error)
    }
  };




  const lblTitleStyle = "text-[18px] font-bold text-neutral";
  return (
    <div className="min-h-screen bg-base-200 text-neutral">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-40 bg-base-200 shadow-[0_8px_32px_rgba(78,33,32,0.08)] flex items-center justify-between px-6 py-4 relative">
        <button
          type="button"
          onClick={() => hdlGoBack()}
          className="text-secondary hover:opacity-80  active:scale-95 transition-transform duration-200 relative z-10"
        >
          <LeftIcon className="w-8" />
        </button>

        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 tracking-[-0.02em] font-bold text-[20px] whitespace-nowrap">
          Create Activity
        </h1>

        <div className="w-8"></div>
      </header>

      <div className="mx-auto px-6 pt-8 space-y-8">
        {/* Form Fields */}
        <form
          className="space-y-6"
          onSubmit={(e) => hdlPreCreateActivity(e, Adata)}
        >
          {/* Public Badge / Privacy */}
          <button type="button" onClick={() => hdlPrivacyStatus()}>
            {groupStatus === true ? (
              <div className="flex items-center justify-between text-[14px] px-3 py-1 rounded-full bg-secondary w-fit">
                <div className="flex items-center gap-2">
                  <span className="text-[16px]">🌎</span>
                  <p className="font-bold text-white">Public</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[14px] px-3 py-1 rounded-full bg-[#bf2802] w-fit">
                <div className="flex items-center gap-2">
                  <span className="text-[16px]">🔒</span>
                  <p className="font-bold text-white">Private</p>
                </div>
              </div>
            )}
          </button>

          {/* Activity Name */}
          <div className="space-y-2">
            <label className={lblTitleStyle}>Activity Name</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[14px]">
                ✏️
              </span>
              <input
                className="text-[14px] w-full pl-14 pr-6 py-2 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] focus:ring-2 transition-all outline-none text-neutral placeholder:text-[#834c4b]/40"
                placeholder="Morning Run in the Park"
                type="text"
                value={title}
                // value= {creatingActivity.title||title}
                onChange={(e) => hdlTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Image Upload */}
          <section className="relative group">
            <h3 className={lblTitleStyle}>Add Cover Photo</h3>
            <div className="w-full h-40 rounded-2xl overflow-hidden bg-base-300 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#e8dcd8]/50 backdrop-blur-sm transition-all group-hover:backdrop-blur-none">
                {preview ? (
                  <img src={preview} alt="preview image" className="w-full" />
                ) : (
                  <div
                    onClick={() => document.getElementById("fileInput").click()}
                    className="absolute inset-0 flex flex-col items-center justify-center border-2 border-[#e09c99]/20 rounded-2xl transition-opacity duration-300"
                  >
                    <PhotoIcon className="text-white w-10 h-10" />
                  </div>
                )}

                <input type="file" id="fileInput" className="hidden" onChange={hdlActivityImage} />
              </div>
            </div>
          </section>

          {/* Location */}
          <div>
            <label className={lblTitleStyle}>Location</label>
            <button
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="w-full relative flex items-center group transition-all active:scale-[0.98]"
            >
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[14px] z-10">
                📍
              </span>

              <div className="w-full pl-14 pr-6 py-2 rounded-full bg-white text-left ring-2 ring-[#e09c99]/20 group-hover:ring-[#e09c99]/40 group-focus:ring-[#a83100] transition-all text-neutral placeholder:text-[#834c4b]/40">
                <span className="text-[#834c4b]/40 text-[14px]">
                  {selectedLocation?.placeName || "Select a location"}
                </span>
              </div>
            </button>
          </div>

          {/* Date & Time Row */}
          <div>
            <label className={lblTitleStyle}>Pick a Time</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[14px]">
                📅
              </span>
              <div className="text-[14px] w-full pl-14 pr-6 py-2 rounded-full bg-white text-left ring-2 ring-[#e09c99]/20 group-hover:ring-[#e09c99]/40 group-focus:ring-[#a83100] transition-all text-neutral placeholder:text-[#834c4b]/40">
                <input
                  type="datetime-local"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                />
              </div>
            </div>

            {!hasEndTime ? (
              <button type='button' onClick={() => setHasEndTime(true)}
                className="w-full flex justify-end px-2.5 py-1 text-[12px] text-[#a83100] opacity-60 hover:opacity-100">
                + Add End Date & Time
              </button>
            ) : (
              <div className="">
                {/* <label className={lblTitleStyle}>End Date & Time</label> */}
                <div className="relative mt-2">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl pointer-events-none">🏁</span>
                  <input
                    type="datetime-local"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    min={eventStartTime}
                    className="w-full pl-14 pr-4 py-3 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] transition-all outline-none text-neutral text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHasEndTime(false)
                    setEventEndTime("")
                  }}
                  className="w-full px-2.5 py-1 flex justify-end text-[12px] text-[#a83100] opacity-60 hover:opacity-100"
                >
                  Remove ✕
                </button>
              </div>
            )}
          </div>

          {/* maxParticipants */}
          <div className="flex items-center gap-4 -mt-3">
            <label className={lblTitleStyle}>Max Participant <span className="font-light">(optional)</span></label>
            <input
              className="w-11 h-8 pl-4 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] focus:ring-2 transition-all outline-none text-neutral placeholder:text-[#834c4b]/40"
              placeholder="5"
              type="text"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
            />
            {/* <p>{maxParticipants}</p>
              <p>{typeof maxParticipants}</p> */}
          </div>




          {/* Category Chips */}
          <div>
            <label className={lblTitleStyle}>
              <span>🏷️</span> Category{" "}
            </label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {categoryList.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-3xl text-[14px] font-medium flex items-center gap-2 transition-all duration-200 active:scale-95
                        ${isSelected
                        ? "bg-secondary text-white shadow-md"
                        : "bg-[#ffdad8] text-[#834c4b] hover:bg-[#ffd2d0]"
                      }
                    `}
                  >
                    <span className="text-[16px]">{cat.icon}</span> {cat.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className={lblTitleStyle}>Notes</label>
            <div className="relative">
              <span className="absolute left-5 top-6 text-xl">📝</span>
              <textarea
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] transition-all outline-none text-neutral placeholder:text-[#834c4b]/40 resize-none"
                placeholder={description || "Tell us more about the activity, what to bring, and expectations..."}
                rows="4"
                value={description}
                onChange={(e) => hdlDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="pt-4 pb-12">
            <button className="w-full py-4 rounded-full bg-linear-to-r from-primary to-secondary text-white font-bold text-lg shadow-[0_8px_32px_rgba(168,49,0,0.24)] active:scale-95 transition-all hover:scale-[1.05]">
              Create Activity
            </button>
          </div>
        </form>
      </div>

      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onConfirm={hdlConfirmLocation}
      />
    </div>
  );
}

export default CreateActivity;

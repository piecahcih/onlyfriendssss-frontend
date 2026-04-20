import { useState } from 'react'
import { LeftIcon, LocationIcon } from '../../icons'
import { useNavigate } from 'react-router'
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import pointer from '../../assets/pointer.svg'
import mockActImg from '../../assets/mockActImg.jpg'
import Swal from 'sweetalert2'
import useActivityStore from '../../stores/activitiesStore'
import { format } from 'date-fns'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function ShowCreate() {
    const navigate = useNavigate()
    const [isCreating, setIsCreating] = useState(false)

    const hdlGoBack = () => {
        navigate(-1)
    }
    
    const creatingActivity = useActivityStore(st=>st.creatingActivity)
    // console.log('creatingActivity', creatingActivity)


const hdlCreateActivity = async (e) => {
      e.preventDefault()
      setIsCreating(true)
      try {
        const formData = new FormData();

        formData.append("title", creatingActivity.title);
        formData.append("description", creatingActivity.description);
        formData.append("category", creatingActivity.category);
        formData.append("placeId", creatingActivity.placeId);
        formData.append("placeName", creatingActivity.placeName || "");
        formData.append("address", creatingActivity.address || "");
        formData.append("latitude", creatingActivity.latitude);
        formData.append("longitude", creatingActivity.longitude);
        formData.append("isPublic", creatingActivity.isPublic);
        formData.append("eventStartTime", new Date(creatingActivity.eventStartTime).toISOString());

        if (creatingActivity.eventEndTime) {
            formData.append("eventEndTime", new Date(creatingActivity.eventEndTime).toISOString());
        }

        if (creatingActivity.maxParticipants) {
            formData.append("maxParticipants", creatingActivity.maxParticipants);
        }

        if (creatingActivity.coverPhoto) {
            formData.append("coverPhoto", creatingActivity.coverPhoto); 
        }

        await useActivityStore.getState().createActivity(formData)

        navigate('/')
        Swal.fire({
          title: '<h2 class="text-[24px] font-bold text-neutral leading-tight">Activity Created Successfully</h2>',
          confirmButtonColor: "#FC5100",
          width: '300px',  
          padding: '1em',  
        });
        
      } catch (error) {
        setIsCreating(false)
        console.error(error)
      }

    }
    
    const [groupStatus, setGroupStatus] = useState(creatingActivity.isPublic)

  const categoryList = [
    { id: "HEALTH", title: "Health & Wellness", icon: "💪" },
    { id: "ENTERTAINMENT", title: "Chill & Hangout", icon: "🎭" },
    { id: "ART", title: "Creative", icon: "🎨" },
    { id: "FOOD", title: "Foodies", icon: "🍱" },
    { id: "TRAVEL", title: "Travel", icon: "✈️" },
  ];
    const selectedCategory = categoryList.find(cat => cat.id === creatingActivity.category)


  return (
    <div className="min-h-screen bg-base-200 text-neutral">
        
      {/* TopAppBar */}
    <header className="w-full top-0 sticky z-40 bg-base-200 shadow-[0_8px_32px_rgba(78,33,32,0.08)] flex items-center justify-between px-6 py-4 relative">

        <button type='button' onClick={()=>hdlGoBack()} 
            className="text-[#a83100] hover:opacity-80 transition-opacity active:scale-95 transition-transform duration-200 relative z-10">
            <LeftIcon className='w-8' />
        </button>

        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 tracking-[-0.02em] font-bold text-[20px] whitespace-nowrap">
            Preview Activity
        </h1>

        <div className="w-8"></div>
    </header>

      <div className="mx-auto px-6 pt-4 space-y-8">

        {/* Form Fields */}
        <form onSubmit={(e)=>hdlCreateActivity(e)}>

          <div className="flex gap-3 pb-4">
            {/* Public Badge / Privacy */}
              <button type='button' disabled>
                  {groupStatus === true ? 
                      <div className="flex items-center justify-between text-[14px] px-3 py-1 rounded-full bg-secondary w-fit">                        
                          <div className="flex items-center gap-2">
                              <span className="text-[18px]">🌎</span>
                              <p className="font-bold text-white">Public</p>
                          </div>
                      </div>
                  :   <div className="flex items-center justify-between text-[14px] px-3 py-1 rounded-full bg-[#bf2802] w-fit">                        
                          <div className="flex items-center gap-2">
                              <span className="text-[18px]">🔒</span>
                              <p className="font-bold text-white">Private</p>
                          </div>
                      </div>}
              </button>

            {/* Category */}
            <h3 className="px-4 py-1.5 w-fit rounded-3xl text-[14px] font-medium flex items-center gap-2 border border-secondary text-neutral shadow-md">
              <span className='text-[16px]'>{selectedCategory.icon}</span> {selectedCategory.title}
            </h3>
          </div>

          {/*Image*/}
          <div className="w-full h-40 rounded-2xl overflow-hidden bg-base-300 relative border-2 border-[#e09c99]/20">
            <img src={creatingActivity.blob} alt="activityIMG" className='w-full object-contain' />
          </div>


          {/* Activity Name */}
          <div className="mt-2">
            <label className="text-[22px] font-bold text-neutral">
              {creatingActivity.title}
            </label>
          </div>


          {/* Date & Time Row */}
          <h3 className="">
            <span className=" text-xl">📅</span> {format(new Date(creatingActivity.eventStartTime), 'eee, dd MMM yyyy, HH:mm')}
            {creatingActivity.eventEndTime && (format(new Date(creatingActivity.eventEndTime), ' - eee, dd MMM yyyy, HH:mm'))}
          </h3>

          
          {/* Notes */}
          <p className="font-light my-5 leading-relaxed">{creatingActivity.description}</p>

          {/* maxParticipants */}
          <p className="font-light my-5 leading-relaxed">
             {creatingActivity.maxParticipants && (`Max ${creatingActivity.maxParticipants} Participants`)} 
          </p>

          {/* Location Section */}
          <div className="space-y-4 mt-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div className="flex flex-col">
                <span className="font-extrabold text-neutral text-lg leading-tight">
                  {creatingActivity.placeName || "Selected Location"}
                </span>
                <span className="text-sm text-neutral/50 font-medium">
                  {creatingActivity.address}
                </span>
              </div>
            </div>

            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${creatingActivity.latitude},${creatingActivity.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-full h-35 rounded-[2rem] overflow-hidden shadow-xl ring-4 ring-white group active:scale-[0.98] transition-all"
            >
              <div className="w-full h-full bg-base-300 relative pointer-events-none">
                <Map
                  mapboxAccessToken={TOKEN}
                  initialViewState={{
                    longitude: creatingActivity.longitude,
                    latitude: creatingActivity.latitude,
                    zoom: 15
                  }}
                  interactive={false}
                  mapStyle="mapbox://styles/mapbox/streets-v12"
                >
                  <Marker
                    longitude={creatingActivity.longitude}
                    latitude={creatingActivity.latitude}
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


          <div className="py-8">
            <button disabled={isCreating}
            className="w-full py-4 rounded-full bg-linear-to-r from-primary to-secondary text-white font-bold text-lg shadow-[0_8px_32px_rgba(168,49,0,0.24)] active:scale-95 transition-all hover:scale-[1.05]">
              Create Activity {isCreating && <span className="loading loading-dots loading-md"></span>}
            </button>
          </div>
        </form>

      </div>

    </div>
  )
}

export default ShowCreate
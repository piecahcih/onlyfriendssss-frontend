import { useState } from 'react'
import { LeftIcon, LocationIcon } from '../../icons'
import { useNavigate } from 'react-router'
import MockingMap from '../../assets/mockingmap.png'
import mockActImg from '../../assets/mockActImg.jpg'
import Swal from 'sweetalert2'
import useActivityStore from '../../stores/activitiesStore'
import { format } from 'date-fns'

function ShowCreate() {
    const navigate = useNavigate()


    const hdlGoBack = () => {
        navigate(-1)
    }
    
    const creatingActivity = useActivityStore(st=>st.creatingActivity)
    // console.log('creatingActivity', creatingActivity)


    const hdlCreateActivity = async (e) => {
      e.preventDefault()

      const formData = new FormData();

      formData.append("title", creatingActivity.title);
      formData.append("description", creatingActivity.description);
      formData.append("category", creatingActivity.category);
      formData.append("placeId", creatingActivity.placeId);
      formData.append("isPublic", creatingActivity.isPublic);
      formData.append("eventStartTime", creatingActivity.eventStartTime.toISOString());

      if (creatingActivity.eventEndTime) {
          formData.append("eventEndTime", creatingActivity.eventEndTime.toISOString());
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
    }
    
    const [groupStatus, setGroupStatus] = useState(true)
    const hdlPrivacyStatus = () => {
      setGroupStatus(creatingActivity.isPublic)
    }

    const categoryList = [
      { id: "HEALTH", title: "Health", icon: "💪" },
      { id: "ENTERTAINMENT", title: "Entertainment", icon: "🎭" },
      { id: "ART", title: "Art", icon: "🎨" },
      { id: "FOOD", title: "Food", icon: "🍱" },
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
            Create Activity
        </h1>

        <div className="w-8"></div>
    </header>

      <div className="mx-auto px-6 pt-4 space-y-8">

        {/* Form Fields */}
        <form onSubmit={(e)=>hdlCreateActivity(e)}>

          <div className="flex gap-3 pb-4">
            {/* Public Badge / Privacy */}
              <button type='button' onClick={()=>hdlPrivacyStatus()}>
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
            {format(new Date(creatingActivity.eventEndTime), '- eee, dd MMM yyyy, HH:mm')}
          </h3>
          

          {/* Notes */}
          <p className="font-light my-5">{creatingActivity.description}</p>

          {/* Location */}
          <h3 className="w-full flex items-center my-2.5">
            <span className="text-xl">📍</span> Benchakitti Park, Bangkok
          </h3>


          <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-[0_12px_48px_rgba(78,33,32,0.1)] ring-4 ring-white">
            <div className="w-full h-full bg-base-200 relative">
              <img 
                alt="Interactive map view" 
                className="w-full h-full object-cover opacity-90" 
                src={MockingMap}
              />
              
              {/* Pulsing Pin Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-15 h-15 flex items-center justify-center rounded-full bg-secondary/40 ">
                  <LocationIcon className='w-8 text-primary'/>
                </div>
              </div>
            </div>
          </div>


          <div className="py-8">
            <button className="w-full py-4 rounded-full bg-linear-to-r from-primary to-secondary text-white font-bold text-lg shadow-[0_8px_32px_rgba(168,49,0,0.24)] active:scale-95 transition-all">
              Create Activity
            </button>
          </div>
        </form>

      </div>

    </div>
  )
}

export default ShowCreate
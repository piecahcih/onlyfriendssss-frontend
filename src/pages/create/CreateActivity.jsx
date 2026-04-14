import { useState } from 'react'
import { LeftIcon, PhotoIcon } from '../../icons'
import { useNavigate } from 'react-router'
import MapModal from '../../components/MapModal'
import useActivityStore from '../../stores/activitiesStore'
import useUserStore from '../../stores/userStore'

function CreateActivity() {
    const navigate = useNavigate()

    const hdlGoBack = () => {
        navigate(-1)
    }

    const [groupStatus, setGroupStatus] = useState(true)//always be public as default
    const hdlPrivacyStatus = () => {
        setGroupStatus(!groupStatus)
    }

    const [isMapOpen, setIsMapOpen] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState("")
    const hdlConfirmLocation = () => {
        setSelectedLocation("Benchakitti Park, Bangkok")
        setIsMapOpen(false)
    }

    const [selectedCategory, setSelectedCategory] = useState("HEALTH");
    const categoryList = [
        { id: "HEALTH", title: "Health", icon: "💪" },
        { id: "ENTERTAINMENT", title: "Entertainment", icon: "🎭" },
        { id: "ART", title: "Art", icon: "🎨" },
        { id: "FOOD", title: "Food", icon: "🍱" },
        { id: "TRAVEL", title: "Travel", icon: "✈️" }
    ];

    const user = useUserStore(st=>st.user)
    const Adata = {
      hostId: user.id,
      isPublic: true,
      coverPhoto:'https:res.cloudinary.com/piecahcih/image/upload/v1774345102/1amannlIMG1_kf4hqs.webp',
      placeId: 1,
      title: 'title',
      eventStartTime: new Date("2027-09-19T13:00:00"),
      category: 'ART',
      description: 'description',
    }
  
    // if(eventEndTime){
    //   Adata.eventEndTime = eventEndTime
    // }

    // const { coverPhoto,category,title,description,eventStartTime,eventEndTime,placeId } = req.body
    
    const hdlPreCreateActivity = (e,Adata) => {
      e.preventDefault()
      useActivityStore.getState().setCreatingActivity(Adata)

      navigate('/create-showcreate')
    }


    const lblTitleStyle = "text-[18px] font-bold text-neutral"
  return (
    <div className="min-h-screen bg-base-200 text-neutral font-sans">
        
      {/* TopAppBar */}
    <header className="w-full top-0 sticky z-40 bg-base-200 shadow-[0_8px_32px_rgba(78,33,32,0.08)] flex items-center justify-between px-6 py-4 relative">

        <button type='button' onClick={()=>hdlGoBack()} 
            className="text-[#a83100] hover:opacity-80  active:scale-95 transition-transform duration-200 relative z-10">
            <LeftIcon className='w-8' />
        </button>

        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 tracking-[-0.02em] font-bold text-[20px] whitespace-nowrap">
            Create Activity
        </h1>

        <div className="w-8"></div>
    </header>

      <div className="max-w-2xl mx-auto px-6 pt-8 space-y-8">

        {/* Form Fields */}
        <form className="space-y-6" onSubmit={(e)=>hdlPreCreateActivity(e,Adata)}>

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
          


          {/* Activity Name */}
          <div className="space-y-2">
            <label className={lblTitleStyle}>
              Activity Name
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">✏️</span>
              <input
                className="w-full pl-14 pr-6 py-3 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] focus:ring-2 transition-all outline-none text-neutral placeholder:text-[#834c4b]/40"
                placeholder="Morning Run in the Park"
                type="text"
              />
            </div>
          </div>

            {/* Hero Section/Image Upload */}
            <section className="relative group">
                <h3 className={lblTitleStyle}>Add Cover Photo</h3>
            <div className="w-full h-40 rounded-2xl overflow-hidden bg-base-300 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fcdfd4]/50 backdrop-blur-sm transition-all group-hover:backdrop-blur-none">
                <div  onClick={() => document.getElementById('fileInput').click()}
                className="absolute inset-0 flex flex-col items-center justify-center border-2 border-[#e09c99]/20 rounded-2xl transition-opacity duration-300">
                    <PhotoIcon className="text-white w-10 h-10" />
                </div>
                    <input type="file" id="fileInput" className="hidden" />
                    {/* onChange={hdlFileChange} */}
                </div>
            </div>
            </section>



          {/* Location */}
            <div className="space-y-2">
                <label className={lblTitleStyle}>Location</label>
                
                <button type="button" onClick={() => setIsMapOpen(true)} 
                    className="w-full relative flex items-center group transition-all active:scale-[0.98]">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl z-10">📍</span>
                    
                    <div className="w-full pl-14 pr-6 py-3 rounded-full bg-white text-left ring-2 ring-[#e09c99]/20 group-hover:ring-[#e09c99]/40 group-focus:ring-[#a83100] transition-all text-neutral placeholder:text-[#834c4b]/40">
                        <span className="text-[#834c4b]/40">{selectedLocation || "Select a location"}</span>
                    </div>
                </button>
            </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={lblTitleStyle}>Start Date</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">📅</span>
                <input
                  className="w-full pl-14 pr-4 py-3 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] transition-all outline-none text-neutral text-sm"
                  placeholder="Oct 24, 2023"
                  type="text"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={lblTitleStyle}>Time</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">🕒</span>
                <input
                  className="w-full pl-14 pr-4 py-3 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] transition-all outline-none text-neutral text-sm"
                  placeholder="08:30 AM"
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={lblTitleStyle}>End Date</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">📅</span>
                <input
                  className="w-full pl-14 pr-4 py-3 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] transition-all outline-none text-neutral text-sm"
                  placeholder="Oct 24, 2023"
                  type="text"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={lblTitleStyle}>Time</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">🕒</span>
                <input
                  className="w-full pl-14 pr-4 py-3 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] transition-all outline-none text-neutral text-sm"
                  placeholder="08:30 AM"
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="space-y-3">
            <label className={lblTitleStyle}><span>🏷️</span> Category </label>
            <div className="flex flex-wrap gap-2">
                {categoryList.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                    <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-3xl text-[14px] font-medium flex items-center gap-2 transition-all duration-200 active:scale-95
                        ${
                        isSelected
                            ? "bg-secondary text-white shadow-md"
                            : "bg-[#ffdad8] text-[#834c4b] hover:bg-[#ffd2d0]"
                        }
                    `}
                    >
                    <span className='text-[16px]'>{cat.icon}</span> {cat.title}
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
                placeholder="Tell us more about the activity, what to bring, and expectations..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 pb-12">
            <button className="w-full py-4 rounded-full bg-linear-to-r from-primary to-secondary text-white font-bold text-lg shadow-[0_8px_32px_rgba(168,49,0,0.24)] active:scale-95 transition-all">
              Create Activity
            </button>
          </div>
        </form>

      </div>

      <MapModal isOpen={isMapOpen} onClose={()=>setIsMapOpen(false)} onConfirm={hdlConfirmLocation} />
    </div>
  )
}

export default CreateActivity

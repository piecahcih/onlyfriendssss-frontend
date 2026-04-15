import { useNavigate } from "react-router"
import { LeftIcon } from "../icons"

function ActivityDetails() {
    const navigate = useNavigate()

    const hdlGoBack = () => {
        navigate('/activities')
    }

  return (
    <div className="min-h-screen bg-base-200 text-neutral pb-12">
      {/* TopAppBar */}
        <header className="w-full top-0 sticky z-40 bg-base-200 shadow-[0_8px_32px_rgba(78,33,32,0.08)] flex items-center justify-between px-6 py-4 relative">

            <button type='button' onClick={()=>hdlGoBack()} 
                className="text-[#a83100] hover:opacity-80  active:scale-95 transition-transform duration-200 relative z-10">
                <LeftIcon className='w-8' />
            </button>

            <div className="text-[26px]">•••</div>
        </header> 

        <div className="mx-auto px-6 pt-8 space-y-8">
            CONTENT
        </div>

        <div className="fixed bottom-0 left-0 w-full p-6 z-40">
            <button className="w-full px-4 py-3 rounded-full bg-linear-to-r from-primary to-secondary text-white font-bold text-lg shadow-[0_8px_24px_rgba(252,81,0,0.2)] active:scale-95 transition-all">
                Join
            </button>      
        </div>
    </div>
  )
}

export default ActivityDetails
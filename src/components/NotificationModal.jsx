import { motion, AnimatePresence } from 'framer-motion'
import { LeftIcon, Notification } from '../icons'

function NotificationModal({isOpen, onClose}) {

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div          
            initial={{ x: "100%" }}   
            animate={{ opacity: 1, x: 0 }}  
            exit={{ opacity: 0, x: "100%" }}   
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col bg-base-200">

                <header className="w-full top-0 sticky z-40 bg-base-200 shadow-[0_8px_32px_rgba(78,33,32,0.08)] flex items-center justify-between px-6 py-4 relative">
            
                    <button type='button' onClick={onClose} 
                        className="text-[#a83100] hover:opacity-80  active:scale-95 transition-transform duration-200 relative z-10">
                        <LeftIcon className='w-8' />
                    </button>
            
                    <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 tracking-[-0.02em] font-bold text-[20px] whitespace-nowrap">
                        Notifications
                    </h1>
            
                    <div className="w-8"></div>
                </header>    

                <div className="flex flex-col gap-3 items-center justify-center my-50">
                    <Notification className='w-20 text-secondary/75' />
                    <h1 className='font-bold text-[18px]'>You don't have any notification!</h1>
                </div>

            </motion.div>
        )}
    </AnimatePresence>
  )
}

export default NotificationModal
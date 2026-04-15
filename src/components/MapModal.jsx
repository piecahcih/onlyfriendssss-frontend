import { motion, AnimatePresence } from 'framer-motion'
import MockingMap from '../assets/mockingmap.png'
import { LocationIcon, MicIcon, SearchIcon } from '../icons'
import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

function MapboxViewer() {
  const mapContainerRef = useRef()
  const mapRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current, 
      center: [100.53499383276497, 13.758571505785834], 
      zoom: 15 
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, []) 

  return (
    <div 
      id='map-container' 
      ref={mapContainerRef} 
      style={{ width: '100%', height: '500px' }} 
      className="rounded-2xl overflow-hidden shadow-lg"
    />
  )
}

function MapModal({ isOpen, onClose, onConfirm }) {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: "100%" }}   
          animate={{ opacity: 1, x: 0 }}  
          exit={{ opacity: 0, x: "100%" }}   
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col bg-base-200">

          {/* TopAppBar Component */}
          <header className="fixed top-0 w-full z-50 bg-base-200 shadow-[0_8px_32px_rgba(78,33,32,0.08)]">
            <div className="flex justify-end items-center px-6 py-4 w-full h-16">
                <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 tracking-[-0.02em] font-bold text-[20px] whitespace-nowrap">
                    Choose Location
                </h1>

              <button onClick={onClose}
                className="text-[#a83100] active:scale-95 duration-200 hover:bg-[#ff784c]/10 p-2 rounded-full transition-all">
                <span className="text-2xl leading-none">✕</span>
              </button>
            </div>
          </header>

          <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto w-full flex flex-col gap-8 overflow-y-auto no-scrollbar">
            {/* Search Bar */}
            <section className="w-full">
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <SearchIcon className='w-5' />
                </div>
                <input 
                  className="w-full bg-white border-none outline-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] py-3 pl-14 pr-14 rounded-full font-sans text-lg shadow-[0_4px_24px_rgba(78,33,32,0.04)] transition-all placeholder:text-[#4e2120]/40" 
                  placeholder="Search for a place" 
                  type="text"
                />
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                  <MicIcon className='w-5.5' />
                </div>
              </div>
            </section>

            {/* Map Container */}
            <MapboxViewer/>
            {/* <section>
              <div className="relative w-full h-4/5 rounded-2xl overflow-hidden shadow-[0_12px_48px_rgba(78,33,32,0.1)] ring-4 ring-white">
                <div className="w-full h-full bg-base-200 relative">
                  <img 
                    alt="Interactive map view" 
                    className="w-full h-full object-cover opacity-90" 
                    src={MockingMap}
                  />
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-15 h-15 flex items-center justify-center rounded-full bg-secondary/40 ">
                      <LocationIcon className='w-8 text-primary'/>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}

            <div className="fixed bottom-0 left-0 w-full p-6 z-40">
              <button onClick={onConfirm}
                  className="w-full py-4 bg-linear-to-r from-primary to-secondary text-white font-bold text-xl rounded-full shadow-[0_12px_32px_rgba(168,49,0,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <span>Continue</span>
              </button>
            </div>

          </main>
        </motion.div>

      )}
    </AnimatePresence>
  )
}

export default MapModal

import { motion, AnimatePresence } from 'framer-motion'
import { LocationIcon, MicIcon, SearchIcon } from '../../icons'
import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import MapContainer from './MapContainer';
import getPlaces, { reverseGeocode } from '../../api/getPlace';
import { useSpeechToText } from '../../hooks/useSpeechToText';

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
  const [address, setAddress] = useState({
    placeName: "",
    streetAndNumber: "",
    place: "",
    region: "",
    postcode: "",
    country: "",
    latitude: 13.758571505785834, 
    longitude: 100.53499383276497, 
    raw: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const performSearch = async (query) => {
    if (query.length > 2) {
      const results = await getPlaces(query);
      setSearchResults(results || []);
    } else {
      setSearchResults([]);
    }
  };

  const { isListening, toggleListening, isSupported } = useSpeechToText((transcript) => {
    setSearchQuery(transcript);
    performSearch(transcript);
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        updateCoordinates(13.7563, 100.5018);
      },
      {
        enableHighAccuracy: true,
        timeout: 50000,
        maximumAge: 0
      }
    );
  }, []);

  const updateCoordinates = async (latitude, longitude) => {
    const feature = await reverseGeocode(latitude, longitude);
    if (feature) {
      const region = feature.context?.find(c => c.id.startsWith('region'))?.text || "";
      const postcode = feature.context?.find(c => c.id.startsWith('postcode'))?.text || "";
      const place = feature.context?.find(c => c.id.startsWith('place'))?.text || "";
      
      setAddress({
        ...address,
        latitude,
        longitude,
        placeName: feature.text,
        address: feature.place_name,
        region,
        postcode,
        place,
        raw: feature
      });
    } else {
      setAddress((prev) => ({ ...prev, latitude, longitude }));
    }
  };

  const hdlSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  const handleSelectPlace = (feature) => {
    const [longitude, latitude] = feature.center;
    const region = feature.context?.find(c => c.id.startsWith('region'))?.text || "";
    const postcode = feature.context?.find(c => c.id.startsWith('postcode'))?.text || "";
    const place = feature.context?.find(c => c.id.startsWith('place'))?.text || "";

    setAddress({
      ...address,
      latitude,
      longitude,
      placeName: feature.text,
      address: feature.place_name,
      region,
      postcode,
      place,
      raw: feature
    });
    setSearchQuery(feature.text);
    setSearchResults([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: "100%" }}   
          animate={{ opacity: 1, x: 0 }}  
          exit={{ opacity: 0, x: "100%" }}   
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col bg-base-200">

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
            <section className="w-full relative">
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 z-10 flex items-center pointer-events-none">
                    <SearchIcon className='w-5' />
                </div>
                <input 
                  value={searchQuery}
                  onChange={hdlSearch}
                  className="w-full bg-white/95 backdrop-blur-md border-none outline-none ring-2 ring-primary/10 focus:ring-primary py-2 pl-14 pr-14 rounded-full shadow-md text-gray-700 transition-all placeholder:text-gray-400" 
                  placeholder="Search for a place" 
                  type="text"
                />
                {isSupported && (
                  <div 
                    onClick={toggleListening}
                    className="absolute inset-y-0 right-5 flex items-center cursor-pointer z-10"
                  >
                    <MicIcon 
                      className={`w-5.5 transition-all duration-300 ${
                        isListening ? "text-red-500 animate-pulse scale-110" : "text-gray-400 hover:text-primary"
                      }`} 
                    />
                  </div>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto border border-base-300">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectPlace(result)}
                      className="w-full text-left px-6 py-3 hover:bg-primary/5 transition-colors border-b border-base-100 last:border-none"
                    >
                      <p className="font-bold text-sm text-neutral">{result.text}</p>
                      <p className="text-xs text-neutral/50 truncate">{result.place_name}</p>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <MapContainer longitude={address.longitude} latitude={address.latitude} updateCoordinates={updateCoordinates}/>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-primary/5 space-y-2">
               <h3 className="font-bold text-primary text-[12px] uppercase tracking-wider">Selected Address</h3>
               <p className="font-bold text-[16px] text-neutral">{address.placeName || "Mark a location on map"}</p>
               <p className="text-[14px] text-neutral/60">{address.address}</p>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-6 z-40 bg-linear-to-t from-base-200 via-base-200 to-transparent">
              <button onClick={() => onConfirm(address)}
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

import pointer from '../../assets/pointer.svg'
import Map, {Marker} from "react-map-gl/mapbox"
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect } from 'react';
import { YourLocationIcon } from '../../icons';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function MapContainer({longitude, latitude, updateCoordinates}) {
  const [viewport, setViewport] = useState({
    latitude,
    longitude,
    zoom: 16,
  });

  // console.log('latitude', latitude)
  // console.log('longitude', longitude)

  const [marker, setMarker] = useState({
    latitude,
    longitude,
  });

  useEffect(() => {
    setViewport((oldViewport) => ({
      ...oldViewport,
      latitude,
      longitude,
    }));

    setMarker({
      latitude,
      longitude,
    });
  }, [latitude, longitude]);

  const handleMarkerDrag = (event) => {
    const lat = event.lngLat.lat;
    const lng = event.lngLat.lng;

    setMarker({ latitude: lat, longitude: lng });

    updateCoordinates(lat, lng);
  };

  const handleLocateUser = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 50000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="map relative" style={{ width: '100%', height: '400px', borderRadius: '24px', overflow: 'hidden' }}>
      <Map
        {...viewport}
        mapboxAccessToken={TOKEN}
        // mapStyle="mapbox://styles/mapbox/streets-v12"
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        onMove={(event) => {
          setViewport(event.viewState);
        }}
      >
        <Marker
          latitude={marker.latitude}
          longitude={marker.longitude}
          draggable={true}
          onDragEnd={handleMarkerDrag}
        >
          <img className="marker w-8 h-8" src={pointer} alt="pointer" />
        </Marker>

        {/* Locate User Button */}
        <div className="absolute bottom-2 right-2 z-10">
          <button 
            onClick={handleLocateUser}
            className="p-1.5 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-gray-50 active:scale-95 transition-all border border-base-200 flex items-center justify-center group"
            title="Go to current location"
          >
            <YourLocationIcon className="w-7 h-7 text-primary group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </Map>
    </div>
  );
}

export default MapContainer
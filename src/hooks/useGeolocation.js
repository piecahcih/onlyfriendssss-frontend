import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export function useMapHandler() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const hdlGetCurrentLocation = useCallback((imgUrl) => {
    if (!navigator.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const { longitude, latitude } = pos.coords;
      if (userMarkerRef.current) userMarkerRef.current.remove();

      const el = document.createElement("div");
      el.style.cssText = `width: 50px; height: 50px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(0,0,0,0.3); overflow: hidden;`;
      el.innerHTML = `<img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;" />`;

      userMarkerRef.current = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current);
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 17,
        pitch: 60,
        essential: true,
      });
    });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [100.535, 13.7583],
      zoom: 14,
      pitch: 60,
      bearing: 40,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    mapRef.current = map;

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  return { mapContainerRef, mapRef, hdlGetCurrentLocation };
}

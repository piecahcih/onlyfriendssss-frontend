import { useEffect, useRef, useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export function useMapHandler() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userLocationRef = useRef(null); // { latitude, longitude }

  const hdlGetCurrentLocation = useCallback((imgUrl, isInstant = false) => {
    if (!navigator.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const { longitude, latitude } = pos.coords;
      userLocationRef.current = { latitude, longitude };
      if (userMarkerRef.current) userMarkerRef.current.remove();

      const el = document.createElement("div");
      el.style.cssText = `width: 50px; height: 50px; border-radius: 50%; border: 3px solid red; box-shadow: 0 0 15px rgba(0,0,0,0.3); overflow: hidden;`;
      el.innerHTML = `<img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;" />`;

      userMarkerRef.current = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current);

      const viewOptions = {
        center: [longitude, latitude],
        zoom: 17,
        pitch: 60,
        padding: { bottom: 320 },
      };

      if (isInstant) {
        mapRef.current.jumpTo(viewOptions);
      } else {
        mapRef.current.flyTo({
          ...viewOptions,
          essential: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // style: "mapbox://styles/mapbox/standard",
      // style: "mapbox://styles/mapbox/dark-v11",
      style: "mapbox://styles/mapbox/outdoors-v12",
      // style: "mapbox://styles/mapbox/light-v11",
      center: [100.535, 13.7583],
      zoom: 14,
      pitch: 60,
      bearing: 40,
      padding: { bottom: 320 },
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.on("style.load", () => {
      // 1. Add 3D Terrain
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // 2. Add 3D Buildings
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout["text-field"],
      )?.id;

      map.addLayer(
        {
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#f5ecdf",
            "fill-extrusion-vertical-gradient": true,
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId,
      );

      // 3. Set Global Light (Shadow control)
      map.setLight({
        anchor: "viewport",
        color: "#ffffff",
        intensity: 0.2,
        position: [1, 210, 30],
      });
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  return { mapContainerRef, mapRef, hdlGetCurrentLocation, userLocationRef };
}

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

function LDD2() {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaWFtYmVuIiwiYSI6ImNtbzBmaWFhZTA3cmsyeW85eHhpOXQxdGcifQ.HOpVteb2fW2U-gN61K0_ew";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [100.53499383276497, 13.758571505785834],
      zoom: 15,
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ width: "100%", height: "500px" }}
      />
    </>
  );
}

export default LDD2;

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router";

export function useActivityMarkers(mapRef, activities) {
  const markersRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapRef?.current) return;

    // 1. ล้างหมุดเดิม
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();
    let hasValidPins = false;
    const groups = {};

    // 2. จัดกลุ่มกิจกรรมตามพิกัด
    activities.forEach((act) => {
      const lat = parseFloat(act.place?.latitude);
      const lng = parseFloat(act.place?.longitude);
      if (isNaN(lat) || isNaN(lng) || lat === 0) return;

      const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(act);
    });

    // 3. วนลูปสร้างหมุด
    Object.keys(groups).forEach((key) => {
      const groupActivities = groups[key];
      const [centerLat, centerLng] = key.split(",").map(parseFloat);

      groupActivities.forEach((act, index) => {
        let finalLat = centerLat;
        let finalLng = centerLng;

        // กระจายหมุดแบบวงกลม (Spiderify)
        if (groupActivities.length > 1) {
          const angle = (index / groupActivities.length) * (2 * Math.PI);
          const radius = 0.0003;
          finalLat += Math.cos(angle) * radius;
          finalLng += Math.sin(angle) * radius;
        }

        const el = document.createElement("div");
        el.className = "activity-marker-container";
        el.style.cssText = `
          width: 45px; height: 45px; background: white; border-radius: 50%; 
          border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
          cursor: pointer; overflow: hidden; display: flex; align-items: center; 
          justify-content: center; z-index: 100; transition: transform 0.1s ease;
        `;

        const img = document.createElement("img");
        img.src =
          act.coverPhoto ||
          `https://api.dicebear.com/8.x/identicon/svg?seed=${act.id}`;
        img.style.cssText = `width: 100%; height: 100%; object-fit: cover; pointer-events: none;`;
        el.appendChild(img);

        // --- Logic: เช็คก่อนว่าควรซูมหรือควรเปลี่ยนหน้า ---
        el.onclick = (e) => {
          e.stopPropagation();

          const currentZoom = mapRef.current.getZoom();
          const isGrouped = groupActivities.length > 1;

          // ถ้าหมุดซ้อนกัน และยังซูมไม่ถึงระดับ 17 -> ให้ซูมเข้าไปกระจายหมุดก่อน
          if (isGrouped && currentZoom < 17) {
            mapRef.current.flyTo({
              center: [finalLng, finalLat],
              zoom: 18,
              pitch: 45,
              duration: 800,
              essential: true,
            });
          } else {
            // ถ้าซูมใกล้พอแล้ว หรือมีหมุดเดียว -> ไปที่หน้ารายละเอียดเลย
            navigate(`/activity-details?actid=${act.id}`);
          }
        };

        try {
          const marker = new mapboxgl.Marker(el)
            .setLngLat([finalLng, finalLat])
            .addTo(mapRef.current);

          markersRef.current.push(marker);
          bounds.extend([finalLng, finalLat]);
          hasValidPins = true;
        } catch (err) {
          console.error(err);
        }
      });
    });

    // ซูมให้เห็นภาพรวมเมื่อข้อมูลเปลี่ยน
    if (hasValidPins && mapRef.current) {
      mapRef.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 14,
        duration: 1200,
        linear: false,
      });
    }
  }, [activities, mapRef, navigate]);

  return markersRef;
}
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router";

// --- Helper: คำนวณระยะห่างระหว่าง 2 จุด (km) สูตร Haversine ---
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const NEARBY_RADIUS_KM = 10; // รัศมีสำหรับ fitBounds (กม.)

export function useActivityMarkers(mapRef, activities) {
  const markersRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapRef?.current) return;

    // ฟังก์ชันหลัก: สร้างหมุดทั้งหมด + fitBounds เฉพาะหมุดที่อยู่ใกล้
    function buildMarkers(userLat, userLng) {
      // 1. ล้างหมุดเดิม
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const nearbyBounds = new mapboxgl.LngLatBounds(); // bounds เฉพาะหมุดใกล้ user
      let hasValidPins = false;
      let hasNearbyPins = false;
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

      // 3. วนลูปสร้างหมุด (ปักทุกอัน)
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
            hasValidPins = true;

            // --- คำนวณระยะห่างจาก user สำหรับ fitBounds ---
            if (userLat !== null && userLng !== null) {
              const dist = getDistanceKm(userLat, userLng, finalLat, finalLng);
              if (dist <= NEARBY_RADIUS_KM) {
                nearbyBounds.extend([finalLng, finalLat]);
                hasNearbyPins = true;
              }
            }
          } catch (err) {
            console.error(err);
          }
        });
      });

      // 4. ซูมให้เห็นภาพรวม
      if (hasValidPins && mapRef.current) {
        if (hasNearbyPins) {
          // มีหมุดใกล้ → fitBounds เฉพาะหมุดใน 50 กม.
          mapRef.current.fitBounds(nearbyBounds, {
            padding: { top: 100, bottom: 330, left: 60, right: 60 },
            maxZoom: 15,
            duration: 2000,
            essential: true,
          });
        } else if (userLat !== null) {
          // รู้ตำแหน่งแต่ไม่มีหมุดใกล้เลย → flyTo ตำแหน่ง user เฉยๆ
          mapRef.current.flyTo({
            center: [userLng, userLat],
            zoom: 13,
            duration: 1500,
            essential: true,
          });
        }
        // ถ้าไม่รู้ตำแหน่ง user เลย → ไม่ zoom (ปล่อยให้อยู่ตำแหน่งเดิม)
      }
    }

    // ดึงตำแหน่ง user ก่อน → แล้วค่อยสร้างหมุด
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // ได้ตำแหน่งแล้ว → สร้างหมุดพร้อมคำนวณระยะ
          buildMarkers(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // ไม่ได้ permission / error → สร้างหมุดแบบไม่มี user location
          buildMarkers(null, null);
        },
        { maximumAge: 60000, timeout: 5000 }
      );
    } else {
      buildMarkers(null, null);
    }

    // Cleanup: ล้างหมุดเมื่อ unmount
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [activities, mapRef, navigate]);

  return markersRef;
}

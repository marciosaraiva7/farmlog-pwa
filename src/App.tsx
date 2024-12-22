import mapboxgl, { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./context/auth";

import { ClientTypes } from "./types/schema";

import { AvatarUser } from "./components/AvatarUser";
import useInitials from "./hooks/initialsName";

import "mapbox-gl/dist/mapbox-gl.css";
import { fetchAnnotations, fetchFarmData } from "./api/farmApi";
import "./App.css";
import { ControlBar } from "./components/ControlBar";
import { DropdownMenuButton } from "./components/DropdownMenuButton";
import { useRealTimeLocation } from "./hooks/useRealTimeLocation";

const limitMapStyle = "mapbox://styles/mapbox/streets-v12";
const NDVIMapStyle = "mapbox://styles/marciosaraiva/cm41yyp8m00m001qrdc6xav6x";

function App() {
  const { latitude, longitude } = useRealTimeLocation();
  const [styleMap, setStyleMap] = useState<string>(NDVIMapStyle);
  const [clients, setClients] = useState<ClientTypes[]>([]);
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const initials = useInitials(user?.name as string);

  const handleSelection = (id: string) => {
    if (id === "ndvi") {
      setStyleMap(NDVIMapStyle);
    } else {
      setStyleMap(limitMapStyle);
    }
  };

  useEffect(() => {
    const loadFarmData = async () => {
      try {
        const data = await fetchFarmData(user?.idClienteFazenda);
        setClients(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadFarmData();
  }, [user?.idClienteFazenda]);

  useEffect(() => {
    if (latitude === 0 && longitude === 0) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoibWFyY2lvc2FyYWl2YSIsImEiOiJjbTQ0eXB5ZTMwc2VnMmxvbmlkdzJ3NHExIn0.8VWTQqv3IOUYORp1cuoZsg";

    const mapCenter =
      styleMap === NDVIMapStyle ? [-45.45552, -12.0127] : [longitude, latitude];

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: styleMap,
        center: [mapCenter[0], mapCenter[1]],
        zoom: 15,
      });

      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        showUserLocation: true,
        trackUserLocation: true,
        showUserHeading: true,
      });

      mapRef.current.addControl(geolocateControl);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [styleMap, latitude, longitude]);

  useEffect(() => {
    const loadAnnotations = async () => {
      try {
        const annotations = await fetchAnnotations(user?.id);

        annotations.forEach(
          (annotation: {
            latitude: number;
            longitude: number;
            titulo: string;
            descricao: string;
          }) => {
            if (mapRef.current) {
              const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div>
                  <h2><b>${annotation.titulo}</b></h2>
                  <h3>${annotation.descricao}</h3>
                </div>
              `);

              new mapboxgl.Marker()
                .setLngLat([annotation.longitude, annotation.latitude])
                .setPopup(popup)
                .addTo(mapRef.current);
            }
          },
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadAnnotations();
  }, [mapRef]);

  const transformedClients = clients.map((client) => ({
    id: client.id,
    name: client.proprietario,
  }));

  return (
    <div className="h-screen">
      {latitude !== 0 && longitude !== 0 ? (
        <>
          <div className="absolute top-[59px] z-10 flex w-full justify-between pl-[20px] pr-[20px]">
            <button className="h-[50px] w-[50px] rounded-full border-[1px] border-[#EAC00F] bg-white shadow-md flex justify-center items-center">
              <AvatarUser
                initials={initials}
                profilePicture={user?.profilePicture}
              />
            </button>
            <DropdownMenuButton
              label="VISUALIZAR MAPA"
              items={[
                { id: "ndvi", label: "NDVI" },
                { id: "limite", label: "Limite de talhão" },
              ]}
              onSelect={(id) => handleSelection(id)}
            />
          </div>
          <div
            className="absolute w-full"
            id="map-container"
            ref={mapContainerRef}
          />
          <ControlBar
            latitude={latitude}
            longitude={longitude}
            listControl={transformedClients}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p>Carregando mapa...</p>
        </div>
      )}
    </div>
  );
}

export default App;

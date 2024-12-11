import mapboxgl, { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./context/auth";

import { AvatarUser } from "./components/AvatarUser";
import useInitials from "./hooks/initialsName";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { ControlBar } from "./components/ControlBar";
import { DropdownMenuButton } from "./components/DropdownMenuButton";

function App() {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Ref para o container do mapa
  const { user } = useAuth();

  const initials = useInitials(user?.name as string);

  const handleSelection = (id: string) => {
    console.log("Item selecionado:", id);
  };

  // Salva latitude e longitude no localStorage
  const saveLocationToLocalStorage = (lat: number, lon: number) => {
    localStorage.setItem(
      "lastLocation",
      JSON.stringify({ latitude: lat, longitude: lon }),
    );
  };

  // Restaura localização do localStorage
  const restoreLocationFromLocalStorage = () => {
    const savedLocation = localStorage.getItem("lastLocation");
    if (savedLocation) {
      const { latitude, longitude } = JSON.parse(savedLocation);
      setLatitude(latitude);
      setLongitude(longitude);
    }
  };

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWFyY2lvc2FyYWl2YSIsImEiOiJjbTQ0eXB5ZTMwc2VnMmxvbmlkdzJ3NHExIn0.8VWTQqv3IOUYORp1cuoZsg";

    // Inicializa o mapa apenas se o container estiver disponível
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/marciosaraiva/cm41yyp8m00m001qrdc6xav6x",
        center: [-45.45552, -12.0127],
        zoom: 15,
      });
    }

    // Limpa o mapa ao desmontar o componente
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    restoreLocationFromLocalStorage();

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        saveLocationToLocalStorage(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="h-screen">
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
          onSelect={handleSelection}
        />
      </div>
      <div
        className="absolute w-full"
        id="map-container"
        ref={mapContainerRef}
      />

      <ControlBar latitude={latitude} longitude={longitude} />
    </div>
  );
}

export default App;

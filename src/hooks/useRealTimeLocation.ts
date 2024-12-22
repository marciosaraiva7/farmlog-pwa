import { useEffect, useState } from "react";

export const useRealTimeLocation = () => {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função para salvar localização no localStorage
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

    restoreLocationFromLocalStorage();

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setError(null); // Limpa qualquer erro existente
        saveLocationToLocalStorage(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      (err) => {
        setError("Erro ao obter localização: " + err.message);
      },
    );

    // Limpa o watchPosition ao desmontar o hook
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { latitude, longitude, error };
};

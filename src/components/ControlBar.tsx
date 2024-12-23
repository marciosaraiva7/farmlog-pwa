import { fetchAreasByFarm, fetchFieldsByArea } from "@/api/farmApi";
import RegisterIcon from "@/assets/icons/register";
import { ListControlProps } from "@/types/schema";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenuList } from "./DropdownMenuList";
import LegendNDVI from "./LegendNDVI";
import { Button } from "./ui/button";

type FieldType = {
  id: string;
  nomeFazenda: string;
};

type FieldProps = {
  id: string;
  nomeTalhao: string;
};

type ControlBarProps = {
  latitude: number;
  longitude: number;
  listControl: ListControlProps[];
};

export function ControlBar({
  latitude,
  longitude,
  listControl,
}: ControlBarProps) {
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [areas, setAreas] = useState<FieldType[]>([]);
  const [fields, setFields] = useState<FieldProps[]>([]);
  const [disable, setDisable] = useState(true);

  function handleRegister() {
    navigate("annotation");
  }

  useEffect(() => {
    if (selectedArea && selectedField && register) {
      setDisable(false);
    }
  }, [selectedArea, selectedField, register]);
  // Load areas when a farm is selected
  function handleIdTalhao(id: string) {
    setSelectedField(id);
    const farmData = JSON.parse(localStorage.getItem("farmData") || "");
    const farmDataUpdate = JSON.stringify({ ...farmData, idTalhao: id });
    localStorage.setItem("farmData", farmDataUpdate);
  }

  useEffect(() => {
    const loadAreas = async () => {
      if (!selectedFarm) return;
      try {
        const data = await fetchAreasByFarm(selectedFarm);
        setAreas(
          data.map((area: { id: string; nomeFazenda: string }) => ({
            id: area.id,
            nomeFazenda: area.nomeFazenda,
          })),
        );
      } catch (error) {
        console.error("Erro ao buscar áreas da fazenda:", error);
      }
    };

    loadAreas();
  }, [selectedFarm]);

  // Load fields when an area is selected
  useEffect(() => {
    const loadFields = async () => {
      if (!selectedArea) return;
      try {
        const data = await fetchFieldsByArea(selectedArea);
        setFields(
          data.map((field: { id: string; nomeTalhao: string }) => ({
            id: field.id,
            nomeTalhao: field.nomeTalhao,
          })),
        );
      } catch (error) {
        console.error("Erro ao buscar campos da área:", error);
      }
    };

    loadFields();
  }, [selectedArea]);

  useEffect(() => {}, []);

  console.log("areas", selectedArea);
  console.log("talhoes", selectedField);

  return (
    <>
      {!register && <LegendNDVI />}
      <div
        className={`w-full bg-[#181A18CC] pr-5 pl-5 pt-3 absolute bottom-0 z-10 ${
          register ? "h-[400px]" : "h-[124px]"
        }`}
      >
        {register && (
          <div>
            <div className="flex w-full justify-between items-center">
              <p className="text-white">ÁREA DE REGISTRO</p>
              <Button className="text-white" onClick={() => setRegister(false)}>
                x
              </Button>
            </div>
            <div>
              <p className="text-white">Cliente</p>
              <DropdownMenuList
                list={listControl}
                onSelect={(id) => {
                  setSelectedFarm(id);
                  setSelectedArea(null); // Reset area when farm changes
                  setFields([]); // Reset fields when farm changes
                }}
              />
              <p className="text-white">Fazenda</p>
              <DropdownMenuList
                list={areas.map((area) => ({
                  id: area.id,
                  name: area.nomeFazenda,
                }))}
                onSelect={(id) => {
                  setSelectedArea(id);
                  setFields([]); // Reset fields when area changes
                }}
              />
              <p className="text-white">Áreas</p>
              <DropdownMenuList
                list={fields.map((field) => ({
                  id: field.id,
                  name: field.nomeTalhao,
                }))}
                onSelect={(id) => {
                  handleIdTalhao(id);
                }}
              />
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex flex-col ">
            <p className="text-white">Sua posição atual</p>
            <p className="text-white">LAT: {latitude.toFixed(6)}</p>
            <p className="text-white">LON: {longitude.toFixed(6)}</p>
          </div>
          <div className="">
            {!register ? (
              <button
                onClick={() => setRegister(true)}
                className="w-[170px] h-[60px] bg-[#EAC00F] rounded-full text-white flex gap-3 justify-center items-center"
              >
                <RegisterIcon /> Registro
              </button>
            ) : (
              <button
                className="w-[170px] h-[60px] bg-[#EAC00F] rounded-full disabled:bg-gray-500 text-white flex gap-3 justify-center items-center"
                onClick={handleRegister}
                disabled={disable}
              >
                Proximo
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

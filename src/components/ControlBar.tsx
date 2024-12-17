import RegisterIcon from "@/assets/icons/register";
import { ListControlProps } from "@/types/schema";
import { useState } from "react";
import { DropdownMenuList } from "./DropdownMenuList";
import LegendNDVI from "./LegendNDVI";
import { Button } from "./ui/button";

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
  const [register, setRegister] = useState(false);
  return (
    <>
      {!register && <LegendNDVI />}
      <div
        className={`w-full  bg-[#181A18CC] pr-5 pl-5 pt-3 absolute bottom-0 z-10 ${
          register ? "h-[300px]" : "h-[124px]"
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
              <DropdownMenuList list={listControl} />
              <p className="text-white">Fazenda</p>
              <DropdownMenuList />
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
            <button
              className="w-[170px] h-[60px] bg-[#EAC00F] rounded-full text-white flex gap-3 justify-center items-center"
              onClick={() => setRegister(true)}
            >
              <RegisterIcon /> Registro
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

import IconBack from "@/assets/icons/icon-back";
import { FarmDataType, LastLocationType } from "@/types/schema";
import { useNavigate } from "react-router-dom";

function HeaderAnnotation() {
  const navigate = useNavigate();
  const farmData: FarmDataType = JSON.parse(
    localStorage.getItem("farmData") || "",
  );
  const lastLocation: LastLocationType = JSON.parse(
    localStorage.getItem("lastLocation") || "",
  );
  return (
    <div className="h-[138px] w-full bg-[#EAC00F] flex items-end p-5 ">
      <div className="flex gap-3">
        <button
          className="bg-transparent focus-within:outline-none focus-within:border-none"
          onClick={() => navigate("/")}
        >
          <IconBack fill="#ffffff" />
        </button>
        <div className="text-white">
          <p className="text-[22px] leading-[29px] font-medium font-sans">
            {farmData?.nomeFazenda}
          </p>
          <p className="flex text-[18px] leading-[24px]">
            Área:{"  "}
            <p className="font-light">
              {" "}
              {lastLocation?.latitude}, {lastLocation?.longitude}
            </p>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeaderAnnotation;

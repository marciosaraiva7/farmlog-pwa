import IconBack from "@/assets/icons/icon-back";

function HeaderAnnotation() {
  return (
    <div className="h-[138px] w-full bg-[#EAC00F] flex items-end p-5 ">
      <div className="flex gap-3">
        <IconBack fill="#ffffff" />
        <div className="text-white">
          <p className="text-[22px] leading-[29px] font-medium font-sans">
            Fazenda Boa esperança
          </p>
          <p className="flex text-[18px] leading-[24px]">
            Área:{"  "}
            <p className="font-light">
              {" "}
              {"22.891987"}, {"-47.306923"}
            </p>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeaderAnnotation;

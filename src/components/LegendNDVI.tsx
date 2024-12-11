const LegendNDVI = () => {
  return (
    <div className="absolute bottom-[134px] z-30 flex items-center justify-between w-full  ">
      <div className="px-[15px] bg-[#181A18CC] rounded-full  py-3 flex items-center justify-between w-full">
        <span className="left-0 text-[16px] leading-[21px] text-white">
          Abaixo de 0.3
        </span>

        <div
          className="h-[14px] w-[43%]  mx-3 rounded-full"
          style={{
            background: "linear-gradient(to right, #FF0000,#F5EF12, #00FF11)",
          }}
        ></div>

        <span className="right-0 text-[16px] leading-[21px] text-white">
          Acima de 0.8
        </span>
      </div>
    </div>
  );
};

export default LegendNDVI;

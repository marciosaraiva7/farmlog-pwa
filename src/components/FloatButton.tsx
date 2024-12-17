import { useNavigate } from "react-router-dom";

const FloatingButton = () => {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/register");
  }
  return (
    <button
      className="w-[60px] h-[60px] flex items-center justify-center shadow-[0px 3px 6px #0000003E] fixed bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-3 rounded-full shadow-lg"
      aria-label="Add"
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-[50px] h-[50px]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
};

export default FloatingButton;

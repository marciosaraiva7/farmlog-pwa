import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import IconBack from "../assets/icons/icon-back.svg";

function ForgotPassword() {
  const [error, setError] = useState(false);
  const [sucess, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function backTo() {
    navigate(-1);
  }

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://farmlog-api.wr-agro.dev.br:3003/api/forgotpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ email }), // Envia o email no corpo da requisição
        },
      );

      if (response.ok) {
        setSuccess(true);
        setError(false);
      } else {
        setError(true);
        setSuccess(false);
      }
    } catch (error) {
      console.error("Erro ao resetar a senha:", error);
      setError(true);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col p-[20px]">
      <div className="mb-[69px] flex gap-[18px]">
        <button
          className="flex h-[35px] w-fit items-center bg-transparent p-0 focus:border-none focus:outline-none"
          onClick={backTo}
        >
          <img src={IconBack} />
        </button>
        <h2 className="text-[27px] font-bold leading-[35px]">
          Recuperar senha
        </h2>
      </div>
      <p className="mb-[5px] text-[18px] leading-[24px]">Email</p>
      <input
        className="mb-[35px] h-[43px] w-full rounded-[6px] border-[0.5px] border-[#EAC00F] pl-[12px] pt-[9] text-[18px] leading-[24px] placeholder:text-[#A1A0A0] focus:outline-[#EAC00F]"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && (
        <p className="mb-[5px] text-center text-[18px] font-medium leading-[24px] text-[#FF0000]">
          Email não identificado
        </p>
      )}
      {sucess && (
        <>
          <p className="mb-[5px] text-center text-[18px] font-medium leading-[24px] text-[#589B14]">
            Email enviado com sucesso!
          </p>
          <p className="mb-[5px] text-center text-[18px] font-[300] leading-[24px] text-[#000000]">
            Enviamos um email com a senha de recuperação.
          </p>
        </>
      )}
      <div className="flex w-full justify-center">
        <button
          onClick={handleResetPassword}
          className="absolute bottom-[233px] flex justify-center rounded-full bg-[#EAC00F] pl-[55px] pr-[55px] text-white transition-all duration-300 ease-in-out focus:border-none focus:outline-none"
        >
          {loading ? (
            <ClipLoader color={"#ffffff"} loading={loading} size={30} />
          ) : (
            "Próximo"
          )}
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;

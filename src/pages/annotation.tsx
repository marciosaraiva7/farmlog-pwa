/* eslint-disable @typescript-eslint/no-unused-expressions */
import LocIcon from "@/assets/icons/loc";
import AudioPlayer from "@/components/AudioPlayer";
import ImageCarousel from "@/components/CarouselImage";
import FloatingButton from "@/components/FloatButton";
import HeaderAnnotation from "@/components/HeaderAnnotation";
import { Modal } from "@/components/Modal";
import SubHeaderFarmDetails from "@/components/SubHeaderAnnotation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { AnnotationType } from "@/types/schema";
import { useEffect, useState } from "react";
import { FaArrowUpLong } from "react-icons/fa6";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";

/**
 * Converte uma string base64 em um objeto File.
 * @param base64String string base64
 * @param fileName nome do arquivo que será usado
 * @param fileType tipo do arquivo (image/png, audio/webm etc.)
 * @returns objeto File
 */
async function base64ToFile(
  base64String: string,
  fileName: string,
  fileType: string,
): Promise<File> {
  const res = await fetch(base64String);
  const blob = await res.blob();
  return new File([blob], fileName, { type: fileType });
}

function AnnotationPage() {
  const [annotations, setAnnotations] = useState<AnnotationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const { user } = useAuth();
  const isOnline = useOnlineStatus();

  const notify = (message: string, type: "success" | "error") => {
    const toastOptions = {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    } as const;
    type === "success"
      ? toast.success(message, toastOptions)
      : toast.error(message, toastOptions);
  };

  // Anotações salvas online (cache local)
  const localAnnotations = localStorage.getItem("annotations") ?? "";

  // Anotações salvas offline (pendentes de envio)
  const offlineAnnotations: AnnotationType[] = JSON.parse(
    localStorage.getItem("offlineAnnotations") || "[]",
  );

  // Última localização salva
  const lastLocation = localStorage.getItem("lastLocation");

  const handleUploadPendingAnnotations = async () => {
    if (!offlineAnnotations || offlineAnnotations.length === 0) return;

    setIsLoading(true);

    try {
      const uploadPromises = offlineAnnotations.map(async (annotation) => {
        // Se tiver "id", significa que é edição (update); se estiver vazio, é criação (create).
        const url = annotation.id
          ? "https://farmlog-api.wr-agro.dev.br:3003/api/updateAnnotation"
          : "https://farmlog-api.wr-agro.dev.br:3003/api/createAnnotation";

        const method = annotation.id ? "PUT" : "POST";

        const formData = new FormData();
        formData.append("id", annotation.id || ""); // se for vazio, cria nova
        formData.append("nrAnotacao", annotation.nrAnotacao.toString());
        formData.append("titulo", annotation.titulo);
        formData.append("descricao", annotation.descricao);
        formData.append("data", new Date().toISOString());
        formData.append("idTecnicoCampo", user?.id ?? "");
        formData.append("urgencia", annotation.urgencia?.toString() || "1");

        // Para latitude e longitude, se não existirem no localStorage, usar 0
        const { latitude, longitude } = JSON.parse(lastLocation ?? "{}") || {};
        formData.append("latitude", latitude?.toString() ?? "0");
        formData.append("longitude", longitude?.toString() ?? "0");

        formData.append("idTalhao", annotation.idTalhao || "");

        // Converte cada imagem base64 para File
        if (annotation.imagens?.length) {
          for (let i = 0; i < annotation.imagens.length; i++) {
            // Cada imagem do offline foi armazenada como base64
            const base64Str = annotation.imagens[i] as unknown as string;
            const fileImg = await base64ToFile(
              base64Str,
              `offline-image-${i}.jpeg`, // nome genérico
              "image/jpeg", // ou "image/png", conforme for
            );
            formData.append("imagens", fileImg);
          }
        }

        // Converte cada áudio base64 para File
        if (annotation.audios?.length) {
          for (let i = 0; i < annotation.audios.length; i++) {
            const base64Str = annotation.audios[i] as unknown as string;
            const fileAudio = await base64ToFile(
              base64Str,
              `offline-audio-${i}.webm`, // nome genérico
              "audio/webm",
            );
            formData.append("audios", fileAudio);
          }
        }

        const response = await fetch(url, {
          method,
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Falha ao enviar a anotação ${annotation.id}`);
        }

        return annotation.id;
      });

      // Quais IDs foram subidos
      const uploadedIds = await Promise.all(uploadPromises);

      // Remove do localStorage as anotações que foram enviadas
      const remainingAnnotations = offlineAnnotations.filter(
        (ann) => !uploadedIds.includes(ann.id),
      );
      localStorage.setItem(
        "offlineAnnotations",
        JSON.stringify(remainingAnnotations),
      );

      notify(
        "Todas as anotações pendentes foram enviadas com sucesso!",
        "success",
      );
    } catch (error) {
      console.error("Erro ao enviar anotações pendentes:", error);
      notify("Erro ao enviar as anotações pendentes", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnotationDeleted = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://farmlog-api.wr-agro.dev.br:3003/api/deleteAnnotation/${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar a anotação");
      }

      // Remove do estado local e do localStorage
      setAnnotations((prevAnnotations) =>
        prevAnnotations.filter((annotation) => annotation.id !== id),
      );

      const updatedAnnotations = annotations.filter(
        (annotation) => annotation.id !== id,
      );
      localStorage.setItem("annotations", JSON.stringify(updatedAnnotations));

      notify("Anotação deletada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao deletar a anotação:", error);
      notify("Erro ao deletar a anotação", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Notifica online/offline
  useEffect(() => {
    if (isOnline) {
      notify("Você está online!", "success");
    } else {
      notify("Você ficou offline!", "error");
    }
  }, [isOnline]);

  // Busca as anotações
  useEffect(() => {
    if (localAnnotations && !isOnline) {
      // Se offline, usamos o cache local
      setAnnotations(JSON.parse(localAnnotations));
    } else {
      // Se online, buscamos do servidor
      const fetchAnnotations = async () => {
        setLoadingList(true);
        try {
          const response = await fetch(
            `https://farmlog-api.wr-agro.dev.br:3003/api/getAnnotations?ByUser=${user?.id}`,
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const reverseData = [...data].reverse();
          setAnnotations(reverseData);
          localStorage.setItem("annotations", JSON.stringify(reverseData));
        } catch (error) {
          console.error("Failed to fetch annotations:", error);
        }
        setLoadingList(false);
      };

      fetchAnnotations();
    }
  }, [user?.id, localAnnotations, isOnline]);

  return (
    <div>
      <HeaderAnnotation />

      {/* Modal de Loading */}
      {isLoading && (
        <Modal>
          <div className="flex justify-center items-center ">
            <div className="flex flex-col items-center">
              <RotatingLines
                visible={true}
                strokeColor="gray"
                width="50"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
              <div className="loader mt-4"></div>
            </div>
          </div>
        </Modal>
      )}

      <div className="flex bg-white flex-col gap-4">
        {offlineAnnotations && offlineAnnotations.length > 0 && (
          <Button
            className="flex w-full p-4 h-max"
            onClick={handleUploadPendingAnnotations}
          >
            <div className="flex w-full justify-center items-center rounded-[15px] bg-[#f1f1f1] p-2 gap-4">
              <FaArrowUpLong size={30} />
              <div className="flex flex-col">
                <p className="font-bold text-[18px] text-black">
                  {offlineAnnotations.length + " "} Anotações pendentes
                </p>
                <p className="text-[14px] text-gray-400">
                  Toque para fazer upload
                </p>
              </div>
            </div>
          </Button>
        )}

        {loadingList && (
          <div className="flex w-full h-[100vh] justify-center items-start pt-[80%]">
            <RotatingLines
              visible={true}
              strokeColor="gray"
              width="50"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          </div>
        )}

        {annotations.map((annotation, index) => (
          <div
            key={annotation.id}
            className="bg-white h-full flex flex-col px-4 gap-4 mb-5"
          >
            <div>
              <SubHeaderFarmDetails
                idAnnotation={annotation.id}
                available={index + 1}
                date={new Date(annotation.data).toLocaleDateString()}
                hour={new Date(annotation.data).toLocaleTimeString()}
                onAnnotationDeleted={() =>
                  handleAnnotationDeleted(annotation.id)
                }
              />
              <button className="flex justify-center items-center gap-1 text-[0.875rem] bg-transparent">
                <LocIcon /> Ver posição
              </button>
            </div>
            <h1 className="text-black text-[1.125rem] leading-[1.5rem] ">
              {annotation.descricao}
            </h1>

            {/* Tocar apenas o primeiro áudio (exemplo) */}
            <AudioPlayer
              src={
                annotation.audios.length > 0
                  ? annotation.audios[0].audioUrl
                  : ""
              }
            />

            {/* Exibir imagens em um carrossel */}
            <ImageCarousel
              images={annotation.imagens.map((img) => img.imageUrl)}
            />

            <div className="h-[1px] w-full bg-gray-300"></div>
          </div>
        ))}

        <FloatingButton />
      </div>
    </div>
  );
}

export default AnnotationPage;

import LocIcon from "@/assets/icons/loc";
import AudioPlayer from "@/components/AudioPlayer";
import ImageCarousel from "@/components/CarouselImage";
import FloatingButton from "@/components/FloatButton";
import HeaderAnnotation from "@/components/HeaderAnnotation";
import { Modal } from "@/components/Modal";
import SubHeaderFarmDetails from "@/components/SubHeaderAnnotation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { AnnotationType } from "@/types/schema";
import { useEffect, useState } from "react";
import { FaArrowUpLong } from "react-icons/fa6";

function AnnotationPage() {
  const [annotations, setAnnotations] = useState<AnnotationType[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o modal de loading
  const { user } = useAuth();
  const localAnnotations = localStorage.getItem("annotations");
  const offlineAnnotations = JSON.parse(
    localStorage.getItem("offlineAnnotations") as string,
  );

  const handleUploadPendingAnnotations = async () => {
    if (!offlineAnnotations || offlineAnnotations.length === 0) return;

    setIsLoading(true); // Ativa o modal de carregamento
    const remainingAnnotations = [...offlineAnnotations];

    try {
      for (const annotation of offlineAnnotations) {
        const formData = new FormData();

        // Preencha o formData com os dados da anotação
        formData.append("id", annotation.id);
        formData.append("titulo", annotation.titulo);
        formData.append("descricao", annotation.descricao);
        formData.append("data", annotation.timestamp);
        formData.append("idTecnicoCampo", user?.id ?? "");
        formData.append("urgencia", "1");

        annotation.imagens?.forEach((image: string, index: number) => {
          formData.append(
            `imagens[${index}]`,
            new File([], image, { type: "image/png" }),
          );
        });

        annotation.audios?.forEach((audio: string, index: number) => {
          formData.append(
            `audios[${index}]`,
            new File([], audio, { type: "audio/webm" }),
          );
        });

        const response = await fetch(
          "https://farmlog-api.wr-agro.dev.br:3003/api/createAnnotation",
          {
            method: "POST",
            body: formData,
          },
        );

        if (response.ok) {
          // Remove a anotação atual da lista pendente
          const indexToRemove = remainingAnnotations.findIndex(
            (item) => item.id === annotation.id,
          );
          remainingAnnotations.splice(indexToRemove, 1);

          // Atualiza o localStorage
          localStorage.setItem(
            "offlineAnnotations",
            JSON.stringify(remainingAnnotations),
          );

          console.log(`Anotação ${annotation.id} enviada com sucesso!`);
        } else {
          console.error(`Falha ao enviar a anotação ${annotation.id}`);
        }
      }

      alert("Todas as anotações pendentes foram enviadas com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar anotações pendentes:", error);
      alert("Erro ao enviar as anotações pendentes.");
    } finally {
      setIsLoading(false); // Desativa o modal de carregamento
    }
  };

  const handleAnnotationDeleted = async (id: string) => {
    setIsLoading(true); // Exibe o modal de loading
    try {
      const response = await fetch(
        `https://farmlog-api.wr-agro.dev.br:3003/api/deleteAnnotation/${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar a anotação");
      }

      // Atualiza o estado e remove do localStorage
      setAnnotations((prevAnnotations) =>
        prevAnnotations.filter((annotation) => annotation.id !== id),
      );

      const updatedAnnotations = annotations.filter(
        (annotation) => annotation.id !== id,
      );
      localStorage.setItem("annotations", JSON.stringify(updatedAnnotations));

      alert("Anotação deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar a anotação:", error);
      alert("Erro ao deletar a anotação");
    } finally {
      setIsLoading(false); // Oculta o modal de loading
    }
  };

  useEffect(() => {
    if (localAnnotations) {
      setAnnotations(JSON.parse(localAnnotations));
    } else {
      const fetchAnnotations = async () => {
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
      };

      fetchAnnotations();
    }
  }, [user?.id, localAnnotations]);

  return (
    <div>
      <HeaderAnnotation />

      {/* Modal de Loading */}
      {isLoading && (
        <Modal>
          <div className="flex justify-center items-center h-full ">
            <div className="flex flex-col items-center">
              <p className="text-xl font-semibold">Carregando...</p>
              <div className="loader mt-4"></div>
            </div>
          </div>
        </Modal>
      )}

      <div className="flex bg-white flex-col gap-4">
        {offlineAnnotations && (
          <Button
            className="flex w-full p-4 "
            onClick={handleUploadPendingAnnotations}
          >
            <div className="flex w-full  justify-center items-center rounded-[15px] bg-[#f1f1f1] p-2 gap-4">
              <FaArrowUpLong size={30} />
              <div className="flex flex-col">
                <p className="font-bold text-[18px] text-black">
                  {offlineAnnotations.length + " "} Anotacoes pendentes
                </p>
                <p className="text-[14px] text-gray-400 ">
                  Toque para fazer upload
                </p>
              </div>
            </div>
          </Button>
        )}
        {annotations.map((annotation, index) => (
          <div
            key={annotation.id}
            className="bg-white h-full flex flex-col px-4 gap-4 mb-5"
          >
            <div>
              {/* SubHeaderFarmDetails controla a exclusão */}
              <SubHeaderFarmDetails
                idAnnotation={annotation.id}
                available={index + 1}
                date={new Date(annotation.data).toLocaleDateString()}
                hour={new Date(annotation.data).toLocaleTimeString()}
                onAnnotationDeleted={() =>
                  handleAnnotationDeleted(annotation.id)
                }
              />

              <button className="flex justify-center items-center gap-1 text-[0.875rem] bg-transparent ">
                <LocIcon /> Ver posição
              </button>
            </div>
            <h1 className="text-black text-[1.125rem] leading-[1.5rem] ">
              {annotation.descricao}
            </h1>
            <AudioPlayer
              src={
                annotation.audios.length > 0
                  ? annotation.audios[0].audioUrl
                  : ""
              }
            />
            <ImageCarousel
              images={annotation.imagens.map((image) => image.imageUrl)}
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

import IconBack from "@/assets/icons/icon-back";
import AudioRecorder from "@/components/AudioRecButton";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { AnnotationType } from "@/types/schema";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MoonLoader from "react-spinners/MoonLoader";
import { ToastContainer, toast } from "react-toastify";

function RegisterPage() {
  const [searchParams] = useSearchParams();
  const idAnnotation = searchParams.get("idAnnotation");
  const listAnnotations = localStorage.getItem("annotations");
  const listAnnotationsParse = JSON.parse(listAnnotations ?? "[]");
  const annotation: AnnotationType = listAnnotationsParse.find(
    (item: { id: string }) => item.id === idAnnotation,
  );
  const [title, setTitle] = useState(annotation?.titulo || "");
  const [description, setDescription] = useState(annotation?.descricao || "");

  const [audioList, setAudioList] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [deletedAudios, setDeletedAudios] = useState<string[]>([]);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  // Captura o parâmetro 'idAnnotation' da URL

  const lastLocation = localStorage?.getItem("lastLocation");

  // Recupera e processa as anotações do localStorage

  // Filtra a anotação correspondente ao idAnnotation

  const notify = (message: string) =>
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const notifySuccess = (message: string) =>
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handleSubmit = async () => {
    setLoadingRegister(true);

    // Verificar a conexão com a internet
    const isOnline = navigator.onLine;

    try {
      const url = idAnnotation
        ? "https://farmlog-api.wr-agro.dev.br:3003/api/updateAnnotation"
        : "https://farmlog-api.wr-agro.dev.br:3003/api/createAnnotation";

      const method = idAnnotation ? "PUT" : "POST";

      // FormData
      const formData = new FormData();
      formData.append("id", idAnnotation ?? "");
      formData.append("nrAnotacao", annotation?.nrAnotacao?.toString() ?? "0");
      formData.append("data", new Date().toISOString());
      formData.append(
        "latitude",
        JSON.parse(lastLocation ?? "{}").latitude?.toString() ?? "",
      );
      formData.append(
        "longitude",
        JSON.parse(lastLocation ?? "{}").longitude?.toString() ?? "",
      );
      formData.append("idTalhao", annotation?.idTalhao ?? "");
      formData.append("idTecnicoCampo", user?.id ?? "");
      formData.append("titulo", title ?? "");
      formData.append("descricao", description ?? "");
      formData.append("urgencia", "1");

      imageFiles.forEach((image) => formData.append("imagens", image));
      audioList.forEach((audio) => formData.append("audios", audio));
      deletedImages.forEach((imageId) =>
        formData.append("imagensDeletadas", imageId),
      );
      deletedAudios.forEach((audioId) =>
        formData.append("audiosDeletados", audioId),
      );

      if (isOnline) {
        // Realiza a requisição normalmente
        const response = await fetch(url, {
          method,
          body: formData,
        });

        if (response.ok) {
          notifySuccess(`Sucesso ao cadastrar anotação!`);
          navigate("/annotation");
        } else {
          const data = await response.json();
          console.error("Erro ao processar:", response.statusText);
          notify(`Erro ao processar: ${data.error}`);
        }
      } else {
        // Caso esteja offline, salva no localStorage
        const offlineAnnotations = JSON.parse(
          localStorage.getItem("offlineAnnotations") ?? "[]",
        );

        const newAnnotation = {
          id: idAnnotation ?? Date.now().toString(), // Gera um ID único se não existir
          titulo: title,
          descricao: description,
          imagens: imageFiles.map((file) => URL.createObjectURL(file)),
          audios: audioList.map((file) => URL.createObjectURL(file)),
          deletedImages,
          deletedAudios,
          timestamp: new Date().toISOString(),
        };

        // Substitui ou adiciona a anotação offline
        const updatedAnnotations = offlineAnnotations.filter(
          (item: { id: string }) => item.id !== newAnnotation.id,
        );
        updatedAnnotations.push(newAnnotation);

        localStorage.setItem(
          "offlineAnnotations",
          JSON.stringify(updatedAnnotations),
        );

        notifySuccess("Sem conexão com a internet. Anotação salva offline.");
      }
    } catch (error) {
      console.error("Erro ao processar a anotação:", error);
      notify(`Erro ao processar a anotação: ${error}`);
    } finally {
      setLoadingRegister(false);
    }
  };

  useEffect(() => {
    if (annotation?.imagens?.length > 0 && imageFiles.length === 0) {
      const loadedImageFiles = annotation.imagens.map(
        (image) =>
          new File([], image.imageUrl, {
            type: "image/png",
          }),
      );
      setImageFiles(loadedImageFiles);
    }
  }, [annotation, imageFiles.length]);
  // Só inicializa se title e description estiverem vazios

  // Função memorizada para adicionar imagens
  const handleImageUpload = useCallback(
    (newImages: File[]) => {
      setImageFiles((prevFiles) => [...prevFiles, ...newImages]);

      if (annotation) {
        const updatedAnnotations = listAnnotationsParse.map(
          (item: AnnotationType) => {
            if (item.id === annotation.id) {
              return {
                ...item,
                imagens: [
                  ...item.imagens,
                  ...newImages.map((file) => ({
                    imageUrl: URL.createObjectURL(file),
                  })),
                ],
              };
            }
            return item;
          },
        );

        localStorage.setItem("annotations", JSON.stringify(updatedAnnotations));
      }
    },
    [annotation, listAnnotationsParse],
  );

  // Função memorizada para deletar imagens
  const handleImageDelete = useCallback(
    (deletedImageUrl: string) => {
      setDeletedImages((prevDeleted) => [...prevDeleted, deletedImageUrl]);
      setImageFiles((prevFiles) =>
        prevFiles.filter(
          (file) => URL.createObjectURL(file) !== deletedImageUrl,
        ),
      );

      if (annotation) {
        const updatedAnnotations = listAnnotationsParse.map(
          (item: AnnotationType) => {
            if (item.id === annotation.id) {
              return {
                ...item,
                imagens: item.imagens.filter(
                  (image) => image.imageUrl !== deletedImageUrl,
                ),
              };
            }
            return item;
          },
        );

        localStorage.setItem("annotations", JSON.stringify(updatedAnnotations));
      }
    },
    [annotation, listAnnotationsParse],
  );

  return (
    <div className="bg-white h-[100vh] p-4">
      <div className="flex gap-4 items-start justify-start mb-10">
        <Button
          className="bg-transparent border-none shadow-none w-fit p-0 focus-within:border-none focus-within:outline-none "
          onClick={() => navigate(-1)}
        >
          <IconBack fill="#181A18" />
        </Button>
        <h2 className="text-[22px] leading-[29px] font-medium">
          {idAnnotation ? "Editar Registro" : "Registro"}
        </h2>
      </div>
      <div>
        <div className="flex flex-col gap-4">
          <input
            className="w-full border-b-[1px] pb-[2px]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite aqui seu titulo"
          />
          <textarea
            className="w-full border-b-[1px] pb-[2px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite aqui sua avaliação…"
          />
          <AudioRecorder
            audioList={audioList.map((file) => URL.createObjectURL(file))}
            setAudioList={setAudioList}
          />
          <ImageUploader
            setImageFiles={(files) => {
              if (Array.isArray(files)) {
                handleImageUpload(files);
              }
            }}
            setDeleted={(deletedImages) => {
              if (typeof deletedImages === "string") {
                handleImageDelete(deletedImages);
              }
            }}
            imageList={annotation?.imagens?.map((image) => image.imageUrl)} // Passa a lista de imagens carregadas
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 p-4 w-full">
        <button
          className="w-full gap-4 text-white bg-[#EAC00F] flex items-center justify-center h-[55px] rounded-full text-[1.25rem] leading-[1.625rem] font-medium disabled:bg-slate-400"
          onClick={handleSubmit}
          disabled={loadingRegister}
        >
          <MoonLoader color={"#ffffff"} loading={loadingRegister} size={30} />
          {idAnnotation ? "Atualizar avaliação" : "Registrar avaliação"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default RegisterPage;

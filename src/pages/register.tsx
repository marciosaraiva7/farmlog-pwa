/* eslint-disable @typescript-eslint/no-unused-expressions */
import IconBack from "@/assets/icons/icon-back";
import AudioRecorder from "@/components/AudioRecButton";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useRealTimeLocation } from "@/hooks/useRealTimeLocation";
import { AnnotationType } from "@/types/schema";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

type FormValues = {
  title: string;
  description: string;
  nrAnotacao: string;
  urgencia: string;
  images: File[];
  audios: File[];
};

// Função para converter um arquivo em base64, retornando nome e tipo
function fileToBase64WithMeta(
  file: File,
): Promise<{ base64: string; name: string; type: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (evt) {
      const base64String = (evt.target?.result as string) || "";
      resolve({
        base64: base64String,
        name: file.name,
        type: file.type,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Função para salvar offline respeitando a estrutura do body do cURL.
async function saveAnnotationOffline(formData: FormData) {
  try {
    const offlineAnnotations = JSON.parse(
      localStorage.getItem("offlineAnnotations") || "[]",
    );

    const annotationOffline = {
      id: (formData.get("id") as string) || "",
      nrAnotacao: parseInt(formData.get("nrAnotacao") as string, 10) || 0,
      data: (formData.get("data") as string) || new Date().toISOString(),
      latitude: parseFloat(formData.get("latitude") as string) || 0,
      longitude: parseFloat(formData.get("longitude") as string) || 0,
      idTalhao: (formData.get("idTalhao") as string) || "",
      idTecnicoCampo: (formData.get("idTecnicoCampo") as string) || "",
      titulo: (formData.get("titulo") as string) || "",
      descricao: (formData.get("descricao") as string) || "",
      urgencia: parseInt(formData.get("urgencia") as string, 10) || 0,
      updatedAt: new Date().toISOString(),

      // Arrays contendo apenas os binários em base64
      imagens: [] as string[],
      audios: [] as string[],
    };

    // Convertendo as imagens para base64
    const imageFiles = formData.getAll("imagens");
    for (const img of imageFiles) {
      if (img instanceof File) {
        const base64file = await fileToBase64WithMeta(img);
        annotationOffline.imagens.push(base64file.base64);
      }
    }

    // Convertendo os áudios para base64
    const audioFiles = formData.getAll("audios");
    for (const audio of audioFiles) {
      if (audio instanceof File) {
        const base64file = await fileToBase64WithMeta(audio);
        annotationOffline.audios.push(base64file.base64);
      }
    }

    offlineAnnotations.push(annotationOffline);
    localStorage.setItem(
      "offlineAnnotations",
      JSON.stringify(offlineAnnotations),
    );
  } catch (err) {
    console.error("Erro ao salvar offline:", err);
  }
}

function RegisterPage() {
  const { control, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      nrAnotacao: "",
      urgencia: "",
      images: [],
      audios: [],
    },
  });

  const [searchParams] = useSearchParams();
  const idAnnotation = searchParams.get("idAnnotation");
  const [loadingRegister, setLoadingRegister] = useState(false);

  const { latitude, longitude } = useRealTimeLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Notificação
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

  // Se existir item na lista offline, pega o nrAnotacao do último e soma +1
  // Caso contrário, pega o length da lista online (annotations) + 1
  function getNextNrAnotacao() {
    const offlineAnnotations = JSON.parse(
      localStorage.getItem("offlineAnnotations") || "[]",
    ) as AnnotationType[];
    const onlineAnnotations = JSON.parse(
      localStorage.getItem("annotations") || "[]",
    ) as AnnotationType[];

    if (offlineAnnotations.length > 0) {
      const lastOffline = offlineAnnotations[offlineAnnotations.length - 1];
      return lastOffline.nrAnotacao + 1;
    } else {
      // offlineAnnotations está vazia → usar length da lista online
      return onlineAnnotations.length + 1;
    }
  }

  const onSubmit = async (data: FormValues) => {
    setLoadingRegister(true);

    try {
      const nrAnotacaoValue = getNextNrAnotacao();

      const url = idAnnotation
        ? "https://farmlog-api.wr-agro.dev.br:3003/api/updateAnnotation"
        : "https://farmlog-api.wr-agro.dev.br:3003/api/createAnnotation";

      const method = idAnnotation ? "PUT" : "POST";

      const formData = new FormData();
      formData.append("id", idAnnotation ?? "");
      formData.append("nrAnotacao", nrAnotacaoValue.toString());
      formData.append("data", new Date().toISOString());
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("idTalhao", "766574c2-e378-4a49-a16e-d599bc9b4956");
      formData.append("idTecnicoCampo", user?.id ?? "");
      formData.append("titulo", data.title);
      formData.append("descricao", data.description);
      formData.append("urgencia", data.urgencia);

      data.images.forEach((image) => formData.append("imagens", image));
      data.audios.forEach((audio) => formData.append("audios", audio));

      // Tenta enviar online
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        notify("Sucesso ao registrar a anotação!", "success");
        navigate("/annotation");
      } else {
        const errorData = await response.json();
        notify(
          `Erro: ${
            errorData.message || "Não foi possível concluir a operação"
          }`,
          "error",
        );
      }
    } catch (error) {
      console.error("Erro no registro:", error);

      // Em caso de falha no envio online, salvamos offline
      const nrAnotacaoValue = getNextNrAnotacao();

      const formData = new FormData();
      formData.append("id", idAnnotation ?? "");
      formData.append("nrAnotacao", nrAnotacaoValue.toString());
      formData.append("data", new Date().toISOString());
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("idTalhao", "766574c2-e378-4a49-a16e-d599bc9b4956");
      formData.append("idTecnicoCampo", user?.id ?? "");
      formData.append("titulo", data.title);
      formData.append("descricao", data.description);
      formData.append("urgencia", data.urgencia);

      data.images.forEach((image) => formData.append("imagens", image));
      data.audios.forEach((audio) => formData.append("audios", audio));

      await saveAnnotationOffline(formData);

      notify("Sem conexão! A anotação foi salva localmente.", "success");
    } finally {
      setLoadingRegister(false);
    }
  };

  // Se for edição de anotação (idAnnotation !== null), carrega do localStorage
  useEffect(() => {
    const annotations = JSON.parse(localStorage.getItem("annotations") ?? "[]");
    const annotation: AnnotationType = annotations.find(
      (item: { id: string }) => item.id === idAnnotation,
    );

    if (annotation) {
      reset({
        title: annotation.titulo || "",
        description: annotation.descricao || "",
        nrAnotacao: annotation.nrAnotacao?.toString() || "",
        urgencia: annotation.urgencia?.toString() || "",
        images: [],
        audios: [],
      });
    }
  }, [idAnnotation, reset]);

  return (
    <div className="bg-white h-[100vh] p-4 pb-10">
      <div className="flex gap-4 items-start justify-start mb-10">
        <Button
          className="bg-transparent border-none shadow-none w-fit p-0 focus-within:border-none focus-within:outline-none"
          onClick={() => navigate(-1)}
        >
          <IconBack fill="#181A18" />
        </Button>
        <h2 className="text-[22px] leading-[29px] font-medium">
          {idAnnotation ? "Editar Registro" : "Registrar"}
        </h2>
      </div>

      <form
        className="flex flex-col gap-4 h-[100vh]"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="w-full border-b-[1px] pb-[2px]"
              placeholder="Digite o título"
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full border-b-[1px] pb-[2px]"
              placeholder="Digite a descrição"
            />
          )}
        />
        <Controller
          name="urgencia"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="w-full border-b-[1px] pb-[2px]"
              placeholder="Urgência"
              type="number"
            />
          )}
        />
        <Controller
          name="audios"
          control={control}
          render={({ field }) => (
            <AudioRecorder
              audioList={field.value || []}
              setAudioList={(audios) => {
                field.onChange(audios);
              }}
            />
          )}
        />

        <Controller
          name="images"
          control={control}
          render={() => (
            <ImageUploader
              setImageFiles={(files) => setValue("images", files)}
              setDeleted={() => {}}
              imageList={[]}
            />
          )}
        />
        <div className="fixed bottom-0 left-0 p-4 w-full">
          <button
            type="submit"
            className="w-full gap-4 text-white bg-[#EAC00F] flex items-center justify-center h-[55px] rounded-full text-[1.25rem] leading-[1.625rem] font-medium disabled:bg-[#dadedf]"
            disabled={loadingRegister}
          >
            <RotatingLines
              visible={loadingRegister}
              strokeColor="gray"
              width="30"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
            {idAnnotation ? "Atualizar Registro" : "Registrar"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default RegisterPage;

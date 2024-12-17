import { useState } from "react";
import { BsX } from "react-icons/bs";
import { FaRegImage } from "react-icons/fa";

interface ImageUploaderProps {
  setImageFiles: (files: File[] | ((prevFiles: File[]) => File[])) => void;
  setDeleted: (
    deletedImages: string[] | ((prevDeleted: string[]) => string[]),
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageList?: any; // Lista de URLs de imagens carregadas previamente
}

const ImageUploader = ({
  setImageFiles,
  setDeleted,
  imageList = [],
}: ImageUploaderProps) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>(imageList); // Inicializa com a lista de URLs carregadas
  const [imageFiles, setImageFileState] = useState<File[]>([]); // Estado para os arquivos de imagem locais

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImageFiles = files.filter((file) =>
      file.type.startsWith("image/"),
    );
    const newImagePreviews = newImageFiles.map((file) =>
      URL.createObjectURL(file),
    );

    setImageFileState((prevFiles) => [...prevFiles, ...newImageFiles]); // Armazena os arquivos localmente
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setImageFiles((prevFiles: any) => [...prevFiles, ...newImageFiles]); // Atualiza o estado de imagens no componente pai
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]); // Mostra os previews das novas imagens
  };

  const removeImage = (index: number) => {
    if (index < imageList.length) {
      // Se for uma imagem carregada (não nova), adiciona à lista de deletadas
      setDeleted((prevDeleted) => [...prevDeleted, imagePreviews[index]]);
    } else {
      // Remove a imagem localmente
      setImageFileState((prevFiles) =>
        prevFiles.filter((_, i) => i !== index - imageList.length),
      );
    }

    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="flex flex-col items-start w-full">
      {/* Mostrar previews das imagens carregadas e novas */}
      {imagePreviews.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative mb-2">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-[200px] object-cover rounded-md"
              />
              <button
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                onClick={() => removeImage(index)}
              >
                <BsX size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden" // Oculta o input padrão
      />
      <label className="bg-[#181A1880] text-white flex gap-2 items-center pt-2 pb-2 pl-4 pr-4 rounded-full text-[1.125rem] leading-[1.5rem] cursor-pointer">
        <FaRegImage fill="white" size={"21px"} /> Imagem
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden" // Mantém o input oculto
        />
      </label>
    </div>
  );
};

export default ImageUploader;

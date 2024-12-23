import { useState } from "react";
import { BsX } from "react-icons/bs";
import { FaRegImage } from "react-icons/fa";

interface ImageUploaderProps {
  setImageFiles: (files: (File | string)[]) => void;
  setDeleted: (deletedImages: (File | string)[]) => void;
  imageList?: (File | string)[]; // Permitir strings (URL) e arquivos (File)
}

const ImageUploader = ({
  setImageFiles,
  setDeleted,
  imageList = [],
}: ImageUploaderProps) => {
  // Converte cada item para uma string de preview
  // Se for File, cria URL temporária, se for string (URL), mantém como está.
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    imageList.map((img) =>
      typeof img === "string" ? img : URL.createObjectURL(img),
    ),
  );

  const [images, setImages] = useState<(File | string)[]>(imageList);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImageFiles = files.filter((file) =>
      file.type.startsWith("image/"),
    );

    const updatedFiles = [...images, ...newImageFiles];
    setImages(updatedFiles);
    setImageFiles(updatedFiles);

    const newImagePreviews = newImageFiles.map((file) =>
      URL.createObjectURL(file),
    );
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setImageFiles(updatedImages);

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);

    // Passa para o pai qual imagem foi deletada
    setDeleted(images.filter((_, i) => i === index));
  };

  return (
    <div className="flex flex-col items-start w-full">
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
                type="button"
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                onClick={() => removeImage(index)}
              >
                <BsX size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="bg-[#181A1880] text-white flex gap-2 items-center pt-2 pb-2 pl-4 pr-4 rounded-full text-[1.125rem] leading-[1.5rem] cursor-pointer">
        <FaRegImage fill="white" size={"21px"} /> Imagem
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default ImageUploader;

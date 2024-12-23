import { useState } from "react";
import { BsX } from "react-icons/bs";
import { FaRegImage } from "react-icons/fa";

interface ImageUploaderProps {
  setImageFiles: (files: File[]) => void;
  setDeleted: (deletedImages: string[]) => void;
  imageList?: string[];
}

const ImageUploader = ({
  setImageFiles,
  setDeleted,
  imageList = [],
}: ImageUploaderProps) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>(imageList);
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImageFiles = files.filter((file): file is File =>
      file.type.startsWith("image/"),
    );

    // Combine the existing files with the new ones
    const updatedFiles = [...images, ...newImageFiles];
    setImages(updatedFiles); // Update local state
    setImageFiles(updatedFiles); // Update parent state

    // Generate previews for the new files
    const newImagePreviews = newImageFiles.map((file) =>
      URL.createObjectURL(file),
    );
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
  };

  const removeImage = (index: number) => {
    const isPreloaded = index < imageList.length;

    if (isPreloaded) {
      // Add the preloaded image to the deleted list
      setDeleted([...imageList.slice(0, index), ...imageList.slice(index + 1)]);
    } else {
      // Remove a locally added image
      const localIndex = index - imageList.length;
      const updatedImages = images.filter((_, i) => i !== localIndex);
      setImages(updatedImages);
      setImageFiles(updatedImages);
    }

    // Remove the preview image
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index),
    );
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

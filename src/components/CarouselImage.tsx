import { useEffect, useRef, useState } from "react";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleWheel = (event: WheelEvent) => {
    if (event.deltaY > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    } else {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length,
      );
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("wheel", handleWheel);
      carousel.addEventListener("drag", () => handleWheel);
    }
    return () => {
      if (carousel) {
        carousel.removeEventListener("wheel", handleWheel);
        carousel.addEventListener("drag", () => handleWheel);
      }
    };
  }, [handleWheel]);

  return (
    <div ref={carouselRef} className="flex flex-col items-center">
      <div className="w-full max-w-lg overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Image ${index + 1}`}
              className="w-full h-[300px] object-cover flex-shrink-0 rounded-[15px]" // Define a altura fixa aqui
            />
          ))}
        </div>
      </div>
      <div className="flex space-x-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-[7px] h-[7px] rounded-full focus:border-none focus:outline-none focus-within:border-none focus-within:outline-none  ${currentIndex === index ? "bg-[#EAC00F]" : "bg-gray-300"}`}
            onClick={() => handleDotClick(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;

/* eslint-disable @typescript-eslint/no-explicit-any */
import AudioPlayer from "@/components/AudioPlayer";
import ImageCarousel from "@/components/CarouselImage";
import SubHeaderFarmDetails from "@/components/SubHeaderAnnotation";

const AnnotationList = ({
  annotations,
  onDelete,
}: {
  annotations: any[];
  onDelete: (id: string) => void;
}) => (
  <div>
    {annotations.map((annotation, index) => (
      <div key={annotation.id} className="annotation-card">
        <SubHeaderFarmDetails
          idAnnotation={annotation.id}
          available={index + 1}
          date={new Date(annotation.data).toLocaleDateString()}
          hour={new Date(annotation.data).toLocaleTimeString()}
          onAnnotationDeleted={() => onDelete(annotation.id)}
        />
        <AudioPlayer src={annotation.audios[0]?.audioUrl || ""} />
        <ImageCarousel
          images={annotation.imagens.map((img: any) => img.imageUrl)}
        />
      </div>
    ))}
  </div>
);

export default AnnotationList;
